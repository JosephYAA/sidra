/* Shared settings and helpers for every Sidra page. */

const TEAM = [
  { name: "Noor Alawadhi", major: "Computer Science", role: "Web app development", photo: "assets/img/team/noor.jpg" },
  { name: "Rawan Mahdi", major: "Data Science & AI", role: "Data analysis, notebooks & modelling", photo: "assets/img/team/rawan.jpg" },
  { name: "Yusuf Alatawi", major: "Cybersecurity", role: "Data analysis, notebooks & modelling", photo: "" },
  { name: "Abdulaziz Ajlan", major: "Mechanical Engineering", role: "Data collection, selection & documentation", photo: "assets/img/team/abdulaziz.jpg" },
  { name: "Malak Alsalam", major: "Mechanical Engineering", role: "Data collection, selection & documentation", photo: "assets/img/team/malak.jpg" },
];

// ---- Small icon set (inline SVG, no downloads needed) ----
const ICONS = {
  tree: '<path d="M12 22v-6"/><path d="M8 16h8"/><path d="M12 2a5 5 0 0 0-4.9 6A4 4 0 0 0 6 16h12a4 4 0 0 0-1.1-8A5 5 0 0 0 12 2z"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z"/>',
  waves: '<path d="M2 7c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2"/><path d="M2 12c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2"/><path d="M2 17c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2"/>',
  thermo: '<path d="M14 14.8V4a2 2 0 1 0-4 0v10.8a4 4 0 1 0 4 0z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  sliders: '<path d="M4 6h10"/><path d="M18 6h2"/><circle cx="16" cy="6" r="2"/><path d="M4 12h4"/><path d="M12 12h8"/><circle cx="10" cy="12" r="2"/><path d="M4 18h12"/><path d="M20 18h0"/><circle cx="18" cy="18" r="2"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  arrow: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M12 3 2 21h20L12 3z"/><path d="M12 10v4"/><path d="M12 18h0"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-4-6.3"/>',
  satellite: '<path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4z"/><path d="M16 8l3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/><path d="M8 21h8"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  // Sidra assistant: leaf-shaped chat bubble (two dots + a warm coral dot)
  leafchat: '<path d="M4.6 20.2 6.4 15.6C4.4 11.2 7.3 5 19.6 4.2c-.1 9.9-4.9 12.4-10.2 12.3z"/><circle cx="9.4" cy="12.6" r="1.25" fill="currentColor" stroke="none"/><circle cx="12.4" cy="10.6" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.6" cy="8.4" r="1.25" fill="#F2A285" stroke="none"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
};

function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

function renderIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size || 18));
  });
}

// ---- Load the files the notebook creates ----
async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  // Python's json writer can emit NaN/Infinity, which browsers reject: read those as null.
  const text = await res.text();
  return JSON.parse(text.replace(/([:\[,]\s*)(?:-?Infinity|NaN)(?=\s*[,\]}])/g, "$1null"));
}

/* The notebooks write these two files; the website reads them directly. */
async function loadResults() {
  const [hot, sur] = await Promise.all([
    loadJSON("results/reclaimed_land_metrics.json"),
    loadJSON("results/surrounding_land_summary.json"),
  ]);
  return { hot, sur };
}

