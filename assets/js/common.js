/* Shared settings and helpers for every Sidra page. */

const TEAM = [
  { name: "Abdulaziz Ajlan", major: "Mechanical Engineering", role: "Physical dynamics analysis" },
  { name: "Malak Alsalam", major: "Mechanical Engineering", role: "Thermal performance engineering" },
  { name: "Yusuf Alatawi", major: "Cybersecurity", role: "Cloud pipeline & data compliance" },
  { name: "Noor Alawadhi", major: "Computer Science", role: "Algorithms, STAC queries & web app" },
  { name: "Rawan Mahdi", major: "Data Science & AI", role: "Model development & evaluation" },
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
   Animated thermal scan (illustrative, for the idea page)
   ===================================================================== */
const SCAN_SPOTS = [
  { x: 205, y: 92, r: 15, kind: "built", label: "Dense built-up block", cool: "park" },
  { x: 120, y: 112, r: 10, kind: "warm", label: "Paved car park", cool: "park" },
  { x: 268, y: 160, r: 13, kind: "warm", label: "Road junction", cool: "warm" },
  { x: 86, y: 196, r: 9, kind: "park", label: "Pocket park", cool: "park" },
  { x: 182, y: 214, r: 18, kind: "hot", label: "Sand fill, no shade", cool: "park" },
  { x: 250, y: 252, r: 9, kind: "warm", label: "New villas", cool: "park" },
  { x: 160, y: 290, r: 11, kind: "water", label: "Open water channel", cool: "water" },
];
const SPOT_COLORS = { hot: "#E5484D", built: "#D95926", warm: "#E8A33D", park: "#4ADE80", water: "#3987E5" };

function renderScan(el) {
  if (!el) return;
  let greener = false;
  const spotsSVG = () => SCAN_SPOTS.map((s, i) => {
    const kind = greener ? s.cool : s.kind;
    const c = SPOT_COLORS[kind];
    const r = greener && kind === "park" && s.kind !== "park" ? s.r * 0.8 : s.r;
    return `<g class="spot" data-i="${i}" tabindex="0" style="--d:${i * 0.35}s">
      <circle cx="${s.x}" cy="${s.y}" r="${r * 3.2}" fill="url(#glow-${kind})" class="halo"/>
      <circle cx="${s.x}" cy="${s.y}" r="${r}" fill="${c}" class="core"/>
    </g>`;
  }).join("");
  const glowDefs = Object.entries(SPOT_COLORS).map(([k, c]) => `
    <radialGradient id="glow-${k}"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("");
  const hotCount = () => SCAN_SPOTS.filter((s) => ["hot", "built", "warm"].includes(greener ? s.cool : s.kind)).length;

  el.innerHTML = `
    <div class="scan-card">
      <div class="scan-top">
        <span class="tiny">${t("Diyar Al Muharraq · thermal scan")}</span>
        <div class="seg" id="scan-seg"><button class="on" data-mode="today">${t("Today")}</button><button data-mode="green">${t("Greener layout")}</button></div>
      </div>
      <svg viewBox="0 0 360 340" class="scan-svg" role="img" aria-label="Illustrative thermal scan of a reclaimed island">
        <defs>
          <pattern id="scan-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(74,222,128,0.07)"/></pattern>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4ADE80" stop-opacity="0"/><stop offset="0.5" stop-color="#4ADE80" stop-opacity="0.35"/><stop offset="1" stop-color="#4ADE80" stop-opacity="0"/></linearGradient>
          ${glowDefs}
        </defs>
        <rect width="360" height="340" fill="url(#scan-grid)"/>
        <path class="island" d="M70 70 L262 56 L302 150 L272 268 L190 318 L92 296 L52 190 Z"/>
        <g id="scan-spots">${spotsSVG()}</g>
        <rect class="beam" x="0" y="-60" width="360" height="60" fill="url(#beam)"/>
      </svg>
      <div class="scan-foot">
        <span class="tiny" id="scan-info">${t("Click a hotspot to inspect it")}</span>
        <span class="scan-live"><span class="online"></span><span id="scan-count"></span></span>
      </div>
      <div class="tiny" style="margin-top:6px;opacity:.8">${t("Illustrative visual, not measured data.")}</div>
    </div>`;

  const update = () => {
    el.querySelector("#scan-spots").innerHTML = spotsSVG();
    el.querySelector("#scan-count").textContent = t("{n} heat hotspots · {mode}", { n: hotCount(), mode: t(greener ? "greener layout" : "live scan") });
    bindSpots();
  };
  const bindSpots = () => el.querySelectorAll(".spot").forEach((g) => {
    const show = () => {
      const s = SCAN_SPOTS[Number(g.dataset.i)];
      const kind = greener ? s.cool : s.kind;
      const words = { hot: "very hot", built: "hot", warm: "warm", park: "cool (vegetation)", water: "coolest (water)" };
      el.querySelector("#scan-info").innerHTML = `<b style="color:${SPOT_COLORS[kind]}">●</b> ${greener && s.cool !== s.kind ? t("Greened: ") : ""}${t(s.label)} · ${t(words[kind])}`;
    };
    g.addEventListener("click", show);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter") show(); });
  });
  el.querySelectorAll("#scan-seg button").forEach((b) => b.addEventListener("click", () => {
    greener = b.dataset.mode === "green";
    el.querySelectorAll("#scan-seg button").forEach((x) => x.classList.toggle("on", x === b));
    update();
  }));
  update();
}

document.addEventListener("DOMContentLoaded", renderFooter);
