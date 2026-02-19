// Rotating prompts to reduce habituation
const INTENTION_PROMPTS = [
  { heading: 'What are you looking for?', subtext: 'Be specific. If you can\'t name it, you probably don\'t need it.' },
  { heading: 'Why are you here right now?', subtext: 'Name one thing. If nothing comes to mind, that\'s your answer.' },
  { heading: 'What will you do after this?', subtext: 'Having an exit plan makes it easier to leave.' },
  { heading: 'Is this what you want to be doing?', subtext: 'You opened this app for a reason — or maybe you didn\'t.' },
  { heading: 'What would be a better use of this time?', subtext: 'Not guilt — just a question worth asking.' },
];

// Constants
const CONFIG = {
  DEFAULT_REPROMPT_INTERVAL: 2 * 60 * 1000,
  SCROLL_THRESHOLD: 100,
  REPROMPT_CHECK_INTERVAL: 5000,
  BREATHING_DURATION: 6000, // 6 seconds
  DEFAULT_DOMAINS: [
    'twitter.com',
    'x.com',
    'facebook.com',
    'instagram.com',
    'reddit.com',
    'tiktok.com',
    'youtube.com'
  ]
};

// Normalize hostname — strip www. so keys always match domain list
function normalizeDomain(hostname) {
  return hostname.replace(/^www\./, '');
}

// State management
class DoomScrollState {
  constructor() {
    this.isUnlocked = false;
    this.timeSpent = 0;
    this.timerInterval = null;
    this.currentDomain = normalizeDomain(window.location.hostname);
    this.lastScrollY = window.scrollY;
    this.scrollTimeout = null;
    this.repromptInterval = CONFIG.DEFAULT_REPROMPT_INTERVAL;
  }

  async loadRepromptInterval() {
    try {
      const { repromptInterval } = await chrome.storage.local.get('repromptInterval');
      if (repromptInterval && Number.isFinite(repromptInterval) && repromptInterval > 0) {
        // Clamp to sane range: 1-60 minutes
        const clamped = Math.max(1, Math.min(60, repromptInterval));
        this.repromptInterval = clamped * 60 * 1000;
      }
    } catch (error) {
      console.error('Error loading reprompt interval:', error);
    }
  }

  startTimer() {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.timeSpent++;
      this.updateTimerDisplay();
      this.saveTimeSpent();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resumeTimer() {
    if (this.isUnlocked && !this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.timeSpent++;
        this.updateTimerDisplay();
        this.saveTimeSpent();
      }, 1000);
    }
  }

  // Note: slight race condition possible with multiple tabs on same domain.
  // Acceptable for approximate time tracking; not worth the complexity of
  // message-passing through the background worker for exact accuracy.
  async saveTimeSpent() {
    try {
      const key = `timeSpent_${this.currentDomain}`;
      const data = await chrome.storage.local.get(key);
      const totalTime = (data[key] || 0) + 1;
      await chrome.storage.local.set({ [key]: totalTime });
    } catch (error) {
      console.error('Error saving time spent:', error);
    }
  }

  updateTimerDisplay() {
    const display = document.getElementById('doomscroll-timer');
    if (!display) return;

    const minutes = Math.floor(this.timeSpent / 60);
    const seconds = this.timeSpent % 60;
    const pad = (n) => String(n).padStart(2, '0');
    display.textContent = `${pad(minutes)}:${pad(seconds)} on ${this.currentDomain}`;
  }
}

// UI Components
class DoomScrollUI {
  constructor(state) {
    this.state = state;
  }

