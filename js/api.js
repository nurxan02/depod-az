// API base configuration (set this to your deployed backend origin)
// Example usage in browser console:
//   API.setBase('https://api.yourdomain.com');
(function () {
  // Determine base once and reuse everywhere with safer defaults
  function readMetaBase() {
    const el = document.querySelector('meta[name="depod-api-base"]');
    return el && el.content ? el.content.trim() : "";
  }
  

  function isLocalhostHost(h) {
    return h === "localhost" || h === "127.0.0.1";
  }

  function isSafeUrl(u) {
    try {
      const url = new URL(u);
      // Allow http only for localhost; require https otherwise
      if (!isLocalhostHost(url.hostname) && url.protocol !== "https:")
        return false;
      return true;
    } catch (_) {
      return false;
    }
  }

  // Base sources priority: window var -> meta tag -> localStorage (localhost) -> dev-friendly fallback -> same-origin
  let API_BASE =
    (typeof window !== "undefined" && window.DEPOD_API_BASE) ||
    readMetaBase() ||
    "";

  // Only honor localStorage override during localhost development
  if (!API_BASE && isLocalhostHost(location.hostname)) {
    const devOverride = localStorage.getItem("API_BASE");
    if (devOverride && isSafeUrl(devOverride)) {
      API_BASE = devOverride;
    }
  }

  // Dev-friendly default: if on localhost and non-8000 port (e.g., 5500), assume Django on 127.0.0.1:8000
  if (
    !API_BASE &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1") &&
    location.port &&
    location.port !== "8000"
  ) {
    API_BASE = "http://127.0.0.1:8000";
  }

  // Otherwise, if still empty and we are served via http(s), prefer same-origin
  if (!API_BASE && /^https?:$/.test(location.protocol)) {
    API_BASE = location.origin;
  }

  function apiUrl(path) {
    if (!API_BASE) return path; // when empty, relative (for dev fallback)
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${normalized}`;
  }

  async function fetchJson(url, opts = {}) {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      ...opts,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function listProducts(category = null) {
    const url = category
      ? apiUrl(`/api/products/?category=${encodeURIComponent(category)}`)
      : apiUrl("/api/products/");
    const data = await fetchJson(url);
    // DRF pagination support
    return Array.isArray(data) ? data : data.results || [];
  }

  async function getProduct(id) {
    return fetchJson(apiUrl(`/api/products/${encodeURIComponent(id)}/`));
  }

  async function listCategories() {
    const data = await fetchJson(apiUrl("/api/categories/"));
    return Array.isArray(data) ? data : data.results || [];
  }

  function setBase(url) {
    if (url && !isSafeUrl(url)) {
      console.warn("Rejected insecure API base (use https or localhost):", url);
      return;
    }
    API_BASE = url || "";
    // Persist only in localhost dev to avoid tampering in prod
    if (isLocalhostHost(location.hostname)) {
      if (url) localStorage.setItem("API_BASE", url);
      else localStorage.removeItem("API_BASE");
    }
  }

  // Dev-friendly default: if on localhost and nothing set, assume backend on 127.0.0.1:8000
  if (
    !API_BASE &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ) {
    setBase("http://127.0.0.1:8000");
  }

  window.API = {
    setBase,
    listProducts,
    getProduct,
    listCategories,
    _url: apiUrl,
  };
})();
