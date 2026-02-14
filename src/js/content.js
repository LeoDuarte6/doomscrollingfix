// Constants
const CONFIG = {
  DEFAULT_REPROMPT_INTERVAL: 2 * 60 * 1000, // 2 minutes default
  SCROLL_THRESHOLD: 100, // pixels scrolled before triggering reprompt check
  REPROMPT_CHECK_INTERVAL: 5000, // check every 5 seconds
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

// State management
class DoomScrollState {
  constructor() {
    this.isUnlocked = false;
    this.timeSpent = 0;
    this.timerInterval = null;
    this.currentDomain = window.location.hostname;
    this.lastScrollY = window.scrollY;
    this.scrollTimeout = null;
    this.repromptInterval = CONFIG.DEFAULT_REPROMPT_INTERVAL;
  }

  async loadRepromptInterval() {
    try {
      const { repromptInterval } = await chrome.storage.local.get('repromptInterval');
      if (repromptInterval) {
        this.repromptInterval = repromptInterval * 60 * 1000; // stored in minutes, convert to ms
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
    display.textContent = `Time spent: ${minutes}m ${seconds}s`;
  }
}

// UI Components
class DoomScrollUI {
  constructor(state) {
    this.state = state;
  }

  createOverlay() {
    // Remove existing overlay if any
    const existing = document.getElementById('doomscroll-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'doomscroll-overlay';
    return overlay;
  }

  createCaptcha() {
    const container = document.createElement('div');
    const nums = this.generateCaptchaNumbers();

    container.innerHTML = `
      <p class="doomscroll-text">Solve: ${nums.num1} + ${nums.num2} = ?</p>
      <input type="text" class="doomscroll-input" placeholder="Enter answer">
      <p class="doomscroll-error" style="display: none">Incorrect answer. Try again.</p>
      <button class="doomscroll-button">Verify</button>
    `;

    return { container, answer: nums.num1 + nums.num2 };
  }

  createLoginForm() {
    const form = document.createElement('form');
    form.classList.add('doomscroll-login-form');

    form.innerHTML = `
      <input type="password" class="doomscroll-input" placeholder="Enter password">
      <button type="submit" class="doomscroll-button">Submit</button>
      <p class="doomscroll-error" style="display: none">Incorrect password. Try again.</p>
    `;

    return form;
  }

  ensureTimerDisplay() {
    let display = document.getElementById('doomscroll-timer');
    if (!display) {
      display = document.createElement('div');
      display.id = 'doomscroll-timer';
      display.classList.add('doomscroll-timer');
      document.body.appendChild(display);
    }
    return display;
  }

  generateCaptchaNumbers() {
    return {
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    };
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

      // Set up scroll listener for reprompting
      window.addEventListener('scroll', () => this.handleScroll());

      // Set up periodic reprompt check
      this.startRepromptCheck();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async checkIfDoomscrollSite() {
    const { doomscrollDomains } = await chrome.storage.local.get('doomscrollDomains');
    const domains = doomscrollDomains || CONFIG.DEFAULT_DOMAINS;
    return domains.some(domain => this.state.currentDomain.includes(domain));
  }

  async checkIfShouldShowOverlay() {
    const key = `lastUnlock_${this.state.currentDomain}`;
    const { [key]: lastUnlockTime } = await chrome.storage.local.get(key);
    return !lastUnlockTime || (Date.now() - lastUnlockTime) >= this.state.repromptInterval;
  }

  setupOverlay() {
    const overlay = this.ui.createOverlay();
    const { container: captcha, answer: captchaAnswer } = this.ui.createCaptcha();
    const loginForm = this.ui.createLoginForm();

    loginForm.style.display = 'none';
    overlay.appendChild(captcha);
    overlay.appendChild(loginForm);

    this.setupEventListeners(captcha, captchaAnswer, loginForm);
    this.wrapAndBlurContent();
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.style.opacity = '1');
  }

  setupEventListeners(captcha, captchaAnswer, loginForm) {
    const verifyButton = captcha.querySelector('.doomscroll-button');
    const captchaInput = captcha.querySelector('.doomscroll-input');

    captchaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyButton.click();
      }
    });

    verifyButton.addEventListener('click', () => this.handleCaptchaVerification(captcha, captchaAnswer, loginForm));

    loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e, loginForm));

    const loginInput = loginForm.querySelector('.doomscroll-input');
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  async handleCaptchaVerification(captcha, captchaAnswer, loginForm) {
    const input = captcha.querySelector('.doomscroll-input');
    const error = captcha.querySelector('.doomscroll-error');
    const userAnswer = parseInt(input.value, 10);

    if (userAnswer === captchaAnswer) {
      captcha.style.display = 'none';
      loginForm.style.display = 'flex';
      loginForm.querySelector('.doomscroll-input').focus();
    } else {
      error.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  async handleLoginSubmit(e, loginForm) {
    e.preventDefault();
    const input = loginForm.querySelector('.doomscroll-input');
    const error = loginForm.querySelector('.doomscroll-error');

    try {
      const { password } = await chrome.storage.local.get('password');
      if (input.value === password) {
        this.unlockContent();
        await this.saveUnlockTime();
      } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
      }
    } catch (err) {
      console.error('Login error:', err);
    }
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

    // Ensure only one timer display exists (don't re-append on every unlock)
    this.ui.ensureTimerDisplay();
  }

  async saveUnlockTime() {
    const key = `lastUnlock_${this.state.currentDomain}`;
    await chrome.storage.local.set({ [key]: Date.now() });

    const { interventionCount = 0 } = await chrome.storage.local.get('interventionCount');
    await chrome.storage.local.set({ interventionCount: interventionCount + 1 });
  }

  // Scroll-triggered reprompting (ported from root content.js)
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

  // Periodic timer-based reprompting (ported from root content.js)
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
    console.log(`${source}-triggered reprompt`);
    this.state.isUnlocked = false;
    this.state.stopTimer();
    this.setupOverlay();
  }
}

// Initialize: support both document_start (immediate) and DOMContentLoaded
function startController() {
  const controller = new DoomScrollController();
  controller.init().catch(console.error);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startController);
} else {
  startController();
}