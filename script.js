const STORAGE_KEY = "smartHabitReminders";
const form = document.getElementById("reminder-form");
const activeList = document.getElementById("activeList");
const completedList = document.getElementById("completedList");
const clearCompletedBtn = document.getElementById("clearCompleted");

const modal = document.getElementById("notificationModal");
const notificationText = document.getElementById("notificationText");
const doneBtn = document.getElementById("doneBtn");
const snoozeBtn = document.getElementById("snoozeBtn");

let reminders = loadReminders();
let activeNotificationId = null;

function loadReminders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveReminders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function createReminder({ taskName, reminderTime, category }) {
  return {
    id: crypto.randomUUID(),
    taskName: taskName.trim(),
    reminderTime,
    category: category || "General",
    completed: false,
    notified: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

function render() {
  const active = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  activeList.innerHTML = active.length
    ? active.map((item) => activeItemTemplate(item)).join("")
    : '<li class="list-item">No active reminders yet.</li>';

  completedList.innerHTML = completed.length
    ? completed.map((item) => completedItemTemplate(item)).join("")
    : '<li class="list-item">No completed tasks yet.</li>';
}

function activeItemTemplate(item) {
  return `
    <li class="list-item">
      <div class="item-top">
        <strong>${escapeHtml(item.taskName)}</strong>
        <span class="pill">${escapeHtml(item.category)}</span>
      </div>
      <p class="item-meta">Reminder: ${formatDate(item.reminderTime)}</p>
      <div class="item-actions">
        <button class="btn btn--success" data-action="complete" data-id="${item.id}">Mark Done</button>
        <button class="btn btn--danger" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    </li>
  `;
}

function completedItemTemplate(item) {
  return `
    <li class="list-item">
      <div class="item-top">
        <strong>${escapeHtml(item.taskName)}</strong>
        <span class="pill">${escapeHtml(item.category)}</span>
      </div>
      <p class="item-meta">Completed: ${formatDate(item.completedAt)}</p>
    </li>
  `;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function completeReminder(id) {
  reminders = reminders.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      completed: true,
      completedAt: new Date().toISOString(),
    };
  });

  saveReminders();
  render();
}

function deleteReminder(id) {
  reminders = reminders.filter((item) => item.id !== id);
  saveReminders();
  render();
}

function showNotification(reminder) {
  activeNotificationId = reminder.id;
  notificationText.textContent = `${reminder.taskName} (${reminder.category}) is due now.`;
  modal.classList.remove("hidden");
}

function hideNotification() {
  modal.classList.add("hidden");
  activeNotificationId = null;
}

function snoozeReminder(id) {
  reminders = reminders.map((item) => {
    if (item.id !== id) return item;

    const newTime = new Date(item.reminderTime);
    newTime.setMinutes(newTime.getMinutes() + 10);

    return {
      ...item,
      reminderTime: newTime.toISOString(),
      notified: false,
    };
  });

  saveReminders();
  render();
}

function checkDueReminders() {
  if (activeNotificationId) return;

  const now = Date.now();
  const due = reminders.find(
    (item) => !item.completed && !item.notified && new Date(item.reminderTime).getTime() <= now
  );

  if (!due) return;

  reminders = reminders.map((item) =>
    item.id === due.id
      ? {
          ...item,
          notified: true,
        }
      : item
  );

  saveReminders();
  showNotification(due);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const reminderTimeValue = document.getElementById("reminderTime").value;
  const category = document.getElementById("category").value;

  const reminderTime = new Date(reminderTimeValue);
  if (Number.isNaN(reminderTime.getTime())) return;

  reminders.push(
    createReminder({
      taskName,
      reminderTime: reminderTime.toISOString(),
      category,
    })
  );

  saveReminders();
  render();
  form.reset();
});

activeList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { id, action } = button.dataset;
  if (!id || !action) return;

  if (action === "complete") completeReminder(id);
  if (action === "delete") deleteReminder(id);
});

clearCompletedBtn.addEventListener("click", () => {
  reminders = reminders.filter((item) => !item.completed);
  saveReminders();
  render();
});

doneBtn.addEventListener("click", () => {
  if (activeNotificationId) completeReminder(activeNotificationId);
  hideNotification();
});

snoozeBtn.addEventListener("click", () => {
  if (activeNotificationId) snoozeReminder(activeNotificationId);
  hideNotification();
});

render();
setInterval(checkDueReminders, 1000);
