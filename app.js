const STORAGE_KEY = "life-game-assistant-save";
const LEGACY_STORAGE_KEYS = [
  "life-game-assistant-save-v3",
  "life-game-assistant-save-v2",
  "life-game-assistant-save-v1",
];

const themePresets = {
  coast: {
    id: "coast",
    name: "海边露营",
    badge: "COAST CAMP",
    title: "潮汐营地终端",
    subtitle: "像在海风里整理今天，把任务做成会发亮的贝壳和宝石。",
    companionRole: "潮汐搭档",
    taskLabel: "营地任务池",
    rewardLabel: "营地奖励池",
    todayLine: "今天从营地里抽几件想推进的事。",
    companionHint: "这是你的私人海边通讯频道。",
    storyPrefix: "海岸异闻",
    praise: [
      "海风刚吹过终端，你就已经把这一项做完了。",
      "营地记录更新成功。你今天的节奏很漂亮。",
      "又一颗宝石入袋，像刚从浪花里捞上来的。",
    ],
    stories: [
      "潮线后退时露出一只小漂流瓶。你可以去泡杯茶，当作新的海边补给。",
      "营地篝火重新亮了一下，像是在承认你今天确实推进了很多。",
    ],
    vars: {
      "--bg-top": "#0e3a43",
      "--bg-bottom": "#f2e4c8",
      "--panel": "rgba(250, 246, 238, 0.9)",
      "--panel-strong": "rgba(248, 252, 252, 0.96)",
      "--ink": "#14323a",
      "--muted": "#4b666d",
      "--accent": "#0f8c8c",
      "--accent-strong": "#085f71",
      "--theme-glow-a": "rgba(130, 220, 222, 0.45)",
      "--theme-glow-b": "rgba(255, 244, 212, 0.6)",
    },
  },
  digital: {
    id: "digital",
    name: "数码驯兽师",
    badge: "DIGI LINK",
    title: "数码搭档指挥台",
    subtitle: "把日常拆成短回合推进，让搭档看着你一项项升级。",
    companionRole: "搭档兽",
    taskLabel: "指令任务池",
    rewardLabel: "补给奖励池",
    todayLine: "今日指令就抽这些，其他先不管。",
    companionHint: "这是你的搭档专线，默认由你发号施令。",
    storyPrefix: "数据异常",
    praise: [
      "指令执行成功。你的推进效率已经像成熟期形态了。",
      "数据流稳定，这一轮完成得非常干净。",
      "图鉴信号增强中。搭档对你的表现很满意。",
    ],
    stories: [
      "终端边缘闪过一道像素噪点，似乎有新区域被悄悄解锁。",
      "搭档从旧数据包里找出一个徽章，你今天可以多给自己一段休息时间。",
    ],
    vars: {
      "--bg-top": "#111827",
      "--bg-bottom": "#dbeafe",
      "--panel": "rgba(239, 246, 255, 0.9)",
      "--panel-strong": "rgba(250, 252, 255, 0.97)",
      "--ink": "#18233b",
      "--muted": "#4f5f83",
      "--accent": "#2563eb",
      "--accent-strong": "#1d4ed8",
      "--theme-glow-a": "rgba(59, 130, 246, 0.38)",
      "--theme-glow-b": "rgba(125, 211, 252, 0.35)",
    },
  },
  splat: {
    id: "splat",
    name: "涂地打工",
    badge: "INK SHIFT",
    title: "涂地班次面板",
    subtitle: "把今天变成一轮轻快的上工，做完就领奖，不和自己死磕。",
    companionRole: "小鱿搭子",
    taskLabel: "班次任务池",
    rewardLabel: "休班奖励池",
    todayLine: "今天先接这几单，剩下的以后再说。",
    companionHint: "这是涂地频道，保持手感比硬肝更重要。",
    storyPrefix: "班次彩蛋",
    praise: [
      "这一下收工得很漂亮，地面像刚被你刷干净。",
      "班次结算更新。你今天的手感明显在线。",
      "又推进一项，像连着赢了好几个小回合。",
    ],
    stories: [
      "打工站里刷出一个隐藏贴纸。你今天可以额外看点喜欢的东西。",
      "小鱿搭子在角落找到一枚亮片，像是在说今天收工得不错。",
    ],
    vars: {
      "--bg-top": "#17212b",
      "--bg-bottom": "#fef3c7",
      "--panel": "rgba(255, 248, 237, 0.9)",
      "--panel-strong": "rgba(255, 252, 247, 0.97)",
      "--ink": "#29232f",
      "--muted": "#6b5870",
      "--accent": "#ea580c",
      "--accent-strong": "#c2410c",
      "--theme-glow-a": "rgba(251, 146, 60, 0.35)",
      "--theme-glow-b": "rgba(163, 230, 53, 0.3)",
    },
  },
};

const defaultTaskPool = [
  createPoolItem("吃早餐、冲茶", "repeatable"),
  createPoolItem("看 AI 讲论文", "repeatable"),
  createPoolItem("煮饭、做家务", "repeatable"),
  createPoolItem("回学校办理杂事", "one-time"),
  createPoolItem("写 100 字同人脑洞", "repeatable"),
  createPoolItem("设计一颗宝石的名字和特性", "repeatable"),
  createPoolItem("用 AI 查一个地理地质模型", "one-time"),
];

const defaultRewardPool = [
  createPoolItem("画一张小速写（5-10 分钟）", "repeatable", "quest"),
  createPoolItem("看一集动画", "repeatable", "instant"),
  createPoolItem("打 30 分钟游戏", "repeatable", "instant"),
  createPoolItem("躺在床上听一张专辑", "repeatable", "instant"),
  createPoolItem("刷 15 分钟手机", "repeatable", "instant"),
  createPoolItem("发呆看窗外", "repeatable", "instant"),
  createPoolItem("喝一杯茶或咖啡，什么都不想", "repeatable", "instant"),
  createPoolItem("买一个小零食", "one-time", "instant"),
];

