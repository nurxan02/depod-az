// Contact page dynamic loader (non-destructive)
(async function () {
  const API_BASE = window.DEPOD_API_BASE || "http://127.0.0.1:8000";
  const API_URL = API_BASE.replace(/\/$/, "") + "/api/contact/";

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
  function updateList(containerSel, itemSel, arr, apply) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    const container = qs(containerSel);
    if (!container) return;
    const items = Array.from(container.querySelectorAll(itemSel));
    const n = Math.min(items.length, arr.length);
    for (let i = 0; i < n; i++) apply(items[i], arr[i], i);
    for (let i = n; i < items.length; i++) items[i].style.display = "none";
  }

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
    console.error("Contact API fetch error:", e);
    return;
  }
  if (!data) return;

  // Hero
  setText(".contact-title", data.hero_title);
  setText(".contact-subtitle", data.hero_subtitle, 200);

  // Contact info grid
  // Emails
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(1) p:nth-of-type(1)",
    data.email_primary
  );
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(1) p:nth-of-type(2)",
    data.email_secondary
  );
  // Phones
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(2) p:nth-of-type(1)",
    data.phone_primary
  );
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(2) p:nth-of-type(2)",
    data.phone_secondary
  );
  // Address lines
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(3) p:nth-of-type(1)",
    data.address_line1
  );
  setText(
    ".contact-info .contact-grid .contact-item:nth-child(3) p:nth-of-type(2)",
    data.address_line2
  );

  // Working hours (4th card)
  updateList(
    ".contact-info .contact-grid .contact-item:nth-child(4)",
    "p",
    data.working_hours,
    (p, wh, idx) => {
      // Keep original line breaks; map label/time into two <p> blocks
      if (idx === 0) {
        p.innerHTML = `${wh.label}: <br/>${wh.time}`;
      } else {
        p.innerHTML = `${wh.label}: <br/>${wh.time}`;
      }
    }
  );

  // Form copy
  setText(".contact-form-section .form-content h2", data.form_title);
  setText(".contact-form-section .form-content p", data.form_text, 300);

  // Sidebar support
  setText(".form-sidebar .sidebar-item:nth-child(1) h3", data.support_title);
  setText(".form-sidebar .sidebar-item:nth-child(1) p", data.support_text, 200);
  const supportLink = qs(
    ".form-sidebar .sidebar-item:nth-child(1) .support-link"
  );
  if (supportLink && isStr(data.support_phone)) {
    supportLink.href = `tel:${data.support_phone.replace(/\s+/g, "")}`;
    supportLink.lastChild &&
      (supportLink.lastChild.textContent = ` ${data.support_phone}`);
  }

  // Sidebar catalog teaser
  setText(".form-sidebar .sidebar-item:nth-child(2) h3", data.catalog_title);
  setText(".form-sidebar .sidebar-item:nth-child(2) p", data.catalog_text, 160);
  const catalogLink = qs(
    ".form-sidebar .sidebar-item:nth-child(2) .catalog-link"
  );
  if (catalogLink && isStr(data.catalog_link))
    catalogLink.href = data.catalog_link;

  // FAQ list
  updateList(
    ".form-sidebar .sidebar-item:nth-child(3) .faq-list",
    ".faq-item",
    data.faqs,
    (item, f) => {
      const h4 = item.querySelector("h4");
      const p = item.querySelector("p");
      if (h4 && isStr(f.question)) h4.textContent = f.question;
      if (p && isStr(f.answer)) p.textContent = f.answer;
    }
  );

  // Map
  setText(".map-section .section-title", data.map_section_title);
  setText(".map-section .map-content h3", data.map_heading);
  setText(".map-section .map-content p", data.map_address, 160);
  const mapBtn = qs(".map-section .map-btn");
  if (mapBtn && isStr(data.map_button_text))
    mapBtn.textContent = data.map_button_text;
  if (mapBtn && isStr(data.map_url))
    mapBtn.onclick = () => window.open(data.map_url, "_blank");
})();
