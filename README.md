# My Habits – Weekly Habit Tracker (PWA)

> **Live Demo:** [https://ayheza4-max.github.io/HabitTrackerapp/](https://ayheza4-max.github.io/HabitTrackerapp/)

A lightweight, installable, and offline-capable habit tracker built with vanilla HTML, CSS, and JavaScript. 

**Author:** Ayheza Queen S. Morada  
**Section:** BSINTE 2A
**Course / Subject:** PLATFORM TECHNOLOGIES
**Date:** November 2026

---

## 📖 About the Project

**My Habits** is a mobile-friendly Progressive Web App (PWA) designed to help users build and maintain daily habits using a visual weekly grid. Each habit is displayed as a row, and the days of the selected week are columns. With one tap, users can mark a habit as done, instantly updating their weekly progress, daily streaks, and overall completion percentage.

The app features a **Light/Dark mode toggle** that saves the user's preference in local storage and respects the device's system settings.

Because this is a PWA, it can be **installed directly to a phone's home screen** (bypassing app stores) and used **completely offline**. All data is saved locally on the device using `localStorage` — no accounts, no servers, and no tracking.

---

## ✨ Key Features

- **Weekly Habit Grid:** 7 columns (Sunday–Saturday) to track the week at a glance.
- **One-Tap Check-in:** Tap the circle to toggle a day as done (✓) or missed (✕).
- **Habit Management:** Add new habits with a name and optional description, or delete them with the ✕ button.
- **Week Navigation:** Move between weeks using previous/next buttons, a date picker, or the "This Week" shortcut.
- **Light & Dark Mode:** Built-in theme toggle (🌙/☀️) using CSS variables, remembering user preference.
- **Progress Tracking:** Weekly progress bar, per-habit weekly counts (`3/7 this week`), and current streaks (🔥).
- **Installable (PWA):** Includes a manifest and an "Install" button prompt for Android/iOS.
- **Offline Support:** A service worker caches the app shell for offline access.
- **Persistent Storage:** Data survives page reloads via `localStorage`.

---

## 🛠️ Technical Implementation (Source Code Guide)

Here is how the core features are implemented in the codebase:

1. **Data & State Management (`script.js`)**
   - The app state (`habits` array) is initialized from `localStorage`. 
   - Helper functions like `getDateKey()` and `getWeekDates()` format standard JavaScript `Date` objects into `YYYY-MM-DD` strings for easy storage and retrieval.
   - The `renderAll()` function handles re-rendering the DOM based on the current state (e.g., when a habit is checked off or a new week is selected).

2. **Light / Dark Mode (`style.css` & `script.js`)**
   - Theming is handled using **CSS Variables** defined in the `:root` selector for light mode and `[data-theme="dark"]` for dark mode.
   - JavaScript toggles the `data-theme` attribute on the `<html>` element and saves the user's choice to `localStorage`.

3. **Progressive Web App (PWA)**
   - **`site.webmanifest`**: Defines the app's name, icons, and display mode (`standalone`) so it opens like a native app without the browser address bar.
   - **`sw.js` (Service Worker)**: Intercepts network requests. It uses a "cache-first" strategy for static assets (CSS, JS, icons) and a "network-first" fallback for the HTML, allowing the app to function fully offline.
   - **Install Prompt**: Listens for the browser's `beforeinstallprompt` event to show a custom "Install" button inside the app UI.

---

## 🚀 How to Run the Source Code Locally

Because this app uses a Service Worker for offline capabilities, it **must** be run through a local web server (it will not work properly if you just double-click `index.html`).

1. Clone the repository:
   ```bash
   git clone https://github.com/ayheza4-max/HabitTrackerapp.git
   cd HabitTrackerapp