const defaultState = {
  themeId: "coast",
  customThemeName: "",
  companion: "潮汐搭档",
  taskPool: defaultTaskPool,
  rewardPool: defaultRewardPool,
  gems: [
    "海蓝露珠石",
    "暮光砂金石",
    "露营地萤石",
    "数码核碎片",
    "涂地墨水晶",
    "牧场星陨铁",
    "同人灵感玉",
    "懒人云母",
    "潮痕欧泊",
    "终端贝壳晶",
  ],
  todayTasks: [],
  gemLedger: [],
  dailyLog: {},
  journalDrafts: {},
  unlockedQuests: [],
  unlockedStickers: [],
  unlockedSpecialLines: [],
  completedCount: 0,
  featherCount: 0,
  skipCardCount: 0,
  shellCount: 0,
  currentDateLabel: "",
  currentTimeLabel: "",
  dayPhase: "",
  hatchery: {
    name: "潮汐蛋",
    stage: "egg",
    growth: 0,
    mood: "状态稳定，正在等待一点点照顾。",
    lastGem: "",
    decorStickerId: "",
  },
  taskTargetCount: 4,
  companionLine: "准备就绪。今天也会有新的宝石入账。",
  storyLine: "尚未触发剧情事件。",
};

const stickerCatalog = [
  { id: "camp-mug", name: "营地马克杯贴纸", description: "像是从海边补给箱上撕下来的一小块纪念。" },
  { id: "shell-map", name: "贝壳地图贴纸", description: "上面画着一条通往放松地点的小路线。" },
  { id: "pixel-wave", name: "像素浪花贴纸", description: "有点数码海浪的味道，适合贴在终端边角。" },
  { id: "orange-ink", name: "橘墨班次贴纸", description: "看起来像一次轻快收工后的结算奖励。" },
  { id: "gem-ledger", name: "图鉴标记贴纸", description: "提醒你今天也让图鉴多亮了一格。" },
];

const specialLineCatalog = [
  "我看到你不是在硬撑，而是在认真照顾自己的节奏，这很厉害。",
  "今天的推进感像潮水刚好拍到脚边，舒服而且扎实。",
  "你每次认真完成一点点，整个终端都会变得更像你的地盘。",
  "这不是肝出来的战绩，是你很会替自己安排反馈。",
];

let state = loadState();
let pendingTask = null;
let rewardMode = "random";
let syncTimeoutId = null;
let isHydratingRemote = true;

const root = document.documentElement;
const themeSelect = document.querySelector("#themeSelect");
const themeInput = document.querySelector("#themeInput");
const themeBadge = document.querySelector("#themeBadge");
const heroTitle = document.querySelector("#heroTitle");
const heroCopy = document.querySelector("#heroCopy");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const dayPhase = document.querySelector("#dayPhase");
const companionInput = document.querySelector("#companionInput");
const taskCountInput = document.querySelector("#taskCountInput");
const drawTasksButton = document.querySelector("#drawTasksButton");
const redrawTasksButton = document.querySelector("#redrawTasksButton");
const taskTypeSelect = document.querySelector("#taskTypeSelect");
const rewardTypeSelect = document.querySelector("#rewardTypeSelect");
const rewardModeSelect = document.querySelector("#rewardModeSelect");
const todayTasks = document.querySelector("#todayTasks");
const taskPool = document.querySelector("#taskPool");
const rewardPool = document.querySelector("#rewardPool");
const gemLedger = document.querySelector("#gemLedger");
const gemCodex = document.querySelector("#gemCodex");
const questBoard = document.querySelector("#questBoard");
const completedCount = document.querySelector("#completedCount");
const featherCount = document.querySelector("#featherCount");
const skipCardCount = document.querySelector("#skipCardCount");
const uniqueGemCount = document.querySelector("#uniqueGemCount");
const collectedGemCount = document.querySelector("#collectedGemCount");
const missingGemCount = document.querySelector("#missingGemCount");
const questCount = document.querySelector("#questCount");
const shellCount = document.querySelector("#shellCount");
const stickerCount = document.querySelector("#stickerCount");
const specialLineCount = document.querySelector("#specialLineCount");
const petName = document.querySelector("#petName");
const petStage = document.querySelector("#petStage");
const petMood = document.querySelector("#petMood");
const hatcheryVisual = document.querySelector("#hatcheryVisual");
const growthFill = document.querySelector("#growthFill");
const growthText = document.querySelector("#growthText");
const petDecor = document.querySelector("#petDecor");
const companionLine = document.querySelector("#companionLine");
const storyLine = document.querySelector("#storyLine");
const taskForm = document.querySelector("#taskForm");
const rewardForm = document.querySelector("#rewardForm");
const taskInput = document.querySelector("#taskInput");
const rewardInput = document.querySelector("#rewardInput");
const todayHint = document.querySelector("#todayHint");
const taskPoolTitle = document.querySelector("#taskPoolTitle");
const rewardPoolTitle = document.querySelector("#rewardPoolTitle");
const companionHint = document.querySelector("#companionHint");
const generateJournalButton = document.querySelector("#generateJournalButton");
const appendTaskButton = document.querySelector("#appendTaskButton");
const appendRewardButton = document.querySelector("#appendRewardButton");
const journalEditor = document.querySelector("#journalEditor");
const rewardDialog = document.querySelector("#rewardDialog");
const rewardDialogTitle = document.querySelector("#rewardDialogTitle");
const rewardChoices = document.querySelector("#rewardChoices");
const rerollRewardButton = document.querySelector("#rerollRewardButton");
const showAllRewardsButton = document.querySelector("#showAllRewardsButton");
const addInstantRewardButton = document.querySelector("#addInstantRewardButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const taskCardTemplate = document.querySelector("#taskCardTemplate");
const questCardTemplate = document.querySelector("#questCardTemplate");
const redeemStickerButton = document.querySelector("#redeemStickerButton");
const redeemLineButton = document.querySelector("#redeemLineButton");
const feedShellButton = document.querySelector("#feedShellButton");
const infuseGemButton = document.querySelector("#infuseGemButton");
const decorateStickerButton = document.querySelector("#decorateStickerButton");
const stickerBoard = document.querySelector("#stickerBoard");

themeSelect.value = state.themeId;
themeInput.value = state.customThemeName || getTheme().name;
companionInput.value = state.companion;
taskCountInput.value = state.taskTargetCount;

themeSelect.addEventListener("change", (event) => {
  state.themeId = event.target.value;
  state.customThemeName = "";
  themeInput.value = getTheme().name;
  state.companionLine = `主题已切换到“${getTheme().name}”。界面和频道语气一起更新了。`;
  saveAndRender();
});

themeInput.addEventListener("input", (event) => {
  state.customThemeName = event.target.value.trim();
  saveAndRender();
});

companionInput.addEventListener("input", (event) => {
  state.companion = event.target.value.trim() || getTheme().companionRole;
  saveAndRender();
});

taskCountInput.addEventListener("input", (event) => {
  const parsed = Number.parseInt(event.target.value, 10);
  state.taskTargetCount = Number.isFinite(parsed) ? clampTaskCount(parsed) : 4;
  taskCountInput.value = state.taskTargetCount;
  saveAndRender();
});

drawTasksButton.addEventListener("click", () => {
  state.todayTasks = generateTodayTasks(state.taskTargetCount);
  saveAndRender();
});

redrawTasksButton.addEventListener("click", () => {
  const targetCount = state.todayTasks.length || state.taskTargetCount;
  state.todayTasks = generateTodayTasks(targetCount);
  saveAndRender();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  state.taskPool.unshift(createPoolItem(value, taskTypeSelect.value));
  taskInput.value = "";
  saveAndRender();
});

rewardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = rewardInput.value.trim();
  if (!value) return;
  state.rewardPool.unshift(createPoolItem(value, rewardTypeSelect.value, rewardModeSelect.value));
  rewardInput.value = "";
  saveAndRender();
});

