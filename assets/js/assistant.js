/* =====================================================================
   Sidra Assistant
   - Free built-in assistant that answers from results/metrics.json (English + Arabic)
   - Voice input (speak your question) and read-aloud answers
   - Optional: connect an n8n webhook for AI answers (falls back to the built-in one)
   ===================================================================== */

// ---- Optional AI upgrade: paste your n8n "Production URL" between the quotes ----
const CHAT_WEBHOOK_URL = "";

const VOICE_LANG = { en: "en-US", ar: "ar-BH" };

/* ---------- Text helpers ---------- */
function normalizeText(s) {
  return ` ${String(s)
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")      // Arabic diacritics + tatweel
    .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}²%+.\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}
const fx = (n, d = 2) => Number(n).toFixed(d);

/* ---------- Knowledge base ----------
   Each topic: keywords (English + Arabic), the suggestion label, and a bilingual answer.
   Answers use the live numbers from metrics.json (M). */
const TOPICS = [
  {
    id: "tax",
    q: ["How much hotter did the new land get?", "كم ازدادت حرارة الأرض الجديدة؟"],
    kw: ["thermal tax", "tax", "how much hotter", "how hot", "difference", "warmer", "hotter than", "result", "finding", "change", "الضريبه الحراريه", "ضريبه", "الفرق", "كم ازدادت", "اكثر حراره", "النتيجه", "النتائج", "التغير"],
    a: (M) => [
      `At the same locations, Diyar's summer surface temperature rose by about ${fx(M.diyar_change_vs_sea_c, 1)}°C relative to open sea after it was built on the sea, compared with only ${fx(M.original_land_change_vs_sea_c, 1)}°C on original land. Today Diyar's median late-morning summer surface temperature is about ${fx(M.diyar_median_summer_lst_c, 1)}°C. This compares surface histories; on its own it doesn't prove cause.`,
      `في المواقع نفسها، ارتفعت حرارة سطح ديار المحرق صيفاً بنحو ${fx(M.diyar_change_vs_sea_c, 1)}°م مقارنة بالبحر المفتوح بعد بنائها فوق البحر، مقابل ${fx(M.original_land_change_vs_sea_c, 1)}°م فقط على الأرض الأصلية. واليوم يبلغ وسيط حرارة سطح ديار صيفاً قبل الظهر نحو ${fx(M.diyar_median_summer_lst_c, 1)}°م. هذه مقارنة بين تواريخ الأسطح، ولا تثبت السبب وحدها.`],
    next: ["why", "hotspots", "cause"],
  },
  {
    id: "why",
    q: ["Why is reclaimed land hotter?", "لماذا الأرض المستصلحة أكثر حرارة؟"],
    kw: ["why", "reason", "how come", "hotter", "heat up", "لماذا", "ليش", "ليه", "سبب", "تسخن"],
    a: () => [
      "Seawater is a natural heat sink: it absorbs the sun's energy, mixes it into deeper water and stays cool. Reclaimed land replaces it with sand, concrete and asphalt, which absorb sunlight, heat up quickly and release that heat into the air and the neighbourhoods built on top.",
      "مياه البحر مُبرِّد طبيعي: تمتص طاقة الشمس وتوزعها في الأعماق وتبقى باردة. أما الأرض المستصلحة فتستبدلها بالرمل والخرسانة والأسفلت، وهي أسطح تمتص أشعة الشمس وتسخن بسرعة ثم تطلق الحرارة في الهواء وفي الأحياء المبنية فوقها."],
    next: ["coast", "hotspots", "reduce"],
  },
  {
    id: "cause",
    q: ["Did reclamation cause the heat?", "هل الاستصلاح هو سبب الحرارة؟"],
    kw: ["cause", "caused", "causal", "prove", "proof", "because of reclamation", "responsible", "يسبب", "سببت", "اثبات", "يثبت", "السبب"],
    a: () => [
      "Not proven yet. Our comparisons are observational: they show that reclaimed locations warmed far more relative to the sea than original land did, but sensors changed over the decades and control areas may have developed too. Ground measurements, material checks and monitored interventions are needed to isolate the effect of reclamation.",
      "لم يثبت ذلك بعد. مقارناتنا قائمة على الملاحظة: تُظهر أن المواقع المستصلحة سخنت أكثر بكثير مقارنة بالبحر من الأرض الأصلية، لكن أجهزة الاستشعار تغيرت عبر العقود وقد تكون مناطق المقارنة تطورت أيضاً. نحتاج إلى قياسات ميدانية وفحص للمواد ومراقبة للتدخلات لعزل أثر الاستصلاح."],
    next: ["limits", "fieldvisit", "tax"],
  },
  {
    id: "hotspots",
    q: ["Where are the hotspots?", "أين النقاط الساخنة؟"],
    kw: ["hotspot", "hotspots", "hot spot", "hottest", "where is it hottest", "gi*", "getis", "zone", "zones", "persistent", "النقاط الساخنه", "نقاط ساخنه", "الاكثر حراره", "مناطق ساخنه", "بؤر", "البؤر", "بؤره", "البؤر الحراريه", "بؤر حراريه", "النقاط الحاره"],
    a: (M) => [
      `Inside Diyar, ${fx(M.persistent_hotspot_ha, 0)} ha form persistent hotspots in ${M.hotspot_zones} zones: 90 m cells that are in the hottest 10% on at least half of the summer dates, found with the Getis–Ord Gi* statistic. About ${fx(M.stable_hotspot_ha, 0)} ha stay hot under every robustness check. See the Hotspots tab for the map.`,
      `داخل ديار، تشكّل ${fx(M.persistent_hotspot_ha, 0)} هكتاراً نقاطاً ساخنة دائمة في ${M.hotspot_zones} مناطق: خلايا بحجم 90 م تقع ضمن أحر 10% في نصف التواريخ الصيفية على الأقل، وحُددت بإحصاء Getis–Ord Gi*. ونحو ${fx(M.stable_hotspot_ha, 0)} هكتاراً تبقى ساخنة في كل اختبارات الثبات. شاهد الخريطة في تبويب النقاط الساخنة.`],
    next: ["fieldvisit", "coast", "reduce"],
  },
  {
    id: "coast",
    q: ["Does the sea cool the coast?", "هل يبرّد البحر الساحل؟"],
    kw: ["shore", "shoreline", "coast", "coastal", "near the water", "sea breeze", "distance from", "الشاطئ", "الساحل", "قرب البحر", "نسيم", "المسافه من"],
    a: (M) => [
      `Yes. Land within 30 m of the water is about ${fx(M.shoreline_cooling_0_30m_c, 1)}°C cooler than Diyar's interior (more than 450 m from water), and the cooling fades within roughly 150–200 m. That's a useful design hint: keeping water channels and open shorelines brings cooling further inland.`,
      `نعم. الأرض على بُعد 30 م من الماء أبرد بنحو ${fx(M.shoreline_cooling_0_30m_c, 1)}°م من داخل ديار (على بُعد أكثر من 450 م من الماء)، ويتلاشى هذا التبريد خلال نحو 150–200 م. وهذا مؤشر مفيد للتصميم: الإبقاء على قنوات المياه والشواطئ المفتوحة يوصل التبريد إلى الداخل.`],
    next: ["reduce", "hotspots", "tax"],
  },
  {
    id: "surround",
    q: ["Did nearby neighbourhoods get warmer?", "هل أصبحت الأحياء المجاورة أكثر حرارة؟"],
    kw: ["nearby", "surrounding", "neighbourhood", "neighborhood", "existing land", "old areas", "muharraq town", "control", "المجاوره", "الاحياء", "المحيطه", "القديمه", "الاراضي القائمه"],
    a: (M) => [
      `Possibly, but it's not certain. The gap between nearby existing land (${M.nearby_cells} cells) and control land further away (${M.control_cells} cells) grew by about ${fx(M.nearby_gap_change_c, 2)}°C between the earlier and recent summers. The resampling interval runs from ${fx(M.nearby_gap_interval_c[0], 2)} to ${fx(M.nearby_gap_interval_c[1], 2)}°C, which includes zero.`,
      `ربما، لكن ليس مؤكداً. اتسع الفرق بين الأراضي القائمة القريبة (${M.nearby_cells} خلية) وأراضي المقارنة الأبعد (${M.control_cells} خلية) بنحو ${fx(M.nearby_gap_change_c, 2)}°م بين الصيف السابق والحديث. ويمتد نطاق عدم اليقين من ${fx(M.nearby_gap_interval_c[0], 2)} إلى ${fx(M.nearby_gap_interval_c[1], 2)}°م، أي أنه يشمل الصفر.`],
    next: ["cause", "accuracy", "limits"],
  },
  {
    id: "fieldvisit",
    q: ["Where should we inspect?", "أين يجب أن نفحص ميدانياً؟"],
    kw: ["inspect", "inspection", "field visit", "site visit", "visit", "shortlist", "priority", "candidate", "where should", "فحص", "زياره", "ميداني", "الاولويه", "المرشحه", "اين نذهب", "field", "field team", "on site", "check on", "نزور", "الزياره الميدانيه", "الفريق الميداني", "وين نروح"],
    a: (M) => [
      `The model shortlists ${M.priority_cells} cells of 120 m (${M.inspection_areas} inspection area) that were repeatedly warmer than predicted. The selection was checked across 13 model and control choices. On site, check surface materials, shade, vegetation and air flow before choosing interventions. See the Field visit tab.`,
      `يرشّح النموذج ${M.priority_cells} خلايا بحجم 120 م (منطقة فحص واحدة) كانت أكثر حرارة من المتوقع بشكل متكرر. وقد تم التحقق من هذا الاختيار عبر 13 خياراً للنموذج ومناطق المقارنة. في الموقع، افحص مواد الأسطح والظل والغطاء النباتي وحركة الهواء قبل اختيار التدخلات. شاهد تبويب الزيارة الميدانية.`],
    next: ["reduce", "hotspots", "model"],
  },
  {
    id: "reduce",
    q: ["How can we reduce the heat?", "كيف نخفف الحرارة؟"],
    kw: ["reduce", "cool", "cooler", "lower", "mitigate", "solution", "recommend", "advice", "what should", "improve", "intervention", "تخفيف", "نخفف", "تقليل", "تبريد", "ابرد", "حل", "حلول", "توصيه", "نصيحه", "انصح", "تدخل"],
    a: () => [
      "Common, well-established ways to cool new land are: more trees and shaded green space, keeping open water channels so sea breezes reach further inland (our data shows strong cooling near the shore), light-coloured reflective roofs and paving, and street layouts that let breezes through. Start with the hotspot zones and the field-visit shortlist, and measure before and after any change.",
      "من الطرق المعروفة لتبريد الأراضي الجديدة: زيادة الأشجار والمساحات الخضراء المظللة، والإبقاء على قنوات مياه مفتوحة ليصل نسيم البحر إلى الداخل (تُظهر بياناتنا تبريداً قوياً قرب الشاطئ)، واستخدام أسقف وأرصفة فاتحة اللون عاكسة للحرارة، وتخطيط شوارع يسمح بمرور النسيم. ابدأ بمناطق النقاط الساخنة وقائمة الفحص الميداني، وقِس قبل أي تغيير وبعده."],
    next: ["fieldvisit", "coast", "hotspots"],
  },
  {
    id: "uhi",
    q: ["What is an urban heat island?", "ما هي الجزيرة الحرارية الحضرية؟"],
    kw: ["heat island", "uhi", "urban heat", "الجزيره الحراريه", "جزر حراريه", "جزيره حراريه"],
    a: () => [
      "An urban heat island is an area that is noticeably hotter than its surroundings because of buildings, paving and a lack of vegetation and water. Sidra studies the surface version of this effect with satellite thermal data.",
      "الجزيرة الحرارية الحضرية منطقة أكثر حرارة بشكل واضح من محيطها بسبب المباني والأرصفة وقلة الغطاء النباتي والمياه. تدرس سدرة هذا الأثر على مستوى السطح باستخدام البيانات الحرارية من الأقمار الصناعية."],
    next: ["why", "tax", "reduce"],
  },
  {
    id: "accuracy",
    q: ["How accurate is the model?", "ما مدى دقة النموذج؟"],
    kw: ["accurate", "accuracy", "reliable", "trust", "r2", "r²", "mae", "error", "score", "how good", "performance", "دقه", "دقيق", "موثوق", "نثق", "اداء", "خطا"],
    a: (M) => [
      `On areas it never saw (spatial blocks), the model's mean absolute error is about ${fx(M.model_space_mae_c, 2)}°C; on withheld summer dates it's about ${fx(M.model_date_mae_c, 2)}°C. A simple baseline that just predicts the median scores about 1.9°C on the spatial test, so the model clearly adds skill. It's used to screen cells, not to measure cooling.`,
      `على مناطق لم يرها من قبل (كتل مكانية)، يبلغ متوسط الخطأ المطلق للنموذج نحو ${fx(M.model_space_mae_c, 2)}°م، وعلى تواريخ صيفية محجوبة نحو ${fx(M.model_date_mae_c, 2)}°م. أما خط الأساس البسيط الذي يتوقع الوسيط فقط فيسجل نحو 1.9°م في الاختبار المكاني، لذا فالنموذج يضيف قيمة واضحة. يُستخدم لفرز الخلايا لا لقياس التبريد.`],
    next: ["validation", "model", "limits"],
  },
  {
    id: "validation",
    q: ["How did you validate it?", "كيف تحققتم من النموذج؟"],
    kw: ["validate", "validation", "test", "tested", "split", "cross-validation", "held out", "withheld", "تحقق", "اختبار", "التحقق", "تقسيم"],
    a: () => [
      "Nearby pixels and dates are very similar, so a random split would be too optimistic. Instead we withhold whole spatial blocks (space), whole summer dates (date), both together, and all of 2025 (forward year). The hotspot results were also re-run with different neighbourhood sizes, periods and thresholds.",
      "البكسلات والتواريخ المتقاربة متشابهة جداً، لذا فإن التقسيم العشوائي سيكون متفائلاً أكثر من اللازم. بدلاً من ذلك نحجب كتلاً مكانية كاملة (المكان)، وتواريخ صيفية كاملة (التاريخ)، والاثنين معاً، وكل عام 2025 (السنة اللاحقة). كما أُعيد حساب النقاط الساخنة بأحجام جوار وفترات وعتبات مختلفة."],
    next: ["accuracy", "model", "limits"],
  },
  {
    id: "model",
    q: ["Which model do you use?", "ما النموذج الذي تستخدمونه؟"],
    kw: ["which model", "machine learning", "algorithm", "gradient boosting", "boosting", "random forest", "ai model", "features", "تعلم الاله", "خوارزميه", "النموذج المستخدم", "الذكاء الاصطناعي", "المتغيرات"],
    a: (M) => [
      `A histogram gradient-boosting model (seed 42) predicts recent surface temperature on control land from ${M.model_features} inputs: Landsat indices, Sentinel-2 indices, distance to the historical coast, season, sensor, and ERA5 weather (air temperature, dew point, wind, radiation, rain). Cells that are repeatedly warmer than predicted are shortlisted for inspection.`,
      `نموذج تعزيز التدرج بالمدرجات التكرارية (البذرة 42) يتوقع حرارة السطح الحديثة على أراضي المقارنة من ${M.model_features} متغيراً: مؤشرات لاندسات وسنتينل-2، والمسافة عن الساحل التاريخي، والموسم، ونوع المستشعر، وطقس ERA5 (حرارة الهواء، نقطة الندى، الرياح، الإشعاع، المطر). وتُرشّح الخلايا التي تكون أكثر حرارة من المتوقع بشكل متكرر للفحص.`],
    next: ["accuracy", "validation", "fieldvisit"],
  },
  {
    id: "ndvi",
    q: ["What is NDVI?", "ما هو NDVI؟"],
    kw: ["ndvi", "vegetation index", "مؤشر الغطاء النباتي"],
    a: () => [
      "NDVI measures vegetation: (NIR − Red) / (NIR + Red). Values near +1 mean dense healthy plants; near 0 or below means bare ground, buildings or water. Diyar's hotspot cells have an NDVI of only about 0.04, which means almost no vegetation.",
      "مؤشر NDVI يقيس الغطاء النباتي: (NIR − Red) / (NIR + Red). القيم القريبة من +1 تعني نباتات كثيفة، والقريبة من 0 أو أقل تعني أرضاً جرداء أو مباني أو ماء. خلايا النقاط الساخنة في ديار قيمة NDVI فيها نحو 0.04 فقط، أي شبه انعدام للنباتات."],
    next: ["mndwi", "ndbi", "hotspots"],
  },
  {
    id: "ndbi",
    q: ["What is NDBI?", "ما هو NDBI؟"],
    kw: ["ndbi", "built-up index", "built up index", "مؤشر البناء", "مؤشر المباني"],
    a: () => [
      "NDBI highlights built-up surfaces using short-wave infrared: (SWIR − NIR) / (SWIR + NIR). One caution: it also responds to bare sand, which is common on new reclaimed land, so we combine it with annual land-cover maps.",
      "مؤشر NDBI يبرز الأسطح المبنية باستخدام الأشعة تحت الحمراء قصيرة الموجة: (SWIR − NIR) / (SWIR + NIR). لكنه يتأثر أيضاً بالرمل المكشوف الشائع في الأراضي المستصلحة الجديدة، لذلك نجمعه مع خرائط الغطاء الأرضي السنوية."],
    next: ["ndvi", "mndwi", "data"],
  },
  {
    id: "mndwi",
    q: ["How do you detect new land?", "كيف تكتشفون الأرض الجديدة؟"],
    kw: ["mndwi", "water index", "detect land", "new land", "detect reclamation", "outline", "مؤشر المياه", "اكتشاف", "الارض الجديده", "حدود"],
    a: (M) => [
      `With MNDWI, an optical water index: (Green − SWIR) / (Green + SWIR), positive over water. We take annual medians from Landsat (1998–2025) and Sentinel-2, then find pixels that changed from water to land. Diyar's reclaimed outline covers about ${fx(M.reclaimed_area_km2, 1)} km², with reclamation starting around ${M.reclamation_start_year}.`,
      `باستخدام MNDWI، وهو مؤشر بصري للمياه: (Green − SWIR) / (Green + SWIR)، وقيمته موجبة فوق الماء. نأخذ الوسيط السنوي من لاندسات (1998–2025) وسنتينل-2، ثم نحدد البكسلات التي تحولت من ماء إلى يابسة. تبلغ مساحة الأرض المستصلحة في ديار نحو ${fx(M.reclaimed_area_km2, 1)} كم²، وبدأ الاستصلاح نحو عام ${M.reclamation_start_year}.`],
    next: ["reclaim", "tax", "data"],
  },
  {
    id: "lst",
    q: ["How do you measure temperature?", "كيف تقيسون الحرارة؟"],
    kw: ["lst", "land surface temperature", "measure temperature", "thermal band", "measure heat", "how do you measure", "درجه حراره السطح", "تقيسون", "قياس الحراره", "النطاق الحراري", "كيف تقيس"],
    a: () => [
      "We use Landsat Collection 2 Level-2 surface temperature from June–September, with quality masks (clouds, shadows, and an ST_QA uncertainty of at most 3 K). It's late-morning ground temperature, not air temperature or how hot people feel. Each date is compared with the median temperature of open sea.",
      "نستخدم حرارة السطح من لاندسات المجموعة 2 المستوى 2 للفترة من يونيو إلى سبتمبر، مع أقنعة الجودة (الغيوم والظلال وعدم يقين ST_QA لا يتجاوز 3 كلفن). إنها حرارة الأرض قبل الظهر، وليست حرارة الهواء أو ما يشعر به الناس. ويُقارن كل تاريخ بوسيط حرارة البحر المفتوح."],
    next: ["data", "resolution", "limits"],
  },
  {
    id: "data",
    q: ["What data do you use?", "ما البيانات التي تستخدمونها؟"],
    kw: ["data", "dataset", "satellite", "source", "scene", "sentinel", "landsat", "era5", "weather", "land cover", "بيانات", "قمر", "اقمار", "مصدر", "مصادر", "صور", "سنتينل", "لاندسات", "الطقس"],
    a: (M) => [
      `Four open sources: Landsat Collection 2 Level-2 (USGS; ${M.summer_scenes_before} earlier and ${M.summer_scenes_recent} recent summer scenes in Part 1), Sentinel-2 Level-2A (ESA Copernicus), the annual 10 m land-cover map from Impact Observatory, and ERA5 hourly weather from Copernicus C3S. All are accessed through Microsoft Planetary Computer or public mirrors, with no API keys.`,
      `أربعة مصادر مفتوحة: لاندسات المجموعة 2 المستوى 2 (هيئة المسح الجيولوجي الأمريكية؛ ${M.summer_scenes_before} صورة صيفية سابقة و${M.summer_scenes_recent} حديثة في الجزء الأول)، وسنتينل-2 المستوى 2A (كوبرنيكوس)، وخريطة الغطاء الأرضي السنوية بدقة 10 م من Impact Observatory، وبيانات الطقس الساعية ERA5 من كوبرنيكوس. وكلها متاحة عبر Microsoft Planetary Computer أو مرايا عامة دون مفاتيح.`],
    next: ["whysat", "lst", "resolution"],
  },
  {
    id: "whysat",
    q: ["Why use satellites?", "لماذا الأقمار الصناعية؟"],
    kw: ["why satellite", "why satellites", "weather station", "sensors on the ground", "لماذا الاقمار", "ليش الاقمار", "محطات الطقس", "حساسات"],
    a: () => [
      "Satellites cover whole islands at once, and Landsat goes back to the 1990s, before Diyar existed, so we can compare before and after. The data is free and open, and the method can be repeated for any coastline. Weather stations only measure a few points.",
      "تغطي الأقمار الصناعية جزراً كاملة دفعة واحدة، ويعود أرشيف لاندسات إلى التسعينيات قبل وجود ديار، لذا يمكن المقارنة بين ما قبل وما بعد. البيانات مجانية ومفتوحة، ويمكن تكرار المنهجية لأي ساحل. أما محطات الطقس فتقيس نقاطاً قليلة فقط."],
    next: ["data", "elsewhere", "how"],
  },
  {
    id: "resolution",
    q: ["What resolution is the data?", "ما دقة البيانات؟"],
    kw: ["resolution", "pixel", "cell size", "30 m", "90 m", "120 m", "meter", "الدقه المكانيه", "بكسل", "متر", "حجم الخليه"],
    a: () => [
      "Landsat products are distributed at 30 m, but the thermal sensor's native resolution is 100–120 m. So hotspots are mapped on 90 m cells and Part 2 uses a 120 m grid, matching the older thermal sensor. Sentinel-2 adds 10 m detail on vegetation and surfaces. Near the shoreline, thermal pixels mix land and water.",
      "تُوزَّع منتجات لاندسات بدقة 30 م، لكن الدقة الأصلية للمستشعر الحراري 100–120 م. لذلك تُرسم النقاط الساخنة على خلايا 90 م ويستخدم الجزء الثاني شبكة 120 م بما يناسب المستشعر الحراري الأقدم. ويضيف سنتينل-2 تفاصيل بدقة 10 م عن النباتات والأسطح. وقرب الشاطئ تختلط بكسلات الحرارة بين اليابسة والماء."],
    next: ["limits", "lst", "data"],
  },
  {
    id: "area",
    q: ["Where is the study area?", "أين منطقة الدراسة؟"],
    kw: ["where", "area", "location", "diyar", "muharraq", "map", "place", "bbox", "coordinates", "اين", "وين", "منطقه", "موقع", "ديار", "المحرق", "خريطه", "احداثيات"],
    a: (M) => [
      `Diyar Al Muharraq, one of Bahrain's largest reclamation projects, north-east of Muharraq. Its reclaimed outline covers about ${fx(M.reclaimed_area_km2, 1)} km². See it on satellite imagery in the Map View tab.`,
      `ديار المحرق، أحد أكبر مشاريع الاستصلاح في البحرين، شمال شرق المحرق. تبلغ مساحة أرضها المستصلحة نحو ${fx(M.reclaimed_area_km2, 1)} كم². شاهدها على صور الأقمار الصناعية في تبويب الخريطة.`],
    next: ["reclaim", "hotspots", "data"],
  },
  {
    id: "reclaim",
    q: ["What is land reclamation?", "ما هو استصلاح الأراضي؟"],
    kw: ["what is reclamation", "land reclamation", "reclamation mean", "what is land reclamation", "artificial island", "how is new land made", "when was diyar built", "استصلاح الاراضي", "ما هو الاستصلاح", "ردم البحر", "جزر صناعيه", "ما هو استصلاح", "متي بنيت"],
    a: (M) => [
      `Land reclamation creates new land by filling in shallow sea with sand and rock. Bahrain uses it widely to make room for homes and growth. From satellite water history, Diyar's reclamation started around ${M.reclamation_start_year}.`,
      `استصلاح الأراضي هو إنشاء أرض جديدة بردم البحر الضحل بالرمل والصخور. تستخدمه البحرين على نطاق واسع لتوفير مساحات للسكن والنمو. ومن تاريخ المياه في صور الأقمار الصناعية، بدأ استصلاح ديار نحو عام ${M.reclamation_start_year}.`],
    next: ["tax", "mndwi", "area"],
  },
  {
    id: "who",
    q: ["Who is Sidra for?", "لمن صُممت سدرة؟"],
    kw: ["who is it for", "who is this for", "who is sidra for", "for who", "for whom", "target", "who uses", "who would use", "user", "planner", "ministry", "developer", "لمن", "المستخدم", "المخطط", "المخططين", "الوزاره", "المطور", "البلديه"],
    a: () => [
      "Coastal developers, municipalities and the Ministry of Works, Municipalities Affairs and Urban Planning: the people who plan new land and decide where to invest in shade, greenery and cooling. Sidra shows them where heat concentrates and where to inspect first.",
      "المطورون الساحليون والبلديات ووزارة الأشغال وشؤون البلديات والتخطيط العمراني، أي من يخططون للأراضي الجديدة ويقررون أين يستثمرون في الظل والتشجير والتبريد. تُظهر لهم سدرة أين تتركز الحرارة وأين يبدأ الفحص."],
    next: ["different", "fieldvisit", "vision"],
  },
  {
    id: "different",
    q: ["What makes Sidra different?", "ما الذي يميز سدرة؟"],
    kw: ["what makes", "different from", "unique", "special", "advantage", "why sidra", "better than", "يميز", "مميز", "الفرق عن", "ميزه", "افضل من"],
    a: () => [
      "Sidra uses three decades of free satellite data on Bahrain's own coast, checks every result for robustness (different neighbourhoods, periods, controls and held-out tests), states its uncertainty honestly, and ends with a concrete shortlist of places to inspect, not just a heat map.",
      "تستخدم سدرة ثلاثة عقود من بيانات الأقمار الصناعية المجانية على سواحل البحرين نفسها، وتختبر ثبات كل نتيجة (أحجام جوار وفترات ومناطق مقارنة واختبارات محجوبة مختلفة)، وتعرض حدود اليقين بصراحة، وتنتهي بقائمة محددة لأماكن الفحص، لا مجرد خريطة حرارية."],
    next: ["who", "how", "validation"],
  },
  {
    id: "how",
    q: ["How does Sidra work?", "كيف تعمل سدرة؟"],
    kw: ["how does", "how it works", "how do you", "method", "methodology", "pipeline", "steps", "process", "approach", "كيف تعمل", "كيف يعمل", "المنهجيه", "الطريقه", "الخطوات", "طريقه العمل"],
    a: () => [
      "Two parts. Part 1 (reclaimed land): find water-to-land changes with MNDWI, compare summer temperatures with open sea before and after, then map persistent hotspots with Getis–Ord Gi*. Part 2 (surrounding land): compare nearby and control land over time with quality-masked Landsat data, then use a validated model to shortlist cells for a field visit.",
      "جزءان. الجزء الأول (الأرض المستصلحة): تحديد التحول من ماء إلى يابسة بمؤشر MNDWI، ومقارنة حرارة الصيف بالبحر المفتوح قبل وبعد، ثم رسم النقاط الساخنة الدائمة بإحصاء Getis–Ord Gi*. الجزء الثاني (الأراضي المحيطة): مقارنة الأراضي القريبة وأراضي المقارنة عبر الزمن ببيانات لاندسات بعد أقنعة الجودة، ثم استخدام نموذج مُختبر لترشيح خلايا للزيارة الميدانية."],
    next: ["data", "hotspots", "surround"],
  },
  {
    id: "limits",
    q: ["What are the limitations?", "ما حدود المشروع؟"],
    kw: ["limitation", "limitations", "weakness", "drawback", "honest", "problem with", "حدود", "قيود", "عيوب", "نقاط الضعف"],
    a: () => [
      "Landsat measures late-morning surface temperature, not air temperature or pedestrian heat stress. Historical and recent sensors aren't harmonised; thermal pixels are coarse (~100–120 m) and mix land and water near the shore; control areas may have developed; and annual land-cover maps only start in 2017. These comparisons can't isolate the effect of reclamation on their own.",
      "يقيس لاندسات حرارة السطح قبل الظهر، لا حرارة الهواء أو الإجهاد الحراري للمشاة. أجهزة الاستشعار القديمة والحديثة غير متناسقة تماماً، وبكسلات الحرارة خشنة (~100–120 م) وتختلط بين اليابسة والماء قرب الشاطئ، وقد تكون مناطق المقارنة تطورت، وخرائط الغطاء الأرضي السنوية تبدأ من 2017 فقط. ولا تستطيع هذه المقارنات وحدها عزل أثر الاستصلاح."],
    next: ["improve", "cause", "accuracy"],
  },
  {
    id: "improve",
    q: ["What's next for Sidra?", "ما الخطوة التالية لسدرة؟"],
    kw: ["next", "what's next", "next steps", "future", "roadmap", "plan", "upcoming", "الخطوات القادمه", "القادمه", "التالي", "المستقبل", "خارطه الطريق", "الخطه"],
    a: () => [
      "Next: visit the shortlisted area with ground temperature sensors and material checks, harmonise historical and recent sensors, test interventions such as shading and greening with before-and-after monitoring, and repeat the method on other reclamation projects like Madinat Salman. Hyperspectral data could later help identify roofing and paving materials.",
      "الخطوات القادمة: زيارة المنطقة المرشحة بأجهزة قياس حرارة ميدانية وفحص المواد، ومواءمة أجهزة الاستشعار القديمة والحديثة، واختبار تدخلات مثل التظليل والتشجير مع مراقبة قبلها وبعدها، وتكرار المنهجية على مشاريع استصلاح أخرى مثل مدينة سلمان. وقد تساعد البيانات فائقة الطيف لاحقاً في تحديد مواد الأسقف والأرصفة."],
    next: ["fieldvisit", "elsewhere", "limits"],
  },
  {
    id: "elsewhere",
    q: ["Can it work for other places?", "هل يمكن تطبيقها في أماكن أخرى؟"],
    kw: ["other places", "elsewhere", "other country", "gulf", "scale", "repeat", "anywhere", "madinat salman", "اماكن اخري", "دول", "الخليج", "تطبيق", "تكرار", "مكان اخر", "مدينه سلمان"],
    a: () => [
      "Yes. Sidra uses free global satellite data and open-source Python, so the same notebooks can be pointed at another coastline by changing the study settings. Part 2 already repeats its comparison on other coastal patches as a check.",
      "نعم. تستخدم سدرة بيانات فضائية عالمية مجانية وبايثون مفتوح المصدر، لذا يمكن توجيه الدفاتر نفسها إلى ساحل آخر بتغيير إعدادات الدراسة. والجزء الثاني يكرر المقارنة بالفعل على مقاطع ساحلية أخرى كاختبار."],
    next: ["whysat", "improve", "cost"],
  },
  {
    id: "cost",
    q: ["Is it free to use?", "هل استخدامها مجاني؟"],
    kw: ["cost", "free", "price", "paid", "open source", "license", "licence", "مجاني", "تكلفه", "سعر", "مفتوح المصدر", "رخصه"],
    a: () => [
      "Yes. All the data is open (Landsat is public domain; Sentinel-2, ERA5 and the land-cover maps have open licences), the code is open-source Python, and no account or API key is needed.",
      "نعم. كل البيانات مفتوحة (لاندسات ملكية عامة، وسنتينل-2 وERA5 وخرائط الغطاء الأرضي برخص مفتوحة)، والكود مفتوح المصدر بلغة بايثون، ولا حاجة إلى حساب أو مفتاح API."],
    next: ["data", "elsewhere", "team"],
  },
  {
    id: "vision",
    q: ["How does it fit Bahrain's plans?", "كيف تتوافق مع خطط البحرين؟"],
    kw: ["vision 2030", "vision", "bahrain plan", "afforestation", "net zero", "sdg", "sustainab", "smart cit", "رؤيه 2030", "رؤيه", "التشجير", "الحياد الكربوني", "الاستدامه", "مستدام", "المدن الذكيه"],
    a: () => [
      "Sidra supports Bahrain Economic Vision 2030's focus on sustainable growth, the National Afforestation Plan (by showing where shade and greenery are most needed), Bahrain's Net Zero by 2060 pledge, and UN SDG 11 on sustainable cities. It fits the hackathon's Theme 05: Sustainable Urban Planning & Smart Cities.",
      "تدعم سدرة تركيز رؤية البحرين الاقتصادية 2030 على النمو المستدام، والخطة الوطنية للتشجير (بإظهار أين تشتد الحاجة إلى الظل والخضرة)، وتعهد البحرين بالحياد الكربوني بحلول 2060، وهدف التنمية المستدامة 11. وتندرج ضمن المحور 05 للهاكاثون: التخطيط العمراني المستدام والمدن الذكية."],
    next: ["who", "reduce", "different"],
  },
  {
    id: "report",
    q: ["How do I get a report?", "كيف أحصل على تقرير؟"],
    kw: ["report", "pdf", "download", "export", "print", "تقرير", "تحميل", "طباعه"],
    a: () => [
      "Click 'Generate report' at the top of the dashboard. Your browser's print window opens; choose 'Save as PDF'.",
      "اضغط «إنشاء تقرير» أعلى لوحة البيانات. ستفتح نافذة الطباعة في المتصفح؛ اختر «حفظ كملف PDF»."],
    next: ["hotspots", "area", "tax"],
  },
  {
    id: "team",
    q: ["Who built Sidra?", "من صنع سدرة؟"],
    kw: ["team", "who made", "who built", "who are you", "creator", "aubh", "university", "الفريق", "فريق", "من صنع", "من انتم", "الجامعه"],
    a: () => [
      `Sidra was built by Team Sidra at the American University of Bahrain: ${TEAM.map((m) => m.name).join(", ")}.`,
      `أعدّ سدرة فريق سدرة في الجامعة الأمريكية في البحرين: ${TEAM.map((m) => t(m.name)).join("، ")}.`],
    next: ["name", "who", "how"],
  },
  {
    id: "name",
    q: ["Why the name Sidra?", "لماذا اسم سدرة؟"],
    kw: ["name", "called", "sidr", "tree name", "why sidra name", "اسم سدره", "لماذا اسم", "ليش اسم", "الاسم", "اسم", "السدر", "تسميه", "سميت"],
    a: () => [
      "Sidra is named after the sidr tree (Ziziphus spina-christi), one of Bahrain's most loved native trees. It thrives in extreme heat with little water and has given shade for generations. We want Bahrain's new islands to be just as resilient.",
      "سُمّيت سدرة على اسم شجرة السدر، من أحب الأشجار المحلية في البحرين. تزدهر في الحر الشديد وقلة الماء، ووفّرت الظل لأجيال. نريد لجزر البحرين الجديدة أن تكون بالصمود نفسه."],
    next: ["team", "tax", "who"],
  },
  {
    id: "help",
    q: ["What can you help with?", "بماذا تساعدني؟"],
    kw: ["help", "what can you", "what do you know", "options", "menu", "ساعدني", "مساعده", "ماذا تعرف", "بماذا"],
    a: () => [
      "I can explain our findings (heat change vs the sea, hotspots, shoreline cooling, nearby neighbourhoods), the method (MNDWI, Gi*, validation, the model), the data sources, the limitations and the field-visit shortlist. You can also tap the microphone and ask by voice.",
      "يمكنني شرح نتائجنا (تغير الحرارة مقارنة بالبحر، والنقاط الساخنة، وتبريد الشاطئ، والأحياء المجاورة)، والمنهجية (MNDWI وGi* والتحقق والنموذج)، ومصادر البيانات، والحدود، وقائمة الفحص الميداني. ويمكنك أيضاً الضغط على الميكروفون وطرح سؤالك بالصوت."],
    next: ["tax", "hotspots", "how"],
  },
  {
    id: "hi",
    q: ["Hello!", "مرحباً!"],
    kw: ["hi", "hello", "hey", "salam", "good morning", "good evening", "مرحبا", "السلام", "اهلا", "هلا", "صباح الخير", "مساء الخير"],
    a: () => ["Hi! 👋 I'm Sidra. Ask me how much hotter the new land got, where the hotspots are, or what to inspect first.", "أهلاً! 👋 أنا سدرة. اسألني كم ازدادت حرارة الأرض الجديدة، أو أين النقاط الساخنة، أو ماذا نفحص أولاً."],
    next: ["tax", "hotspots", "help"],
  },
  {
    id: "thanks",
    q: ["Thanks!", "شكراً!"],
    kw: ["thank", "thanks", "great", "awesome", "شكرا", "مشكور", "يعطيك العافيه", "ممتاز", "رائع"],
    a: () => ["You're welcome! 🌳 Anything else you'd like to know?", "العفو! 🌳 هل تود معرفة شيء آخر؟"],
    next: ["reduce", "fieldvisit", "improve"],
  },
];
const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((tp) => [tp.id, tp]));
const DEFAULT_SUGGESTIONS = ["tax", "hotspots", "coast", "surround", "fieldvisit"];

