/* Sidra dashboard: reads the two results files the notebooks write and draws every view.
   results/reclaimed_land_metrics.json  -> Part 1 (reclaimed land, hotspots)
   results/surrounding_land_summary.json -> Part 2 (surrounding land, model, field visit) */

const COLORS = {
  brand: "#10B981", blue: "#3987E5", orange: "#D95926", aqua: "#199E70", violet: "#9085E9",
  ink: "#E8F0EC", ink2: "#9FB5A9", ink3: "#5F7A6C", grid: "rgba(255,255,255,0.06)",
};
const CLASS_COLORS = { "Persistent hotspot": "#B91C1C", "Hotspot": "#F08A55", "Not significant": "#5F7A6C", "Cool cluster": "#3987E5" };

let R = null;          // { hot, sur }
const charts = {};
const $ = (id) => document.getElementById(id);
const fmt = (n, d = 1) => (n === null || n === undefined || Number.isNaN(Number(n)) ? "--" : Number(n).toFixed(d));
const signed = (n, d = 1) => (Number(n) > 0 ? "+" : "") + fmt(n, d);

/* ---------- Chart.js defaults ---------- */
Chart.defaults.color = COLORS.ink2;
Chart.defaults.font.family = isAR ? "'IBM Plex Sans Arabic', sans-serif" : "'Plus Jakarta Sans', sans-serif";
Chart.defaults.borderColor = COLORS.grid;
Chart.defaults.plugins.legend.display = false;
Object.assign(Chart.defaults.plugins.tooltip, {
  backgroundColor: "#050806", borderColor: "#059669", borderWidth: 1, padding: 10, titleColor: COLORS.ink, bodyColor: COLORS.ink,
});

function legend(el, items) {
  el.innerHTML = items.map(([label, color]) => `<span><i style="background:${color}"></i>${label}</span>`).join("");
}

/* ---------- Navigation ---------- */
function showView(name) {
  if (!$(`view-${name}`)) name = "overview";
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  history.replaceState(null, "", `${location.search}#${name}`);
  if (name === "mapview") initMap();
  Object.values(charts).forEach((c) => c.resize());
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNav() {
  document.querySelectorAll("#nav button").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); showView(a.dataset.goto); }));
  $("report-btn").addEventListener("click", () => { initMap(); setTimeout(() => window.print(), 300); });
  window.addEventListener("beforeprint", () => Object.values(charts).forEach((c) => c.resize()));
  const start = location.hash.replace("#", "");
  if (start) showView(start);
}

