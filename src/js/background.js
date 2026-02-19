// Constants
const ALARM_NAME = 'checkDoomscrollStatus';
const CHECK_INTERVAL = 1; // Check every minute

function normalizeDomain(hostname) {
  return hostname.replace(/^www\./, '');
}

/**
 * @typedef {import('./options').Settings} Settings
 */

/**
 * Initializes the background service worker
 */
async function initialize() {
  try {
    // Set up periodic checks
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: CHECK_INTERVAL
    });

    // Listen for alarm
    chrome.alarms.onAlarm.addListener(handleAlarm);

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(handleTabUpdate);

    // Listen for installation/update
    chrome.runtime.onInstalled.addListener(handleInstall);

    // Open options page when extension icon is clicked
    chrome.action.onClicked.addListener(() => {
      chrome.runtime.openOptionsPage();
    });

    console.log('Background service worker initialized');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

/**
 * Handles extension installation or update
 * @param {Object} details - Installation details
 */
async function handleInstall(details) {
  try {
    if (details.reason === 'install') {
      // Set default settings on install
      const settings = await chrome.storage.local.get(null);
      if (!settings.password) {
        await chrome.storage.local.set({
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
        });
      }

      // Open options page for initial setup with onboarding flag
      await chrome.storage.local.set({ showOnboarding: true });
      chrome.runtime.openOptionsPage();
    }
  } catch (error) {
    console.error('Installation handler error:', error);
  }
}

/**
 * Handles tab updates
 * @param {number} tabId - ID of the updated tab
 * @param {Object} changeInfo - Information about the change
 * @param {chrome.tabs.Tab} tab - The updated tab
 */
async function handleTabUpdate(tabId, changeInfo, tab) {
  try {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
      const url = new URL(tab.url);
      const domain = normalizeDomain(url.hostname);

      const { doomscrollDomains = [] } = await chrome.storage.local.get('doomscrollDomains');

      if (doomscrollDomains.some(d => domain === d || domain.endsWith('.' + d))) {
        await updateBadge(tabId);
      }
    }
  } catch (error) {
    console.error('Tab update handler error:', error);
  }
}

/**
 * Handles alarm events
 * @param {chrome.alarms.Alarm} alarm - The alarm that fired
 */
async function handleAlarm(alarm) {
  try {
    if (alarm.name === ALARM_NAME) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      
      for (const tab of tabs) {
        if (tab.url && tab.url.startsWith('http')) {
          await checkTab(tab);
        }
      }
    }
  } catch (error) {
    console.error('Alarm handler error:', error);
  }
}

/**
 * Checks a tab for doomscrolling
 * @param {chrome.tabs.Tab} tab - The tab to check
 */
async function checkTab(tab) {
  try {
    const url = new URL(tab.url);
    const domain = normalizeDomain(url.hostname);

    const { doomscrollDomains = [] } = await chrome.storage.local.get('doomscrollDomains');

    if (doomscrollDomains.some(d => domain === d || domain.endsWith('.' + d))) {
      await updateBadge(tab.id);

      // Get time spent on this domain
      const key = `timeSpent_${domain}`;
      const { [key]: timeSpent = 0 } = await chrome.storage.local.get(key);
      
      // Update badge with time spent
      const minutes = Math.floor(timeSpent / 60);
      await chrome.action.setBadgeText({
        text: minutes.toString(),
        tabId: tab.id
      });
    }
  } catch (error) {
    console.error('Tab check error:', error);
  }
}

/**
 * Updates the extension badge for a tab
 * @param {number} tabId - ID of the tab
 */
async function updateBadge(tabId) {
  try {
    // Set badge background color
    await chrome.action.setBadgeBackgroundColor({
      color: '#dc2626',
      tabId
    });
  } catch (error) {
    console.error('Badge update error:', error);
  }
}

// Initialize the service worker
initialize(); 