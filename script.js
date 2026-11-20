/* =========================================================
   My Habits – Weekly Habit Tracker
   Vanilla JavaScript. Data is saved in localStorage.
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   State
   --------------------------------------------------------- */
const STORAGE_KEY = 'weeklyHabits';

let habits = [];
try {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
  habits = Array.isArray(raw) ? raw : [];
} catch (err) {
  habits = [];
}

let selectedDate = new Date();

/* ---------------------------------------------------------
   DOM references
   --------------------------------------------------------- */
const datePicker       = document.getElementById('date-picker');
const headerRow        = document.getElementById('header-row');
const habitsContainer  = document.getElementById('habits-container');
const emptyMsg         = document.getElementById('empty-msg');
const addForm          = document.getElementById('add-form');
const clearBtn         = document.getElementById('clear-btn');
const prevWeekBtn      = document.getElementById('prev-week');
const nextWeekBtn      = document.getElementById('next-week');
const todayBtn         = document.getElementById('today-btn');
const summaryEl        = document.getElementById('summary');
const installBtn       = document.getElementById('install-btn');

/* ---------------------------------------------------------
   Constants
   --------------------------------------------------------- */
const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */

/** Returns a YYYY-MM-DD key for a date object. */
function getDateKey(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'invalid-date';
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/** Today's key as YYYY-MM-DD. */
function todayKey() {
  return getDateKey(new Date());
}

/** Persist habits to localStorage. */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.warn('Could not save data:', err);
  }
}