/* ---------- Overview ---------- */
function renderOverview() {
  const r = R.hot.results, s = R.sur;
  const matched = r.matched_land_comparison || {};

  $("scene-chip").textContent = t("{n} recent summer Landsat scenes · 2021–2025", { n: r.recent_summer_scenes_used });
  $("k-area").textContent = fmt(r.diyar_reclaimed_area_km2, 1);
  $("k-area-note").textContent = t("Built on the sea since about {y}", { y: r.diyar_reclamation_start_year_p5 });
  $("k-change").textContent = (matched.gap_c == null ? "--" : signed(matched.gap_c, 2));
  $("k-change-note").textContent = (matched.gap_c == null ? t("Insufficient matching support") : t("{n} complete summers", { n: matched.complete_summers.length }));
  $("k-lst").textContent = fmt(r.diyar_median_summer_lst_c, 1);
  $("k-hot").textContent = fmt(r.hotspot_area_ha["Persistent hotspot"], 0);
  $("k-hot-note").textContent = t("{n} zones · {s} ha under all checks", { n: r.n_hotspot_zones, s: fmt(r.stable_hotspot_area_ha, 0) });

  const matchInterval = matched.conditional_year_target_block_interval;
  $("matched-support").textContent = matched.gap_c == null ? t("Insufficient matching support") : [
    t("Median eligible target share matched: {v}%", { v: fmt(100 * matched.median_matched_target_share, 0) }),
    matchInterval ? t("Conditional 95% interval: {lo} to {hi}°C", { lo: signed(matchInterval.lower_c, 2), hi: signed(matchInterval.upper_c, 2) }) : t("Interval unavailable"),
    (matched.balance || []).some((b) => b.after_smd > 0.1) ? t("Residual measured-feature imbalance remains") : "",
  ].filter(Boolean).join(" · ");

  // Same-date matched land benchmark
  const groups = matched.surface_temperature_table || [];
  legend($("ba-legend"), [[t("Matched Diyar reclaimed land"), COLORS.orange], [t("Matched existing land"), COLORS.blue]]);
  charts.ba = new Chart($("ba-chart"), {
    type: "bar",
    data: {
      labels: groups.map((g) => t(g.group)),
      datasets: [
        { label: t("Matched summer surface temperature"), data: groups.map((g) => g.surface_temperature_c), backgroundColor: [COLORS.orange, COLORS.blue], borderRadius: 4 },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, title: { display: true, text: t("Surface temperature (°C)") }, grid: { color: COLORS.grid } }, x: { grid: { display: false } } },
      plugins: { tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${signed(c.raw, 1)}°C` } } },
    },
  });

  // Evidence tiles + sources
  const used = s.usable_temperature_dates || {};
  const tiles = [
    [t("Summer scenes, Part 1"), r.recent_summer_scenes_used, "satellite"],
    [t("Landsat scenes, Part 2"), s.downloaded_landsat, "satellite"],
    [t("Sentinel-2 pairs"), s.sentinel_pairs, "layers"],
    [t("ERA5 weather days"), s.weather_unique_days, "waves"],
  ];
  $("evidence-tiles").innerHTML = tiles.map(([label, v, ic]) =>
    `<div class="tile"><div class="t-top">${label} <span data-icon="${ic}" data-size="15" style="color:var(--neon)"></span></div><div class="t-val">${v ?? "--"}</div></div>`).join("");
  const sources = ["Landsat Collection 2 Level-2 (USGS)", "Sentinel-2 Level-2A (ESA Copernicus)", "Annual 10 m land cover (Impact Observatory)", "ERA5 hourly reanalysis (Copernicus C3S)"];
  $("source-list").innerHTML = sources.map((x) => `<li><span class="ok" data-icon="check" data-size="16"></span>${t(x)}</li>`).join("");
  renderIcons($("evidence-tiles")); renderIcons($("source-list"));

  // Coastal profile
  const prof = r.coastal_profile;
  const ctx = $("coast-chart").getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, "rgba(16,185,129,0.35)"); grad.addColorStop(1, "rgba(16,185,129,0)");
  charts.coast = new Chart($("coast-chart"), {
    type: "line",
    data: {
      labels: prof.map((p) => `${(p.from_m + p.to_m) / 2}`),
      datasets: [{ label: t("vs Diyar median"), data: prof.map((p) => p.vs_diyar_median_c), borderColor: COLORS.brand, backgroundColor: grad, fill: "origin", tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, pointHoverBackgroundColor: COLORS.brand, pointHoverBorderColor: "#fff" }],
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { title: { display: true, text: t("Distance from shoreline (m)") }, grid: { display: false } },
        y: { title: { display: true, text: t("°C vs Diyar median") }, grid: { color: (c) => (c.tick.value === 0 ? "rgba(255,255,255,0.25)" : COLORS.grid) } },
      },
      plugins: { tooltip: { callbacks: { title: (i) => t("{m} m from the shore", { m: i[0].label }), label: (c) => ` ${signed(c.raw, 2)}°C` } } },
    },
  });

  renderInsights();
}

function renderInsights() {
  const r = R.hot.results, s = R.sur;
  const matched = r.matched_land_comparison || {};
  const ci = (s.matched_year_block_uncertainty || []).find((x) => x.comparison === "original") || {};
  const items = [
    { warn: matched.gap_c == null || (matched.balance || []).some((b) => b.after_smd > 0.1), tag: t("Matched comparison"),
      title: matched.gap_c == null ? t("Insufficient matching support") : t("Matched land gap: {v}°C", { v: signed(matched.gap_c, 2) }),
      text: t("Same-date inland pairs matched on measured surfaces and distance from water. The gap applies to the matched subset and does not isolate a causal reclamation effect.") },
    { warn: false, tag: t("Measured"), title: t("The sea cools the first ~{m} m of coast", { m: r.shore_buffer_m }), text: t("Land within 30 m of the water is about {v}°C cooler than Diyar's interior (more than 450 m from water). The cooling fades within about {m} m.", { v: fmt(r.coastal_cooling_0_30m_c, 1), m: r.shore_buffer_m }) },
    { warn: false, tag: t("Hotspots"), title: t("{a} ha of persistent hotspots in {n} zones", { a: fmt(r.hotspot_area_ha["Persistent hotspot"], 0), n: r.n_hotspot_zones }), text: t("These cells are in the hottest 10% on at least half of the summer dates, and {s} ha stay hot under every robustness check.", { s: fmt(r.stable_hotspot_area_ha, 0) }) },
    { warn: true, tag: t("Uncertain"), title: t("Nearby land: +{v}°C, but not certain", { v: fmt(s.equal_month_gap_change_c, 2) }), text: t("The interval ({lo} to {hi}°C) includes zero, so we cannot yet say the surrounding neighbourhoods warmed.", { lo: fmt(ci.lower_c, 2), hi: signed(ci.upper_c, 2) }) },
  ];
  $("insights").innerHTML = items.map((i) => `
    <div class="insight">
      <span class="icon-ring ${i.warn ? "warn" : ""}" data-icon="${i.warn ? "alert" : "sparkle"}"></span>
      <div><span class="badge ${i.warn ? "gold" : "green"}">${i.tag}</span><b style="margin-top:6px">${i.title}</b><p>${i.text}</p></div>
    </div>`).join("");
  renderIcons($("insights"));
}

/* ---------- Hotspots ---------- */
function renderHotspots() {
  const r = R.hot.results;
  $("h-persist").textContent = fmt(r.hotspot_area_ha["Persistent hotspot"], 0);
  $("h-stable").textContent = fmt(r.stable_hotspot_area_ha, 0);
  $("h-zones").textContent = r.n_hotspot_zones;
  $("h-cells").textContent = t("{n} cells ranked", { n: r.ranked_cells });
  $("h-coast").textContent = signed(-r.coastal_cooling_0_30m_c, 1);
  $("h-buffer").textContent = t("vs interior · {m} m shore band excluded from ranking", { m: r.shore_buffer_m });

  const order = ["Persistent hotspot", "Hotspot", "Not significant", "Cool cluster"];
  const prof = Object.fromEntries(r.hotspot_class_profile.map((p) => [p.class, p]));
  charts.cls = new Chart($("class-chart"), {
    type: "bar",
    data: { labels: order.map((k) => t(k)), datasets: [{ data: order.map((k) => r.hotspot_area_ha[k]), backgroundColor: order.map((k) => CLASS_COLORS[k]), borderRadius: 4, borderSkipped: "start", barPercentage: 0.6 }] },
    options: {
      indexAxis: "y", maintainAspectRatio: false,
      scales: { x: { beginAtZero: true, title: { display: true, text: t("Hectares") }, grid: { color: COLORS.grid } }, y: { grid: { display: false } } },
      plugins: { tooltip: { callbacks: { label: (c) => ` ${fmt(c.raw, 1)} ha` } } },
    },
  });
  const head = [t("Class"), t("Excess °C"), t("Built %"), t("NDVI"), t("Distance to water")];
  const rows = order.map((k) => prof[k]).filter(Boolean).map((p) =>
    `<tr><td><span class="swatch" style="background:${CLASS_COLORS[p.class]}"></span>${t(p.class)}</td><td class="mono">${signed(p["excess_°C"], 2)}</td><td class="mono">${fmt(p["built_%"], 0)}</td><td class="mono">${fmt(p.NDVI, 2)}</td><td class="mono">${fmt(p.dist_to_water_m, 0)} m</td></tr>`).join("");
  $("class-table").innerHTML = `<thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody>`;

  $("robust-bars").innerHTML = r.robustness.map((x) => `
    <div class="fbar"><div class="f-top"><span>${t(x.check)}</span><b>${fmt(x.jaccard_hotspots, 2)}</b></div>
    <div class="track"><div class="fill" style="width:${x.jaccard_hotspots * 100}%"></div></div></div>`).join("");
}

/* ---------- Surroundings ---------- */
function renderSurroundings() {
  const s = R.sur;
  const ci = (s.matched_year_block_uncertainty || []).find((x) => x.comparison === "original") || {};
  const used = s.usable_temperature_dates || {};
  $("s-gap").textContent = signed(s.equal_month_gap_change_c, 2);
  $("s-gap-ci").textContent = t("Interval {lo} to {hi}°C", { lo: fmt(ci.lower_c, 2), hi: signed(ci.upper_c, 2) });
  $("s-cells").textContent = `${s.nearby_cells} / ${s.control_cells}`;
  $("s-cells-note").textContent = t("Nearby / control 120 m cells");
  $("s-dates").textContent = `${used.before ?? "--"} / ${used.recent ?? "--"}`;
  $("s-dates-note").textContent = t("Before / recent summer dates");

  const months = s.monthly_results;
  const MONTH = { 6: "June", 7: "July", 8: "August", 9: "September" };
  legend($("month-legend"), [[t("Before period"), COLORS.blue], [t("Recent period"), COLORS.orange]]);
  charts.month = new Chart($("month-chart"), {
    type: "bar",
    data: {
      labels: months.map((m) => t(MONTH[m.month])),
      datasets: [
        { label: t("Before period"), data: months.map((m) => m.before_gap_c), backgroundColor: COLORS.blue, borderRadius: 4 },
        { label: t("Recent period"), data: months.map((m) => m.recent_gap_c), backgroundColor: COLORS.orange, borderRadius: 4 },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { title: { display: true, text: t("Nearby minus control (°C)") }, grid: { color: (c) => (c.tick.value === 0 ? "rgba(255,255,255,0.25)" : COLORS.grid) } }, x: { grid: { display: false } } },
      plugins: { tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${signed(c.raw, 2)}°C` } } },
    },
  });

  const NAMES = { original: "Main comparison", matched_optical_history: "Matched surface history", matched_optical_and_recent_cover: "Matched history and land cover" };
  const all = s.matched_year_block_uncertainty || [];
  const lo = Math.min(...all.map((x) => x.lower_c), 0) - 0.2, hi = Math.max(...all.map((x) => x.upper_c)) + 0.2;
  const pos = (v) => ((v - lo) / (hi - lo)) * 100;
  $("ci-rows").innerHTML = all.map((x) => `
    <div class="ci-row">
      <div class="f-top"><span>${t(NAMES[x.comparison] || x.comparison)}</span><b class="mono">${signed(x.point_c, 2)}°C</b></div>
      <div class="ci-track"><span class="ci-zero" style="left:${pos(0)}%"></span>
        <span class="ci-bar" style="left:${pos(x.lower_c)}%;width:${pos(x.upper_c) - pos(x.lower_c)}%"></span>
        <span class="ci-dot" style="left:${pos(x.point_c)}%"></span></div>
      <div class="tiny">${fmt(x.lower_c, 2)} … ${signed(x.upper_c, 2)}°C</div>
    </div>`).join("");
  $("s-interpret").innerHTML = t("<b>How to read this:</b> the main interval crosses zero (the white line), so the nearby warming is not certain. These are observed gaps, not a measured effect of reclamation.");
}

