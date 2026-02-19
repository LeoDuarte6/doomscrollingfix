// Constants
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

    document.getElementById('clear-stats').addEventListener('click', () => {
      this.handleClearStats();
    });

    document.getElementById('export-settings').addEventListener('click', () => {
      this.handleExport();
    });

    document.getElementById('import-settings').addEventListener('change', (e) => {
      this.handleImport(e);
    });
  }

  async loadSettings() {
    const settings = await SettingsManager.getSettings();
    this.displayWebsites(settings.doomscrollDomains);
    document.getElementById('reprompt-interval').value = settings.repromptInterval;
    this.updateStatistics(settings);
    this.checkOnboarding();
  }

  async checkOnboarding() {
    const { showOnboarding } = await chrome.storage.local.get('showOnboarding');
    const banner = document.getElementById('onboarding-banner');
    if (!banner) return;

    if (showOnboarding) {
      banner.style.display = 'block';
      const dismissBtn = banner.querySelector('.onboarding-dismiss');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', async () => {
          await chrome.storage.local.set({ showOnboarding: false });
          banner.style.display = 'none';
        });
      }
    } else {
      banner.style.display = 'none';
    }
  }

  updateStatistics(settings) {
    const interventions = settings.interventionCount || 0;
    const dismissals = settings.dismissCount || 0;
    const totalInteractions = interventions + dismissals;

    document.getElementById('total-interventions').textContent = totalInteractions;

    // "Time saved" = dismissals * estimated avg session (15 min) + interventions that shortened sessions (5 min)
    const timeSaved = (dismissals * 15) + (interventions * 5);
    document.getElementById('time-saved').textContent = timeSaved > 0 ? `${timeSaved}m` : '0m';

    // Dismiss rate
    if (totalInteractions > 0) {
      const rate = Math.round((dismissals / totalInteractions) * 100);
      document.getElementById('dismiss-rate').textContent = `${rate}%`;
    } else {
      document.getElementById('dismiss-rate').textContent = '--';
    }

    this.updateBarChart(settings);
    this.updateIntentionLog(settings);
    this.updateTotalTracked(settings);
  }

  async updateTotalTracked(settings) {
    let totalSeconds = 0;
    for (const domain of settings.doomscrollDomains) {
      const key = `timeSpent_${domain}`;
      const result = await chrome.storage.local.get(key);
      totalSeconds += result[key] || 0;
    }
    document.getElementById('total-tracked').textContent = formatTime(totalSeconds);
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
            <span class="bar-label">${escapeHtml(d.domain)}</span>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="bar-value">${formatTime(d.time)}</span>
          </div>
        `;
      }).join('');
  }

  updateIntentionLog(settings) {
    const container = document.getElementById('intention-log');
    const log = settings.intentionLog || [];

    if (log.length === 0) {
      container.innerHTML = '<p class="bar-empty">No intentions logged yet. They\'ll appear here after your next visit.</p>';
      return;
    }

    // Show most recent first, limit to 15
    const recent = log.slice().reverse().slice(0, 15);

    container.innerHTML = recent.map(entry => {
      const date = new Date(entry.timestamp);
      const timeStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        + ' ' + date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      const intentionText = entry.intention
        ? escapeHtml(entry.intention)
        : '<span class="intention-empty">No reason given</span>';

      return `
        <div class="intention-row">
          <span class="intention-domain">${escapeHtml(entry.domain)}</span>
          <span class="intention-text">${intentionText}</span>
          <span class="intention-time">${timeStr}</span>
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
        <span>${escapeHtml(domain)}</span>
        <button type="button" data-domain="${escapeHtml(domain)}">Remove</button>
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

    // TODO: Passwords are stored in plaintext in chrome.storage.local.
    // Consider hashing (e.g. SHA-256 via SubtleCrypto) before storing.
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

    // Request host permission for custom domains not in default list
    const defaultDomains = DEFAULT_SETTINGS.doomscrollDomains;
    if (!defaultDomains.includes(domain)) {
      try {
        const granted = await chrome.permissions.request({
          origins: [`*://*.${domain}/*`, `*://${domain}/*`]
        });
        if (!granted) {
          showToast('Permission denied — cannot monitor this site', 'error');
          return;
        }
      } catch (err) {
        console.error('Permission request error:', err);
        showToast('Could not request permission', 'error');
        return;
      }
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

    if (!Number.isFinite(interval) || interval < 1 || interval > 60) {
      showToast('Enter 1-60 minutes', 'error');
      return;
    }

    await SettingsManager.updateSettings({ repromptInterval: interval });
    showToast('Timer saved');
  }

  async handleClearStats() {
    if (!confirm('Clear all usage stats? Your settings will be kept.')) return;

    const settings = await SettingsManager.getSettings();
    const keysToRemove = [];

    for (const domain of settings.doomscrollDomains) {
      keysToRemove.push(`timeSpent_${domain}`);
      keysToRemove.push(`lastUnlock_${domain}`);
    }

    await chrome.storage.local.remove(keysToRemove);
    await chrome.storage.local.set({
      interventionCount: 0,
      dismissCount: 0,
      intentionLog: []
    });

    await this.loadSettings();
    showToast('Stats cleared');
  }

  async handleExport() {
    try {
      const data = await chrome.storage.local.get(null);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doomscrollingfix-settings-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Settings exported');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Export failed', 'error');
    }
  }

  async handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        showToast('Invalid settings file', 'error');
        return;
      }

      await chrome.storage.local.set(data);
      await this.loadSettings();
      showToast('Settings imported');
    } catch (error) {
      console.error('Import error:', error);
      showToast('Import failed — invalid file', 'error');
    }

    // Reset file input so same file can be re-imported
    event.target.value = '';
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