/** Returns an array of 7 Date objects (Sunday → Saturday) for the week containing baseDate. */
function getWeekDates(baseDate) {
  let current = new Date(baseDate);
  if (isNaN(current.getTime())) current = new Date();
  current.setHours(0, 0, 0, 0);

  current.setDate(current.getDate() - current.getDay()); // back to Sunday

  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Current consecutive-day streak for a habit (ends today, or yesterday if today not done). */
function getStreak(habit) {
  const history = habit.history || {};
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (history[getDateKey(cursor)] !== true) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (history[getDateKey(cursor)] === true) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/* ---------------------------------------------------------
   Rendering
   --------------------------------------------------------- */

function renderHeader() {
  headerRow.innerHTML = '<div class="habit-info-col">Habit Details</div>';

  const weekDates = getWeekDates(selectedDate);
  const todaysKey = todayKey();

  weekDates.forEach(date => {
    const dayName = DAY_NAMES[date.getDay()];
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

    const div = document.createElement('div');
    div.className = 'day-col' + (getDateKey(date) === todaysKey ? ' is-today' : '');
    div.innerHTML = `${dayName}<span class="date-text">${dateStr}</span>`;
    headerRow.appendChild(div);
  });
}

function renderSummary(weekDates) {
  const totalPossible = habits.length * 7;
  let done = 0;

  habits.forEach(habit => {
    const history = habit.history || {};
    weekDates.forEach(date => {
      if (history[getDateKey(date)] === true) done++;
    });
  });

  const first = weekDates[0];
  const last  = weekDates[6];
  const range = `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
  const pct   = totalPossible === 0 ? 0 : Math.round((done / totalPossible) * 100);

  summaryEl.innerHTML = `
    <div class="summary-top">
      <span class="summary-label"><strong>${done}</strong> of ${totalPossible} check-ins this week</span>
      <span class="summary-range">${range}</span>
    </div>
    <div class="summary-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Weekly progress">
      <div class="summary-fill" style="width:${pct}%"></div>
    </div>`;
}

function renderHabits() {
  habitsContainer.innerHTML = '';

  if (habits.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  const weekDates = getWeekDates(selectedDate);
  const todaysKey = todayKey();

  habits.forEach((habit, index) => {
    if (!habit.history) habit.history = {};

    const row = document.createElement('div');
    row.className = 'board-row';

    /* ---------- Habit info column ---------- */
    const infoCol = document.createElement('div');
    infoCol.className = 'habit-info-col';

    const textWrapper = document.createElement('div');
    textWrapper.className = 'habit-text';

    const nameEl = document.createElement('div');
    nameEl.className = 'habit-name';
    nameEl.textContent = habit.name || 'Unnamed';

    const descEl = document.createElement('div');
    descEl.className = 'habit-desc';
    descEl.textContent = habit.desc || 'No description';

    /* Per-habit stats */
    let weekDone = 0;
    weekDates.forEach(date => {
      if (habit.history[getDateKey(date)] === true) weekDone++;
    });
    const streak = getStreak(habit);

    const statsEl = document.createElement('div');
    statsEl.className = 'habit-stats';
    statsEl.innerHTML =
      `<span class="week-count">${weekDone}/7 this week</span>` +
      (streak > 0 ? `<span class="streak">🔥 ${streak} day${streak === 1 ? '' : 's'}</span>` : '');

    textWrapper.appendChild(nameEl);
    textWrapper.appendChild(descEl);
    textWrapper.appendChild(statsEl);

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.type = 'button';
    delBtn.innerHTML = '&#10005;';
    delBtn.title = 'Delete habit';
    delBtn.setAttribute('aria-label', `Delete habit ${habit.name || 'Unnamed'}`);
    delBtn.addEventListener('click', () => {
      if (!confirm(`Delete "${habit.name || 'this habit'}"?`)) return;
      habits.splice(index, 1);
      saveData();
      renderAll();
    });

    infoCol.appendChild(textWrapper);
    infoCol.appendChild(delBtn);
    row.appendChild(infoCol);

    /* ---------- Day columns ---------- */
    weekDates.forEach(date => {
      const dateKey = getDateKey(date);
      const isDone  = habit.history[dateKey] === true;

      const dayCol = document.createElement('div');
      dayCol.className = 'day-col';

      const icon = document.createElement('button');
      icon.type = 'button';
      icon.className = 'status-icon ' + (isDone ? 'done' : 'missed');
      icon.innerHTML = isDone ? '&#10003;' : '&#10005;';
      icon.setAttribute('aria-pressed', String(isDone));
      icon.setAttribute(
        'aria-label',
        `${habit.name || 'Habit'} on ${DAY_NAMES[date.getDay()]} ${date.getDate()}: ${isDone ? 'done, tap to unmark' : 'not done, tap to mark done'}`
      );

      icon.addEventListener('click', () => {
        if (habit.history[dateKey]) {
          delete habit.history[dateKey];
        } else {
          habit.history[dateKey] = true;
        }
        saveData();
        renderAll();
      });

      /* Subtle highlight for today's column */
      if (dateKey === todaysKey) dayCol.style.background = '#fafcff';

      dayCol.appendChild(icon);
      row.appendChild(dayCol);
    });

    habitsContainer.appendChild(row);
  });
}

function renderAll() {
  renderHeader();
  renderSummary(getWeekDates(selectedDate));
  renderHabits();
}

/* ---------------------------------------------------------
   Event handlers
   --------------------------------------------------------- */

addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('habit-name');
  const descInput = document.getElementById('habit-desc');

  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (name === '') {
    alert('Please enter a habit name.');
    nameInput.focus();
    return;
  }

  habits.push({ name, desc, history: {} });
  nameInput.value = '';
  descInput.value = '';
  nameInput.focus();

  saveData();
  renderAll();
});

clearBtn.addEventListener('click', () => {
  if (habits.length === 0) {
    alert('There are no habits to clear.');
    return;
  }
  if (confirm('Are you sure you want to delete ALL habits? This cannot be undone.')) {
    habits = [];
    saveData();
    renderAll();
  }
});

datePicker.addEventListener('change', (e) => {
  if (e.target.value) {
    selectedDate = new Date(e.target.value + 'T00:00:00');
  } else {
    selectedDate = new Date();
    datePicker.value = getDateKey(selectedDate);
  }
  renderAll();
});

prevWeekBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() - 7);
  datePicker.value = getDateKey(selectedDate);
  renderAll();
});

nextWeekBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() + 7);
  datePicker.value = getDateKey(selectedDate);
  renderAll();
});

todayBtn.addEventListener('click', () => {
  selectedDate = new Date();
  datePicker.value = getDateKey(selectedDate);
  renderAll();
});

/* ---------------------------------------------------------
   Install (PWA) handling
   --------------------------------------------------------- */
let deferredPrompt = null;

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

if (isStandalone) {
  installBtn.hidden = true;
} else if (isIOS) {
  /* iOS Safari has no install prompt API — show manual instructions */
  installBtn.hidden = false;
  installBtn.textContent = 'Install';
  installBtn.addEventListener('click', () => {
    alert(
      'To install on iPhone / iPad:\n\n' +
      '1. Tap the Share button (□↑) in Safari\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add"'
    );
  });
} else {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } catch (err) {
      /* ignore */
    }
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.hidden = true;
    deferredPrompt = null;
  });
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
datePicker.value = getDateKey(selectedDate);
selectedDate = new Date(datePicker.value + 'T00:00:00');
renderAll();