function matchTopic(question) {
  const q = normalizeText(question);
  let best = null, bestScore = 0;
  for (const tp of TOPICS) {
    let score = 0;
    for (const k of tp.kw) {
      const nk = normalizeText(k).trim();
      if (!nk) continue;
      // whole-word match for short keywords, substring for longer phrases
      const hit = nk.length <= 3 ? q.includes(` ${nk} `) : q.includes(nk);
      if (hit) score += 1 + nk.split(" ").length * 0.6 + nk.length / 20;
    }
    if (score > bestScore) { bestScore = score; best = tp; }
  }
  return best;
}

/* Returns { text, next: [topic ids] } */
function sidraAnswer(question, M, extra = {}) {
  const ar = typeof isAR !== "undefined" && isAR;
  if (!M) return { text: ar ? "ما زلت أحمّل النتائج. حاول بعد لحظة." : "I'm still loading the results. Try again in a second.", next: [] };
  const tp = matchTopic(question);
  if (!tp) {
    return {
      text: ar
        ? "لم أجد إجابة دقيقة لهذا السؤال بعد. جرّب أحد هذه المواضيع، أو أعد صياغة سؤالك:"
        : "I don't have a precise answer to that yet. Try one of these topics, or rephrase your question:",
      next: ["tax", "hotspots", "how", "help"],
    };
  }
  const [en, arText] = tp.a(M, extra);
  return { text: ar ? arText : en, next: tp.next || [] };
}

