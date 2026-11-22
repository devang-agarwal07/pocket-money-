/**
 * Pocket Money Management SPA - Core Application Logic
 * Spend Smart / Save More / Grow Your Future - Little Steps... Big Dreams!
 */

// Initial Default State
const DEFAULT_STATE = {
  currentView: 'home',
  darkMode: false,
  notifications: true,
  soundEffects: true,
  user: {
    name: 'Rohan',
    fullName: 'Rohan Sharma',
    email: 'rohan.saver@pocketmoney.edu',
    grade: '10th Standard',
    monthlyPocketMoney: 1000,
    currentSavings: 1000,
    savingsGoalName: 'New Sports Bicycle & Gear',
    savingsGoalAmount: 3000,
    avatar: 'boy'
  },
  // 40-40-10-10 Rule Allocations (Percentage)
  rule: {
    savePercent: 40,
    spendPercent: 40,
    investPercent: 10,
    donatePercent: 10
  },
  // Budget Categories
  budget: [
    { id: 'food', name: 'Food', allocated: 200, spent: 140, icon: 'utensils', color: '#F97316', bgClass: 'bg-orange-500' },
    { id: 'entertainment', name: 'Entertainment', allocated: 150, spent: 120, icon: 'film', color: '#A855F7', bgClass: 'bg-purple-500' },
    { id: 'school', name: 'School Supplies', allocated: 250, spent: 180, icon: 'book', color: '#3B82F6', bgClass: 'bg-blue-500' },
    { id: 'savings', name: 'Savings', allocated: 300, spent: 300, icon: 'piggy', color: '#10B981', bgClass: 'bg-emerald-500' },
    { id: 'emergency', name: 'Emergency', allocated: 100, spent: 20, icon: 'shield', color: '#EF4444', bgClass: 'bg-rose-500' }
  ],
  // 30-Day Smart Money Challenge (₹20/day)
  challenge: {
    dailyAmount: 20,
    targetAmount: 600,
    totalDays: 30,
    completedDays: [1, 2, 3, 4, 5, 6, 7] // default 7 days completed (₹140)
  },
  // Transactions
  transactions: [
    { id: 1, title: 'Canteen Samosa & Juice', category: 'Food', amount: -40, type: 'expense', date: 'Today, 2:30 PM', icon: 'utensils' },
    { id: 2, title: 'Weekly Pocket Money Received', category: 'Income', amount: 250, type: 'income', date: 'Yesterday, 10:00 AM', icon: 'wallet' },
    { id: 3, title: 'Math Notebook & Gel Pens', category: 'School Supplies', amount: -70, type: 'expense', date: '20 Nov, 4:15 PM', icon: 'book' },
    { id: 4, title: 'Weekend Movie Group Share', category: 'Entertainment', amount: -120, type: 'expense', date: '18 Nov, 6:00 PM', icon: 'film' },
    { id: 5, title: 'Day 7 Smart Challenge Deposit', category: 'Savings', amount: 20, type: 'savings', date: '17 Nov, 9:00 AM', icon: 'piggy' },
    { id: 6, title: 'Grandma Diwali Blessing', category: 'Income', amount: 200, type: 'income', date: '15 Nov, 1:20 PM', icon: 'gift' }
  ],
  // Blog metadata
  blogLikes: {
    1: 42,
    2: 35,
    3: 58
  },
  blogBookmarks: {
    1: true,
    2: false,
    3: true
  },
  // Contact messages submitted locally
  contactMessages: []
};

// Application State Manager
class StateManager {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('pocket_money_app_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load saved state, using default', e);
    }
    return { ...DEFAULT_STATE };
  }

  saveState() {
    try {
      localStorage.setItem('pocket_money_app_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist state', e);
    }
  }

  update(updater) {
    if (typeof updater === 'function') {
      this.state = updater(this.state);
    } else {
      this.state = { ...this.state, ...updater };
    }
    this.saveState();
  }
}

const store = new StateManager();

// Web Audio API Sound Synthesizer (Zero External Dependencies)
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playCoin() {
    if (!store.state.soundEffects) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, this.ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playPop() {
    if (!store.state.soundEffects) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playFanfare() {
    if (!store.state.soundEffects) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + (i * 0.1);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch (e) {}
  }
}

const sounds = new SoundFX();

// Toast Notification Manager
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
  }

  show(message, type = 'success', duration = 3500) {
    if (!this.container) return;
    const toast = document.createElement('div');
    toast.className = `toast-enter flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all transform pointer-events-auto ${
      type === 'success' ? 'bg-emerald-600 text-white' :
      type === 'info' ? 'bg-blue-600 text-white' :
      type === 'warning' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
    }`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === 'info') {
      iconSvg = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="flex-1">${message}</span>
      <button class="opacity-70 hover:opacity-100 ml-2 focus:outline-none" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
}

const toast = new ToastManager();

