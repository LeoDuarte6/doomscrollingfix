// Types (for documentation)
/**
 * @typedef {Object} Settings
 * @property {string} password - The user's password
 * @property {string[]} doomscrollDomains - List of monitored domains
 * @property {number} repromptInterval - Time in minutes before re-authentication
 * @property {number} interventionCount - Number of times the extension has intervened
 */

/**
 * @typedef {Object} TimeSpent
 * @property {string} domain - The domain name
 * @property {number} time - Time spent in seconds
 */

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

// Utility Functions
/**
 * Shows a toast message
 * @param {string} message - Message to display
 * @param {'success' | 'error'} type - Type of toast
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = type === 'success' ? 'var(--ds-success)' : 'var(--ds-error)';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Validates a domain string
 * @param {string} domain - Domain to validate
 * @returns {boolean} - Whether the domain is valid
 */
function isValidDomain(domain) {
  const pattern = /^([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain);
}

// Storage Management
class SettingsManager {
  /**
   * Retrieves all settings from storage
   * @returns {Promise<Settings>}
   */
  static async getSettings() {
    const result = await chrome.storage.local.get(null);
    return { ...DEFAULT_SETTINGS, ...result };
  }

  /**
   * Updates settings in storage
   * @param {Partial<Settings>} newSettings - Settings to update
   */
  static async updateSettings(newSettings) {
    await chrome.storage.local.set(newSettings);
  }

  /**
   * Resets all settings to defaults
   */
  static async resetSettings() {
    await chrome.storage.local.clear();
    await this.updateSettings(DEFAULT_SETTINGS);
  }
}

// UI Management
class UIManager {
  constructor() {
    this.initializeEventListeners();
    this.loadSettings();
  }

  /**
   * Sets up all event listeners
   */
  initializeEventListeners() {
    // Password form
    document.getElementById('password-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePasswordUpdate();
    });

    // Website form
    document.getElementById('add-website-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleWebsiteAdd();
    });

    // Timer form
    document.getElementById('timer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTimerUpdate();
    });

    // Reset button
    document.getElementById('reset-settings').addEventListener('click', () => {
      this.handleReset();
    });
  }

  /**
   * Loads and displays all settings
   */
  async loadSettings() {
    const settings = await SettingsManager.getSettings();
    
    // Load websites
    this.displayWebsites(settings.doomscrollDomains);
    
    // Load timer settings
    document.getElementById('reprompt-interval').value = settings.repromptInterval;
    
    // Load statistics
    this.updateStatistics(settings);
  }

  /**
   * Updates the statistics display
   * @param {Settings} settings - Current settings
   */
  updateStatistics(settings) {
    document.getElementById('total-interventions').textContent = settings.interventionCount;
    
    // Calculate time saved (rough estimate: 5 minutes per intervention)
    const timeSaved = settings.interventionCount * 5;
    document.getElementById('time-saved').textContent = `${timeSaved} minutes`;
    
    this.updateUsageChart();
  }

  /**
   * Updates the usage chart
   */
  async updateUsageChart() {
    const settings = await SettingsManager.getSettings();
    const timeData = [];
    
    for (const domain of settings.doomscrollDomains) {
      const key = `timeSpent_${domain}`;
      const result = await chrome.storage.local.get(key);
      timeData.push({
        domain,
        time: result[key] || 0
      });
    }
    
    // Sort by time spent
    timeData.sort((a, b) => b.time - a.time);
    
    // Update most visited site
    if (timeData.length > 0) {
      document.getElementById('most-visited').textContent = timeData[0].domain;
    }
    
    // Update chart (if using a charting library)
    this.renderChart(timeData);
  }

  /**
   * Renders the usage chart
   * @param {TimeSpent[]} data - Time spent data
   */
  renderChart(data) {
    // Implementation would go here if using a charting library
    console.log('Chart data:', data);
  }

  /**
   * Displays the list of monitored websites
   * @param {string[]} domains - List of domains
   */
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

  /**
   * Handles password update
   */
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
      showToast('New passwords do not match', 'error');
      return;
    }
    
    await SettingsManager.updateSettings({ password: newPassword });
    showToast('Password updated successfully');
    
    // Clear form
    document.getElementById('password-form').reset();
  }

  /**
   * Handles adding a new website
   */
  async handleWebsiteAdd() {
    const input = document.getElementById('new-website');
    const domain = input.value.trim().toLowerCase();
    
    if (!isValidDomain(domain)) {
      showToast('Please enter a valid domain', 'error');
      return;
    }
    
    const settings = await SettingsManager.getSettings();
    if (settings.doomscrollDomains.includes(domain)) {
      showToast('Domain already exists', 'error');
      return;
    }
    
    const newDomains = [...settings.doomscrollDomains, domain];
    await SettingsManager.updateSettings({ doomscrollDomains: newDomains });
    
    this.displayWebsites(newDomains);
    showToast('Website added successfully');
    input.value = '';
  }

  /**
   * Handles removing a website
   * @param {string} domain - Domain to remove
   */
  async handleWebsiteRemove(domain) {
    const settings = await SettingsManager.getSettings();
    const newDomains = settings.doomscrollDomains.filter(d => d !== domain);
    
    await SettingsManager.updateSettings({ doomscrollDomains: newDomains });
    this.displayWebsites(newDomains);
    showToast('Website removed successfully');
  }

  /**
   * Handles timer settings update
   */
  async handleTimerUpdate() {
    const interval = parseInt(document.getElementById('reprompt-interval').value, 10);
    
    if (interval < 1 || interval > 60) {
      showToast('Please enter a value between 1 and 60 minutes', 'error');
      return;
    }
    
    await SettingsManager.updateSettings({ repromptInterval: interval });
    showToast('Timer settings updated successfully');
  }

  /**
   * Handles settings reset
   */
  async handleReset() {
    if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
      await SettingsManager.resetSettings();
      await this.loadSettings();
      showToast('All settings have been reset');
    }
  }
}

// Initialize the options page
document.addEventListener('DOMContentLoaded', () => {
  new UIManager();
}); 