rewardDialog.addEventListener("close", () => {
  if (rewardDialog.returnValue === "cancel") {
    pendingTask = null;
    rewardMode = "random";
  }
});

redeemStickerButton.addEventListener("click", redeemSticker);
redeemLineButton.addEventListener("click", redeemSpecialLine);
feedShellButton.addEventListener("click", feedHatcheryWithShell);
infuseGemButton.addEventListener("click", infuseHatcheryWithGem);
decorateStickerButton.addEventListener("click", decorateHatcheryWithSticker);
generateJournalButton.addEventListener("click", regenerateJournalDraft);
appendTaskButton.addEventListener("click", () => appendManualJournalItem("task"));
appendRewardButton.addEventListener("click", () => appendManualJournalItem("reward"));
rerollRewardButton.addEventListener("click", () => rerenderRewardChoices("random"));
showAllRewardsButton.addEventListener("click", () => rerenderRewardChoices("all"));
addInstantRewardButton.addEventListener("click", addInstantRewardAndClaim);
journalEditor.addEventListener("input", (event) => {
  state.journalDrafts[getTodayKey()] = event.target.value;
  persistLocalState();
  scheduleRemoteSync();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

refreshClock();
window.setInterval(refreshClock, 30_000);

initializeApp();

function render() {
  applyTheme();
  refreshClock();

  completedCount.textContent = state.completedCount;
  featherCount.textContent = state.featherCount;
  skipCardCount.textContent = state.skipCardCount;
  const collectedGemNames = new Set(state.gemLedger.map((entry) => entry.gem));
  uniqueGemCount.textContent = collectedGemNames.size;
  collectedGemCount.textContent = collectedGemNames.size;
  missingGemCount.textContent = Math.max(state.gems.length - collectedGemNames.size, 0);
  questCount.textContent = state.unlockedQuests.length;
  shellCount.textContent = state.shellCount;
  stickerCount.textContent = state.unlockedStickers.length;
  specialLineCount.textContent = state.unlockedSpecialLines.length;
  currentDate.textContent = state.currentDateLabel;
  currentTime.textContent = state.currentTimeLabel;
  dayPhase.textContent = state.dayPhase;
  companionLine.textContent = `${state.companion}：${state.companionLine}`;
  storyLine.textContent = state.storyLine;
  todayHint.textContent = state.todayTasks.length
    ? `${getTheme().todayLine} 当前必选数：${countPinnedTasks()}，本轮目标数：${state.taskTargetCount}。`
    : `点击“开始今天”随机抽取 ${state.taskTargetCount} 个任务。`;
  redrawTasksButton.disabled = state.taskPool.filter((task) => !task.archived).length < 1;
  redeemStickerButton.disabled = state.shellCount < 3 || getAvailableStickers().length < 1;
  redeemLineButton.disabled = state.shellCount < 5 || getAvailableSpecialLines().length < 1;
  feedShellButton.disabled = state.shellCount < 1;
  infuseGemButton.disabled = new Set(state.gemLedger.map((entry) => entry.gem)).size < 1;
  decorateStickerButton.disabled = state.unlockedStickers.length < 1;
  journalEditor.value = state.journalDrafts[getTodayKey()] || buildJournalDraft();

  renderTodayTasks();
  renderPool(taskPool, state.taskPool, "task");
  renderPool(rewardPool, state.rewardPool, "reward");
  renderQuestBoard();
  renderStickerBoard();
  renderHatchery();
  renderGemCodex();
  renderGemLedger();
}

function switchTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tabName);
  });
}