/* ---------- Optional AI answers through n8n ---------- */
async function askWebhook(question, M, history) {
  if (!CHAT_WEBHOOK_URL) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lang: typeof LANG !== "undefined" ? LANG : "en", history: history.slice(-6), results: M }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    const data = type.includes("json") ? await res.json() : await res.text();
    const body = Array.isArray(data) ? data[0] : data;
    const reply = typeof body === "string" ? body : (body && (body.reply || body.output || body.text || body.answer));
    return reply ? String(reply).trim() : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Voice: speech-to-text and read aloud ---------- */
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
let speakReplies = false;
try { speakReplies = localStorage.getItem("sidra-speak") === "1"; } catch (e) { /* ignore */ }

function speak(text) {
  if (!speakReplies || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[🌳👋]/gu, ""));
  const lang = VOICE_LANG[typeof LANG !== "undefined" ? LANG : "en"];
  u.lang = lang;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
  if (voice) u.voice = voice;
  u.rate = 1.02;
  window.speechSynthesis.speak(u);
}

/* ---------- Chat UI ---------- */
function bindChat({ log, suggest, form, input, getM }, getAnswer) {
  const ar = typeof isAR !== "undefined" && isAR;
  const history = [];
  const add = (text, who) => {
    log.insertAdjacentHTML("beforeend", `<div class="msg ${who}"></div>`);
    log.lastElementChild.textContent = text;
    log.scrollTop = log.scrollHeight;
  };
  const setSuggestions = (ids) => {
    suggest.innerHTML = ids.map((id) => TOPIC_BY_ID[id]).filter(Boolean)
      .map((tp) => `<button type="button">${ar ? tp.q[1] : tp.q[0]}</button>`).join("");
    suggest.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
  };

  const ask = async (text) => {
    if (!text.trim()) return;
    add(text, "user");
    history.push({ role: "user", content: text });
    log.insertAdjacentHTML("beforeend", '<div class="msg bot typing"><span></span><span></span><span></span></div>');
    log.scrollTop = log.scrollHeight;
    const started = Date.now();

    let local = getAnswer(text);
    if (typeof local === "string") local = { text: local, next: [] };
    const ai = await askWebhook(text, getM ? getM() : null, history);
    const reply = ai || local.text;

    setTimeout(() => {
      log.querySelector(".typing")?.remove();
      add(reply, "bot");
      history.push({ role: "assistant", content: reply });
      setSuggestions(local.next && local.next.length ? local.next : DEFAULT_SUGGESTIONS);
      speak(reply);
    }, Math.max(0, 450 - (Date.now() - started)));
  };

  add(t("Hi! I'm Sidra 🌳 Ask me about our thermal-impact results, the data, or how planners use this platform."), "bot");
  setSuggestions(DEFAULT_SUGGESTIONS);
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });

  /* --- Microphone button --- */
  const sendBtn = form.querySelector('button[type="submit"]');
  const mic = document.createElement("button");
  mic.type = "button";
  mic.className = "mic-btn";
  mic.innerHTML = icon("mic", 17);
  mic.setAttribute("aria-label", ar ? "تحدث" : "Speak");
  mic.title = ar ? "اضغط وتحدث" : "Tap and speak";
  form.insertBefore(mic, sendBtn);

  if (!SpeechRec) {
    mic.disabled = true;
    mic.title = ar ? "الإدخال الصوتي يعمل في Chrome وEdge" : "Voice input works in Chrome and Edge";
  } else {
    let rec = null;
    mic.addEventListener("click", () => {
      if (rec) { rec.stop(); return; }
      rec = new SpeechRec();
      rec.lang = VOICE_LANG[typeof LANG !== "undefined" ? LANG : "en"];
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      const before = input.placeholder;
      input.placeholder = ar ? "أستمع إليك..." : "Listening...";
      mic.classList.add("listening");
      let finalText = "";
      rec.onresult = (ev) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) finalText += ev.results[i][0].transcript;
          else interim += ev.results[i][0].transcript;
        }
        input.value = (finalText + interim).trim();
      };
      rec.onerror = (ev) => {
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          add(ar ? "اسمح للمتصفح باستخدام الميكروفون ثم حاول مرة أخرى." : "Please allow microphone access in your browser, then try again.", "bot");
        }
      };
      rec.onend = () => {
        mic.classList.remove("listening");
        input.placeholder = before;
        rec = null;
        if (finalText.trim()) { ask(finalText.trim()); input.value = ""; }
      };
      rec.start();
    });
  }

  /* --- Read-aloud toggle --- */
  if ("speechSynthesis" in window) {
    const spk = document.createElement("button");
    spk.type = "button";
    spk.className = "mic-btn speak-btn";
    const paint = () => {
      spk.innerHTML = icon(speakReplies ? "volume" : "mute", 17);
      spk.classList.toggle("on", speakReplies);
      spk.title = speakReplies ? (ar ? "إيقاف القراءة الصوتية" : "Stop reading answers aloud") : (ar ? "قراءة الإجابات بصوت عالٍ" : "Read answers aloud");
      spk.setAttribute("aria-label", spk.title);
    };
    paint();
    spk.addEventListener("click", () => {
      speakReplies = !speakReplies;
      try { localStorage.setItem("sidra-speak", speakReplies ? "1" : "0"); } catch (e) { /* ignore */ }
      if (!speakReplies) window.speechSynthesis.cancel();
      paint();
    });
    form.insertBefore(spk, mic);
  }
}
