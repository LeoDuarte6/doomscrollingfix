// Constants
const STORAGE_KEYS = {
  PASSWORD: 'password',
  DOMAINS: 'doomscrollDomains',
  REPROMPT_INTERVAL: 'repromptInterval',
  INTERVENTION_COUNT: 'interventionCount'
};

const DEFAULT_SETTINGS = {
  password: '',
  doomscrollDomains: [
    'twitter.com',
    'x.com',
    'facebook.com',
    'instagram.com',
    'reddit.com',
    'tiktok.com',
    'youtube.com'
  ],
  repromptInterval: 2,
  interventionCount: 0
};

// Utility
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function isValidDomain(domain) {
  const pattern = /^([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain);
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

// Storage
class SettingsManager {
  static async getSettings() {
    const result = await chrome.storage.local.get(null);
    return { ...DEFAULT_SETTINGS, ...result };
  }

  static async updateSettings(newSettings) {
    await chrome.storage.local.set(newSettings);
  }

  static async resetSettings() {
    await chrome.storage.local.clear();
    await this.updateSettings(DEFAULT_SETTINGS);
  }
}

// Sidebar Navigation
class SidebarManager {
  constructor() {
    this.navItems = document.querySelectorAll('.nav-item[data-section]');
    this.sections = document.querySelectorAll('.section');
    this.init();
  }

  init() {
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.dataset.section;
        this.switchTo(sectionId);
      });
    });
  }

  switchTo(sectionId) {
    // Update nav
    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update sections
    this.sections.forEach(section => {
      section.classList.toggle('active', section.id === `section-${sectionId}`);
    });
  }
}

// UI
class UIManager {
  constructor() {
    this.initializeEventListeners();
    this.loadSettings();
  }

  initializeEventListeners() {
    document.getElementById('password-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePasswordUpdate();
    });

    document.getElementById('add-website-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleWebsiteAdd();
    });

    document.getElementById('timer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTimerUpdate();
    });

    document.getElementById('reset-settings').addEventListener('click', () => {
      this.handleReset();
    });
  }

  async loadSettings() {
    const settings = await SettingsManager.getSettings();
    this.displayWebsites(settings.doomscrollDomains);
    document.getElementById('reprompt-interval').value = settings.repromptInterval;
    this.updateStatistics(settings);
  }

  updateStatistics(settings) {
    document.getElementById('total-interventions').textContent = settings.interventionCount;

    const timeSaved = settings.interventionCount * 5;
    document.getElementById('time-saved').textContent = timeSaved > 0 ? `${timeSaved}m` : '0m';

    this.updateBarChart(settings);
  }

  async updateBarChart(settings) {
    const timeData = [];

    for (const domain of settings.doomscrollDomains) {
      const key = `timeSpent_${domain}`;
      const result = await chrome.storage.local.get(key);
      timeData.push({
        domain,
        time: result[key] || 0
      });
    }

    timeData.sort((a, b) => b.time - a.time);

    // Update most visited
    if (timeData.length > 0 && timeData[0].time > 0) {
      document.getElementById('most-visited').textContent = timeData[0].domain;
    }

    // Render bar chart
    const container = document.getElementById('bar-chart');
    const maxTime = Math.max(...timeData.map(d => d.time), 1);

    if (timeData.every(d => d.time === 0)) {
      container.innerHTML = '<p class="bar-empty">No usage data yet. Start browsing to see stats.</p>';
      return;
    }

    container.innerHTML = timeData
      .filter(d => d.time > 0)
      .map(d => {
        const pct = Math.round((d.time / maxTime) * 100);
        return `
          <div class="bar-row">
            <span class="bar-label">${d.domain}</span>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="bar-value">${formatTime(d.time)}</span>
          </div>
        `;
      }).join('');
  }

  displayWebsites(domains) {
    const container = document.getElementById('website-list');
    container.innerHTML = '';

    domains.forEach(domain => {
      const item = document.createElement('div');
      item.className = 'website-item';
      item.innerHTML = `
        <span>${domain}</span>
        <button type="button" data-domain="${domain}">Remove</button>
      `;

      item.querySelector('button').addEventListener('click', () => {
        this.handleWebsiteRemove(domain);
      });

      container.appendChild(item);
    });
  }

  async handlePasswordUpdate() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const settings = await SettingsManager.getSettings();

    if (settings.password && settings.password !== currentPassword) {
      showToast('Current password is incorrect', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (!newPassword) {
      showToast('Password cannot be empty', 'error');
      return;
    }

    await SettingsManager.updateSettings({ password: newPassword });
    showToast('Password updated');
    document.getElementById('password-form').reset();
  }

  async handleWebsiteAdd() {
    const input = document.getElementById('new-website');
    const domain = input.value.trim().toLowerCase();

    if (!isValidDomain(domain)) {
      showToast('Enter a valid domain', 'error');
      return;
    }

    const settings = await SettingsManager.getSettings();
    if (settings.doomscrollDomains.includes(domain)) {
      showToast('Already monitored', 'error');
      return;
    }

    const newDomains = [...settings.doomscrollDomains, domain];
    await SettingsManager.updateSettings({ doomscrollDomains: newDomains });

    this.displayWebsites(newDomains);
    showToast('Website added');
    input.value = '';
  }

  async handleWebsiteRemove(domain) {
    const settings = await SettingsManager.getSettings();
    const newDomains = settings.doomscrollDomains.filter(d => d !== domain);

    await SettingsManager.updateSettings({ doomscrollDomains: newDomains });
    this.displayWebsites(newDomains);
    showToast('Website removed');
  }

  async handleTimerUpdate() {
    const interval = parseInt(document.getElementById('reprompt-interval').value, 10);

    if (interval < 1 || interval > 60) {
      showToast('Enter 1-60 minutes', 'error');
      return;
    }

    await SettingsManager.updateSettings({ repromptInterval: interval });
    showToast('Timer saved');
  }

  async handleReset() {
    if (confirm('Reset all settings? This cannot be undone.')) {
      await SettingsManager.resetSettings();
      await this.loadSettings();
      showToast('Settings reset');
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = new SidebarManager();
  const ui = new UIManager();

  // Live refresh — update dashboard when storage changes from other tabs
  chrome.storage.onChanged.addListener(() => {
    ui.loadSettings();
  });
});
