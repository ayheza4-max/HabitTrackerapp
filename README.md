# My Habits – Weekly Habit Tracker

A lightweight, installable, offline-capable habit tracker built with plain HTML, CSS, and JavaScript.

**Author:** Your Full Name  
**Section:** Your Section  
**Course / Subject:** Your Subject  
**Date:** November 2026

---

## 📖 Description

**My Habits** is a mobile-friendly web application that helps you build and track daily habits on a
weekly grid. Each habit is a row and each day of the selected week is a column — tap a circle to mark
a habit as done, and your progress, weekly totals, and streaks update instantly.

All data is stored **locally on your device** using `localStorage`. There is no account, no server,
and no tracking — your data never leaves your phone.

The app is a **Progressive Web App (PWA)**, which means it can be installed to your home screen and
used completely offline, just like a native mobile app.

---

## ✨ Features

- **Weekly habit grid** — 7 columns (Sunday–Saturday) per habit
- **One-tap check-in** — tap the circle to toggle done ✓ / not done ✕
- **Add & delete habits** — with a name and optional description
- **Week navigation** — previous / next week buttons, date picker, and a "This Week" shortcut
- **Today highlight** — the current day's column is highlighted in the header
- **Weekly progress bar** — shows total check-ins out of the possible total for the week
- **Per-habit stats** — weekly count (e.g. `3/7 this week`) and current streak (🔥)
- **Persistent storage** — habits survive page reloads and app restarts via `localStorage`
- **Clear All** — wipe all habits with a confirmation prompt
- **Installable (PWA)** — "Install" button / Add to Home Screen on Android and iOS
- **Offline support** — service worker caches the app shell for offline use
- **Responsive & accessible** — works on phones, tablets, and desktops; keyboard and screen-reader friendly

---

## 🚀 How to Install & Run

### Option A — Run it locally

1. Download or clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/my-habits.git