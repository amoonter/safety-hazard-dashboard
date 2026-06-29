const DEFAULT_DATA_SOURCE = "./data/2026-hazards-cleaned.json";
const DEFAULT_LEVEL1 = "航线维修模块";
const CHART_GRID_LEFT = 168;
const CHART_LABEL_WIDTH = 168;

const state = {
  rawRecords: [],
  fileName: "",
  filters: {
    hazardName: "",
    station: "",
    hazardType: "",
    hazardSource: "",
    coreRisk: "",
    riskControl: "",
    consequence: "",
    dateStart: "",
    dateEnd: ""
  },
  selectedLevel1: DEFAULT_LEVEL1,
  selectedLevel2: "",
  selectedLevel3: "",
  charts: {}
};

const elements = {
  fileInput: document.getElementById("fileInput"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  resetDrillBtn: document.getElementById("resetDrillBtn"),
  clearLevel2Btn: document.getElementById("clearLevel2Btn"),
  clearLevel3Btn: document.getElementById("clearLevel3Btn"),
  level1Select: document.getElementById("level1Select"),
  level2Select: document.getElementById("level2Select"),
  level3Select: document.getElementById("level3Select"),
  hazardNameInput: document.getElementById("hazardNameInput"),
  stationSelect: document.getElementById("stationSelect"),
  hazardTypeSelect: document.getElementById("hazardTypeSelect"),
  hazardSourceSelect: document.getElementById("hazardSourceSelect"),
  coreRiskSelect: document.getElementById("coreRiskSelect"),
  riskControlSelect: document.getElementById("riskControlSelect"),
  consequenceSelect: document.getElementById("consequenceSelect"),
  dateStartInput: document.getElementById("dateStartInput"),
  dateEndInput: document.getElementById("dateEndInput"),
  statusBand: document.getElementById("statusBand"),
  statusMessage: document.getElementById("statusMessage"),
  fileNameLabel: document.getElementById("fileNameLabel"),
  metricTotal: document.getElementById("metricTotal"),
  metricL1Kinds: document.getElementById("metricL1Kinds"),
  metricL2Kinds: document.getElementById("metricL2Kinds"),
  metricL3Kinds: document.getElementById("metricL3Kinds"),
  trendAlertSummary: document.getElementById("trendAlertSummary"),
  trendAlertList: document.getElementById("trendAlertList"),
  stationProfileSummary: document.getElementById("stationProfileSummary"),
  stationProfileList: document.getElementById("stationProfileList"),
  duplicateSummary: document.getElementById("duplicateSummary"),
  duplicateList: document.getElementById("duplicateList"),
  selectedLevel1Label: document.getElementById("selectedLevel1Label"),
  selectedLevel2Label: document.getElementById("selectedLevel2Label"),
  selectedLevel3Label: document.getElementById("selectedLevel3Label"),
  selectedCoreRiskLabel: document.getElementById("selectedCoreRiskLabel"),
  selectedRiskControlLabel: document.getElementById("selectedRiskControlLabel"),
  selectedConsequenceLabel: document.getElementById("selectedConsequenceLabel"),
  level2Subtitle: document.getElementById("level2Subtitle"),
  level3Subtitle: document.getElementById("level3Subtitle"),
  consequenceSubtitle: document.getElementById("consequenceSubtitle"),
  coreRiskSubtitle: document.getElementById("coreRiskSubtitle"),
  riskControlSubtitle: document.getElementById("riskControlSubtitle"),
  detailCountText: document.getElementById("detailCountText"),
  detailTableBody: document.getElementById("detailTableBody")
};

function init() {
  initCharts();
  bindEvents();
  renderEmptyDashboard();
  window.addEventListener("resize", () => {
    Object.values(state.charts).forEach((chart) => chart?.resize());
  });
  autoLoadData();
}

function initCharts() {
  state.charts.level1 = echarts.init(document.getElementById("level1Chart"));
  state.charts.level2 = echarts.init(document.getElementById("level2Chart"));
  state.charts.level3 = echarts.init(document.getElementById("level3Chart"));
  state.charts.consequence = echarts.init(document.getElementById("consequenceChart"));
  state.charts.coreRisk = echarts.init(document.getElementById("coreRiskChart"));
  state.charts.riskControl = echarts.init(document.getElementById("riskControlChart"));

  state.charts.level1.on("click", (params) => {
    state.selectedLevel1 = params.name;
    state.selectedLevel2 = "";
    state.selectedLevel3 = "";
    renderAll();
  });

  state.charts.level2.on("click", (params) => {
    state.selectedLevel2 = state.selectedLevel2 === params.name ? "" : params.name;
    state.selectedLevel3 = "";
    renderAll();
  });

  state.charts.level3.on("click", (params) => {
    state.selectedLevel3 = state.selectedLevel3 === params.name ? "" : params.name;
    renderAll();
  });

  state.charts.consequence.on("click", (params) => {
    state.filters.consequence = state.filters.consequence === params.name ? "" : params.name;
    renderAll();
  });

  state.charts.coreRisk.on("click", (params) => {
    state.filters.coreRisk = state.filters.coreRisk === params.name ? "" : params.name;
    renderAll();
  });

  state.charts.riskControl.on("click", (params) => {
    state.filters.riskControl = state.filters.riskControl === params.name ? "" : params.name;
    renderAll();
  });
}

function bindEvents() {
  elements.fileInput.addEventListener("change", handleFileUpload);
  elements.resetFiltersBtn.addEventListener("click", resetFilters);
  elements.resetDrillBtn.addEventListener("click", resetDrill);
  elements.clearLevel2Btn.addEventListener("click", () => {
    state.selectedLevel2 = "";
    state.selectedLevel3 = "";
    renderAll();
  });
  elements.clearLevel3Btn.addEventListener("click", () => {
    state.selectedLevel3 = "";
    renderAll();
  });
  elements.level1Select.addEventListener("change", (event) => {
    state.selectedLevel1 = event.target.value;
    state.selectedLevel2 = "";
    state.selectedLevel3 = "";
    renderAll();
  });
  elements.level2Select.addEventListener("change", (event) => {
    state.selectedLevel2 = event.target.value;
    state.selectedLevel3 = "";
    renderAll();
  });
  elements.level3Select.addEventListener("change", (event) => {
    state.selectedLevel3 = event.target.value;
    renderAll();
  });
  elements.hazardNameInput.addEventListener("input", (event) => {
    state.filters.hazardName = event.target.value.trim();
    state.selectedLevel2 = "";
    state.selectedLevel3 = "";
    renderAll();
  });
  elements.stationSelect.addEventListener("change", (event) => {
    state.filters.station = event.target.value;
    renderAll();
  });
  elements.hazardTypeSelect.addEventListener("change", (event) => {
    state.filters.hazardType = event.target.value;
    renderAll();
  });
  elements.hazardSourceSelect.addEventListener("change", (event) => {
    state.filters.hazardSource = event.target.value;
    renderAll();
  });
  elements.coreRiskSelect.addEventListener("change", (event) => {
    state.filters.coreRisk = event.target.value;
    renderAll();
  });
  elements.riskControlSelect.addEventListener("change", (event) => {
    state.filters.riskControl = event.target.value;
    renderAll();
  });
  elements.consequenceSelect.addEventListener("change", (event) => {
    state.filters.consequence = event.target.value;
    renderAll();
  });
  elements.dateStartInput.addEventListener("change", (event) => {
    state.filters.dateStart = event.target.value;
    renderAll();
  });
  elements.dateEndInput.addEventListener("change", (event) => {
    state.filters.dateEnd = event.target.value;
    renderAll();
  });
}

async function handleFileUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    setStatus(`正在读取 ${file.name}...`, file.name, false);
    if (isWorkbookSource(file.name)) {
      const buffer = await file.arrayBuffer();
      loadRecordsFromWorkbookBuffer(buffer, file.name);
    } else {
      const text = await file.text();
      loadRecordsFromText(text, file.name);
    }
  } catch (error) {
    console.error(error);
    setStatus(`文件读取失败：${error.message}`, "未加载文件", false);
    renderEmptyDashboard();
  } finally {
    event.target.value = "";
  }
}