  createOverlay() {
    const existing = document.getElementById('doomscroll-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'doomscroll-overlay';
    return overlay;
  }

  // Step 1: Breathing pause — intercepts System 1 behavior
  createBreathingStep() {
    const container = document.createElement('div');
    container.className = 'doomscroll-card';

    const breathingMessages = [
      { heading: 'Take a moment', subtext: 'Breathe in... and out.' },
      { heading: 'Pause', subtext: 'Six seconds. That\'s all it takes.' },
      { heading: 'Slow down', subtext: 'Your feed will still be there.' },
      { heading: 'One breath', subtext: 'Let your nervous system catch up.' },
    ];
    const msg = breathingMessages[Math.floor(Math.random() * breathingMessages.length)];

    container.innerHTML = `
      <div class="doomscroll-breathing-ring">
        <div class="doomscroll-breathing-circle"></div>
      </div>
      <p class="doomscroll-heading">${msg.heading}</p>
      <p class="doomscroll-subtext">${msg.subtext}</p>
      <div class="doomscroll-progress-bar">
        <div class="doomscroll-progress-fill"></div>
      </div>
    `;

    return container;
  }

  // Step 2: Intention prompt — implementation intentions (d=0.65 effect size)
  createIntentionStep() {
    const container = document.createElement('div');
    container.className = 'doomscroll-card';

    const prompt = INTENTION_PROMPTS[Math.floor(Math.random() * INTENTION_PROMPTS.length)];

    container.innerHTML = `
      <div class="doomscroll-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <p class="doomscroll-heading">${prompt.heading}</p>
      <p class="doomscroll-subtext">${prompt.subtext}</p>
      <input type="text" class="doomscroll-input" placeholder="e.g. Check a DM, find a recipe..." autocomplete="off">
      <div class="doomscroll-choice-row">
        <button class="doomscroll-button doomscroll-button-dismiss">Go back</button>
        <button class="doomscroll-button doomscroll-button-proceed">Continue to ${this.state.currentDomain}</button>
      </div>
    `;

    return container;
  }

  ensureTimerDisplay() {
    let display = document.getElementById('doomscroll-timer');
    if (!display) {
      display = document.createElement('div');
      display.id = 'doomscroll-timer';
      display.classList.add('doomscroll-timer');
      document.documentElement.appendChild(display);
    }
    return display;
  }
}

// Main Controller
class DoomScrollController {
  constructor() {
    this.state = new DoomScrollState();
    this.ui = new DoomScrollUI(this.state);
    this.repromptCheckInterval = null;
  }