/* ---------- Model ---------- */
function renderModel() {
  const s = R.sur;
  const ml = s.ml_validation || [];
  const get = (m, tst) => ml.find((x) => x.model === m && x.test === tst) || {};
  const best = get("Landsat+ERA5+Sentinel", "space"), date = get("Landsat+ERA5+Sentinel", "date"), base = get("training_median", "space");
  $("m-space").textContent = fmt(best.mae_c, 2);
  $("m-space-note").textContent = t("R² {r} · a simple baseline scores {b}°C", { r: fmt(best.r2, 2), b: fmt(base.mae_c, 2) });
  $("m-date").textContent = fmt(date.mae_c, 2);
  $("m-date-note").textContent = t("{n} withheld summer dates", { n: (s.ml_held_out_dates || []).length || date.dates });
  $("m-features").textContent = (s.ml_features || []).length;

  const models = [["training_median", "Simple baseline", COLORS.blue], ["Landsat", "Landsat", COLORS.orange], ["Landsat+ERA5", "+ ERA5 weather", COLORS.aqua], ["Landsat+ERA5+Sentinel", "+ Sentinel-2", COLORS.violet]];
  const tests = [["space", "Space"], ["date", "Date"], ["space_and_date", "Space and date"]];
  legend($("ml-legend"), models.map(([, label, c]) => [t(label), c]));
  charts.ml = new Chart($("ml-chart"), {
    type: "bar",
    data: {
      labels: tests.map(([, l]) => t(l)),
      datasets: models.map(([key, label, c]) => ({ label: t(label), data: tests.map(([tk]) => get(key, tk).mae_c ?? null), backgroundColor: c, borderRadius: 4, borderSkipped: "start" })),
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, title: { display: true, text: t("MAE (°C)") }, grid: { color: COLORS.grid } }, x: { grid: { display: false } } },
      plugins: { tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${fmt(c.raw, 2)}°C` } } },
    },
  });
}

/* ---------- Field visit ---------- */
function renderFieldVisit() {
  const s = R.sur;
  $("f-cells").textContent = s.review_priority_cells;
  $("f-area").textContent = t("{n} inspection area · 120 m cells", { n: s.candidate_inspection_areas });
  $("f-variants").textContent = (s.candidate_variant_comparison || []).length;
  $("f-supported").textContent = s.supported_nearby_cells;
}

/* ---------- Map ---------- */
let mapReady = false;
function initMap() {
  if (mapReady || !R) return;
  mapReady = true;
  const set = R.hot.settings, s = R.sur;
  const [w, so, e, n] = R.hot.study_bbox_lonlat;
  const el = $("map");
  try {
    const map = L.map(el).setView([(so + n) / 2, (w + e) / 2], 13);
    const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics", maxZoom: 18 });
    const dark = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19, className: "dark-tiles" });
    satellite.addTo(map);
    L.control.layers({ [t("Satellite")]: satellite, [t("Dark map")]: dark }, null, { position: "topright" }).addTo(map);
    L.rectangle([[so, w], [n, e]], { color: COLORS.brand, weight: 2, fillOpacity: 0.05, dashArray: "6 6" }).addTo(map).bindPopup(`<b>${t("Part 1 study area")}</b>`);
    if (s.focus_bbox) {
      const [fw, fs, fe, fn] = s.focus_bbox;
      L.rectangle([[fs, fw], [fn, fe]], { color: "#E8C45A", weight: 2, fillOpacity: 0.04 }).addTo(map).bindPopup(`<b>${t("Part 2 focus area")}</b>`);
    }
    const [clon, clat] = set.DIYAR_CENTRE;
    L.circle([clat, clon], { radius: set.DIYAR_RADIUS_M, color: "#F08A55", weight: 2, fillOpacity: 0.08 }).addTo(map)
      .bindPopup(`<b>${t("Diyar Al Muharraq")}</b><br>${t("Reclaimed area: {a} km²", { a: fmt(R.hot.results.diyar_reclaimed_area_km2, 1) })}<br>${t("Matched land gap: {v}°C", { v: summarizeResults(R).diyar_matched_land_gap_c == null ? "--" : signed(summarizeResults(R).diyar_matched_land_gap_c, 2) })}`);
    map.fitBounds([[so, w], [n, e]], { padding: [20, 20] });
    setTimeout(() => map.invalidateSize(), 200);
  } catch (err) {
    el.innerHTML = `<div class="map-fallback">${t("The map needs an internet connection to load.")}</div>`;
  }
  const kv = [
    [t("Site"), t(R.hot.site)],
    [t("Part 1 bounding box"), `${w}–${e}°E, ${so}–${n}°N`],
    [t("Projection"), R.hot.crs],
    [t("Summer window"), `${set.SUMMER[0]} → ${set.SUMMER[1]}`],
    [t("Recent temperature years"), `${set.LST_RECENT_YEARS[0]}–${set.LST_RECENT_YEARS.at(-1)}`],
    [t("Hotspot cell size"), `${set.CELL_M} m`],
    [t("Part 2 grid"), `${s.pixel_metres} m`],
    [t("Weather snapshot"), s.weather_snapshot],
  ];
  $("scene-kv").innerHTML = kv.map(([k, v]) => `<div class="kv"><span>${k}</span><span>${v}</span></div>`).join("");
}

/* ---------- Assistant ---------- */
function answer(question) {
  return sidraAnswer(question, summarizeResults(R));
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    R = await loadResults();
  } catch (err) {
    showLoadError($("main"));
    return;
  }
  document.querySelectorAll(".gallery img").forEach((img) => {
    const swap = () => { img.outerHTML = `<div class="placeholder">${t("Image not found in the results folder.")}</div>`; };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });
  renderOverview();
  renderHotspots();
  renderSurroundings();
  renderModel();
  renderFieldVisit();
  initChatWidget(() => summarizeResults(R), answer);
  initNav();
});
