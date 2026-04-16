const STORAGE_KEY = "life-game-assistant-save";

const viewMode = document.querySelector("#viewMode");
const weekPicker = document.querySelector("#weekPicker");
const monthPicker = document.querySelector("#monthPicker");
const weekPickerWrap = document.querySelector("#weekPickerWrap");
const monthPickerWrap = document.querySelector("#monthPickerWrap");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const todayButton = document.querySelector("#todayButton");
const rangeTitle = document.querySelector("#rangeTitle");
const rangeHint = document.querySelector("#rangeHint");
const grid = document.querySelector("#grid");
const selectedTitle = document.querySelector("#selectedTitle");
const selectedMeta = document.querySelector("#selectedMeta");
const selectedEditor = document.querySelector("#selectedEditor");
const dayItemTemplate = document.querySelector("#dayItemTemplate");

let state = loadState();
let currentMode = "week";
let currentDate = new Date();
let selectedKey = formatKey(new Date());
let syncTimeoutId = null;
let isHydratingRemote = true;

initializePickers();
bindEvents();
initializeDiary();

function bindEvents() {
  viewMode.addEventListener("change", (event) => {
    currentMode = event.target.value;
    syncPickerVisibility();
    render();
  });

  weekPicker.addEventListener("change", () => {
    currentDate = weekStringToDate(weekPicker.value);
    render();
  });

  monthPicker.addEventListener("change", () => {
    currentDate = new Date(`${monthPicker.value}-01T12:00:00`);
    render();
  });

  prevButton.addEventListener("click", () => {
    currentDate = shiftDate(currentDate, currentMode === "week" ? -7 : -30);
    render();
  });

  nextButton.addEventListener("click", () => {
    currentDate = shiftDate(currentDate, currentMode === "week" ? 7 : 30);
    render();
  });

  todayButton.addEventListener("click", () => {
    currentDate = new Date();
    selectedKey = formatKey(new Date());
    render();
  });

  selectedEditor.addEventListener("input", (event) => {
    const next = loadState();
    next.journalDrafts = next.journalDrafts || {};
    next.journalDrafts[selectedKey] = event.target.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    scheduleRemoteSync(next);
  });
}

async function initializeDiary() {
  await hydrateFromRemote();
  render();
}

function render() {
  state = loadState();
  syncPickers();
  syncPickerVisibility();

  const days = currentMode === "week" ? getWeekDays(currentDate) : getMonthDays(currentDate);
  rangeTitle.textContent = currentMode === "week" ? formatWeekTitle(days) : formatMonthTitle(currentDate);
  rangeHint.textContent = currentMode === "week" ? "左边保留一周 7 格视图，右边查看当天全文。" : "左边保留整月格子视图，右边查看当天全文。";
  grid.innerHTML = "";
  grid.className = `day-grid ${currentMode}`;

  const realDayKeys = days.filter((day) => !day.empty).map((day) => formatKey(day.date));
  if (!realDayKeys.includes(selectedKey)) {
    selectedKey = realDayKeys[0] || formatKey(new Date());
  }

  days.forEach((day) => {
    const key = formatKey(day.date);
    const draft = state.journalDrafts?.[key] || "";
    const item = dayItemTemplate.content.firstElementChild.cloneNode(true);
    item.querySelector(".day-label").textContent = day.label;
    item.querySelector(".day-tag").textContent = day.tag;
    item.querySelector(".day-preview").textContent = makePreview(draft, day.empty);
    item.classList.toggle("active", key === selectedKey && !day.empty);
    if (day.empty) {
      item.classList.add("empty");
    } else {
      item.addEventListener("click", () => {
        selectedKey = key;
        renderSelectedEditor();
        render();
      });
    }
    grid.appendChild(item);
  });

  renderSelectedEditor();
}

function renderSelectedEditor() {
  const draft = state.journalDrafts?.[selectedKey] || "";
  selectedTitle.textContent = selectedKey;
  selectedMeta.textContent = draft ? "这里是这一天的完整正文，可直接修改。" : "这一天还没有正文，你可以直接写。";
  selectedEditor.value = draft;
}

function initializePickers() {
  currentMode = "week";
  viewMode.value = currentMode;
  syncPickers();
}

function syncPickers() {
  weekPicker.value = dateToWeekString(currentDate);
  monthPicker.value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
}

function syncPickerVisibility() {
  weekPickerWrap.hidden = currentMode !== "week";
  monthPickerWrap.hidden = currentMode !== "month";
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

async function hydrateFromRemote() {
  try {
    const remote = await window.lifeGameSync.fetchRemoteSave();
    if (remote?.save_data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote.save_data));
      state = remote.save_data;
    }
  } catch (error) {
    console.error("Failed to hydrate diary from Supabase:", error);
  } finally {
    isHydratingRemote = false;
  }
}

function scheduleRemoteSync(nextState) {
  if (isHydratingRemote) return;
  window.clearTimeout(syncTimeoutId);
  syncTimeoutId = window.setTimeout(async () => {
    try {
      await window.lifeGameSync.upsertRemoteSave(nextState);
    } catch (error) {
      console.error("Failed to sync diary to Supabase:", error);
    }
  }, 400);
}

function getWeekDays(date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const day = shiftDate(start, index);
    return {
      date: day,
      label: new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(day),
      tag: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"][index],
    };
  });
}

function getMonthDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  const firstWeekday = (first.getDay() + 6) % 7;
  const start = shiftDate(first, -firstWeekday);
  return Array.from({ length: 42 }, (_, index) => {
    const day = shiftDate(start, index);
    const inMonth = day.getMonth() === date.getMonth();
    return {
      date: day,
      label: new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(day),
      tag: inMonth ? "当日" : "跨月",
      empty: !inMonth,
    };
  });
}

function startOfWeek(date) {
  const clone = new Date(date);
  const weekday = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - weekday);
  clone.setHours(12, 0, 0, 0);
  return clone;
}

function shiftDate(date, diffDays) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + diffDays);
  clone.setHours(12, 0, 0, 0);
  return clone;
}

function dateToWeekString(date) {
  const monday = startOfWeek(date);
  const year = monday.getFullYear();
  const week = getWeekNumber(monday);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function weekStringToDate(value) {
  const [yearText, weekText] = value.split("-W");
  const year = Number.parseInt(yearText, 10);
  const week = Number.parseInt(weekText, 10);
  const jan4 = new Date(year, 0, 4, 12);
  const monday = startOfWeek(jan4);
  return shiftDate(monday, (week - 1) * 7);
}

function getWeekNumber(date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
}

function formatKey(date) {
  return new Intl.DateTimeFormat("sv-SE").format(date);
}

function formatWeekTitle(days) {
  const start = days[0].date;
  const end = days[6].date;
  return `${formatKey(start)} - ${formatKey(end)}`;
}

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(date);
}

function makePreview(text, empty) {
  if (empty) return "这个格子不在当前月份。";
  if (!text.trim()) return "这一天还没有日记。";
  return text.split("\n").slice(0, 4).join("\n");
}
