// Localhost API base logging
(function () {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("API base is", localStorage.getItem("API_BASE"));
  }
})();

// Global category name map (key -> display name), filled from API when available
window.CATEGORY_NAME_MAP = window.CATEGORY_NAME_MAP || null;

// Prefetch categories early to ensure name lookups work on all pages
(async function prefetchCategoriesForNames() {
  if (!window.API) return;
  try {
    const cats = await window.API.listCategories();
    window.CATEGORY_NAME_MAP = Object.fromEntries(
      cats.map((c) => [c.key, c.name])
    );
  } catch (e) {
    // ignore; will fallback to static map below
  }
})();

// Product Database (local fallback)
const PRODUCTS = {
  "peak-black": {
    id: "peak-black",
    name: "Peak Black",
    category: "earphone",
    // price: 89.99,
    // originalPrice: 119.99,
    // discount: 25,
    images: {
      main: "image/material/earphone/png/peak-black.png",
      gallery: [
        "image/material/earphone/png/peak-black.png",
        "image/material/earphone/peak-black-tips.jpg",
        "image/material/earphone/peak-black-box.jpg",
      ],
    },
    description:
      "Mükəmməl səs keyfiyyəti və uzun batareya ömrü ilə Peak Black qulaqlıq",
    features: [
      "24 saat batareya ömrü",
      "Bluetooth 5.0 texnologiyası",
      "IPX4 su davamlılığı",
      "Noise cancellation",
      "Touch control",
      "Sürətli şarj",
    ],
    specs: {
      "Bluetooth Versiya": "5.0",
      "Batareya Ömrü": "24 saat (case ilə)",
      "Su Davamlılığı": "IPX4",
      Çəki: "45g",
      Rəng: "Qara",
      Mikrofon: "Daxili",
      "Şarj Portu": "USB-C",
    },
    highlights: [
      { number: "24h", text: "Batareya" },
      { number: "IPX4", text: "Suya Davamlı" },
      { number: "5.0", text: "Bluetooth" },
    ],
  },
  "peak-beige": {
    id: "peak-beige",
    name: "Peak Beige",
    category: "earphone",
    // price: 94.99,
    // originalPrice: 129.99,
    // discount: 27,
    images: {
      main: "image/material/earphone/png/peak-beige.png",
      gallery: [
        "image/material/earphone/png/peak-beige.png",
        "image/material/earphone/peak-beige-tips.jpg",
        "image/material/earphone/peak-beige-box.jpg",
      ],
    },
    description:
      "Premium dizayn və yüksək səs keyfiyyəti ilə Peak Beige qulaqlıq",
    features: [
      "28 saat batareya ömrü",
      "Bluetooth 5.0 texnologiyası",
      "IPX5 su davamlılığı",
      "Active noise cancellation",
      "Ambient ses rejimi",
      "Wireless charging",
    ],
    specs: {
      "Bluetooth Versiya": "5.0",
      "Batareya Ömrü": "28 saat (case ilə)",
      "Su Davamlılığı": "IPX5",
      Çəki: "42g",
      Rəng: "Bej",
      Mikrofon: "Daxili",
      "Şarj Portu": "USB-C + Wireless",
    },
    highlights: [
      { number: "28h", text: "Batareya" },
      { number: "IPX5", text: "Suya Davamlı" },
      { number: "ANC", text: "Noise Cancelation" },
    ],
  },
  "tws-001-white": {
    id: "tws-001-white",
    name: "TWS-001 White",
    category: "earphone",
    // price: 69.99,
    // originalPrice: 89.99,
    // discount: 22,
    images: {
      main: "image/material/earphone/TWS-001-white.jpg",
      gallery: [
        "image/material/earphone/TWS-001-white.jpg",
        "image/material/earphone/TWS-001-white-tips.jpg",
        "image/material/earphone/TWS-001-white-case.jpg",
        "image/material/earphone/TWS-001-white-perspective.jpg",
      ],
    },
    description: "Gündəlik istifadə üçün mükəmməl TWS-001 White qulaqlıq",
    features: [
      "20 saat batareya ömrü",
      "Bluetooth 5.0 texnologiyası",
      "IPX4 su davamlılığı",
      "Touch control",
      "Auto pairing",
      "Ergonomik dizayn",
    ],
    specs: {
      "Bluetooth Versiya": "5.0",
      "Batareya Ömrü": "20 saat (case ilə)",
      "Su Davamlılığı": "IPX4",
      Çəki: "48g",
      Rəng: "Ağ",
      Mikrofon: "Daxili",
      "Şarj Portu": "USB-C",
    },
    highlights: [
      { number: "20h", text: "Batareya" },
      { number: "IPX4", text: "Suya Davamlı" },
      { number: "48g", text: "Yüngül" },
    ],
  },
  "powerpack-15w": {
    id: "powerpack-15w",
    name: "PowerPack 15W",
    category: "powerbank",
    // price: 49.99,
    // originalPrice: 69.99,
    // discount: 29,
    images: {
      main: "image/material/earphone/powerpack-15w-white-perspective.jpg",
      gallery: [
        "image/material/earphone/powerpack-15w-white-perspective.jpg",
        "image/material/earphone/powerpack-15w-white.jpg",
        "image/material/earphone/powerpack-15w-white-leftside.jpg",
      ],
    },
    description: "Yüksək tutumlu və sürətli şarj imkanı ilə PowerPack 15W",
    features: [
      "10000mAh tutum",
      "15W sürətli şarj",
      "Çoxlu port dəstəyi",
      "LED ekran",
      "Təhlükəsizlik sistemi",
      "Universal uyğunluq",
    ],
    specs: {
      Tutum: "10000mAh",
      "Max Güc": "15W",
      Giriş: "5V/2A, 9V/2A",
      Çıxış: "5V/3A, 9V/2A, 12V/1.5A",
      Portlar: "USB-A, USB-C, Micro USB",
      Çəki: "250g",
      Ölçülər: "140 x 68 x 16mm",
    },
    highlights: [
      { number: "10000", text: "mAh Tutum" },
      { number: "15W", text: "Sürətli Şarj" },
      { number: "3", text: "Port" },
    ],
  },
  "charger-20w": {
    id: "charger-20w",
    name: "Charger 20W",
    category: "charger",
    // price: 24.99,
    // originalPrice: 34.99,
    // discount: 29,
    images: {
      main: "image/material/earphone/charger-20w.jpg",
      gallery: [
        "image/material/earphone/charger-20w.jpg",
        "image/material/earphone/charger-20w-back.jpg",
        "image/material/earphone/charger-20w-cable.jpg",
      ],
    },
    description: "Səyahət zamanı etibarlı enerji həlli Charger 20W",
    features: [
      "20W maksimum güc",
      "USB Type-C port",
      "Universal uyğunluq",
      "Orijinal dizayn",
      "Qorunma sistemi",
      "Kompakt dizayn",
    ],
    specs: {
      "Max Güc": "20W",
      Giriş: "12V-24V DC",
      Çıxış: "5V/3A, 9V/2A, 12V/1.25A",
      "Port Sayı": "1 USB-C",
      Protokollar: "QC3.0, PD",
      Çəki: "45g",
      Ölçülər: "65 x 32 x 32mm",
    },
    highlights: [
      { number: "20W", text: "Max Güc" },
      { number: "1", text: "USB-C Port" },
      { number: "12-24V", text: "Uyğunluq" },
    ],
  },
  "car-charger-15w": {
    id: "car-charger-15w",
    name: "Car Charger 15W",
    category: "car-charger",
    // price: 24.99,
    // originalPrice: 34.99,
    // discount: 29,
    images: {
      main: "image/material/earphone/car-15w.jpg",
      gallery: [
        "image/material/earphone/car-15w.jpg",
        "image/material/earphone/car-15w-top.jpg",
      ],
    },
    description: "Səyahət zamanı etibarlı enerji həlli Car Charger 15W",
    features: [
      "15W maksimum güc",
      "İkili USB port",
      "Universal uyğunluq",
      "LED indikator",
      "Qorunma sistemi",
      "Kompakt dizayn",
    ],
    specs: {
      "Max Güc": "15W",
      Giriş: "12V-24V DC",
      Çıxış: "5V/3A, 9V/2A, 12V/1.25A",
      "Port Sayı": "2 USB-A",
      Protokollar: "QC3.0, PD",
      Çəki: "45g",
      Ölçülər: "65 x 32 x 32mm",
    },
    highlights: [
      { number: "15W", text: "Max Güc" },
      { number: "2", text: "USB Port" },
      { number: "12-24V", text: "Uyğunluq" },
    ],
  },
};