async function autoLoadData() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source");
  const resolvedSource = source && /\.(xlsx|xls|jsonl|json)$/i.test(source) ? source : DEFAULT_DATA_SOURCE;

  try {
    setStatus(`正在读取 ${resolvedSource}...`, resolvedSource, false);
    const response = await fetch(resolvedSource, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`无法读取 ${resolvedSource}`);
    }
    if (isWorkbookSource(resolvedSource)) {
      const buffer = await response.arrayBuffer();
      loadRecordsFromWorkbookBuffer(buffer, resolvedSource);
    } else {
      const text = await response.text();
      loadRecordsFromText(text, resolvedSource);
    }
  } catch (error) {
    console.error(error);
    setStatus(`自动读取失败：${error.message}`, resolvedSource, false);
    renderEmptyDashboard();
  }
}

function loadRecordsFromText(text, fileName) {
  const raw = parseJsonLikeText(text);
  loadRecordsFromRows(raw, fileName);
}

function loadRecordsFromWorkbookBuffer(buffer, fileName) {
  if (typeof XLSX === "undefined") {
    throw new Error("Excel 解析库未加载，请检查网络或 SheetJS 引入。");
  }
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true
  });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("Excel 文件中没有可读取的工作表");
  }
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
    raw: false
  });
  loadRecordsFromRows(rows, fileName);
}

function loadRecordsFromRows(raw, fileName) {
  state.rawRecords = normalizeRecords(raw);
  state.fileName = fileName;
  resetFilters(false);
  resetDrill(false);
  setStatus(`已加载 ${fileName}，共 ${state.rawRecords.length} 条隐患记录。`, fileName, true);
  renderAll();
}

function isWorkbookSource(name) {
  return /\.(xlsx|xls)$/i.test(String(name || ""));
}

function parseJsonLikeText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    throw new Error("文件内容为空");
  }
  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON 文件内容不是数组");
    }
    return parsed;
  }

  return trimmed
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`第 ${index + 1} 行 JSON 解析失败`);
      }
    });
}

function normalizeRecords(rows) {
  return rows.map((row) => {
    const parsedDate = parseDateValue(row["发现时间"]);
    const hazardSourceText = cleanMultilineText(row["关联的危险源"]);
    const coreRiskText = cleanMultilineText(row["核心风险"]);
    const riskControlText = cleanMultilineText(row["关联的风险控制措施"]);
    const consequenceText = cleanMultilineText(row["关联的后果"]);
    return {
      id: cleanText(row["隐患编号"]),
      foundItem: cleanText(row["发现项"]),
      hazardName: cleanText(row["隐患名称"]),
      station: cleanText(row["站点/城市"]),
      discoveredAt: parsedDate ? parsedDate.iso : "",
      discoveredAtLabel: parsedDate ? parsedDate.label : cleanText(row["发现时间"]),
      discoveredMonth: parsedDate ? parsedDate.month : "",
      hazardType: cleanText(row["隐患类型"]),
      level1: cleanText(row["一级过程"]),
      level2: cleanText(row["二级过程"]),
      level3: cleanText(row["三级过程"]),
      hazardSource: hazardSourceText,
      hazardSourceItems: parseListItems(hazardSourceText),
      coreRisk: coreRiskText,
      coreRiskItems: parseListItems(coreRiskText).filter((item) => item !== "未直接匹配公司固化核心风险清单"),
      riskControl: riskControlText,
      riskControlItems: parseListItems(riskControlText),
      consequence: consequenceText,
      consequenceItems: parseListItems(consequenceText),
      causeAnalysis: cleanMultilineText(row["原因分析"]),
      controlMeasures: cleanMultilineText(row["控制措施"])
    };
  }).filter((record) => record.id && record.hazardName);
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }
  const text = String(value).trim();
  const matched = text.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})/);
  if (!matched) {
    const fallback = new Date(text);
    if (Number.isNaN(fallback.getTime())) {
      return null;
    }
    return formatDateInfo(fallback);
  }
  return formatDateInfo(new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3])));
}

