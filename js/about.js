// About page dynamic loader (non-destructive)
(async function () {
  // API endpoint (fallback to local backend if not provided)
  const API_BASE = window.DEPOD_API_BASE || "http://127.0.0.1:8000";
  const API_URL = API_BASE.replace(/\/$/, "") + "/api/about/";

  // Helpers
  const qs = (sel) => document.querySelector(sel);
  const isStr = (v) => typeof v === "string" && v.trim().length > 0;
  function setText(selector, value, maxLength) {
    const el = qs(selector);
    if (!el || !isStr(value)) return;
    const val =
      maxLength && value.length > maxLength
        ? value.slice(0, maxLength) + "…"
        : value;
    el.textContent = val;
  }
  function updateListNonDestructive(containerSel, itemSel, arr, apply) {
    if (!Array.isArray(arr) || arr.length === 0) return; // keep defaults
    const container = qs(containerSel);
    if (!container) return;
    const items = Array.from(container.querySelectorAll(itemSel));
    const n = Math.min(items.length, arr.length);
    for (let i = 0; i < n; i++) apply(items[i], arr[i], i);
    // hide extras if provided fewer than existing
    for (let i = n; i < items.length; i++) items[i].style.display = "none";
  }

  // Fetch data
  let data;
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    data =
      json && json.results
        ? json.results[0]
        : Array.isArray(json)
        ? json[0]
        : json;
  } catch (e) {
    console.error("About API fetch error:", e);
    return;
  }
  if (!data) return;

  // Hero
  setText(".about-title", data.title);
  setText(".about-subtitle", data.subtitle, 160);

  // Story
  setText(".company-story .story-content .story-text p.lead", data.story, 800);

  // Stats (update numbers only if present)
  if (data.experience_years != null)
    setText(
      ".story-stats .stat-item:nth-child(1) .stat-number",
      String(data.experience_years)
    );
  if (data.product_models != null)
    setText(
      ".story-stats .stat-item:nth-child(2) .stat-number",
      String(data.product_models)
    );
  if (data.happy_customers != null)
    setText(
      ".story-stats .stat-item:nth-child(3) .stat-number",
      String(data.happy_customers)
    );
  if (isStr(data.quality_rating))
    setText(
      ".story-stats .stat-item:nth-child(4) .stat-number",
      data.quality_rating
    );

  // Mission & Vision
  setText(".mission-vision .mv-item:nth-child(1) p", data.mission, 600);
  setText(".mission-vision .mv-item:nth-child(2) p", data.vision, 600);

  // Values
  updateListNonDestructive(
    ".values-grid",
    ".value-item",
    data.values,
    (item, v) => {
      const iconEl = item.querySelector(".value-icon i");
      if (iconEl && isStr(v.icon)) iconEl.className = v.icon;
      const h3 = item.querySelector("h3");
      const p = item.querySelector("p");
      if (h3 && isStr(v.title)) h3.textContent = v.title;
      if (p && isStr(v.text)) p.textContent = v.text;
    }
  );

  // Team
  updateListNonDestructive(
    ".team-grid",
    ".team-member",
    data.team,
    (item, m) => {
      const h3 = item.querySelector(".member-info h3");
      const p = item.querySelector(".member-info p");
      const span = item.querySelector(".member-info .member-detail");
      if (h3 && isStr(m.title)) h3.textContent = m.title;
      if (p && isStr(m.description)) p.textContent = m.description;
      if (span && isStr(m.detail)) span.textContent = m.detail;
    }
  );

  // Technology & Innovation
  setText(".technology .section-title", data.technology_title);
  setText(".technology .tech-text p", data.technology_text, 600);
  updateListNonDestructive(
    ".technology .tech-features",
    "li",
    data.technology_features,
    (li, txt) => {
      if (isStr(txt)) li.textContent = txt;
    }
  );
  updateListNonDestructive(
    ".technology .tech-stats",
    ".tech-stat",
    data.technology_stats,
    (item, s) => {
      const num = item.querySelector(".tech-number");
      const lab = item.querySelector(".tech-label");
      if (num && (isStr(s.number) || typeof s.number === "number"))
        num.textContent = String(s.number);
      if (lab && isStr(s.label)) lab.textContent = s.label;
    }
  );

  // Contact CTA
  setText(".contact-cta h2", data.contact_title);
  setText(".contact-cta p", data.contact_text, 300);

  // Footer moved to a global singleton via /api/footer/ and js/footer.js
})();
