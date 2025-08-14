// Product Database
const PRODUCTS = {
  "peak-black": {
    id: "peak-black",
    name: "Peak Black",
    category: "earphone",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
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
      { number: "IPX4", text: "Su Davamlı" },
      { number: "5.0", text: "Bluetooth" },
    ],
  },
  "peak-beige": {
    id: "peak-beige",
    name: "Peak Beige",
    category: "earphone",
    price: 94.99,
    originalPrice: 129.99,
    discount: 27,
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
      { number: "IPX5", text: "Su Davamlı" },
      { number: "ANC", text: "Noise Cancel" },
    ],
  },
  "tws-001-white": {
    id: "tws-001-white",
    name: "TWS-001 White",
    category: "earphone",
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
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
      { number: "IPX4", text: "Su Davamlı" },
      { number: "48g", text: "Yüngül" },
    ],
  },
  "powerpack-15w": {
    id: "powerpack-15w",
    name: "PowerPack 15W",
    category: "powerbank",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
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
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
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
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
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

// Get all products
function getAllProducts() {
  return Object.values(PRODUCTS);
}

// Get products by category
function getProductsByCategory(category) {
  if (category === "all") return getAllProducts();
  return Object.values(PRODUCTS).filter(
    (product) => product.category === category
  );
}

// Get single product by ID
function getProductById(id) {
  return PRODUCTS[id];
}

// Render products grid
function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card-modern" data-category="${product.category}">
            ${
              product.discount > 0
                ? `<div class="discount-badge">${product.discount}% OFF</div>`
                : ""
            }
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
                <h3 class="product-name-modern">${product.name}</h3>
                <p class="product-description-short">${product.description}</p>
                <div class="product-price-container">
                    <span class="current-price">$${product.price}</span>
                    ${
                      product.originalPrice
                        ? `<span class="original-price">$${product.originalPrice}</span>`
                        : ""
                    }
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
  const categoryNames = {
    earphone: "Qulaqlıqlar",
    powerbank: "Powerbank",
    "car-charger": "Avtomobil Şarjı",
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

function initProductsPage() {
  // Get category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "all";

  // Load products
  const products = getProductsByCategory(category);
  renderProducts(products);

  // Set active filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active");
    }
  });

  // Add filter event listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-category");

      // Update active filter
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter products
      const filteredProducts = getProductsByCategory(selectedCategory);
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