function formatDateInfo(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return {
    iso: `${year}-${month}-${day}`,
    label: `${year}-${month}-${day}`,
    month: `${year}-${month}`
  };
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function cleanMultilineText(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function parseListItems(value) {
  return [...new Set(
    String(value ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\r\n?/g, "\n")
      .split(/\n+/)
      .map((item) => item.replace(/^[0-9]+\s*[.、)\-]?\s*/, "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
  )];
}

function resetFilters(shouldRender = true) {
  state.filters = {
    hazardName: "",
    station: "",
    hazardType: "",
    hazardSource: "",
    coreRisk: "",
    riskControl: "",
    consequence: "",
    dateStart: "",
    dateEnd: ""
  };

  elements.hazardNameInput.value = "";
  elements.stationSelect.value = "";
  elements.hazardTypeSelect.value = "";
  elements.hazardSourceSelect.value = "";
  elements.coreRiskSelect.value = "";
  elements.riskControlSelect.value = "";
  elements.consequenceSelect.value = "";
  elements.dateStartInput.value = "";
  elements.dateEndInput.value = "";

  if (shouldRender && state.rawRecords.length) {
    renderAll();
  }
}

function resetDrill(shouldRender = true) {
  state.selectedLevel1 = DEFAULT_LEVEL1;
  state.selectedLevel2 = "";
  state.selectedLevel3 = "";
  if (shouldRender && state.rawRecords.length) {
    renderAll();
  }
}

function renderAll() {
  if (!state.rawRecords.length) {
    renderEmptyDashboard();
    return;
  }

  const recordsWithoutHazardSource = applyBaseFilters(state.rawRecords, { excludeHazardSource: true });
  const recordsWithoutCoreRisk = applyBaseFilters(state.rawRecords, { excludeCoreRisk: true });
  const recordsWithoutRiskControl = applyBaseFilters(state.rawRecords, { excludeRiskControl: true });
  const recordsWithoutConsequence = applyBaseFilters(state.rawRecords, { excludeConsequence: true });
  const baseFilteredRecords = applyBaseFilters(state.rawRecords);

  const level1Counts = buildCounts(baseFilteredRecords, "level1");

  const level1Names = level1Counts.map((item) => item.name);
  if (!level1Names.includes(state.selectedLevel1)) {
    state.selectedLevel1 = level1Names.includes(DEFAULT_LEVEL1) ? DEFAULT_LEVEL1 : (level1Names[0] || "");
  }

  const level1Records = state.selectedLevel1
    ? baseFilteredRecords.filter((record) => record.level1 === state.selectedLevel1)
    : baseFilteredRecords;
  const level2Counts = state.selectedLevel1 ? buildCounts(level1Records, "level2") : [];
  const level2Names = level2Counts.map((item) => item.name);
  if (state.selectedLevel2 && !level2Names.includes(state.selectedLevel2)) {
    state.selectedLevel2 = "";
  }

  const level2Records = state.selectedLevel2
    ? level1Records.filter((record) => record.level2 === state.selectedLevel2)
    : level1Records;
  const level3Counts = state.selectedLevel2 ? buildCounts(level2Records, "level3") : [];
  const level3Names = level3Counts.map((item) => item.name);
  if (state.selectedLevel3 && !level3Names.includes(state.selectedLevel3)) {
    state.selectedLevel3 = "";
  }

  const finalRecords = state.selectedLevel3
    ? level2Records.filter((record) => record.level3 === state.selectedLevel3)
    : level2Records;

  syncDynamicFilters({
    recordsWithoutHazardSource,
    recordsWithoutCoreRisk,
    recordsWithoutRiskControl,
    recordsWithoutConsequence,
    level1Counts,
    baseFilteredRecords
  });

  const levelScopeRecordsWithoutConsequence = filterByCurrentLevels(recordsWithoutConsequence);
  const levelScopeRecordsWithoutCoreRisk = filterByCurrentLevels(recordsWithoutCoreRisk);
  const levelScopeRecordsWithoutRiskControl = filterByCurrentLevels(recordsWithoutRiskControl);

  updateSummary(baseFilteredRecords);
  renderTrendAlerts(state.rawRecords);
  renderStationProfiles(state.rawRecords);
  renderDuplicateProblems(state.rawRecords);
  updateSelectionStrip();
  renderLevel1Chart(level1Counts);
  renderLevel2Chart(level2Counts);
  renderLevel3Chart(level3Counts);
  renderConsequenceChart(buildMultiCounts(levelScopeRecordsWithoutConsequence, "consequenceItems"));
  renderCoreRiskChart(buildMultiCounts(levelScopeRecordsWithoutCoreRisk, "coreRiskItems"));
  renderRiskControlChart(buildMultiCounts(levelScopeRecordsWithoutRiskControl, "riskControlItems"));
  renderDetailTable(finalRecords);
}

function filterByCurrentLevels(records) {
  let scoped = state.selectedLevel1 ? records.filter((record) => record.level1 === state.selectedLevel1) : records;
  scoped = state.selectedLevel2 ? scoped.filter((record) => record.level2 === state.selectedLevel2) : scoped;
  scoped = state.selectedLevel3 ? scoped.filter((record) => record.level3 === state.selectedLevel3) : scoped;
  return scoped;
}

function applyBaseFilters(records, options = {}) {
  const {
    excludeHazardSource = false,
    excludeCoreRisk = false,
    excludeRiskControl = false,
    excludeConsequence = false
  } = options;

  return records.filter((record) => {
    if (state.filters.hazardName && !record.hazardName.toLowerCase().includes(state.filters.hazardName.toLowerCase())) {
      return false;
    }
    if (state.filters.station && record.station !== state.filters.station) {
      return false;
    }
    if (state.filters.hazardType && record.hazardType !== state.filters.hazardType) {
      return false;
    }
    if (!excludeHazardSource && state.filters.hazardSource && !record.hazardSourceItems.includes(state.filters.hazardSource)) {
      return false;
    }
    if (!excludeCoreRisk && state.filters.coreRisk && !record.coreRiskItems.includes(state.filters.coreRisk)) {
      return false;
    }
    if (!excludeRiskControl && state.filters.riskControl && !record.riskControlItems.includes(state.filters.riskControl)) {
      return false;
    }
    if (!excludeConsequence && state.filters.consequence && !record.consequenceItems.includes(state.filters.consequence)) {
      return false;
    }
    if (state.filters.dateStart && (!record.discoveredAt || record.discoveredAt < state.filters.dateStart)) {
      return false;
    }
    if (state.filters.dateEnd && (!record.discoveredAt || record.discoveredAt > state.filters.dateEnd)) {
      return false;
    }
    return true;
  });
}

function syncDynamicFilters({
  recordsWithoutHazardSource,
  recordsWithoutCoreRisk,
  recordsWithoutRiskControl,
  recordsWithoutConsequence,
  level1Counts,
  baseFilteredRecords
}) {
  const level2OptionRecords = state.selectedLevel1
    ? baseFilteredRecords.filter((record) => record.level1 === state.selectedLevel1)
    : [];
  const level2OptionCounts = buildCounts(level2OptionRecords, "level2");
  const level3OptionRecords = state.selectedLevel2
    ? level2OptionRecords.filter((record) => record.level2 === state.selectedLevel2)
    : [];
  const level3OptionCounts = buildCounts(level3OptionRecords, "level3");

  populateSelect(elements.stationSelect, extractDistinctValues(state.rawRecords, "station"), "全部站点", state.filters.station);
  populateSelect(elements.hazardTypeSelect, extractDistinctValues(state.rawRecords, "hazardType"), "全部类型", state.filters.hazardType);
  populateSelect(elements.hazardSourceSelect, extractDistinctArrayValues(recordsWithoutHazardSource, "hazardSourceItems"), "全部危险源", state.filters.hazardSource);
  populateSelect(elements.coreRiskSelect, extractDistinctArrayValues(recordsWithoutCoreRisk, "coreRiskItems"), "全部核心风险", state.filters.coreRisk);
  populateSelect(elements.riskControlSelect, extractDistinctArrayValues(recordsWithoutRiskControl, "riskControlItems"), "全部风险控制措施", state.filters.riskControl);
  populateSelect(elements.consequenceSelect, extractDistinctArrayValues(recordsWithoutConsequence, "consequenceItems"), "全部后果", state.filters.consequence);
  populateSelect(elements.level1Select, level1Counts.map((item) => item.name), "未选择", state.selectedLevel1);
  populateSelect(elements.level2Select, level2OptionCounts.map((item) => item.name), "全部二级过程", state.selectedLevel2);
  populateSelect(elements.level3Select, level3OptionCounts.map((item) => item.name), "全部三级过程", state.selectedLevel3);
}

function populateSelect(selectElement, values, placeholder, currentValue) {
  const normalizedValues = values.filter(Boolean);
  selectElement.innerHTML = [`<option value="">${placeholder}</option>`]
    .concat(normalizedValues.map((value) => {
      const selected = value === currentValue ? " selected" : "";
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(value)}</option>`;
    }))
    .join("");
  selectElement.value = normalizedValues.includes(currentValue) ? currentValue : "";
}

function extractDistinctValues(records, key) {
  return [...new Set(records.map((record) => record[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function extractDistinctArrayValues(records, key) {
  return [...new Set(records.flatMap((record) => Array.isArray(record[key]) ? record[key] : []).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function buildCounts(records, key) {
  const map = new Map();
  records.forEach((record) => {
    const value = record[key];
    if (!value) {
      return;
    }
    map.set(value, (map.get(value) || 0) + 1);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value - a.value) || a.name.localeCompare(b.name, "zh-CN"));
}

function buildMultiCounts(records, key) {
  const map = new Map();
  records.forEach((record) => {
    (record[key] || []).forEach((value) => {
      if (!value) {
        return;
      }
      map.set(value, (map.get(value) || 0) + 1);
    });
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value - a.value) || a.name.localeCompare(b.name, "zh-CN"));
}

function updateSummary(records) {
  elements.metricTotal.textContent = String(records.length);
  elements.metricL1Kinds.textContent = String(new Set(records.map((record) => record.level1).filter(Boolean)).size);
  elements.metricL2Kinds.textContent = String(new Set(records.map((record) => record.level2).filter(Boolean)).size);
  elements.metricL3Kinds.textContent = String(new Set(records.map((record) => record.level3).filter(Boolean)).size);
}

function renderTrendAlerts(records) {
  if (!records.length) {
    elements.trendAlertSummary.textContent = "当前没有可用于趋势监控的数据。";
    elements.trendAlertList.innerHTML = renderNeutralAlert("暂无趋势数据", "当前未加载可用于趋势监控的隐患记录。");
    return;
  }

  const months = getSortedMonths(records);
  if (months.length < 3) {
    elements.trendAlertSummary.textContent = `全量数据共 ${records.length} 条记录，但有效月份不足 3 个。`;
    elements.trendAlertList.innerHTML = renderNeutralAlert("月份跨度不足", "趋势预警至少需要三个有效月份的数据。");
    return;
  }

  const alerts = buildTrendAlerts(records, months);
  if (!alerts.length) {
    elements.trendAlertSummary.textContent = `全量数据共 ${records.length} 条记录，未识别到三个月连续上升项。`;
    elements.trendAlertList.innerHTML = renderNeutralAlert("未触发连续上升预警", "全量数据中未识别到三个月连续上升的过程、后果、风险控制措施或核心风险。");
    return;
  }

  const total = alerts.reduce((sum, group) => sum + group.items.length, 0);
  elements.trendAlertSummary.textContent = `全量数据共 ${records.length} 条记录，识别到 ${total} 条三个月连续上升信号。`;
  elements.trendAlertList.innerHTML = renderTrendAlertColumns(alerts);
}

function buildTrendAlerts(records, months) {
  const dimensions = [
    {
      label: "过程",
      type: "custom",
      cardClass: "high",
      getValues: (record) => {
        const values = [];
        if (record.level2) {
          values.push(`二级过程｜${record.level2}`);
        }
        if (record.level3) {
          values.push(`三级过程｜${record.level3}`);
        }
        return values;
      }
    },
    { label: "关联的后果", key: "consequenceItems", type: "multi", cardClass: "high" },
    { label: "风险控制措施", key: "riskControlItems", type: "multi", cardClass: "medium" },
    { label: "核心风险", key: "coreRiskItems", type: "multi", cardClass: "medium" }
  ];

  return dimensions.map((dimension) => {
    const itemMap = new Map();
    records.forEach((record) => {
      const month = record.discoveredMonth;
      if (!month) {
        return;
      }
      const values = dimension.type === "custom"
        ? dimension.getValues(record)
        : (dimension.type === "multi" ? record[dimension.key] : [record[dimension.key]]);
      values.filter(Boolean).forEach((value) => {
        if (!itemMap.has(value)) {
          itemMap.set(value, new Map(months.map((item) => [item, 0])));
        }
        itemMap.get(value).set(month, itemMap.get(value).get(month) + 1);
      });
    });

    const items = [];
    itemMap.forEach((countsMap, itemName) => {
      const series = months.map((month) => countsMap.get(month) || 0);
      if (series.length >= 3) {
        const last3 = series.slice(-3);
        if (last3[0] < last3[1] && last3[1] < last3[2] && last3[2] >= 2) {
          items.push({
            category: "连续上升",
            title: `${itemName}`,
            description: `${months.slice(-3).map((month, index) => `${month}：${last3[index]}条`).join("，")}。`,
            score: 100 + last3[2]
          });
        }
      }
    });

    return {
      label: dimension.label,
      cardClass: dimension.cardClass,
      items: items.sort((a, b) => b.score - a.score)
    };
  });
}

function getSortedMonths(records) {
  return [...new Set(records.map((record) => record.discoveredMonth).filter(Boolean))].sort();
}

function renderTrendAlertColumns(groups) {
  return groups.map((group) => `
    <section class="alert-column">
      <div class="alert-column-header">
        <strong>${escapeHtml(group.label)}</strong>
      </div>
      <div class="alert-column-list">
        ${group.items.length ? group.items.map((item) => renderTrendAlertCard(item, group.cardClass)).join("") : renderTrendAlertEmpty(group.label)}
      </div>
    </section>
  `).join("");
}

function renderTrendAlertCard(alert, cardClass) {
  return `
    <article class="alert-card ${cardClass}">
      <div class="alert-card-head">
        <span class="alert-badge">${escapeHtml(alert.category)}</span>
        <span class="alert-level">关注</span>
      </div>
      <strong>${escapeHtml(alert.title)}</strong>
      <p>${escapeHtml(alert.description)}</p>
    </article>
  `;
}

function renderTrendAlertEmpty(label) {
  return `
    <article class="alert-card neutral">
      <strong>${escapeHtml(label)}暂无连续上升项</strong>
      <p>全量数据中未识别到该类项目三个月连续上升。</p>
    </article>
  `;
}

function renderNeutralAlert(title, description) {
  return `
    <article class="alert-card neutral">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function renderStationProfiles(records) {
  if (!records.length) {
    elements.stationProfileSummary.textContent = "全量数据中没有站点数据。";
    elements.stationProfileList.innerHTML = renderNeutralInsight("暂无站点画像", "全量数据中没有可用于站点画像的隐患记录。");
    return;
  }
  const profiles = buildCounts(records, "station").filter((item) => item.name).slice(0, 6).map((item) => {
    const stationRecords = records.filter((record) => record.station === item.name);
    return {
      station: item.name,
      count: item.value,
      topLevel2: buildCompositeCounts(stationRecords, ["level1", "level2"]).slice(0, 2),
      topLevel3: buildCompositeCounts(stationRecords, ["level1", "level2", "level3"])[0] || null,
      topRiskControl: buildMultiCounts(stationRecords, "riskControlItems")[0] || null
    };
  });
  if (!profiles.length) {
    elements.stationProfileSummary.textContent = "全量数据中没有可识别站点。";
    elements.stationProfileList.innerHTML = renderNeutralInsight("暂无站点画像", "隐患记录中未识别到有效站点/城市字段。");
    return;
  }
  elements.stationProfileSummary.textContent = `全量数据中识别到 ${profiles.length} 个站点/城市。`;
  elements.stationProfileList.innerHTML = profiles.map((profile) => `
    <article class="insight-card">
      <div class="insight-card-head">
        <strong>${escapeHtml(profile.station)}</strong>
      </div>
      <dl>
        <dt>二级过程数量第1</dt><dd>${formatCountItem(profile.topLevel2[0])}</dd>
        <dt>二级过程数量第2</dt><dd>${formatCountItem(profile.topLevel2[1])}</dd>
        <dt>三级过程数量第1</dt><dd>${formatCountItem(profile.topLevel3)}</dd>
        <dt>风险控制措施数量第1</dt><dd>${formatCountItem(profile.topRiskControl)}</dd>
      </dl>
    </article>
  `).join("");
}

function buildCompositeCounts(records, keys) {
  const map = new Map();
  records.forEach((record) => {
    const values = keys.map((key) => record[key]).filter(Boolean);
    if (values.length !== keys.length) {
      return;
    }
    const name = values.join("-");
    map.set(name, (map.get(name) || 0) + 1);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value - a.value) || a.name.localeCompare(b.name, "zh-CN"));
}

function formatCountItem(item) {
  if (!item) {
    return "-";
  }
  return escapeHtml(item.name);
}

function renderDuplicateProblems(records) {
  const duplicates = buildDuplicateProblems(records);
  if (!duplicates.length) {
    elements.duplicateSummary.textContent = "全量数据中未发现重复问题组合。";
    elements.duplicateList.innerHTML = renderNeutralInsight("未识别到重复问题", "按三类隐患的标准描述结构归一，并结合三级过程识别后，未出现 2 条及以上重复组合。");
    return;
  }
  elements.duplicateSummary.textContent = `识别到 ${duplicates.length} 组同类重复问题组合。`;
  elements.duplicateList.innerHTML = duplicates.slice(0, 8).map((group) => `
    <article class="insight-card">
      <div class="insight-card-head">
        <strong class="duplicate-title">${escapeHtml(group.hazardName)}</strong>
        <span>${group.count} 条</span>
      </div>
      <dl>
        <dt>隐患类型</dt><dd>${escapeHtml(group.hazardType)}</dd>
        <dt>三级过程</dt><dd>${escapeHtml(group.level3)}</dd>
        <dt>识别依据</dt><dd>${escapeHtml(group.basisLabel)}</dd>
        <dt>风险控制</dt><dd>${group.riskControls.length ? group.riskControls.map(escapeHtml).join("<br>") : "-"}</dd>
        <dt>站点</dt><dd>${group.stations.length ? group.stations.map(escapeHtml).join("、") : "-"}</dd>
        <dt>月份</dt><dd>${group.months.length ? group.months.map(escapeHtml).join("、") : "-"}</dd>
      </dl>
    </article>
  `).join("");
}

function buildDuplicateProblems(records) {
  const groups = new Map();
  records.forEach((record) => {
    if (!record.hazardName || !record.hazardType || !record.level3) {
      return;
    }
    const profile = buildDuplicateProfile(record);
    const groupKey = [normalizeDuplicateKey(record.hazardType), normalizeDuplicateKey(record.level3), profile.signature].join("|");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        hazardType: record.hazardType,
        hazardName: record.hazardName,
        level3: record.level3,
        basisLabel: profile.basisLabel,
        riskControls: new Set(),
        stations: new Set(),
        months: new Set(),
        records: []
      });
    }
    const group = groups.get(groupKey);
    group.records.push(record);
    record.riskControlItems.forEach((item) => item && group.riskControls.add(item));
    record.station && group.stations.add(record.station);
    record.discoveredMonth && group.months.add(record.discoveredMonth);
  });

  return [...groups.values()]
    .filter((group) => group.records.length >= 2)
    .map((group) => ({
      hazardType: group.hazardType,
      hazardName: group.hazardName,
      level3: group.level3,
      basisLabel: group.basisLabel,
      count: group.records.length,
      riskControls: [...group.riskControls].sort((a, b) => a.localeCompare(b, "zh-CN")).slice(0, 3),
      stations: [...group.stations].sort((a, b) => a.localeCompare(b, "zh-CN")),
      months: [...group.months].sort()
    }))
    .sort((a, b) => (b.count - a.count) || a.hazardName.localeCompare(b.hazardName, "zh-CN"));
}

function buildDuplicateProfile(record) {
  if (record.hazardType === "人的不安全行为") {
    const split = splitHumanHazardName(record.hazardName);
    const subject = normalizeHumanSubject(split.subjectText);
    const action = getHumanActionFamily(split.actionText, record.level3);
    return { signature: `${subject}|${action}`, basisLabel: `主语：${subject}；动作：${action}` };
  }
  if (record.hazardType === "物的不安全状态") {
    const carrier = normalizeObjectCarrier(record.hazardName);
    const stateKey = getObjectStateFamily(record.hazardName, record.level3);
    return { signature: `${carrier}|${stateKey}`, basisLabel: `对象：${carrier}；状态：${stateKey}` };
  }
  const carrier = normalizeManagementCarrier(record.hazardName);
  const defectKey = getManagementDefectFamily(record.hazardName, record.level3);
  return { signature: `${carrier}|${defectKey}`, basisLabel: `载体：${carrier}；缺陷：${defectKey}` };
}

function splitHumanHazardName(name) {
  const text = String(name || "").trim();
  const markers = ["未按要求", "未按", "未依据", "未及时", "未正确", "未完整", "违反", "违规", "错误地", "错误", "遗漏", "不了解", "未"];
  let firstIndex = -1;
  markers.forEach((marker) => {
    const index = text.indexOf(marker);
    if (index > 0 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
    }
  });
  if (firstIndex === -1) {
    return { subjectText: text, actionText: text };
  }
  return {
    subjectText: text.slice(0, firstIndex),
    actionText: text.slice(firstIndex)
  };
}

function normalizeDuplicateKey(text) {
  return String(text || "").replace(/[。；，、,.;:：()\[\]（）]/g, "").replace(/\s+/g, "").trim();
}

function normalizeHumanSubject(subjectText) {
  const text = normalizeDuplicateKey(subjectText);
  if (/维修人员|维修技术员|工作者|作业人员|工作人员/.test(text)) {
    return "维修人员";
  }
  if (/工具管理员|工具负责人|工具管理人员/.test(text)) {
    return "工具管理人员";
  }
  if (/航材管理员|库房管理员|航材管理人员/.test(text)) {
    return "航材管理人员";
  }
  if (/放行人员|维修放行人员/.test(text)) {
    return "放行人员";
  }
  return text || "未明确主体";
}

function getHumanActionFamily(actionText, level3) {
  const level = normalizeDuplicateKey(level3);
  if (/工具/.test(level)) {
    return "工具借用和现场管控不到位";
  }
  if (/工卡|记录|签署/.test(level)) {
    return "记录填写和签署不规范";
  }
  if (/安全销|跳开关|封堵|防护|拆装|维修步骤|测试|检查|航前|航后|定检/.test(level)) {
    return "未按依据执行维修作业";
  }
  return normalizeDuplicateKey(actionText)
    .replace(/(未按要求|未按|未依据|未及时|未正确|未完整|违反|违规|错误地|错误|遗漏|不了解|未)/g, "")
    .replace(/(工卡|手册|程序|规范|要求|SOP|AMM|MEL|FLB)/g, "")
    .trim() || "作业动作不一致";
}

function normalizeObjectCarrier(name) {
  const text = normalizeDuplicateKey(name);
  const rules = [
    [/工具|手电|力矩扳手|接杆/, "工具设备"],
    [/航材|标签|挂签|化工品|洗眼液|油滤/, "航材物料"],
    [/车辆|梯|反光锥|设施|地面设备/, "设施设备"],
    [/飞机|舱门|电门|部件|系统|管路/, "航空器/部件"]
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  return matched ? matched[1] : (text || "对象未明确");
}

function getObjectStateFamily(name, level3) {
  const text = `${normalizeDuplicateKey(name)}|${normalizeDuplicateKey(level3)}`;
  if (/缺少|缺失|未配备/.test(text)) {
    return "缺失";
  }
  if (/失效|损坏|破损|异常|电量不足/.test(text)) {
    return "损坏或失效";
  }
  if (/不一致|账实不符|混放|混淆|无法辨识|未标注/.test(text)) {
    return "标识或状态异常";
  }
  return "状态异常";
}

function normalizeManagementCarrier(name) {
  const text = normalizeDuplicateKey(name);
  if (/台账|清单|记录本|记录/.test(text)) {
    return "台账记录";
  }
  if (/程序|手册|流程|工卡|SOP/.test(text)) {
    return "程序流程";
  }
  if (/培训|理解/.test(text)) {
    return "培训要求";
  }
  return text || "管理载体未明确";
}

function getManagementDefectFamily(name, level3) {
  const text = `${normalizeDuplicateKey(name)}|${normalizeDuplicateKey(level3)}`;
  if (/未覆盖|缺少|未建立/.test(text)) {
    return "要求缺失";
  }
  if (/不一致|账实不符|未更新/.test(text)) {
    return "标准或账实不一致";
  }
  if (/执行不到位|管控不到位|未落实/.test(text)) {
    return "执行管控不到位";
  }
  return "管理缺陷";
}

function renderNeutralInsight(title, description) {
  return `
    <article class="insight-card neutral">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function updateSelectionStrip() {
  setElementText(elements.selectedLevel1Label, state.selectedLevel1 || "未选择");
  setElementText(elements.selectedLevel2Label, state.selectedLevel2 || "未选择");
  setElementText(elements.selectedLevel3Label, state.selectedLevel3 || "未选择");
  setElementText(elements.selectedCoreRiskLabel, state.filters.coreRisk || "未选择");
  setElementText(elements.selectedRiskControlLabel, state.filters.riskControl || "未选择");
  setElementText(elements.selectedConsequenceLabel, state.filters.consequence || "未选择");
  elements.level2Subtitle.textContent = state.selectedLevel1 ? `当前一级过程：${state.selectedLevel1}` : "请选择一级过程。";
  elements.level3Subtitle.textContent = state.selectedLevel2 ? `当前二级过程：${state.selectedLevel2}` : "请选择二级过程。";
  const scope = getCurrentScopeLabel();
  elements.consequenceSubtitle.textContent = `当前统计范围：${scope}`;
  elements.coreRiskSubtitle.textContent = `当前统计范围：${scope}`;
  elements.riskControlSubtitle.textContent = `当前统计范围：${scope}`;
}

function getCurrentScopeLabel() {
  if (state.selectedLevel3) {
    return state.selectedLevel3;
  }
  if (state.selectedLevel2) {
    return state.selectedLevel2;
  }
  if (state.selectedLevel1) {
    return state.selectedLevel1;
  }
  return "全部记录";
}

function renderLevel1Chart(data) {
  renderHorizontalBarChart(state.charts.level1, data, state.selectedLevel1, "#9cbaf7", "当前筛选范围内没有一级过程数据。", { left: 24 });
}

function renderLevel2Chart(data) {
  if (!state.selectedLevel1) {
    renderEmptyChart(state.charts.level2, "请选择一级过程。");
    return;
  }
  renderHorizontalBarChart(state.charts.level2, data, state.selectedLevel2, "#8fd0c9", "当前一级过程下没有二级过程数据。", { left: 24 });
}

function renderLevel3Chart(data) {
  if (!state.selectedLevel2) {
    renderEmptyChart(state.charts.level3, "请选择二级过程。");
    return;
  }
  renderHorizontalBarChart(state.charts.level3, data, state.selectedLevel3, "#f3a64e", "当前二级过程下没有三级过程数据。", { left: 24 });
}

function renderConsequenceChart(data) {
  renderHorizontalBarChart(state.charts.consequence, data, state.filters.consequence, "#c79df5", "当前范围内没有关联后果数据。", { left: 24, labelWidth: CHART_LABEL_WIDTH, valueLabel: "命中数量" });
}

function renderCoreRiskChart(data) {
  renderHorizontalBarChart(state.charts.coreRisk, data, state.filters.coreRisk, "#7d95f7", "当前范围内没有核心风险数据。", { left: 24, labelWidth: CHART_LABEL_WIDTH, valueLabel: "命中数量" });
}

function renderRiskControlChart(data) {
  renderHorizontalBarChart(state.charts.riskControl, data, state.filters.riskControl, "#74b8a8", "当前范围内没有风险控制措施数据。", { left: 24, valueLabel: "命中数量", fullLabel: true });
}

function renderHorizontalBarChart(chart, data, selectedName, color, emptyMessage, options = {}) {
  const {
    left = CHART_GRID_LEFT,
    labelWidth = CHART_LABEL_WIDTH,
    valueLabel = "问题数量",
    fullLabel = false
  } = options;
  if (!data.length) {
    renderEmptyChart(chart, emptyMessage);
    return;
  }
  const axisLabel = fullLabel
    ? {
        color: "#172033",
        overflow: "none",
        hideOverlap: false
      }
    : {
        color: "#172033",
        width: labelWidth,
        overflow: "truncate"
      };
  chart.setOption({
    animationDuration: 300,
    grid: { left, right: 24, top: 18, bottom: 22, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => `${params[0].name}<br>${valueLabel}：${params[0].value}`
    },
    xAxis: {
      type: "value",
      axisLabel: { color: "#5f6f8f" },
      splitLine: { lineStyle: { color: "#e6edf8" } }
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel
    },
    series: [{
      type: "bar",
      barWidth: 22,
      data: data.map((item) => ({
        value: item.value,
        itemStyle: { color: item.name === selectedName ? "#2f6fed" : color }
      })),
      label: { show: true, position: "right", color: "#172033" }
    }]
  }, true);
}

function renderEmptyChart(chart, message) {
  chart.clear();
  chart.setOption({
    title: {
      text: message,
      left: "center",
      top: "middle",
      textStyle: { color: "#5f6f8f", fontSize: 15, fontWeight: "normal" }
    }
  });
}

function renderDetailTable(records) {
  elements.detailCountText.textContent = `当前命中 ${records.length} 条记录。`;
  if (!records.length) {
    elements.detailTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="14">当前筛选与下钻条件下没有命中记录。</td>
      </tr>
    `;
    return;
  }

  elements.detailTableBody.innerHTML = records.map((record) => `
    <tr>
      <td>${escapeHtml(record.id)}</td>
      <td>${escapeHtml(record.hazardName)}</td>
      <td>${escapeHtml(record.station || "-")}</td>
      <td>${escapeHtml(record.hazardType || "-")}</td>
      <td>${escapeHtml(record.level1 || "-")}</td>
      <td>${escapeHtml(record.level2 || "-")}</td>
      <td>${escapeHtml(record.level3 || "-")}</td>
      <td>${escapeHtml(record.discoveredAtLabel || "-")}</td>
      <td>${formatListCell(record.hazardSourceItems)}</td>
      <td>${formatJoinedCell(record.coreRiskItems, " / ")}</td>
      <td>${formatListCell(record.riskControlItems)}</td>
      <td>${formatListCell(record.consequenceItems)}</td>
      <td>${formatCauseAnalysisCell(record.causeAnalysis)}</td>
      <td>${formatMultilineCell(record.controlMeasures)}</td>
    </tr>
  `).join("");
}

function formatListCell(items) {
  if (!items || !items.length) {
    return "-";
  }
  return items.map((item) => escapeHtml(item)).join("<br>");
}

function formatJoinedCell(items, separator = " / ") {
  if (!items || !items.length) {
    return "-";
  }
  return items.map((item) => escapeHtml(item)).join(separator);
}

function formatMultilineCell(text) {
  if (!text) {
    return "-";
  }
  return String(text).split("\n").map((line) => escapeHtml(line)).join("<br>");
}

function formatCauseAnalysisCell(text) {
  if (!text) {
    return "-";
  }
  const normalized = String(text)
    .replace(/\r\n?/g, "\n")
    .replace(/\s*(人：)/g, "\n$1")
    .replace(/\s*(机：)/g, "\n$1")
    .replace(/\s*(环：)/g, "\n$1")
    .replace(/\s*(管：)/g, "\n$1")
    .replace(/\n+/g, "\n")
    .trim();
  return normalized.split("\n").map((line) => escapeHtml(line.trim())).join("<br>");
}

function renderEmptyDashboard() {
  elements.metricTotal.textContent = "0";
  elements.metricL1Kinds.textContent = "0";
  elements.metricL2Kinds.textContent = "0";
  elements.metricL3Kinds.textContent = "0";
  elements.trendAlertSummary.textContent = "上传数据后自动识别近期上升、突增和集中性问题。";
  elements.trendAlertList.innerHTML = renderNeutralAlert("暂无趋势数据", "请先上传安全隐患数据文件。");
  elements.stationProfileSummary.textContent = "上传数据后自动生成站点主要问题画像。";
  elements.stationProfileList.innerHTML = renderNeutralInsight("暂无站点画像", "请先上传安全隐患数据文件。");
  elements.duplicateSummary.textContent = "上传数据后自动识别重复问题组合。";
  elements.duplicateList.innerHTML = renderNeutralInsight("暂无重复问题", "请先上传安全隐患数据文件。");
  setElementText(elements.selectedLevel1Label, "未选择");
  setElementText(elements.selectedLevel2Label, "未选择");
  setElementText(elements.selectedLevel3Label, "未选择");
  setElementText(elements.selectedCoreRiskLabel, "未选择");
  setElementText(elements.selectedRiskControlLabel, "未选择");
  setElementText(elements.selectedConsequenceLabel, "未选择");
  elements.level2Subtitle.textContent = "请选择一级过程。";
  elements.level3Subtitle.textContent = "请选择二级过程。";
  elements.consequenceSubtitle.textContent = "当前统计范围：全部记录";
  elements.coreRiskSubtitle.textContent = "当前统计范围：全部记录";
  elements.riskControlSubtitle.textContent = "当前统计范围：全部记录";
  elements.detailCountText.textContent = "当前命中 0 条记录。";
  elements.detailTableBody.innerHTML = `
    <tr class="empty-row">
      <td colspan="14">请先上传安全隐患数据文件。</td>
    </tr>
  `;
  elements.hazardNameInput.value = "";
  populateSelect(elements.level1Select, [], "未选择", "");
  populateSelect(elements.level2Select, [], "全部二级过程", "");
  populateSelect(elements.level3Select, [], "全部三级过程", "");
  populateSelect(elements.stationSelect, [], "全部站点", "");
  populateSelect(elements.hazardTypeSelect, [], "全部类型", "");
  populateSelect(elements.hazardSourceSelect, [], "全部危险源", "");
  populateSelect(elements.coreRiskSelect, [], "全部核心风险", "");
  populateSelect(elements.riskControlSelect, [], "全部风险控制措施", "");
  populateSelect(elements.consequenceSelect, [], "全部后果", "");
  renderEmptyChart(state.charts.level1, "正在等待数据。");
  renderEmptyChart(state.charts.level2, "正在等待数据。");
  renderEmptyChart(state.charts.level3, "正在等待数据。");
  renderEmptyChart(state.charts.consequence, "正在等待数据。");
  renderEmptyChart(state.charts.coreRisk, "正在等待数据。");
  renderEmptyChart(state.charts.riskControl, "正在等待数据。");
}

function setStatus(message, fileName, isReady) {
  elements.statusMessage.textContent = message;
  elements.fileNameLabel.textContent = fileName;
  elements.statusBand.classList.toggle("ready", isReady);
}

function setElementText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

init();