function applyTheme() {
  const theme = getTheme();
  const displayThemeName = state.customThemeName || theme.name;
  Object.entries(theme.vars).forEach(([key, value]) => root.style.setProperty(key, value));
  themeBadge.textContent = `${theme.badge} · ${displayThemeName}`;
  heroTitle.textContent = state.customThemeName ? `${state.customThemeName}终端` : theme.title;
  heroCopy.textContent = `${theme.subtitle} 当前主题名：${displayThemeName}。`;
  taskPoolTitle.textContent = `${displayThemeName} · ${theme.taskLabel}`;
  rewardPoolTitle.textContent = `${displayThemeName} · ${theme.rewardLabel}`;
  companionHint.textContent = `${theme.companionHint} 当前主题：${displayThemeName}。`;
}

function renderTodayTasks() {
  todayTasks.innerHTML = "";

  if (!state.todayTasks.length) {
    todayTasks.appendChild(makeEmpty("今天还没有抽任务。先点一次“开始今天”。"));
    return;
  }

  state.todayTasks.forEach((task) => {
    const node = taskCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".task-icon").textContent = task.type === "one-time" ? "◆" : "◌";
    node.querySelector(".task-name").textContent = task.name;
    node.querySelector(".task-tag").textContent = task.type === "one-time" ? "一次性任务" : "可重复任务";
    node.querySelector(".task-meta").textContent =
      state.featherCount > 0 ? "可走普通奖励流程，或消耗 1 根飞羽直接指定奖励。" : "完成后将随机抽取 3 个奖励。";
    node.querySelector(".complete-button").addEventListener("click", () => openRewardDialog(task, false));
    const featherButton = node.querySelector(".feather-button");
    featherButton.disabled = state.featherCount < 1;
    featherButton.addEventListener("click", () => openRewardDialog(task, true));
    todayTasks.appendChild(node);
  });
}

