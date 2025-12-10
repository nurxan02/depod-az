// Footer dynamic loader: applies to any page that has the footer structure
(async function () {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  // Centralized API base (from api.js if available, else global)
  const apiBase =
    window.API && typeof window.API._url === "function"
      ? window.API._url("")
      : window.DEPOD_API_BASE || "";
  const apiRoot = (apiBase || "").replace(/\/$/, "");
  const FOOTER_URL = `${apiRoot}/api/footer/`;
  const CATEGORIES_URL = `${apiRoot}/api/categories/`;

  function qs(sel) {
    return document.querySelector(sel);
  }
  function isStr(v) {
    return typeof v === "string" && v.trim().length > 0;
  }
  function setText(selector, value, maxLength) {
    const el = qs(selector);
    if (!el || !isStr(value)) return;
    const val =
      maxLength && value.length > maxLength
        ? value.slice(0, maxLength) + "…"
        : value;
    el.textContent = val;
  }

  let data;
  try {
    const res = await fetch(FOOTER_URL);
    const json = await res.json();
    data =
      json && json.results
        ? json.results[0]
        : Array.isArray(json)
        ? json[0]
        : json;
  } catch (e) {
    console.error("Footer API fetch error:", e);
    return;
  }
  if (!data) return;
  // Description paragraph
  setText(".footer .footer-description", data.description, 300);
  // Right contact block
  // setText(".footer .footer-contact p:nth-child(1) a", data.email);
  // setText(".footer .footer-contact p:nth-child(2) a", data.phone);
  const contactInfo = document.querySelector(".footer-contact");
  contactInfo.innerHTML = `
              <p><a href="mailto:${data.email}">${data.email}</a></p>
              <p><a href="tel:${data.phone}">${data.phone}</a></p>
  `;
  // Bottom text (if present)
  const bottom = document.querySelector(".footer .footer-bottom p");
  if (bottom && isStr(data.bottom_text))
    bottom.firstChild &&
      (bottom.firstChild.textContent = data.bottom_text + " ");

  // Populate Products links from categories API (non-destructive fallback)
  try {
    const catRes = await fetch(CATEGORIES_URL);
    const catJson = await catRes.json();
    const cats =
      catJson && catJson.results
        ? catJson.results
        : Array.isArray(catJson)
        ? catJson
        : [];
    if (Array.isArray(cats) && cats.length) {
      // Find the footer section titled "Məhsullar"
      const sections = Array.from(
        document.querySelectorAll(".footer .footer-section")
      );
      const productsSection = sections.find((sec) => {
        const h4 = sec.querySelector(".footer-title");
        return h4 && /Məhsullar/i.test(h4.textContent || "");
      });
      if (productsSection) {
        const ul = productsSection.querySelector(".footer-links");
        if (ul) {
          ul.innerHTML = cats
            .map((c) => {
              const key = c.key || c.id || "";
              const name = c.name || key;
              if (!key) return "";
              return `<li><a href="products.html?category=${key}">${name}</a></li>`;
            })
            .join("");
        }
      }
    }
  } catch (e) {
    // keep static links
    console.warn("Footer categories load skipped:", e);
  }
})();