  async init() {
    try {
      const isDoomscrollSite = await this.checkIfDoomscrollSite();
      if (!isDoomscrollSite) return;

      await this.state.loadRepromptInterval();

      const shouldShowOverlay = await this.checkIfShouldShowOverlay();
      if (shouldShowOverlay) {
        this.setupOverlay();
      } else {
        this.unlockContent();
      }

      window.addEventListener('scroll', () => this.handleScroll());
      this.startRepromptCheck();

      document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

      // Clean up intervals on page unload to prevent leaks
      window.addEventListener('beforeunload', () => {
        this.state.stopTimer();
        if (this.repromptCheckInterval) {
          clearInterval(this.repromptCheckInterval);
          this.repromptCheckInterval = null;
        }
      });
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async checkIfDoomscrollSite() {
    const { doomscrollDomains } = await chrome.storage.local.get('doomscrollDomains');
    const domains = doomscrollDomains || CONFIG.DEFAULT_DOMAINS;
    return domains.some(domain =>
      this.state.currentDomain === domain || this.state.currentDomain.endsWith('.' + domain)
    );
  }

  async checkIfShouldShowOverlay() {
    const key = `lastUnlock_${this.state.currentDomain}`;
    const { [key]: lastUnlockTime } = await chrome.storage.local.get(key);
    return !lastUnlockTime || (Date.now() - lastUnlockTime) >= this.state.repromptInterval;
  }

  setupOverlay() {
    const overlay = this.ui.createOverlay();
    const breathingStep = this.ui.createBreathingStep();
    const intentionStep = this.ui.createIntentionStep();

    intentionStep.classList.add('doomscroll-hidden');
    overlay.appendChild(breathingStep);
    overlay.appendChild(intentionStep);

    this.wrapAndBlurContent();
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = '1');

    // Start breathing animation, then transition to intention step
    const progressFill = breathingStep.querySelector('.doomscroll-progress-fill');
    progressFill.style.transition = `width ${CONFIG.BREATHING_DURATION}ms linear`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressFill.style.width = '100%';
      });
    });

    setTimeout(() => {
      breathingStep.classList.add('doomscroll-hidden');
      intentionStep.classList.remove('doomscroll-hidden');

      // Set up intention step listeners
      const dismissBtn = intentionStep.querySelector('.doomscroll-button-dismiss');
      const proceedBtn = intentionStep.querySelector('.doomscroll-button-proceed');
      const input = intentionStep.querySelector('.doomscroll-input');

      dismissBtn.addEventListener('click', () => {
        // Go back — close the tab or navigate away
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // window.close() doesn't work in content scripts unless tab was script-opened.
          // Redirect to a neutral page instead.
          window.location.href = 'about:blank';
        }
      });

      proceedBtn.addEventListener('click', async () => {
        const intention = input.value.trim();

        // Check if password is required
        const { password } = await chrome.storage.local.get('password');
        if (password) {
          const entered = prompt('Enter your DoomScrollingFix password to continue:');
          if (entered !== password) {
            // Show error inline
            let err = intentionStep.querySelector('.doomscroll-error');
            if (!err) {
              err = document.createElement('p');
              err.className = 'doomscroll-error';
              intentionStep.appendChild(err);
            }
            err.textContent = entered === null ? 'Password required to continue.' : 'Wrong password. Try again.';
            return;
          }
        }

        this.unlockContent();
        await this.saveUnlockTime();
        await this.saveIntention(intention);
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          proceedBtn.click();
        }
      });

      // ESC key dismisses (goes back)
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          dismissBtn.click();
        }
      };
      document.addEventListener('keydown', handleKeydown);

      setTimeout(() => input.focus(), 100);
    }, CONFIG.BREATHING_DURATION);
  }

  wrapAndBlurContent() {
    let wrapper = document.querySelector('.doomscroll-content-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.classList.add('doomscroll-content-wrapper');
      while (document.body.firstChild) {
        wrapper.appendChild(document.body.firstChild);
      }
      document.body.appendChild(wrapper);
    }
    wrapper.classList.add('doomscroll-blur');
    document.body.style.overflow = 'hidden';
  }

  unlockContent() {
    const wrapper = document.querySelector('.doomscroll-content-wrapper');
    const overlay = document.getElementById('doomscroll-overlay');

    if (wrapper) wrapper.classList.remove('doomscroll-blur');
    if (overlay) overlay.remove();

    document.body.style.overflow = '';
    document.body.classList.add('doomscroll-greyscale');

    this.state.isUnlocked = true;
    this.state.startTimer();
    this.ui.ensureTimerDisplay();
  }

  async saveUnlockTime() {
    const key = `lastUnlock_${this.state.currentDomain}`;
    await chrome.storage.local.set({ [key]: Date.now() });

    const { interventionCount = 0 } = await chrome.storage.local.get('interventionCount');
    await chrome.storage.local.set({ interventionCount: interventionCount + 1 });
  }

  async saveIntention(intention) {
    try {
      const { intentionLog = [] } = await chrome.storage.local.get('intentionLog');
      intentionLog.push({
        domain: this.state.currentDomain,
        intention: intention || '',
        timestamp: Date.now()
      });
      // Keep last 50 entries to avoid bloating storage
      const trimmed = intentionLog.slice(-50);
      await chrome.storage.local.set({ intentionLog: trimmed });
    } catch (error) {
      console.error('Error saving intention:', error);
    }
  }

  async handleVisibilityChange() {
    if (!this.state.isUnlocked) return;

    if (document.hidden) {
      this.state.pauseTimer();
      if (this.repromptCheckInterval) {
        clearInterval(this.repromptCheckInterval);
        this.repromptCheckInterval = null;
      }
    } else {
      // Check if reprompt interval elapsed while tab was hidden
      const key = `lastUnlock_${this.state.currentDomain}`;
      const { [key]: lastUnlockTime } = await chrome.storage.local.get(key);
      if (lastUnlockTime && (Date.now() - lastUnlockTime) >= this.state.repromptInterval) {
        this.triggerReprompt('visibility');
        return;
      }
      this.state.resumeTimer();
      this.startRepromptCheck();
    }
  }

  handleScroll() {
    if (!this.state.isUnlocked) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - this.state.lastScrollY);

    if (scrollDelta > CONFIG.SCROLL_THRESHOLD) {
      if (this.state.scrollTimeout) {
        clearTimeout(this.state.scrollTimeout);
      }

      this.state.scrollTimeout = setTimeout(async () => {
        try {
          const key = `lastUnlock_${this.state.currentDomain}`;
          const { [key]: lastUnlockTime } = await chrome.storage.local.get(key);

          if (lastUnlockTime && (Date.now() - lastUnlockTime) >= this.state.repromptInterval) {
            this.triggerReprompt('scroll');
          }
        } catch (error) {
          console.error('Scroll reprompt error:', error);
        }
      }, 1000);
    }

    this.state.lastScrollY = currentScrollY;
  }

  startRepromptCheck() {
    if (this.repromptCheckInterval) return;

    this.repromptCheckInterval = setInterval(async () => {
      try {
        if (!this.state.isUnlocked) return;

        const key = `lastUnlock_${this.state.currentDomain}`;
        const { [key]: lastUnlockTime } = await chrome.storage.local.get(key);

        if (lastUnlockTime && (Date.now() - lastUnlockTime) >= this.state.repromptInterval) {
          this.triggerReprompt('timer');
        }
      } catch (error) {
        console.error('Reprompt check error:', error);
      }
    }, CONFIG.REPROMPT_CHECK_INTERVAL);
  }

  triggerReprompt(source) {
    this.state.isUnlocked = false;
    this.state.stopTimer();
    if (this.repromptCheckInterval) {
      clearInterval(this.repromptCheckInterval);
      this.repromptCheckInterval = null;
    }
    this.setupOverlay();
  }
}

// Initialize
function startController() {
  // Skip sub-frames (e.g. YouTube's sandboxed about:blank iframes)
  try { if (window !== window.top) return; } catch { return; }

  const controller = new DoomScrollController();
  controller.init().catch(console.error);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startController);
} else {
  startController();
}