// Primary App Controller
const App = {
  views: [
    'home',
    'dashboard',
    'budget',
    'challenge',
    'faq',
    'team',
    'contact',
    'profile',
    'blog'
  ],

  init() {
    this.applyTheme(store.state.darkMode);
    this.renderAll();
    this.setupEventListeners();
    this.switchView(store.state.currentView || 'home', false);
  },

  // 1. Navigation Controller (Switches between all 9 views dynamically without reloading)
  switchView(viewName, playPopSound = true) {
    if (!this.views.includes(viewName)) {
      viewName = 'home';
    }

    if (playPopSound) {
      sounds.playPop();
    }

    store.update({ currentView: viewName });

    // Hide all view sections
    this.views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        el.classList.add('hidden');
      }
      // Update nav link styles
      const navLinks = document.querySelectorAll(`[data-nav-target="${v}"]`);
      navLinks.forEach(link => {
        if (v === viewName) {
          link.classList.add('nav-link-active');
          link.classList.remove('nav-link-inactive');
        } else {
          link.classList.remove('nav-link-active');
          link.classList.add('nav-link-inactive');
        }
      });
    });

    // Show target section with smooth fade
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Quick View Switcher buttons
    document.querySelectorAll('.view-switcher-btn').forEach(btn => {
      const v = btn.getAttribute('data-view');
      if (v === viewName) {
        btn.classList.add('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-sky-400', 'shadow-md', 'font-bold');
        btn.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-white/50');
      } else {
        btn.classList.remove('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-sky-400', 'shadow-md', 'font-bold');
        btn.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:bg-white/50');
      }
    });

    // Close mobile drawer if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }

    // Refresh specific view data on entrance
    if (viewName === 'dashboard') {
      this.renderDashboardAnalytics();
      this.renderTransactions();
    } else if (viewName === 'budget') {
      this.renderBudgetPlanner();
    } else if (viewName === 'challenge') {
      this.renderChallenge();
    } else if (viewName === 'profile') {
      this.renderProfile();
    }
  },

  // Theme Toggle (Dark / Light Mode)
  toggleDarkMode() {
    const isDark = !store.state.darkMode;
    store.update({ darkMode: isDark });
    this.applyTheme(isDark);
    sounds.playPop();
    toast.show(isDark ? 'Dark mode activated! 🌙' : 'Light mode activated! ☀️', 'info');
  },

  applyTheme(isDark) {
    const html = document.documentElement;
    const darkToggleKnob = document.getElementById('theme-toggle-knob');
    const darkToggleBg = document.getElementById('theme-toggle-bg');
    const profileDarkKnob = document.getElementById('profile-dark-knob');
    const profileDarkBg = document.getElementById('profile-dark-bg');

    if (isDark) {
      html.classList.add('dark');
      if (darkToggleKnob) darkToggleKnob.style.transform = 'translateX(24px)';
      if (darkToggleBg) darkToggleBg.classList.replace('bg-slate-300', 'bg-blue-600');
      if (profileDarkKnob) profileDarkKnob.style.transform = 'translateX(24px)';
      if (profileDarkBg) profileDarkBg.classList.replace('bg-slate-300', 'bg-blue-600');
    } else {
      html.classList.remove('dark');
      if (darkToggleKnob) darkToggleKnob.style.transform = 'translateX(0px)';
      if (darkToggleBg) darkToggleBg.classList.replace('bg-blue-600', 'bg-slate-300');
      if (profileDarkKnob) profileDarkKnob.style.transform = 'translateX(0px)';
      if (profileDarkBg) profileDarkBg.classList.replace('bg-blue-600', 'bg-slate-300');
    }
    // Re-render chart if on dashboard
    if (store.state.currentView === 'dashboard') {
      this.renderDashboardAnalytics();
    }
  },

  // Notifications Toggle
  toggleNotifications() {
    const newVal = !store.state.notifications;
    store.update({ notifications: newVal });
    sounds.playPop();
    const knob = document.getElementById('profile-notif-knob');
    const bg = document.getElementById('profile-notif-bg');
    if (newVal) {
      if (knob) knob.style.transform = 'translateX(24px)';
      if (bg) bg.classList.replace('bg-slate-300', 'bg-emerald-500');
      toast.show('Smart notifications enabled! 🔔', 'success');
    } else {
      if (knob) knob.style.transform = 'translateX(0px)';
      if (bg) bg.classList.replace('bg-emerald-500', 'bg-slate-300');
      toast.show('Notifications paused. 🔕', 'info');
    }
  },

  // Sound Toggle
  toggleSoundEffects() {
    const newVal = !store.state.soundEffects;
    store.update({ soundEffects: newVal });
    sounds.playPop();
    toast.show(newVal ? 'Chimes & audio enabled! 🎵' : 'Audio muted. 🔇', 'info');
    this.renderProfile();
  },

  // 2. Dashboard View - 40-40-10-10 Rule & Analytics
  renderDashboardAnalytics() {
    const pocketMoney = store.state.user.monthlyPocketMoney || 1000;
    const saveAmt = Math.round(pocketMoney * (store.state.rule.savePercent / 100));
    const spendAmt = Math.round(pocketMoney * (store.state.rule.spendPercent / 100));
    const investAmt = Math.round(pocketMoney * (store.state.rule.investPercent / 100));
    const donateAmt = Math.round(pocketMoney * (store.state.rule.donatePercent / 100));

    // Update text elements
    const saveEl = document.getElementById('dash-save-amount');
    const spendEl = document.getElementById('dash-spend-amount');
    const investEl = document.getElementById('dash-invest-amount');
    const donateEl = document.getElementById('dash-donate-amount');
    const totalEl = document.getElementById('dash-total-budget');

    if (saveEl) saveEl.textContent = `₹${saveAmt}`;
    if (spendEl) spendEl.textContent = `₹${spendAmt}`;
    if (investEl) investEl.textContent = `₹${investAmt}`;
    if (donateEl) donateEl.textContent = `₹${donateAmt}`;
    if (totalEl) totalEl.textContent = `₹${pocketMoney}`;

    // Update Donut Chart
    this.renderDonutChart(saveAmt, spendAmt, investAmt, donateAmt, pocketMoney);
  },

  renderDonutChart(save, spend, invest, donate, total) {
    const chartContainer = document.getElementById('donut-chart-svg');
    if (!chartContainer) return;

    // SVG Donut calculation with r = 70, cx = 100, cy = 100 -> circumference = 2 * PI * 70 ≈ 439.82
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const pSave = save / total;
    const pSpend = spend / total;
    const pInvest = invest / total;
    const pDonate = donate / total;

    const lenSave = pSave * circumference;
    const lenSpend = pSpend * circumference;
    const lenInvest = pInvest * circumference;
    const lenDonate = pDonate * circumference;

    const offsetSave = 0;
    const offsetSpend = -lenSave;
    const offsetInvest = -(lenSave + lenSpend);
    const offsetDonate = -(lenSave + lenSpend + lenInvest);

    chartContainer.innerHTML = `
      <circle cx="100" cy="100" r="${radius}" fill="transparent" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="26" />
      <!-- Save 40% (Emerald) -->
      <circle id="slice-save" cx="100" cy="100" r="${radius}" fill="transparent" stroke="#10B981" stroke-width="24"
        stroke-dasharray="${lenSave} ${circumference - lenSave}" stroke-dashoffset="${offsetSave}"
        class="chart-segment transition-all duration-700" data-label="Savings (40%)" data-amt="₹${save}" />
      <!-- Spend 40% (Blue) -->
      <circle id="slice-spend" cx="100" cy="100" r="${radius}" fill="transparent" stroke="#3B82F6" stroke-width="24"
        stroke-dasharray="${lenSpend} ${circumference - lenSpend}" stroke-dashoffset="${offsetSpend}"
        class="chart-segment transition-all duration-700" data-label="Spending (40%)" data-amt="₹${spend}" />
      <!-- Invest 10% (Amber) -->
      <circle id="slice-invest" cx="100" cy="100" r="${radius}" fill="transparent" stroke="#F59E0B" stroke-width="24"
        stroke-dasharray="${lenInvest} ${circumference - lenInvest}" stroke-dashoffset="${offsetInvest}"
        class="chart-segment transition-all duration-700" data-label="Investing (10%)" data-amt="₹${invest}" />
      <!-- Donate 10% (Purple) -->
      <circle id="slice-donate" cx="100" cy="100" r="${radius}" fill="transparent" stroke="#8B5CF6" stroke-width="24"
        stroke-dasharray="${lenDonate} ${circumference - lenDonate}" stroke-dashoffset="${offsetDonate}"
        class="chart-segment transition-all duration-700" data-label="Donation & Kindness (10%)" data-amt="₹${donate}" />
    `;

    // Attach hover listener for center text
    const centerTitle = document.getElementById('chart-center-title');
    const centerSub = document.getElementById('chart-center-sub');

    const updateCenter = (title, sub) => {
      if (centerTitle) centerTitle.textContent = title;
      if (centerSub) centerSub.textContent = sub;
    };

    ['slice-save', 'slice-spend', 'slice-invest', 'slice-donate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('mouseenter', () => {
          sounds.playPop();
          updateCenter(el.getAttribute('data-amt'), el.getAttribute('data-label'));
        });
        el.addEventListener('mouseleave', () => {
          updateCenter(`₹${save}`, 'Savings (40%)');
        });
      }
    });
  },

  // Adjust pocket money base in Dashboard
  adjustPocketMoneyPrompt() {
    const current = store.state.user.monthlyPocketMoney;
    const input = prompt(`Enter your monthly pocket money amount in ₹ (current: ₹${current}):`, current);
    if (input !== null) {
      const val = parseInt(input.trim(), 10);
      if (!isNaN(val) && val >= 100 && val <= 100000) {
        store.update(s => ({
          ...s,
          user: { ...s.user, monthlyPocketMoney: val }
        }));
        this.renderDashboardAnalytics();
        this.renderProfile();
        toast.show(`Monthly Pocket Money updated to ₹${val}!`, 'success');
      } else {
        toast.show('Please enter a valid amount between ₹100 and ₹1,00,000.', 'warning');
      }
    }
  },

  // 3. Transactions Manager
  renderTransactions(filter = 'all') {
    const list = document.getElementById('transactions-list');
    if (!list) return;

    let items = [...store.state.transactions];
    if (filter !== 'all') {
      items = items.filter(t => t.type === filter);
    }

    if (items.length === 0) {
      list.innerHTML = `
        <div class="py-8 text-center text-slate-400">
          <p class="text-sm">No transactions found in this category.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = items.map(t => {
      const isPositive = t.amount > 0;
      const amtFormatted = isPositive ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`;
      const amtClass = isPositive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-800 dark:text-slate-100 font-bold';
      
      let iconColor = 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
      if (t.category === 'Food') iconColor = 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300';
      if (t.category === 'Entertainment') iconColor = 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300';
      if (t.category === 'Savings') iconColor = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
      if (t.category === 'Income') iconColor = 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300';

      return `
        <div class="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
          <div class="flex items-center space-x-3.5">
            <div class="w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              ${this.getTransactionIcon(t.category)}
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">${this.escapeHTML(t.title)}</p>
              <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <span>${t.category}</span>
                <span>•</span>
                <span>${t.date}</span>
              </div>
            </div>
          </div>
          <div class="text-right flex items-center space-x-3">
            <span class="text-base ${amtClass}">${amtFormatted}</span>
            <button onclick="App.deleteTransaction(${t.id})" title="Delete" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  getTransactionIcon(category) {
    switch (category) {
      case 'Food': return '🍔';
      case 'Entertainment': return '🎬';
      case 'School Supplies': return '📚';
      case 'Savings': return '🐷';
      case 'Income': return '💵';
      default: return '🪙';
    }
  },

  deleteTransaction(id) {
    store.update(s => ({
      ...s,
      transactions: s.transactions.filter(t => t.id !== id)
    }));
    sounds.playPop();
    this.renderTransactions();
    toast.show('Transaction removed.', 'info');
  },

  openAddTransactionModal() {
    const modal = document.getElementById('transaction-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.getElementById('tx-title').focus();
    }
  },

  closeAddTransactionModal() {
    const modal = document.getElementById('transaction-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  submitAddTransaction(e) {
    e.preventDefault();
    const title = document.getElementById('tx-title').value.trim();
    const amountVal = parseFloat(document.getElementById('tx-amount').value);
    const category = document.getElementById('tx-category').value;
    const type = document.getElementById('tx-type').value;

    if (!title || isNaN(amountVal) || amountVal <= 0) {
      toast.show('Please enter a valid title and positive amount.', 'warning');
      return;
    }

    const finalAmount = type === 'expense' ? -Math.abs(amountVal) : Math.abs(amountVal);

    const newTx = {
      id: Date.now(),
      title,
      category,
      amount: finalAmount,
      type,
      date: 'Just now',
      icon: 'coin'
    };

    store.update(s => ({
      ...s,
      transactions: [newTx, ...s.transactions]
    }));

    // Update current savings balance
    if (type === 'expense') {
      store.update(s => ({
        ...s,
        user: { ...s.user, currentSavings: Math.max(0, s.user.currentSavings - amountVal) }
      }));
    } else {
      store.update(s => ({
        ...s,
        user: { ...s.user, currentSavings: s.user.currentSavings + amountVal }
      }));
    }

    sounds.playCoin();
    this.closeAddTransactionModal();
    this.renderTransactions();
    this.renderProfile();
    toast.show(`Transaction "${title}" added successfully!`, 'success');

    // Reset fields
    document.getElementById('tx-title').value = '';
    document.getElementById('tx-amount').value = '';
  },

  // 4. Budget Planner View
  renderBudgetPlanner() {
    const container = document.getElementById('budget-categories-list');
    if (!container) return;

    let totalBudget = 0;
    let totalSpent = 0;

    container.innerHTML = store.state.budget.map(item => {
      totalBudget += item.allocated;
      totalSpent += item.spent;
      const percent = Math.min(100, Math.round((item.spent / item.allocated) * 100));
      const remaining = Math.max(0, item.allocated - item.spent);
      const isOver = item.spent > item.allocated;

      // Color coding based on usage
      let barColor = 'bg-blue-500';
      if (item.id === 'food') barColor = 'bg-gradient-to-r from-orange-400 to-amber-500';
      else if (item.id === 'entertainment') barColor = 'bg-gradient-to-r from-purple-500 to-indigo-500';
      else if (item.id === 'school') barColor = 'bg-gradient-to-r from-blue-500 to-cyan-500';
      else if (item.id === 'savings') barColor = 'bg-gradient-to-r from-emerald-400 to-teal-500';
      else if (item.id === 'emergency') barColor = 'bg-gradient-to-r from-rose-500 to-red-500';

      return `
        <div class="p-4 bg-white/70 dark:bg-slate-700/60 rounded-2xl border border-slate-100 dark:border-slate-600/50 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-slate-100 dark:bg-slate-600 shadow-sm">
                ${this.getBudgetEmoji(item.id)}
              </span>
              <div>
                <h4 class="font-bold text-slate-800 dark:text-white text-base">${item.name}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">₹${item.spent} spent of ₹${item.allocated} budget</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-lg font-bold ${isOver ? 'text-rose-500' : 'text-slate-800 dark:text-white'}">₹${item.allocated}</span>
              <p class="text-xs ${isOver ? 'text-rose-500 font-semibold' : 'text-emerald-600 dark:text-emerald-400'} font-medium">
                ${isOver ? 'Budget Exceeded!' : `₹${remaining} left`}
              </p>
            </div>
          </div>

          <!-- Color-coded Progress Bar -->
          <div class="w-full bg-slate-200 dark:bg-slate-600 h-3.5 rounded-full overflow-hidden p-0.5">
            <div class="${barColor} h-full rounded-full transition-all duration-700" style="width: ${percent}%;"></div>
          </div>

          <div class="flex items-center justify-between mt-2 text-xs text-slate-400 dark:text-slate-400">
            <span>${percent}% used</span>
            <div class="flex items-center space-x-2">
              <button onclick="App.adjustCategoryModal('${item.id}')" class="text-blue-600 dark:text-sky-400 hover:underline font-semibold text-xs">
                Edit Limit
              </button>
              <span>•</span>
              <button onclick="App.quickAddSpending('${item.id}')" class="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-xs">
                + Add Expense
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Summary numbers
    const totalEl = document.getElementById('budget-total-sum');
    const spentEl = document.getElementById('budget-spent-sum');
    const remainEl = document.getElementById('budget-remain-sum');
    if (totalEl) totalEl.textContent = `₹${totalBudget}`;
    if (spentEl) spentEl.textContent = `₹${totalSpent}`;
    if (remainEl) remainEl.textContent = `₹${Math.max(0, totalBudget - totalSpent)}`;
  },

  getBudgetEmoji(id) {
    switch (id) {
      case 'food': return '🍕';
      case 'entertainment': return '🎮';
      case 'school': return '📐';
      case 'savings': return '💰';
      case 'emergency': return '🩹';
      default: return '🏷️';
    }
  },

  adjustCategoryModal(catId) {
    const item = store.state.budget.find(b => b.id === catId);
    if (!item) return;
    const newVal = prompt(`Update monthly budget limit for ${item.name} in ₹:`, item.allocated);
    if (newVal !== null) {
      const parsed = parseInt(newVal.trim(), 10);
      if (!isNaN(parsed) && parsed >= 0) {
        store.update(s => ({
          ...s,
          budget: s.budget.map(b => b.id === catId ? { ...b, allocated: parsed } : b)
        }));
        sounds.playPop();
        this.renderBudgetPlanner();
        toast.show(`${item.name} budget updated to ₹${parsed}!`, 'success');
      }
    }
  },

  quickAddSpending(catId) {
    const item = store.state.budget.find(b => b.id === catId);
    if (!item) return;
    const spentVal = prompt(`Enter amount spent on ${item.name} in ₹:`, '50');
    if (spentVal !== null) {
      const parsed = parseInt(spentVal.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) {
        store.update(s => ({
          ...s,
          budget: s.budget.map(b => b.id === catId ? { ...b, spent: b.spent + parsed } : b),
          transactions: [{
            id: Date.now(),
            title: `Quick ${item.name} Expense`,
            category: item.name,
            amount: -parsed,
            type: 'expense',
            date: 'Today',
            icon: 'utensils'
          }, ...s.transactions]
        }));
        sounds.playCoin();
        this.renderBudgetPlanner();
        this.renderTransactions();
        toast.show(`₹${parsed} logged under ${item.name}!`, 'info');
      }
    }
  },

  resetBudgetDefaults() {
    if (confirm('Reset budget categories to standard ₹1,000 recommendations?')) {
      store.update(s => ({
        ...s,
        budget: [
          { id: 'food', name: 'Food', allocated: 200, spent: 140, icon: 'utensils', color: '#F97316', bgClass: 'bg-orange-500' },
          { id: 'entertainment', name: 'Entertainment', allocated: 150, spent: 120, icon: 'film', color: '#A855F7', bgClass: 'bg-purple-500' },
          { id: 'school', name: 'School Supplies', allocated: 250, spent: 180, icon: 'book', color: '#3B82F6', bgClass: 'bg-blue-500' },
          { id: 'savings', name: 'Savings', allocated: 300, spent: 300, icon: 'piggy', color: '#10B981', bgClass: 'bg-emerald-500' },
          { id: 'emergency', name: 'Emergency', allocated: 100, spent: 20, icon: 'shield', color: '#EF4444', bgClass: 'bg-rose-500' }
        ]
      }));
      sounds.playPop();
      this.renderBudgetPlanner();
      toast.show('Budget planner reset to defaults.', 'info');
    }
  },

  // 5. Smart Money Challenge (30-Day Gamified Tracker)
  renderChallenge() {
    const grid = document.getElementById('challenge-days-grid');
    if (!grid) return;

    const { totalDays, completedDays, dailyAmount, targetAmount } = store.state.challenge;
    const completedCount = completedDays.length;
    const totalSaved = completedCount * dailyAmount;
    const percentage = Math.round((totalSaved / targetAmount) * 100);

    // Update text counters
    const counterSaved = document.getElementById('challenge-total-saved');
    const counterPercent = document.getElementById('challenge-progress-percent');
    const counterDays = document.getElementById('challenge-completed-days');
    const counterBar = document.getElementById('challenge-progress-bar');

    if (counterSaved) counterSaved.textContent = `₹${totalSaved}`;
    if (counterPercent) counterPercent.textContent = `${percentage}%`;
    if (counterDays) counterDays.textContent = `${completedCount} of ${totalDays} Days`;
    if (counterBar) counterBar.style.width = `${Math.min(100, percentage)}%`;

    // Render 30 clickable checkboxes
    let html = '';
    for (let day = 1; day <= totalDays; day++) {
      const isDone = completedDays.includes(day);
      html += `
        <button
          onclick="App.toggleChallengeDay(${day})"
          class="challenge-day-btn relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer font-bold select-none ${
            isDone
              ? 'completed border-emerald-500 text-white'
              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-600 shadow-sm'
          }"
          aria-label="Day ${day}: Save ₹${dailyAmount}"
        >
          <div class="flex items-center justify-between w-full mb-1">
            <span class="text-xs uppercase tracking-wider opacity-80">D${day}</span>
            ${
              isDone
                ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`
                : `<div class="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-500"></div>`
            }
          </div>
          <span class="text-sm font-extrabold ${isDone ? 'text-white' : 'text-slate-800 dark:text-white'}">₹${dailyAmount}</span>
        </button>
      `;
    }
    grid.innerHTML = html;

    // Update Money Tree Visual based on completedCount
    this.updateMoneyTreeStage(completedCount);
  },

  toggleChallengeDay(day) {
    const { completedDays, dailyAmount } = store.state.challenge;
    let newCompleted;
    let isAdded = false;

    if (completedDays.includes(day)) {
      newCompleted = completedDays.filter(d => d !== day);
      sounds.playPop();
      toast.show(`Day ${day} unmarked (₹${dailyAmount})`, 'info', 2000);
    } else {
      newCompleted = [...completedDays, day].sort((a, b) => a - b);
      sounds.playCoin();
      isAdded = true;
      toast.show(`🎉 Day ${day} completed! +₹${dailyAmount} saved into piggy bank!`, 'success', 2500);

      // Check if finished 30 days
      if (newCompleted.length === 30) {
        sounds.playFanfare();
        toast.show('🏆 Congratulations! 30-Day Smart Savings Challenge Complete! ₹600 Saved!', 'success', 6000);
      }
    }

    store.update(s => ({
      ...s,
      challenge: { ...s.challenge, completedDays: newCompleted }
    }));

    this.renderChallenge();
  },

  checkNextChallengeDay() {
    const { totalDays, completedDays } = store.state.challenge;
    for (let day = 1; day <= totalDays; day++) {
      if (!completedDays.includes(day)) {
        this.toggleChallengeDay(day);
        return;
      }
    }
    toast.show('All 30 days are already completed! Amazing job! 🌟', 'info');
  },

  resetChallenge() {
    if (confirm('Are you sure you want to reset the 30-Day Challenge?')) {
      store.update(s => ({
        ...s,
        challenge: { ...s.challenge, completedDays: [] }
      }));
      sounds.playPop();
      this.renderChallenge();
      toast.show('30-Day Challenge reset. Ready for a fresh streak!', 'info');
    }
  },

  // Money Tree Vector Animation Generator
  updateMoneyTreeStage(completedDays) {
    const treeContainer = document.getElementById('money-tree-stage');
    const treeBadge = document.getElementById('tree-stage-badge');
    if (!treeContainer) return;

    let stageName = 'Stage 1: Seed & Sprout 🌱';
    let coinCount = 2;
    let foliageScale = 0.6;
    let leavesOpacity = 0.7;

    if (completedDays >= 25) {
      stageName = 'Stage 4: Golden Harvest Tree! 🌳✨';
      coinCount = 12;
      foliageScale = 1.15;
      leavesOpacity = 1;
    } else if (completedDays >= 15) {
      stageName = 'Stage 3: Rupee Blossom Tree 🌿🪙';
      coinCount = 7;
      foliageScale = 1.0;
      leavesOpacity = 0.95;
    } else if (completedDays >= 6) {
      stageName = 'Stage 2: Growing Sapling 🌿';
      coinCount = 4;
      foliageScale = 0.85;
      leavesOpacity = 0.85;
    }

    if (treeBadge) {
      treeBadge.textContent = stageName;
    }

    // Generate dynamic SVG Money Tree
    let coinsSvg = '';
    const coinPositions = [
      { x: 100, y: 80 }, { x: 70, y: 110 }, { x: 130, y: 105 },
      { x: 50, y: 140 }, { x: 150, y: 135 }, { x: 95, y: 130 },
      { x: 80, y: 60 }, { x: 120, y: 65 }, { x: 35, y: 115 },
      { x: 165, y: 115 }, { x: 65, y: 160 }, { x: 135, y: 155 }
    ];

    for (let i = 0; i < Math.min(coinCount, coinPositions.length); i++) {
      const pos = coinPositions[i];
      coinsSvg += `
        <g class="animate-pulse-gentle" style="animation-delay: ${i * 0.25}s">
          <circle cx="${pos.x}" cy="${pos.y}" r="11" fill="#FBBF24" stroke="#D97706" stroke-width="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"/>
          <circle cx="${pos.x}" cy="${pos.y}" r="8.5" fill="none" stroke="#FDE68A" stroke-width="1"/>
          <text x="${pos.x}" y="${pos.y + 3.5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#78350F" font-family="'Fredoka', sans-serif">₹</text>
        </g>
      `;
    }

    treeContainer.innerHTML = `
      <svg viewBox="0 0 200 240" class="w-full h-56 mx-auto filter drop-shadow-md transition-all duration-700">
        <defs>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#854d0e"/>
            <stop offset="50%" stop-color="#a16207"/>
            <stop offset="100%" stop-color="#713f12"/>
          </linearGradient>
          <linearGradient id="foliageGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#34D399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <linearGradient id="foliageGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FB923C"/>
            <stop offset="100%" stop-color="#C2410C"/>
          </linearGradient>
        </defs>

        <!-- Garden Ground / Soil Mound -->
        <ellipse cx="100" cy="220" rx="75" ry="14" fill="#047857" opacity="0.3"/>
        <path d="M50 220 Q100 208 150 220" stroke="#059669" stroke-width="6" stroke-linecap="round"/>

        <!-- Little Plant Pot or Cottage -->
        <path d="M72 200 L128 200 L120 226 L80 226 Z" fill="url(#potGrad)" stroke="#9A3412" stroke-width="2"/>
        <rect x="68" y="196" width="64" height="6" rx="3" fill="#FDBA74" stroke="#9A3412" stroke-width="1.5"/>
        <text x="100" y="217" text-anchor="middle" font-size="9" font-weight="bold" fill="#7C2D12">POCKET ₹</text>

        <!-- Tree Trunk -->
        <path d="M93 200 C93 170 85 145 78 135 C88 140 98 145 100 155 C102 142 110 135 122 135 C115 145 107 170 107 200 Z"
          fill="url(#trunkGrad)" stroke="#582d07" stroke-width="1.5"/>

        <!-- Foliage Clusters (Responsive to stage) -->
        <g transform="translate(100, 115) scale(${foliageScale}) translate(-100, -115)" opacity="${leavesOpacity}">
          <!-- Bottom Foliage -->
          <circle cx="70" cy="140" r="32" fill="url(#foliageGrad2)"/>
          <circle cx="130" cy="140" r="32" fill="url(#foliageGrad2)"/>
          <!-- Middle Foliage -->
          <circle cx="55" cy="105" r="35" fill="url(#foliageGrad1)"/>
          <circle cx="145" cy="105" r="35" fill="url(#foliageGrad1)"/>
          <circle cx="100" cy="120" r="42" fill="url(#foliageGrad2)"/>
          <!-- Top Crown -->
          <circle cx="75" cy="70" r="34" fill="url(#foliageGrad1)"/>
          <circle cx="125" cy="70" r="34" fill="url(#foliageGrad1)"/>
          <circle cx="100" cy="55" r="36" fill="url(#foliageGrad1)"/>
        </g>

        <!-- Dynamic Rupee Coins Growing on Tree -->
        ${coinsSvg}

        <!-- Sparkles if high stage -->
        ${completedDays >= 20 ? `
          <polygon points="100,15 103,23 111,25 103,28 100,35 97,28 89,25 97,23" fill="#FDE047" class="animate-pulse-gentle"/>
          <polygon points="160,50 162,55 167,56 162,58 160,63 158,58 153,56 158,55" fill="#FDE047" class="animate-pulse-gentle" style="animation-delay: 0.5s"/>
          <polygon points="40,55 42,60 47,61 42,63 40,68 38,63 33,61 38,60" fill="#FDE047" class="animate-pulse-gentle" style="animation-delay: 0.8s"/>
        ` : ''}
      </svg>
    `;
  },

  // 6. FAQ Accordion Controller
  toggleFaq(index) {
    const item = document.getElementById(`faq-answer-${index}`);
    const arrow = document.getElementById(`faq-arrow-${index}`);
    if (!item || !arrow) return;

    sounds.playPop();
    const isHidden = item.classList.contains('hidden');

    // Close others for clean accordion experience
    document.querySelectorAll('[id^="faq-answer-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="faq-arrow-"]').forEach(el => el.classList.remove('rotate-180'));

    if (isHidden) {
      item.classList.remove('hidden');
      arrow.classList.add('rotate-180');
    }
  },

  filterFaq(keyword) {
    const q = keyword.toLowerCase().trim();
    document.querySelectorAll('.faq-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  },

  // 7. Blog / Resources Controller
  expandBlogModal(id) {
    const modal = document.getElementById('blog-read-modal');
    const content = document.getElementById('blog-modal-content');
    if (!modal || !content) return;

    sounds.playPop();

    const articles = {
      1: {
        title: 'Top Saving Tips for Students & Young Earners',
        category: 'Practical Habits',
        readTime: '4 min read',
        icon: '🧮',
        body: `
          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">1. The 24-Hour Cooling Rule</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Whenever you feel an overwhelming urge to buy snacks, video game skins, or trendy stationery, wait 24 hours. More than 70% of impulse buying desires fade away by next morning!
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">2. Pay Yourself First</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            As soon as pocket money lands in your hands, move ₹200 or 40% straight into your savings jar before you spend a single Rupee. Never save "what is left" after spending—spend what is left after saving!
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">3. Pack Your Own Water & Snacks</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Buying packaged juice and chips at school canteens eats ₹30–₹50 daily. Carrying a refillable bottle and home snacks saves over ₹900 every month!
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">4. Micro-Streak Challenges</h4>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            Use the 30-day Smart Money Challenge to save just ₹20 a day. Small drops turn into an ocean of ₹600 without feeling any pinch.
          </p>
        `
      },
      2: {
        title: 'Things to Avoid: Costly Traps for Young Savers',
        category: 'Pitfalls & Traps',
        readTime: '5 min read',
        icon: '⚠️',
        body: `
          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">1. Peer Pressure Spending</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Buying expensive branded gear or joining fast-food treats just because your friends are doing it is the #1 reason pocket money vanishes in week one. True friends respect boundaries.
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">2. Micro-Transactions in Video Games</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            ₹79 for gems or ₹150 for virtual crates seem harmless, but repeated taps drain real pocket money into digital pixels that lose value tomorrow.
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">3. Not Keeping an Emergency Buffer</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            If your bicycle tire punctures or you urgently need replacement notebook copies, having zero emergency stash forces you into borrowing stress. Keep at least 10% aside!
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">4. Forgetting To Record Small Cash Transactions</h4>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            Cash leaks silently. Write down every ₹10 bus ticket or photocopy to see where leaks occur.
          </p>
        `
      },
      3: {
        title: 'How to Set Saving Goals You Actually Hit',
        category: 'Goal Setting',
        readTime: '6 min read',
        icon: '🎯',
        body: `
          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">1. Use the SMART Framework</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Don't just say "I want to save money." Say: <em>"I will save ₹3,000 for a gear bicycle in 6 months by saving ₹500 every month."</em> Specific, Measurable, Achievable, Relevant, and Time-bound!
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">2. Visualize Your Dream Milestone</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Print a picture of what you are saving for or stick a note on your money jar. When temptation strikes, your visual goal reminds your brain of the bigger reward ahead.
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">3. Celebrate Small Milestones</h4>
          <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            When you hit 25% or 50% of your savings goal, treat yourself to a small reward (like watching a favorite movie or having homemade ice cream) without touching the core fund.
          </p>

          <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-3">4. Team Up with a Savings Buddy</h4>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            Share your goal with a friend or sibling. Mutual accountability doubles your chance of crossing the finish line!
          </p>
        `
      }
    };

    const art = articles[id] || articles[1];

    content.innerHTML = `
      <div class="mb-4 flex items-center justify-between">
        <span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          ${art.category}
        </span>
        <span class="text-xs text-slate-400">${art.readTime}</span>
      </div>
      <div class="flex items-center space-x-3 mb-6">
        <span class="text-4xl p-2 bg-slate-100 dark:bg-slate-700 rounded-2xl shadow-sm">${art.icon}</span>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">${art.title}</h3>
      </div>
      <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-6">
        ${art.body}
      </div>
      <div class="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <button onclick="App.likeArticle(${id})" class="flex items-center space-x-2 text-rose-500 hover:text-rose-600 font-bold text-sm bg-rose-50 dark:bg-rose-900/30 px-4 py-2 rounded-xl transition">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span id="blog-modal-likes">${store.state.blogLikes[id] || 0} Likes</span>
        </button>
        <button onclick="App.closeBlogModal()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition">
          Close Article
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  closeBlogModal() {
    const modal = document.getElementById('blog-read-modal');
    if (modal) modal.classList.add('hidden');
  },

  likeArticle(id) {
    sounds.playCoin();
    const current = store.state.blogLikes[id] || 0;
    const newLikes = { ...store.state.blogLikes, [id]: current + 1 };
    store.update({ blogLikes: newLikes });

    // Update modal counter if visible
    const modalLikes = document.getElementById('blog-modal-likes');
    if (modalLikes) modalLikes.textContent = `${current + 1} Likes`;

    // Update card counter
    const cardLikes = document.getElementById(`card-likes-${id}`);
    if (cardLikes) cardLikes.textContent = `${current + 1}`;

    toast.show('Thank you for liking this article! ❤️', 'info');
  },

  bookmarkArticle(id) {
    sounds.playPop();
    const current = !!store.state.blogBookmarks[id];
    const newBook = { ...store.state.blogBookmarks, [id]: !current };
    store.update({ blogBookmarks: newBook });

    const btn = document.getElementById(`card-bookmark-${id}`);
    if (btn) {
      if (!current) {
        btn.classList.add('text-amber-500', 'fill-current');
        toast.show('Article bookmarked to your favorites! 🔖', 'success');
      } else {
        btn.classList.remove('text-amber-500', 'fill-current');
        toast.show('Bookmark removed.', 'info');
      }
    }
  },

  // 8. Contact Form Handler
  handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const topic = document.getElementById('contact-topic')?.value || 'General Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      toast.show('Please fill in all required fields.', 'warning');
      return;
    }

    const newMsg = {
      id: Date.now(),
      name,
      email,
      topic,
      message,
      submittedAt: new Date().toLocaleTimeString()
    };

    store.update(s => ({
      ...s,
      contactMessages: [newMsg, ...(s.contactMessages || [])]
    }));

    // Trigger Success
    sounds.playFanfare();
    toast.show(`Thank you ${name}! Message sent successfully. We will reply within 24 hours. ✨`, 'success', 5000);

    // Show inline alert in form
    const alertBox = document.getElementById('contact-success-alert');
    if (alertBox) {
      alertBox.classList.remove('hidden');
      setTimeout(() => alertBox.classList.add('hidden'), 5000);
    }

    // Reset Form
    document.getElementById('contact-form').reset();
  },

  // 9. Profile & Settings Manager
  renderProfile() {
    const { user } = store.state;
    const nameEl = document.getElementById('profile-display-name');
    const fullEl = document.getElementById('profile-full-name');
    const savingsEl = document.getElementById('profile-current-savings');
    const goalEl = document.getElementById('profile-goal-name');
    const goalAmtEl = document.getElementById('profile-goal-amount');
    const pocketEl = document.getElementById('profile-pocket-money');

    if (nameEl) nameEl.textContent = user.name;
    if (fullEl) fullEl.textContent = user.fullName || user.name;
    if (savingsEl) savingsEl.textContent = `₹${user.currentSavings.toLocaleString('en-IN')}`;
    if (goalEl) goalEl.textContent = user.savingsGoalName;
    if (goalAmtEl) goalAmtEl.textContent = `Target: ₹${user.savingsGoalAmount.toLocaleString('en-IN')}`;
    if (pocketEl) pocketEl.textContent = `₹${user.monthlyPocketMoney.toLocaleString('en-IN')}`;

    // Update sound toggle UI
    const soundKnob = document.getElementById('profile-sound-knob');
    const soundBg = document.getElementById('profile-sound-bg');
    if (store.state.soundEffects) {
      if (soundKnob) soundKnob.style.transform = 'translateX(24px)';
      if (soundBg) soundBg.classList.replace('bg-slate-300', 'bg-blue-600');
    } else {
      if (soundKnob) soundKnob.style.transform = 'translateX(0px)';
      if (soundBg) soundBg.classList.replace('bg-blue-600', 'bg-slate-300');
    }
  },

  openEditProfileModal() {
    const modal = document.getElementById('profile-edit-modal');
    if (!modal) return;
    const { user } = store.state;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-fullname').value = user.fullName;
    document.getElementById('edit-pocket').value = user.monthlyPocketMoney;
    document.getElementById('edit-savings').value = user.currentSavings;
    document.getElementById('edit-goal').value = user.savingsGoalName;
    document.getElementById('edit-goalamt').value = user.savingsGoalAmount;
    modal.classList.remove('hidden');
  },

  closeEditProfileModal() {
    const modal = document.getElementById('profile-edit-modal');
    if (modal) modal.classList.add('hidden');
  },

  saveProfileChanges(e) {
    e.preventDefault();
    const name = document.getElementById('edit-name').value.trim();
    const fullName = document.getElementById('edit-fullname').value.trim();
    const pocket = parseInt(document.getElementById('edit-pocket').value, 10);
    const savings = parseInt(document.getElementById('edit-savings').value, 10);
    const goal = document.getElementById('edit-goal').value.trim();
    const goalamt = parseInt(document.getElementById('edit-goalamt').value, 10);

    if (!name || isNaN(pocket) || isNaN(savings)) {
      toast.show('Please fill in valid profile information.', 'warning');
      return;
    }

    store.update(s => ({
      ...s,
      user: {
        ...s.user,
        name,
        fullName: fullName || name,
        monthlyPocketMoney: pocket,
        currentSavings: savings,
        savingsGoalName: goal || 'My Dream Goal',
        savingsGoalAmount: goalamt || 2000
      }
    }));

    sounds.playCoin();
    this.closeEditProfileModal();
    this.renderProfile();
    this.renderDashboardAnalytics();
    toast.show('Profile & pocket money goals updated successfully! 👤✨', 'success');
  },

  addQuickSavings() {
    const input = prompt('Add pocket money deposit to current savings (₹):', '200');
    if (input !== null) {
      const val = parseInt(input.trim(), 10);
      if (!isNaN(val) && val > 0) {
        store.update(s => ({
          ...s,
          user: { ...s.user, currentSavings: s.user.currentSavings + val },
          transactions: [{
            id: Date.now(),
            title: 'Manual Savings Deposit',
            category: 'Savings',
            amount: val,
            type: 'savings',
            date: 'Today',
            icon: 'piggy'
          }, ...s.transactions]
        }));
        sounds.playCoin();
        this.renderProfile();
        this.renderTransactions();
        toast.show(`₹${val} added to your current savings! 🐷🪙`, 'success');
      }
    }
  },

  exportUserData() {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pocket_money_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      sounds.playPop();
      toast.show('Your financial data backup has been downloaded! 📁', 'success');
    } catch (e) {
      toast.show('Failed to export data.', 'error');
    }
  },

  resetAllAppData() {
    if (confirm('Warning: This will reset all pocket money challenge, transactions, and custom settings back to defaults. Continue?')) {
      localStorage.removeItem('pocket_money_app_state');
      store.state = { ...DEFAULT_STATE };
      store.saveState();
      sounds.playPop();
      this.init();
      toast.show('All app data has been reset to defaults.', 'info');
    }
  },

  // Setup Global Event Listeners
  setupEventListeners() {
    // Navigation items
    document.querySelectorAll('[data-nav-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav-target');
        this.switchView(target);
      });
    });

    // View switcher buttons
    document.querySelectorAll('.view-switcher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-view');
        this.switchView(target);
      });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        sounds.playPop();
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Dark Mode Toggles
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleDarkMode());
    }
    const profileDarkBtn = document.getElementById('profile-dark-btn');
    if (profileDarkBtn) {
      profileDarkBtn.addEventListener('click', () => this.toggleDarkMode());
    }

    // Notifications Toggle
    const profileNotifBtn = document.getElementById('profile-notif-btn');
    if (profileNotifBtn) {
      profileNotifBtn.addEventListener('click', () => this.toggleNotifications());
    }

    // Sound Toggle
    const profileSoundBtn = document.getElementById('profile-sound-btn');
    if (profileSoundBtn) {
      profileSoundBtn.addEventListener('click', () => this.toggleSoundEffects());
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    // Transaction Form
    const txForm = document.getElementById('add-transaction-form');
    if (txForm) {
      txForm.addEventListener('submit', (e) => this.submitAddTransaction(e));
    }

    // Profile Edit Form
    const profileForm = document.getElementById('edit-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.saveProfileChanges(e));
    }

    // FAQ Search Filter Input
    const faqSearch = document.getElementById('faq-search-input');
    if (faqSearch) {
      faqSearch.addEventListener('input', (e) => this.filterFaq(e.target.value));
    }

    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAddTransactionModal();
        this.closeEditProfileModal();
        this.closeBlogModal();
      }
    });
  },

  renderAll() {
    this.renderDashboardAnalytics();
    this.renderTransactions();
    this.renderBudgetPlanner();
    this.renderChallenge();
    this.renderProfile();
  },

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
};

// Expose globally for inline HTML event handlers
window.App = App;

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
