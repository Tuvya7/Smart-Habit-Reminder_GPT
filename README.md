# Smart Habit Reminder System (Prototype)

A simple browser-based reminder prototype built with **HTML, CSS, and JavaScript**.

## Proposed Website Structure

1. **Home Section**
   - Explains the problem of forgetting daily tasks.
   - Introduces the Smart Habit Reminder System.
   - Includes clear call-to-action buttons.

2. **Add Reminder Section**
   - Form inputs for:
     - Task name
     - Reminder date & time
     - Optional category

3. **Dashboard Section**
   - Active reminders list.
   - Completed reminders list.
   - Actions: mark done, delete, clear completed.

4. **Reminder Notification Modal**
   - Popup appears when a task is due.
   - Allows user to mark as done or snooze for 10 minutes.

## Improvements Added to the Original Idea

- Kept the prototype as a **single-page app** for easier student demo and faster testing.
- Added **categories** as pills for quick visual scanning.
- Added **snooze support** (10-minute delay) to handle real-life interruptions.
- Added **safe rendering** for task names using HTML escaping.
- Added **localStorage persistence** so reminders remain after refresh.
- Added **clear completed** action for easy cleanup.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`

## Run Locally

Because this uses plain static files, you can simply open `index.html` in a browser.

Or run a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