/* A short, flat summary of both result files: used by the assistant and the AI webhook. */
function summarizeResults(R) {
  if (!R) return null;
  const r = R.hot.results, s = R.sur;
  const matched = r.matched_land_comparison || {};
  const ci = (s.matched_year_block_uncertainty || []).find((x) => x.comparison === "original") || {};
  const ml = (name, test) => (s.ml_validation || []).find((x) => x.model === name && x.test === test) || {};
  return {
    site: R.hot.site,
    reclaimed_area_km2: r.diyar_reclaimed_area_km2,
    reclamation_start_year: r.diyar_reclamation_start_year_p5,
    summer_scenes_recent: r.recent_summer_scenes_used,
    diyar_median_summer_lst_c: r.diyar_median_summer_lst_c,
    diyar_matched_land_gap_c: matched.gap_c ?? null,
    matched_land_interval_c: matched.conditional_year_target_block_interval ? [matched.conditional_year_target_block_interval.lower_c, matched.conditional_year_target_block_interval.upper_c] : null,
    matched_land_support_status: matched.status,
    matched_land_target_share: matched.median_matched_target_share,
    matched_land_complete_summers: (matched.complete_summers || []).length,
    persistent_hotspot_ha: (r.hotspot_area_ha || {})["Persistent hotspot"],
    stable_hotspot_ha: r.stable_hotspot_area_ha,
    hotspot_zones: r.n_hotspot_zones,
    shoreline_cooling_0_30m_c: r.coastal_cooling_0_30m_c,
    nearby_gap_change_c: s.equal_month_gap_change_c,
    nearby_gap_interval_c: [ci.lower_c, ci.upper_c],
    nearby_cells: s.nearby_cells, control_cells: s.control_cells,
    model_space_mae_c: ml("Landsat+ERA5+Sentinel", "space").mae_c,
    model_date_mae_c: ml("Landsat+ERA5+Sentinel", "date").mae_c,
    model_features: (s.ml_features || []).length,
    priority_cells: s.review_priority_cells,
    inspection_areas: s.candidate_inspection_areas,
    interpretation: s.interpretation,
  };
}

