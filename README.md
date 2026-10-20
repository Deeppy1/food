# Fuel — Food Tracker

A lightweight, responsive food diary built with plain HTML, CSS and JavaScript.

## Features
- Searchable starter food list with editable portion and nutrition values
- Log breakfast, lunch, dinner and snacks
- Per-day diary with date picker and totals
- Protein, carbohydrate and fat breakdown
- Local browser storage (no account or server required)
- CSV export
- Progressive Web App manifest and offline cache

## Run it locally
Some browser features (especially service workers/offline mode) require localhost or HTTPS.

### Option 1: Python
1. Install Python 3 if it isn't already installed.
2. Open a terminal in this folder.
3. Run `python -m http.server 8000`
4. Visit `http://localhost:8000` in your browser.

### Option 2: VS Code
Install the Live Server extension, open this folder, and choose **Open with Live Server**.

## Put it online
Upload these files to a static HTTPS host such as GitHub Pages, Netlify, or Cloudflare Pages. No build step is required. Once hosted, open the HTTPS URL on your phone and use the browser's **Add to Home Screen** option.

## Important notes
- Entries are stored in localStorage in that browser on that device. They do not sync across devices and may be lost if browser data is cleared.
- This starter database contains approximate examples, not a verified nutrition database. Check product packaging and portion sizes.
- This is a prototype, not a medical or dietetic tool.