// Map API product to frontend shape
function mapApiProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    images: {
      main:
        p.main_image ||
        (p.images && p.images.find((i) => i.is_main)?.image) ||
        "",
      gallery: Array.isArray(p.images) ? p.images.map((i) => i.image) : [],
    },
    description: p.description || "",
    features: Array.isArray(p.features) ? p.features.map((f) => f.text) : [],
    specs: Array.isArray(p.specs)
      ? p.specs.reduce((acc, s) => {
          acc[s.label] = s.value;
          return acc;
        }, {})
      : {},
    highlights: Array.isArray(p.highlights)
      ? p.highlights.map((h) => ({ number: h.number, text: h.text }))
      : [],
  };
}

// Get all products (prefers API)
async function getAllProducts() {
  try {
    const list = await window.API.listProducts();
    return list.map(mapApiProduct);
  } catch (e) {
    console.warn("API listProducts failed, using local data:", e.message);
    return Object.values(PRODUCTS);
  }
}

// Get products by category
async function getProductsByCategory(category) {
  if (category === "all") return getAllProducts();
  try {
    const list = await window.API.listProducts(category);
    return list.map(mapApiProduct);
  } catch (e) {
    return Object.values(PRODUCTS).filter(
      (product) => product.category === category
    );
  }
}