function showLoadError(container) {
  container.insertAdjacentHTML("afterbegin", `
    <div class="callout warn load-error">
      <b>Couldn't load the results files.</b> Open this site through a local server, not by double-clicking the file.
      In the VS Code terminal run <code>python -m http.server 8000</code> and open
      <code>http://localhost:8000</code>. Also check that <code>results/reclaimed_land_metrics.json</code> and <code>results/surrounding_land_summary.json</code> exist.
    </div>`);
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderIcons();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* Floating chat bubble, available on every page */
function initChatWidget(getM, getAnswer) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="chat-panel" id="chat-panel" role="dialog" aria-label="Sidra assistant">
      <div class="cp-head">
        <span class="cp-avatar" data-icon="leafchat" data-size="22"></span>
        <div><b>${t("Sidra Assistant")}</b><div class="tiny"><span class="online"></span>${t("Online · answers from our results")}</div></div>
        <button class="cp-close" id="cp-close" aria-label="Close chat" data-icon="close" data-size="18"></button>
      </div>
      <div class="cp-body">
        <div class="chat-log" id="cp-log"></div>
        <div class="chat-suggest" id="cp-suggest"></div>
      </div>
      <form class="chat-input cp-input" id="cp-form">
        <input id="cp-text" type="text" placeholder="${t("Ask about the platform...")}" autocomplete="off">
        <button class="send-round" type="submit" aria-label="Send" data-icon="send" data-size="17"></button>
      </form>
    </div>
    <button class="fab" id="chat-fab" aria-label="Open Sidra assistant"><span data-icon="leafchat" data-size="30"></span></button>`);
  renderIcons(document.getElementById("chat-panel"));
  renderIcons(document.getElementById("chat-fab"));
  const panel = document.getElementById("chat-panel");
  const fab = document.getElementById("chat-fab");
  const toggle = (open) => {
    panel.classList.toggle("open", open);
    fab.classList.toggle("open", open);
    fab.innerHTML = icon(open ? "close" : "leafchat", open ? 24 : 30);
    if (open) setTimeout(() => document.getElementById("cp-text").focus(), 200);
  };
  fab.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  document.getElementById("cp-close").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  bindChat({
    log: document.getElementById("cp-log"), suggest: document.getElementById("cp-suggest"),
    form: document.getElementById("cp-form"), input: document.getElementById("cp-text"), getM,
  }, getAnswer || ((q) => sidraAnswer(q, getM())));
}

/* =====================================================================
   Site footer (same on every page)
   ===================================================================== */
function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const L = (h) => (typeof isAR !== "undefined" && isAR ? h.replace(".html", ".html?lang=ar") : h);
  const col = (title, links) => `<div class="fb-col"><h5>${t(title)}</h5>${links.map(([x, h]) => h ? `<a href="${L(h)}">${t(x)}</a>` : `<span>${t(x)}</span>`).join("")}</div>`;
  el.innerHTML = `
    <div class="fb-grid">
      <div class="fb-brand">
        <a class="brand" href="${L("index.html")}"><img alt="" class="brand-logo" src="assets/img/logo.png"><span>${isAR ? "سـد<em>رة</em>" : "SID<em>RA</em>"}</span></a>
        <p>${t("Satellite evidence for coastal heat planning, for Bahrain's planners and coastal developers.")}</p>
        <div class="fb-badges"><span class="badge green">${t("Theme 05")}</span><span class="badge gold">${t("Open data")}</span></div>
      </div>
      ${col("Platform", [["Overview", "index.html#overview"], ["Hotspots", "index.html#hotspots"], ["Surroundings", "index.html#surroundings"], ["Field visit", "index.html#fieldvisit"], ["The Idea", "idea.html"]])}
      ${col("Alignment", [["Bahrain Economic Vision 2030"], ["National Afforestation Plan"], ["Net Zero by 2060 pledge"], ["UN SDG 11 · Sustainable Cities"]])}
      ${col("Data sources", [["Landsat Collection 2 L2 (USGS)"], ["Sentinel-2 L2A (ESA Copernicus)"], ["ERA5 reanalysis (Copernicus C3S)"], ["Annual land cover (Impact Observatory)"]])}
    </div>
    <div class="fb-bottom">
      <span>${t("🌳 Built by Team Sidra, American University of Bahrain · Theme 05: Sustainable Urban Planning & Smart Cities.")}</span>
      <span>${t("Satellite surface temperature, not air temperature · Data: USGS, ESA Copernicus, C3S/ECMWF, Impact Observatory")}</span>
    </div>`;
  renderIcons(el);
}

/* =====================================================================
   Animated thermal scan of Diyar (illustrative, for the idea page)
   A scan bar sweeps down the Diyar pixel map and lights each cell up in
   heat colours; rings pulse on the hotspots. "Greener layout" adds pixel
   trees and cools the cells around them.
   ===================================================================== */
const DIYAR_GRID = [
  ".......................#######....................",
  ".....................##########...................",
  ".....................###########..................",
  "....................#############.................",
  "...................###############................",
  "...................###############................",
  "..................################................",
  "..................#################...............",
  ".................###################.##...........",
  ".................#########.################.......",
  "...............########.....################......",
  "...............#########.....###...###.######.....",
  "..............###############.##.###....######....",
  ".............##################..###..##..#####...",
  ".............###################.##############...",
  "..............##################################..",
  "...................#####################.########.",
  "...........#####.....#################.....#######",
  "..........######.###...#####################..####",
  ".........############...####################...###",
  ".........#############..###################.....##",
  "........###############.##################.....###",
  "........###############......#############.....##.",
  ".......#################....##############...#....",
  "......##################....###############..##...",
  "......##################..........#########.###...",
  ".....###################............###########...",
  "....#.##################........##...##########...",
  "....######################..#########.#######.....",
  "...##################################..######.....",
  "..#.#################################...####.#....",
  "..####################################..###.......",
  ".#####################################..###.......",
  ".######################################..#........",
  "#######################################...........",
  ".#######################################..........",
  "...######################################.........",
  "....###################################...........",
  "......#################################...........",
  "........##############################............",
  ".........##############################...........",
  "...........##########################.............",
  "............##################.#####..............",
  "..............#######################.............",
  "...............####################...............",
  ".................#################................",
  "...................###############................",
  "....................##############................",
  "......................############................",
  "........................##########................",
  ".........................########.................",
  "........................#########.................",
  ".......................####.######................",
  ".......................##########.................",
  ".....................#.######.###.................",
  ".....................###########..................",
  ".....................#########....................",
  ".......................######.....................",
  "........................#####.....................",
  "........................######...................."
];
// Outline image: 8 source px of padding around the grid, 11 source px per cell.
const DIYAR_OUTLINE = { src: "assets/img/diyar-outline.png", pad: 8, pitch: 11 };

const SCAN_SPOTS = [
  { c: 26, r: 38, label: "Sand fill, no shade", kind: "hot", cool: "park", heat: 1.0 },
  { c: 23, r: 6, label: "Dense built-up block", kind: "built", cool: "park", heat: 0.85 },
  { c: 10, r: 22, label: "Paved car park", kind: "warm", cool: "park", heat: 0.7 },
  { c: 31, r: 15, label: "Road junction", kind: "warm", cool: "warm", heat: 0.7 },
  { c: 27, r: 51, label: "New villas", kind: "warm", cool: "park", heat: 0.6 },
];
const SCAN_TREES = [[26, 38], [23, 6], [10, 22], [27, 51], [16, 31], [35, 26]];
const SPOT_COLORS = { hot: "#E5484D", built: "#E07A5F", warm: "#E8A33D", park: "#4ADE80", water: "#3987E5" };
// cool -> hot ramp, matched to the site's greens and the logo's coral
const HEAT_RAMP = [[0, [47, 127, 110]], [0.35, [127, 191, 174]], [0.55, [205, 196, 180]], [0.75, [228, 168, 143]], [1, [224, 122, 95]]];
const NEIGHBOURS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function heatColour(v) {
  v = Math.max(0, Math.min(1, v));
  for (let i = 1; i < HEAT_RAMP.length; i++) {
    const [p1, c1] = HEAT_RAMP[i], [p0, c0] = HEAT_RAMP[i - 1];
    if (v <= p1) { const k = (v - p0) / (p1 - p0); return c0.map((x, j) => Math.round(x + (c1[j] - x) * k)); }
  }
  return HEAT_RAMP.at(-1)[1];
}

function buildHeatFields() {
  const R = DIYAR_GRID.length, C = DIYAR_GRID[0].length;
  const land = (c, r) => r >= 0 && r < R && c >= 0 && c < C && DIYAR_GRID[r][c] === "#";
  // distance (in cells) to the nearest water: the sea cools the shoreline
  const dist = Array.from({ length: R }, () => Array(C).fill(Infinity));
  const queue = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (land(c, r) && NEIGHBOURS.some(([dc, dr]) => !land(c + dc, r + dr))) { dist[r][c] = 1; queue.push([c, r]); }
  }
  for (let i = 0; i < queue.length; i++) {
    const [c, r] = queue[i];
    for (const [dc, dr] of NEIGHBOURS) {
      const nc = c + dc, nr = r + dr;
      if (land(nc, nr) && dist[nr][nc] === Infinity) { dist[nr][nc] = dist[r][c] + 1; queue.push([nc, nr]); }
    }
  }
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const today = [], green = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (!land(c, r)) continue;
    let h = 0.3;
    for (const s of SCAN_SPOTS) h += s.heat * 0.72 * Math.exp(-((c - s.c) ** 2 + (r - s.r) ** 2) / 110);
    const shore = Math.min(1, (dist[r][c] - 1) / 4);
    h = h * (0.45 + 0.55 * shore) + (rand() - 0.5) * 0.12;
    let g = h * 0.62 - 0.04;
    for (const [tc, tr] of SCAN_TREES) g -= 0.5 * Math.exp(-((c - tc) ** 2 + (r - tr) ** 2) / 40);
    today.push({ c, r, v: h });
    green.push({ c, r, v: g });
  }
  return { R, C, today, green };
}

function renderScan(el) {
  if (!el) return;
  let greener = false;
  const isHot = (s) => ["hot", "built", "warm"].includes(greener ? s.cool : s.kind);
  el.innerHTML = `
    <div class="scan-card">
      <div class="scan-top">
        <span class="tiny">${t("Diyar Al Muharraq · thermal scan")}</span>
        <div class="seg" id="scan-seg"><button class="on" data-mode="today">${t("Today")}</button><button data-mode="green">${t("Greener layout")}</button></div>
      </div>
      <canvas class="scan-canvas" role="img" aria-label="${t("Illustrative thermal scan of Diyar Al Muharraq")}"></canvas>
      <div class="scan-foot">
        <span class="tiny" id="scan-info">${t("Click a hotspot to inspect it")}</span>
        <span class="scan-live"><span class="online"></span><span id="scan-count"></span></span>
      </div>
      <div class="tiny" style="margin-top:6px;opacity:.8">${t("Illustrative visual, not measured data.")}</div>
    </div>`;

  const canvas = el.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const F = buildHeatFields();
  const outline = new Image();
  outline.src = DIYAR_OUTLINE.src;
  const CELL = 7, GAP = 1.4, PAD = Math.round(DIYAR_OUTLINE.pad * CELL / DIYAR_OUTLINE.pitch) + 6;
  const W = F.C * CELL + PAD * 2, H = F.R * CELL + PAD * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.aspectRatio = `${W} / ${H}`;
  ctx.scale(dpr, dpr);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SWEEP = 3600, HOLD = 3200, FADE = 700, DARK = [22, 52, 44];
  let start = performance.now(), visible = true, running = false;

  const cellXY = (c, r) => [PAD + c * CELL, PAD + r * CELL];
  const square = (c, r) => {
    const [x, y] = cellXY(c, r);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x + GAP / 2, y + GAP / 2, CELL - GAP, CELL - GAP, 1.6); else ctx.rect(x + GAP / 2, y + GAP / 2, CELL - GAP, CELL - GAP);
    ctx.fill();
  };
  const CANOPY = [];
  [[-1, 1], [-2, 2], [-3, 3], [-3, 3], [-2, 2]].forEach(([a, b], i) => { for (let dc = a; dc <= b; dc++) CANOPY.push([dc, i - 4]); });
  const LEAVES = ["#3FCF8E", "#2BB673", "#5BE0A0", "#22A065", "#34C27F"];
  const drawTree = (c, r, alpha) => {
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    CANOPY.forEach(([dc, dr], i) => { ctx.fillStyle = LEAVES[(i * 7) % LEAVES.length]; square(c + dc, r + dr); });
    ctx.fillStyle = "#7A5C45";
    square(c, r + 1);
    square(c, r + 2);
    square(c - 1, r + 2);
    square(c + 1, r + 2);
    ctx.globalAlpha = 1;
  };
  const reveal = (scanY, y, fadeOut) => Math.max(0, Math.min(1, (scanY - y) / (CELL * 3))) * (1 - fadeOut);

  function frame(now) {
    const cycle = SWEEP + HOLD + FADE;
    const tt = reduced ? SWEEP : (now - start) % cycle;
    const scanY = PAD + (Math.min(tt, SWEEP) / SWEEP) * (F.R * CELL + CELL * 3);
    const fadeOut = !reduced && tt > SWEEP + HOLD ? (tt - SWEEP - HOLD) / FADE : 0;
    ctx.clearRect(0, 0, W, H);
    for (const { c, r, v } of greener ? F.green : F.today) {
      const lit = reveal(scanY, cellXY(c, r)[1], fadeOut);
      const hc = heatColour(v);
      ctx.fillStyle = `rgb(${DARK.map((d, i) => Math.round(d + (hc[i] - d) * lit)).join(",")})`;
      square(c, r);
    }
    if (greener) for (const [tc, tr] of SCAN_TREES) drawTree(tc, tr, reveal(scanY, cellXY(tc, tr)[1], fadeOut));
    if (outline.complete && outline.naturalWidth) {
      const k = CELL / DIYAR_OUTLINE.pitch;
      ctx.globalAlpha = 0.75;
      ctx.drawImage(outline, PAD - DIYAR_OUTLINE.pad * k, PAD - DIYAR_OUTLINE.pad * k, outline.naturalWidth * k, outline.naturalHeight * k);
      ctx.globalAlpha = 1;
    }
    // pulsing rings on the hotspots the bar has passed
    SCAN_SPOTS.forEach((s, i) => {
      const [x, y] = cellXY(s.c, s.r);
      if (!isHot(s) || scanY < y + CELL || fadeOut >= 1) return;
      const cx = x + CELL / 2, cy = y + CELL / 2, ph = (now / 1600 + i * 0.27) % 1, a = 1 - fadeOut;
      const kind = greener ? s.cool : s.kind;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(246, 214, 200, ${0.9 * a})`;
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(232, 140, 110, ${(1 - ph) * 0.8 * a})`;
      ctx.beginPath(); ctx.arc(cx, cy, 6 + ph * (kind === "hot" ? 22 : 14), 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(232, 140, 110, ${0.9 * a})`;
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
    });
    // the scan bar
    if (!reduced && tt < SWEEP) {
      const g = ctx.createLinearGradient(0, scanY - 34, 0, scanY);
      g.addColorStop(0, "rgba(40, 90, 75, 0)");
      g.addColorStop(1, "rgba(40, 90, 75, 0.75)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 34, W, 34);
      ctx.fillStyle = "#8EE3C8";
      ctx.shadowColor = "#8EE3C8";
      ctx.shadowBlur = 12;
      ctx.fillRect(0, scanY - 1.5, W, 3);
      ctx.shadowBlur = 0;
    }
    if (!reduced && visible) requestAnimationFrame(frame); else running = false;
  }
  const play = () => { if (reduced) frame(performance.now()); else if (!running) { running = true; requestAnimationFrame(frame); } };

  const update = () => {
    el.querySelector("#scan-count").textContent = (() => { const n = SCAN_SPOTS.filter(isHot).length; return t(n === 1 ? "{n} heat hotspot · {mode}" : "{n} heat hotspots · {mode}", { n, mode: t(greener ? "greener layout" : "live scan") }); })();
    start = performance.now();
    play();
  };
  canvas.addEventListener("click", (e) => {
    const b = canvas.getBoundingClientRect(), k = W / b.width;
    const px = (e.clientX - b.left) * k, py = (e.clientY - b.top) * k;
    let best = null, bd = 18;
    SCAN_SPOTS.forEach((s) => {
      const [x, y] = cellXY(s.c, s.r), d = Math.hypot(px - x - CELL / 2, py - y - CELL / 2);
      if (d < bd) { bd = d; best = s; }
    });
    if (!best) return;
    const kind = greener ? best.cool : best.kind;
    const words = { hot: "very hot", built: "hot", warm: "warm", park: "cool (vegetation)", water: "coolest (water)" };
    el.querySelector("#scan-info").innerHTML = `<b style="color:${SPOT_COLORS[kind]}">●</b> ${greener && best.cool !== best.kind ? t("Greened: ") : ""}${t(best.label)} · ${t(words[kind])}`;
  });
  el.querySelectorAll("#scan-seg button").forEach((b) => b.addEventListener("click", () => {
    greener = b.dataset.mode === "green";
    el.querySelectorAll("#scan-seg button").forEach((x) => x.classList.toggle("on", x === b));
    el.querySelector("#scan-info").textContent = t("Click a hotspot to inspect it");
    update();
  }));
  outline.onload = () => { if (reduced) frame(performance.now()); };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) play(); }).observe(canvas);
  }
  update();
}

document.addEventListener("DOMContentLoaded", renderFooter);