function renderPool(container, items, mode) {
  container.innerHTML = "";
  if (!items.length) {
    const label = mode === "task" ? "任务池" : "奖励池";
    container.appendChild(makeEmpty(`${label}暂时是空的，可以先新增几项。`));
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "chip";

    const left = document.createElement("div");
    left.className = "chip-main";
    left.innerHTML = `
      <span class="chip-icon">${mode === "task" ? "✦" : "✧"}</span>
      <div>
        <strong>${item.name}</strong>
        <div class="chip-meta">
          <span class="mini-tag ${item.type}">${item.type === "one-time" ? "一次性" : "可重复"}</span>
          ${mode === "reward" ? `<span class="mini-tag ${item.mode === "quest" ? "one-time" : "repeatable"}">${item.mode === "quest" ? "支线事件" : "即时享受"}</span>` : ""}
          ${mode === "task" && item.pinned ? '<span class="mini-tag pinned">📌 必选</span>' : ""}
          ${item.archived ? '<span class="mini-tag archived">已归档</span>' : ""}
        </div>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "chip-actions";

    if (mode === "task") {
      const edit = document.createElement("button");
      edit.className = "ghost";
      edit.textContent = "编辑";
      edit.addEventListener("click", () => editPoolItem(item, "task"));
      actions.appendChild(edit);

      const pin = document.createElement("button");
      pin.className = "ghost";
      pin.textContent = item.pinned ? "取消必选" : "设为必选";
      pin.addEventListener("click", () => {
        item.pinned = !item.pinned;
        saveAndRender();
      });
      actions.appendChild(pin);
    }

    if (item.type === "one-time") {
      const archive = document.createElement("button");
      archive.className = "ghost";
      archive.textContent = item.archived ? "恢复" : "归档";
      archive.addEventListener("click", () => {
        item.archived = !item.archived;
        state.todayTasks = state.todayTasks.filter((task) => task.poolId !== item.id);
        saveAndRender();
      });
      actions.appendChild(archive);
    }

    if (mode === "reward") {
      const edit = document.createElement("button");
      edit.className = "ghost";
      edit.textContent = "编辑";
      edit.addEventListener("click", () => editPoolItem(item, "reward"));
      actions.appendChild(edit);
    }

    const remove = document.createElement("button");
    remove.className = "ghost";
    remove.textContent = "删除";
    remove.addEventListener("click", () => {
      if (mode === "task") {
        state.taskPool = state.taskPool.filter((entry) => entry.id !== item.id);
        state.todayTasks = state.todayTasks.filter((task) => task.poolId !== item.id);
      } else {
        state.rewardPool = state.rewardPool.filter((entry) => entry.id !== item.id);
      }
      saveAndRender();
    });

    actions.appendChild(remove);
    row.append(left, actions);
    container.appendChild(row);
  });
}

function renderQuestBoard() {
  questBoard.innerHTML = "";
  if (!state.unlockedQuests.length) {
    questBoard.appendChild(makeEmpty("还没有已解锁支线。抽到“事件支线”奖励后，它会出现在这里。"));
    return;
  }

  state.unlockedQuests
    .slice()
    .reverse()
    .forEach((quest) => {
      const node = questCardTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector(".quest-name").textContent = quest.name;
      node.querySelector(".quest-tag").textContent = quest.type === "one-time" ? "一次性支线" : "可重复支线";
      node.querySelector(".quest-meta").textContent = `来源任务：${quest.sourceTask}。完成后获得 1 枚贝壳，不再触发宝石和奖励抽取。`;
      node.querySelector(".complete-quest-button").addEventListener("click", () => completeQuest(quest.id));
      node.querySelector(".discard-quest-button").addEventListener("click", () => {
        state.unlockedQuests = state.unlockedQuests.filter((entry) => entry.id !== quest.id);
        saveAndRender();
      });
      questBoard.appendChild(node);
    });
}

function renderStickerBoard() {
  stickerBoard.innerHTML = "";
  if (!state.unlockedStickers.length && !state.unlockedSpecialLines.length) {
    stickerBoard.appendChild(makeEmpty("贝壳工坊还没有兑换记录。攒一点贝壳后可以换贴纸或解锁特殊夸夸。"));
    return;
  }

  state.unlockedStickers.forEach((sticker) => {
    const row = document.createElement("div");
    row.className = "chip sticker-chip";
    row.innerHTML = `
      <div class="chip-main">
        <span class="chip-icon">🪪</span>
        <div>
          <strong>${sticker.name}</strong>
          <div class="chip-text">${sticker.description}</div>
        </div>
      </div>
    `;
    stickerBoard.appendChild(row);
  });

  state.unlockedSpecialLines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = "chip";
    row.innerHTML = `
      <div class="chip-main">
        <span class="chip-icon">💬</span>
        <div>
          <strong>特殊台词 ${index + 1}</strong>
          <div class="chip-text">${line}</div>
        </div>
      </div>
    `;
    stickerBoard.appendChild(row);
  });
}

function renderHatchery() {
  const hatchery = state.hatchery;
  petName.textContent = hatchery.name;
  petStage.textContent = stageLabel(hatchery.stage);
  petMood.textContent = hatchery.mood;
  hatcheryVisual.textContent = stageEmoji(hatchery.stage);
  growthFill.style.width = `${Math.min((hatchery.growth / 6) * 100, 100)}%`;
  growthText.textContent = `成长度 ${Math.min(hatchery.growth, 6)} / 6`;

  petDecor.innerHTML = "";
  if (hatchery.decorStickerId) {
    const sticker = state.unlockedStickers.find((item) => item.id === hatchery.decorStickerId);
    if (sticker) {
      const decor = document.createElement("div");
      decor.className = "chip sticker-chip";
      decor.innerHTML = `
        <div class="chip-main">
          <span class="chip-icon">🪪</span>
          <div>
            <strong>当前贴纸装饰</strong>
            <div class="chip-text">${sticker.name} · ${sticker.description}</div>
          </div>
        </div>
      `;
      petDecor.appendChild(decor);
    }
  }

  if (hatchery.lastGem) {
    const aura = document.createElement("div");
    aura.className = "chip";
    aura.innerHTML = `
      <div class="chip-main">
        <span class="chip-icon">💎</span>
        <div>
          <strong>最近注入的宝石光</strong>
          <div class="chip-text">${hatchery.lastGem}</div>
        </div>
      </div>
    `;
    petDecor.appendChild(aura);
  }

  if (!petDecor.children.length) {
    petDecor.appendChild(makeEmpty("孵化槽目前很素净。喂一点贝壳、注入宝石光，或者给它贴张贴纸吧。"));
  }
}

function renderGemCodex() {
  gemCodex.innerHTML = "";
  const collectedGemNames = new Set(state.gemLedger.map((entry) => entry.gem));

  state.gems.forEach((gem) => {
    const card = document.createElement("article");
    const isCollected = collectedGemNames.has(gem);
    card.className = `gem-card ${isCollected ? "collected" : "missing"}`;
    card.style.setProperty("--gem-color", colorFromString(gem));
    card.innerHTML = `
      <div class="gem-card-head">
        <strong><span class="gem-shine">${isCollected ? "💎" : "◻️"}</span> ${gem}</strong>
        <span class="mini-tag ${isCollected ? "pinned" : "archived"}">${isCollected ? "已收集" : "未收集"}</span>
      </div>
      <p>${isCollected ? "已经进入你的图鉴，可以继续等重复掉落或冲飞羽。" : "还没有遇见这颗宝石，之后完成任务时有机会掉落。"}<\/p>
    `;
    gemCodex.appendChild(card);
  });
}

function renderGemLedger() {
  gemLedger.innerHTML = "";
  if (!state.gemLedger.length) {
    gemLedger.appendChild(makeEmpty("还没有宝石掉落。完成第一个任务后，这里会开始发光。"));
    return;
  }

  state.gemLedger
    .slice()
    .reverse()
    .forEach((entry) => {
      const row = document.createElement("article");
      row.className = "ledger-entry";
      row.innerHTML = `
        <div><span class="label">时间</span><span>${entry.time}</span></div>
        <div><span class="label">宝石</span><span>${entry.gem}</span></div>
        <div><span class="label">来源任务</span><span>${entry.task}</span></div>
        <div><span class="label">领取奖励</span><span>${entry.reward}</span></div>
      `;
      gemLedger.appendChild(row);
    });
}

function openRewardDialog(task, useFeather) {
  const availableRewards = state.rewardPool.filter((reward) => !reward.archived);
  if (!availableRewards.length) {
    state.companionLine = "奖励池现在空了。先加几项你真的会想马上领取的东西吧。";
    saveAndRender();
    return;
  }

  pendingTask = task;
  rewardMode = useFeather ? "feather" : "random";
  rewardDialogTitle.textContent = useFeather
    ? `为“${task.name}”直接指定奖励`
    : `“${task.name}”完成，来抽 3 选 1`;
  rerenderRewardChoices(useFeather ? "all" : "random");

  rewardDialog.showModal();
}

function rerenderRewardChoices(mode = "random") {
  const availableRewards = state.rewardPool.filter((reward) => !reward.archived);
  const choices = mode === "all" || rewardMode === "feather" ? availableRewards.slice() : drawRandom(availableRewards, 3);
  rewardChoices.innerHTML = "";

  choices.forEach((reward) => {
    const option = document.createElement("div");
    option.className = "reward-option";

    const textWrap = document.createElement("div");
    textWrap.innerHTML = `
      <strong>${reward.name}</strong>
      <p>${describeReward(reward, rewardMode === "feather")}<\/p>
    `;

    const pick = document.createElement("button");
    pick.className = "primary";
    pick.type = "button";
    pick.textContent = "领取";
    pick.addEventListener("click", () => completeTaskWithReward(reward));

    option.append(textWrap, pick);
    rewardChoices.appendChild(option);
  });
}

function completeTaskWithReward(reward) {
  if (!pendingTask) return;

  if (rewardMode === "feather" && state.featherCount > 0) {
    state.featherCount -= 1;
  }

  const previousUniqueGemCount = new Set(state.gemLedger.map((item) => item.gem)).size;
  const gem = randomItem(state.gems);
  state.gemLedger.push({
    time: formatNow(),
    gem,
    task: pendingTask.name,
    reward: reward.name,
  });
  recordDailyLog("task", pendingTask.name);
  recordDailyLog("reward", reward.name);

  state.completedCount += 1;

  const taskEntry = state.taskPool.find((entry) => entry.id === pendingTask.poolId);
  if (taskEntry && taskEntry.type === "one-time") {
    taskEntry.archived = true;
  }

  const rewardEntry = state.rewardPool.find((entry) => entry.id === reward.id);
  if (rewardEntry && rewardEntry.type === "one-time") {
    rewardEntry.archived = true;
  }

  if (reward.mode === "quest") {
    recordDailyLog("quest", reward.name);
    state.unlockedQuests.push({
      id: createId(),
      rewardId: reward.id,
      name: reward.name,
      type: reward.type,
      sourceTask: pendingTask.name,
      unlockedAt: formatNow(),
    });
  }

  const uniqueGemCountNow = new Set(state.gemLedger.map((item) => item.gem)).size;
  const previousCollectionTier = Math.floor(previousUniqueGemCount / 5);
  const currentCollectionTier = Math.floor(uniqueGemCountNow / 5);
  if (currentCollectionTier > previousCollectionTier) {
    state.featherCount += currentCollectionTier - previousCollectionTier;
  }

  if (state.completedCount % 5 === 0) {
    state.skipCardCount += 1;
  }

  if (state.completedCount % 10 === 0) {
    state.storyLine = `${getTheme().storyPrefix}：${randomItem(getTheme().stories)}`;
  }

  state.companionLine =
    reward.mode === "quest"
      ? `支线“${reward.name}”已经解锁。你可以稍后去做，它完成后只会给一点轻反馈。`
      : randomItem(getPraisePool());
  state.todayTasks = state.todayTasks.filter((task) => task.id !== pendingTask.id);

  pendingTask = null;
  rewardMode = "random";
  rewardDialog.close();
  saveAndRender();
}

function loadState() {
  try {
    const raw = getStoredSave();
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    const merged = {
      ...structuredClone(defaultState),
      ...parsed,
      taskPool: normalizePool(parsed.taskPool, defaultTaskPool),
      rewardPool: normalizePool(parsed.rewardPool, defaultRewardPool),
    };
    return normalizeState(merged);
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizePool(items, fallback) {
  if (!Array.isArray(items) || !items.length) {
    return structuredClone(fallback);
  }
  return items.map((item) => {
    if (typeof item === "string") {
      return createPoolItem(item, "repeatable");
    }
    return {
      id: item.id || createId(),
      name: item.name || "未命名",
      type: item.type === "one-time" ? "one-time" : "repeatable",
      mode: item.mode === "quest" ? "quest" : "instant",
      archived: Boolean(item.archived),
      pinned: Boolean(item.pinned),
    };
  });
}

function saveAndRender() {
  persistLocalState();
  render();
  scheduleRemoteSync();
}

function getTheme() {
  return themePresets[state.themeId] || themePresets.coast;
}

function drawRandom(items, count) {
  const pool = [...items];
  const picked = [];
  while (pool.length && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeEmpty(text) {
  const node = document.createElement("div");
  node.className = "empty-state";
  node.textContent = text;
  return node;
}

function formatNow() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createPoolItem(name, type = "repeatable", mode = "instant") {
  return {
    id: createId(),
    name,
    type,
    mode,
    archived: false,
    pinned: false,
  };
}

function completeQuest(questId) {
  const quest = state.unlockedQuests.find((entry) => entry.id === questId);
  if (!quest) return;

  state.shellCount += 1;
  state.unlockedQuests = state.unlockedQuests.filter((entry) => entry.id !== questId);
  state.companionLine = `支线“${quest.name}”已完成。你捡到 1 枚贝壳 🐚，这是一种轻量纪念，不会再套一层任务。`;
  saveAndRender();
}

function describeReward(reward, useFeather) {
  if (reward.mode === "quest") {
    return reward.type === "one-time"
      ? "一次性事件支线，领取后会进入待完成面板，做完拿 1 枚贝壳。"
      : "事件支线，领取后会进入待完成面板，做完拿 1 枚贝壳。";
  }
  if (reward.type === "one-time") {
    return "一次性即时奖励，领取后会自动归档。";
  }
  if (useFeather) {
    return "已消耗飞羽，可直接指定这项即时奖励。";
  }
  return "从本次抽取结果中选择这项，即领即享受。";
}

function editPoolItem(item, mode) {
  const previousName = item.name;
  const nextName = window.prompt(`编辑${mode === "task" ? "任务" : "奖励"}名称`, item.name);
  if (nextName === null) return;
  const trimmed = nextName.trim();
  if (!trimmed) return;

  item.name = trimmed;

  if (mode === "task") {
    state.todayTasks = state.todayTasks.map((task) =>
      task.poolId === item.id ? { ...task, name: trimmed } : task
    );
    state.unlockedQuests = state.unlockedQuests.map((quest) =>
      quest.sourceTask === previousName ? { ...quest, sourceTask: trimmed } : quest
    );
  }

  if (mode === "reward") {
    state.unlockedQuests = state.unlockedQuests.map((quest) =>
      quest.rewardId === item.id ? { ...quest, name: trimmed } : quest
    );
  }

  saveAndRender();
}

function redeemSticker() {
  const availableStickers = getAvailableStickers();
  if (state.shellCount < 3 || !availableStickers.length) return;

  const sticker = randomItem(availableStickers);
  state.shellCount -= 3;
  state.unlockedStickers.push(sticker);
  state.companionLine = `你用 3 枚贝壳换到了“${sticker.name}” 🪪。这是很轻的小纪念，但看起来挺像回事。`;
  saveAndRender();
}

function redeemSpecialLine() {
  const availableLines = getAvailableSpecialLines();
  if (state.shellCount < 5 || !availableLines.length) return;

  const line = randomItem(availableLines);
  state.shellCount -= 5;
  state.unlockedSpecialLines.push(line);
  state.companionLine = line;
  saveAndRender();
}

function getAvailableStickers() {
  const owned = new Set(state.unlockedStickers.map((sticker) => sticker.id));
  return stickerCatalog.filter((sticker) => !owned.has(sticker.id));
}

function getAvailableSpecialLines() {
  const owned = new Set(state.unlockedSpecialLines);
  return specialLineCatalog.filter((line) => !owned.has(line));
}

function getPraisePool() {
  return [...getTheme().praise, ...state.unlockedSpecialLines];
}

function getTodayKey() {
  return new Intl.DateTimeFormat("sv-SE").format(new Date());
}

function getTodayLog() {
  const key = getTodayKey();
  if (!state.dailyLog[key]) {
    state.dailyLog[key] = { tasks: [], rewards: [], quests: [] };
  }
  return state.dailyLog[key];
}

function recordDailyLog(type, value) {
  if (!value) return;
  const log = getTodayLog();
  const trimmed = value.trim();
  if (!trimmed) return;
  if (type === "task" && !log.tasks.includes(trimmed)) log.tasks.push(trimmed);
  if (type === "reward" && !log.rewards.includes(trimmed)) log.rewards.push(trimmed);
  if (type === "quest" && !log.quests.includes(trimmed)) log.quests.push(trimmed);
}

function regenerateJournalDraft() {
  const key = getTodayKey();
  state.journalDrafts[key] = mergeJournalNotes(state.journalDrafts[key] || "", buildJournalDraft());
  journalEditor.value = state.journalDrafts[key];
  saveAndRender();
}

function buildJournalDraft() {
  const log = getTodayLog();
  const dateLabel = new Intl.DateTimeFormat("en-CA").format(new Date()).replace(/-/g, "/");
  const themeName = state.customThemeName || getTheme().name;
  const lines = [`${dateLabel} ${themeName}`, ""];
  lines.push(`今日完成了 ${log.tasks.length} 项任务：${joinOrPlaceholder(log.tasks)}`);
  lines.push(`领取了奖励：${joinOrPlaceholder(log.rewards)}`);
  if (log.quests.length) {
    lines.push(`解锁支线：${joinOrPlaceholder(log.quests)}`);
  }
  lines.push("今日备注：");
  return lines.join("\n");
}

function joinOrPlaceholder(items) {
  return items.length ? items.join("、") : "（今天还没有记录）";
}

function appendManualJournalItem(type) {
  const label = type === "task" ? "补充完成的事情" : "补充领取的奖励";
  const value = window.prompt(label, "");
  if (!value) return;
  recordDailyLog(type, value);
  const key = getTodayKey();
  state.journalDrafts[key] = mergeJournalNotes(state.journalDrafts[key] || "", buildJournalDraft());
  journalEditor.value = state.journalDrafts[key];
  saveAndRender();
}

function mergeJournalNotes(previousDraft, nextBaseDraft) {
  const marker = "今日备注：";
  if (!previousDraft.includes(marker)) return nextBaseDraft;
  const previousNote = previousDraft.slice(previousDraft.indexOf(marker) + marker.length);
  return `${nextBaseDraft}${previousNote}`;
}

function addInstantRewardAndClaim() {
  if (!pendingTask) return;
  const value = window.prompt("临时新增一个奖励并立即领取", "");
  if (!value || !value.trim()) return;
  const reward = createPoolItem(value.trim(), "repeatable", "instant");
  state.rewardPool.unshift(reward);
  completeTaskWithReward(reward);
}

function refreshClock() {
  const now = new Date();
  const hour = now.getHours();
  state.currentDateLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);
  state.currentTimeLabel = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  state.dayPhase = getDayPhase(hour);
}

function getDayPhase(hour) {
  if (hour < 6) return "🌙 深夜回合";
  if (hour < 11) return "🌤️ 上午回合";
  if (hour < 14) return "☀️ 午间回合";
  if (hour < 18) return "🌊 下午回合";
  if (hour < 22) return "🌆 傍晚回合";
  return "🛌 夜间回合";
}

function getStoredSave() {
  const direct = localStorage.getItem(STORAGE_KEY);
  if (direct) return direct;
  for (const key of LEGACY_STORAGE_KEYS) {
    const legacy = localStorage.getItem(key);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      return legacy;
    }
  }
  return null;
}

function normalizeState(stateLike) {
  const hatchery = {
    ...structuredClone(defaultState.hatchery),
    ...(stateLike.hatchery || {}),
  };
  hatchery.stage = stageFromGrowth(hatchery.growth);
  return {
    ...stateLike,
    taskTargetCount: clampTaskCount(Number.parseInt(stateLike.taskTargetCount, 10) || defaultState.taskTargetCount),
    dailyLog: typeof stateLike.dailyLog === "object" && stateLike.dailyLog ? stateLike.dailyLog : {},
    journalDrafts: typeof stateLike.journalDrafts === "object" && stateLike.journalDrafts ? stateLike.journalDrafts : {},
    unlockedQuests: Array.isArray(stateLike.unlockedQuests) ? stateLike.unlockedQuests : [],
    unlockedStickers: Array.isArray(stateLike.unlockedStickers) ? stateLike.unlockedStickers : [],
    unlockedSpecialLines: Array.isArray(stateLike.unlockedSpecialLines) ? stateLike.unlockedSpecialLines : [],
    hatchery,
  };
}

async function initializeApp() {
  await hydrateFromRemote();
  render();
}

async function hydrateFromRemote() {
  try {
    const remote = await window.lifeGameSync.fetchRemoteSave();
    if (remote?.save_data) {
      state = normalizeState({
        ...structuredClone(defaultState),
        ...remote.save_data,
        taskPool: normalizePool(remote.save_data.taskPool, defaultTaskPool),
        rewardPool: normalizePool(remote.save_data.rewardPool, defaultRewardPool),
      });
      persistLocalState();
    }
  } catch (error) {
    console.error("Failed to hydrate from Supabase:", error);
  } finally {
    isHydratingRemote = false;
  }
}

function persistLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scheduleRemoteSync() {
  if (isHydratingRemote) return;
  window.clearTimeout(syncTimeoutId);
  syncTimeoutId = window.setTimeout(async () => {
    try {
      await window.lifeGameSync.upsertRemoteSave(state);
    } catch (error) {
      console.error("Failed to sync save to Supabase:", error);
    }
  }, 400);
}

function feedHatcheryWithShell() {
  if (state.shellCount < 1) return;
  state.shellCount -= 1;
  state.hatchery.growth += 2;
  updateHatcheryStage();
  state.hatchery.mood = "它把贝壳当作亮闪闪的小口粮，明显精神了一点。";
  state.companionLine = `${state.hatchery.name}吃掉了一枚贝壳，孵化槽里发出很轻的咔哒声。`;
  saveAndRender();
}

function infuseHatcheryWithGem() {
  const collectedGemNames = [...new Set(state.gemLedger.map((entry) => entry.gem))];
  if (!collectedGemNames.length) return;
  const gem = randomItem(collectedGemNames);
  state.hatchery.lastGem = gem;
  state.hatchery.growth += 1;
  updateHatcheryStage();
  state.hatchery.mood = `它吸收了“${gem}”的光，外壳看起来更亮了一层。`;
  state.companionLine = `孵化槽接入了一束 ${gem} 的光，里面的小东西像是翻了个身。`;
  saveAndRender();
}

function decorateHatcheryWithSticker() {
  if (!state.unlockedStickers.length) return;
  const sticker = randomItem(state.unlockedStickers);
  state.hatchery.decorStickerId = sticker.id;
  state.hatchery.mood = `它现在很喜欢这张“${sticker.name}”，整个槽体都显得更有归属感。`;
  state.companionLine = `你把“${sticker.name}”贴到了孵化槽上。它虽然没说话，但明显挺满意。`;
  saveAndRender();
}

function updateHatcheryStage() {
  state.hatchery.stage = stageFromGrowth(state.hatchery.growth);
  if (state.hatchery.stage === "partner") {
    state.hatchery.name = state.hatchery.name === "潮汐蛋" ? "潮汐团子" : state.hatchery.name;
  }
}

function stageLabel(stage) {
  if (stage === "partner") return "陪伴期";
  if (stage === "hatchling") return "孵化期";
  return "蛋期";
}

function stageEmoji(stage) {
  if (stage === "partner") return "🫧";
  if (stage === "hatchling") return "🐣";
  return "🥚";
}

function stageFromGrowth(growth) {
  if (growth >= 6) return "partner";
  if (growth >= 3) return "hatchling";
  return "egg";
}

function colorFromString(text) {
  let hash = 0;
  for (const char of text) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360} 75% 78%)`;
}

function clampTaskCount(count) {
  return Math.min(20, Math.max(1, count));
}

function generateTodayTasks(targetCount = 4) {
  const availableTasks = state.taskPool.filter((task) => !task.archived);
  const pinnedTasks = availableTasks.filter((task) => task.pinned);
  const randomPool = availableTasks.filter((task) => !task.pinned);
  const cappedPinnedTasks = pinnedTasks.slice(0, targetCount);
  const randomTasks = drawRandom(randomPool, Math.max(targetCount - cappedPinnedTasks.length, 0));
  return [...cappedPinnedTasks, ...randomTasks].map((task) => ({
    id: createId(),
    poolId: task.id,
    name: task.name,
    type: task.type,
    icon: task.type === "one-time" ? "◆" : "◌",
  }));
}

function countPinnedTasks() {
  return state.taskPool.filter((task) => task.pinned && !task.archived).length;
}