// Get single product by ID
async function getProductById(id) {
  try {
    const p = await window.API.getProduct(id);
    return mapApiProduct(p);
  } catch (e) {
    return PRODUCTS[id];
  }
}

// Render products grid
function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card-modern" data-category="${product.category}">
            
            <div class="product-image-container">
                <img src="${product.images.main}" alt="${
        product.name
      }" class="product-image">
                <div class="product-overlay">
                    <a href="product-detail.html?id=${
                      product.id
                    }" class="view-product-btn">Ətraflı Bax</a>
                </div>
            </div>
            <div class="product-info-modern">
                <div class="product-category">${getCategoryName(
                  product.category
                )}</div>
                 <h5 style="color: #757575ff;">Depod</h5><h3 class="product-name-modern">${
                   product.name
                 }</h3>
                <p class="product-description-short">${product.description}</p>
                <div class="product-price-container">

                </div>
                <a href="product-detail.html?id=${
                  product.id
                }" class="product-link-btn">Ətraflı Məlumat</a>
            </div>
        </div>
    `
    )
    .join("");
}

// Render star rating
// Get category display name
function getCategoryName(category) {
  // If object with name (defensive), prefer it
  if (category && typeof category === "object") {
    if (category.name) return category.name;
    if (
      category.key &&
      window.CATEGORY_NAME_MAP &&
      window.CATEGORY_NAME_MAP[category.key]
    ) {
      return window.CATEGORY_NAME_MAP[category.key];
    }
  }

  // Prefer dynamic map loaded from API (covers new categories without code changes)
  if (window.CATEGORY_NAME_MAP && typeof category === "string") {
    const name = window.CATEGORY_NAME_MAP[category];
    if (name) return name;
  }

  // Fallback to static mapping for known defaults
  const categoryNames = {
    earphone: "Qulaqlıqlar",
    powerbank: "Powerbank",
    "car-charger": "Avtomobil Aksesuarları",
    charger: "Şarj Cihazı",
  };
  return categoryNames[category] || category;
}

// Initialize products page
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("products.html")) {
    initProductsPage();
  }
});

async function initProductsPage() {
  // Get category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "all";

  // Render dynamic filters from API categories (fallback to static map)
  await renderFilters(category);

  // Load products
  const products = await getProductsByCategory(category);
  renderProducts(products);

  // Wire filter clicks (buttons are created in renderFilters)
}

async function renderFilters(activeKey) {
  const container = document.querySelector(".filter-tabs");
  if (!container) return;

  // Fetch categories from API
  let categories = [];
  try {
    categories = await window.API.listCategories(); // expects [{id,key,name}]
    // Update global map for consistent naming across pages
    window.CATEGORY_NAME_MAP = Object.fromEntries(
      categories.map((c) => [c.key, c.name])
    );
  } catch (e) {
    // fallback to static mapping keys used in getCategoryName
    categories = [
      { key: "earphone", name: getCategoryName("earphone") },
      { key: "powerbank", name: getCategoryName("powerbank") },
      { key: "charger", name: getCategoryName("charger") },
      { key: "car-charger", name: getCategoryName("car-charger") },
    ];
  }

  // Build buttons: All + categories
  const html = [
    `<button class="filter-btn ${
      activeKey === "all" ? "active" : ""
    }" data-category="all">Hamısı</button>`,
    ...categories.map(
      (c) => `
      <button class="filter-btn ${
        activeKey === c.key ? "active" : ""
      }" data-category="${c.key}">
        ${c.name}
      </button>
    `
    ),
  ].join("\n");

  container.innerHTML = html;

  // Add click handlers
  const filterBtns = container.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const selectedCategory = btn.getAttribute("data-category");

      // Update active states
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Load and render
      const filteredProducts = await getProductsByCategory(selectedCategory);
      renderProducts(filteredProducts);

      // Update URL
      const newUrl =
        selectedCategory === "all"
          ? "products.html"
          : `products.html?category=${selectedCategory}`;
      window.history.pushState({}, "", newUrl);
    });
  });
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PRODUCTS,
    getAllProducts,
    getProductsByCategory,
    getProductById,
  };
}
