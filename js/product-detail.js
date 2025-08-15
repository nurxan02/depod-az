// Localhost API base logging
(function () {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("API base is", localStorage.getItem("API_BASE"));
  }
})();

// Product Detail Page JavaScript

// Import products data from products.js
async function getProductById(productId) {
  if (typeof PRODUCTS === "undefined") {
    console.error(
      "PRODUCTS is not defined. Make sure products.js is loaded first."
    );
    return null;
  }
  try {
    if (window.API) {
      // reuse map from products.js by calling global function if present
      if (typeof window.getProductById === "function") {
        // avoid recursion; call API directly instead
        const p = await window.API.getProduct(productId);
        // inline a small mapper (duplicated minimal) to avoid circular import
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          images: {
            main:
              p.main_image ||
              (p.images && p.images.find((i) => i.is_main)?.image) ||
              "",
            gallery: Array.isArray(p.images)
              ? p.images.map((i) => i.image)
              : [],
          },
          description: p.description || "",
          features: Array.isArray(p.features)
            ? p.features.map((f) => f.text)
            : [],
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
    }
  } catch (e) {
    console.warn("API getProduct failed, using local data:", e.message);
  }
  return PRODUCTS[productId] || null;
}

async function getAllProducts() {
  if (typeof PRODUCTS === "undefined") {
    console.error(
      "PRODUCTS is not defined. Make sure products.js is loaded first."
    );
    return [];
  }
  try {
    if (window.API) {
      const list = await window.API.listProducts();
      return list.map((p) => ({
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
        features: Array.isArray(p.features)
          ? p.features.map((f) => f.text)
          : [],
        specs: Array.isArray(p.specs)
          ? p.specs.reduce((acc, s) => {
              acc[s.label] = s.value;
              return acc;
            }, {})
          : {},
        highlights: Array.isArray(p.highlights)
          ? p.highlights.map((h) => ({ number: h.number, text: h.text }))
          : [],
      }));
    }
  } catch (e) {
    console.warn("API listProducts failed, using local data:", e.message);
  }
  return Object.values(PRODUCTS);
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("product-detail.html")) {
    initProductDetailPage();
  }
});

async function initProductDetailPage() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "products.html";
    return;
  }

  // Get product data
  const product = await getProductById(productId);
  if (!product) {
    window.location.href = "products.html";
    return;
  }

  // Populate product data
  populateProductData(product);
  setupTabs();
  setupImageGallery();
  loadRelatedProducts(product.category, product.id);
}

function populateProductData(product) {
  // Update page title
  document.title = `${product.name} - Depod`;
  document.getElementById("pageTitle").textContent = `${product.name} - Depod`;

  // Populate breadcrumb
  const breadcrumb = document.getElementById("breadcrumb");
  const categoryName = (function () {
    if (typeof getCategoryName === "function") {
      return getCategoryName(product.category);
    }
    // minimal inline fallback using global map or plain text
    if (
      product &&
      typeof product.category === "object" &&
      product.category.name
    ) {
      return product.category.name;
    }
    if (window.CATEGORY_NAME_MAP && typeof product.category === "string") {
      return window.CATEGORY_NAME_MAP[product.category] || product.category;
    }
    return typeof product.category === "string"
      ? product.category
      : product.category?.key || "Kategoriya";
  })();
  const categoryKeyForLink = (function () {
    const c = product.category;
    if (c && typeof c === "object") return c.key || c.id || "";
    return c || "";
  })();

  breadcrumb.innerHTML = `
        <a href="index.html">Ana Səhifə</a>
        <span>/</span>
        <a href="products.html">Məhsullar</a>
        <span>/</span>
        <a href="products.html?category=${categoryKeyForLink}">${categoryName}</a>
        <span>/</span>
        <span class="active">${product.name}</span>
    `;

  // Populate product name
  document.getElementById("productName").textContent = product.name;

  // ...existing code...

  // Populate main image
  const mainImage = document.getElementById("mainProductImage");
  mainImage.src = product.images.main;
  mainImage.alt = product.name;

  // Populate thumbnails
  const thumbnails = document.getElementById("productThumbnails");
  thumbnails.innerHTML = product.images.gallery
    .map(
      (image, index) => `
        <img src="${image}" alt="${product.name} ${index + 1}" 
             class="thumbnail ${index === 0 ? "active" : ""}" 
             onclick="changeMainImage('${image}', this)">
    `
    )
    .join("");

  // Populate highlights
  const highlights = document.getElementById("productHighlights");
  highlights.innerHTML = product.highlights
    .map(
      (highlight) => `
        <div class="highlight-badge">
            <span class="highlight-number">${highlight.number}</span>
            <span class="highlight-text">${highlight.text}</span>
        </div>
    `
    )
    .join("");

  // Populate description
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("detailedDescription").textContent =
    product.description;

  // Populate features
  const featuresList = document.getElementById("productFeatures");
  featuresList.innerHTML = product.features
    .map(
      (feature) => `
        <li><span class="feature-checkmark">✓</span> ${feature}</li>
    `
    )
    .join("");

  // Populate features grid for overview tab
  const featuresGrid = document.getElementById("featuresGrid");

  // Define feature icons mapping
  const featureIcons = {
    "24 saat batareya ömrü": "fa-solid fa-battery-full",
    "28 saat batareya ömrü": "fa-solid fa-battery-full",
    "20 saat batareya ömrü": "fa-solid fa-battery-full",
    "Bluetooth 5.0 texnologiyası": "fab fa-bluetooth-b",
    "IPX4 su davamlılığı": "fas fa-tint",
    "IPX5 su davamlılığı": "fas fa-tint",
    "Active noise cancellation": "fas fa-volume-mute",
    "Noise cancellation": "fas fa-volume-mute",
    "Ambient ses rejimi": "fas fa-volume-up",
    "Touch control": "fas fa-hand-pointer",
    "Wireless charging": "fas fa-charging-station",
    "Sürətli şarj": "fas fa-bolt",
    "15W sürətli şarj": "fas fa-bolt",
    "15W maksimum güc": "fas fa-bolt",
    "20W maksimum güc": "fas fa-bolt",
    "10000mAh tutum": "fas fa-battery-three-quarters",
    "USB-C və Lightning": "fas fa-plug",
    "LED göstərici": "fas fa-lightbulb",
    "LED ekran": "fas fa-lightbulb",
    "Kompakt dizayn": "fas fa-mobile-alt",
    "Çoxlu cihaz dəstəyi": "fas fa-tablets",
    "Universal uyğunluq": "fas fa-plug",
    "Qorunma sistemi": "fas fa-shield-alt",
    "Təhlükəsizlik sistemi": "fas fa-shield-alt",
    "İkili USB port": "fa-brands fa-usb",
    "Çoxlu port dəstəyi": "fa-brands fa-usb",
    "USB Type-C port": "fa-brands fa-usb",
    "LED indikator": "fas fa-lightbulb",
    "Orijinal dizayn": "fa-solid fa-star",
    "Auto pairing": "fa-solid fa-link",
    "Ergonomik dizayn": "fa-solid fa-heart",
  };

  featuresGrid.innerHTML = product.features
    .map((feature) => {
      const iconClass = featureIcons[feature] || "fas fa-check";
      return `
        <div class="feature-card">
            <span class="feature-text">${feature}</span>
            <div class="feature-icon"><i class="${iconClass}"></i></div>
        </div>
        `;
    })
    .join("");

  // Populate specs
  const specsTable = document.getElementById("specsTable");
  specsTable.innerHTML = Object.entries(product.specs)
    .map(
      ([key, value]) => `
        <div class="spec-row">
            <span class="spec-label">${key}</span>
            <span class="spec-value">${value}</span>
        </div>
    `
    )
    .join("");

  // Load related products
  loadRelatedProducts(
    typeof product.category === "object"
      ? product.category.key || product.category.id
      : product.category,
    product.id
  );
}

async function loadRelatedProducts(category, currentProductId) {
  const relatedProductsGrid = document.getElementById("relatedProducts");
  if (!relatedProductsGrid) return;

  // Prefer category-scoped fetch; fallback to all products
  let list = [];
  try {
    if (typeof getProductsByCategory === "function") {
      list = await getProductsByCategory(category);
    } else {
      list = await getAllProducts();
    }
  } catch (e) {
    list = await getAllProducts();
  }

  const catKey =
    typeof category === "object" ? category.key || category.id : category;
  const relatedProducts = list
    .filter(
      (p) =>
        (typeof p.category === "object"
          ? p.category.key || p.category.id
          : p.category) === catKey && p.id !== currentProductId
    )
    .slice(0, 4);

  relatedProductsGrid.innerHTML = relatedProducts
    .map(
      (product) => `
        <div class="related-product-card">
           
            <div class="related-product-image">
                <img src="${product.images.main}" alt="${
        product.name
      }" loading="lazy">
            </div>
            <div class="related-product-info">
                            <div class="product-category">${getCategoryName(
                              product.category
                            )}</div>
                <h3 class="related-product-name">${product.name}</h3>
                <p class="product-description-short">${product.description}</p>
                <a href="product-detail.html?id=${
                  product.id
                }" class="related-product-link">Ətraflı Bax</a>
            </div>
        </div>
    `
    )
    .join("");
}

function setupTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      // Remove active class from all tabs and panels
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      // Add active class to clicked tab and corresponding panel
      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });
}

function setupImageGallery() {
  // Image gallery is already set up in populateProductData
  // This function can be extended for advanced gallery features
}

function changeMainImage(imageSrc, thumbnailElement) {
  // Update main image
  document.getElementById("mainProductImage").src = imageSrc;

  // Update active thumbnail
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb) => thumb.classList.remove("active"));
  thumbnailElement.classList.add("active");
}

// (Removed duplicate loadRelatedProducts definition)

// Quantity controls
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  const maxValue = parseInt(quantityInput.max);

  if (currentValue < maxValue) {
    quantityInput.value = currentValue + 1;
  }
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  const minValue = parseInt(quantityInput.min);

  if (currentValue > minValue) {
    quantityInput.value = currentValue - 1;
  }
}

// Cart functions (placeholder for e-commerce functionality)
function addToCart() {
  const quantity = parseInt(document.getElementById("quantity").value);
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = getProductById(productId);

  // Simulate adding to cart
  showNotification(
    `${product.name} səbətə əlavə edildi! Miqdar: ${quantity}`,
    "success"
  );

  // Here you would typically:
  // 1. Add to localStorage cart
  // 2. Update cart UI
  // 3. Send to backend if available
}

function buyNow() {
  const quantity = parseInt(document.getElementById("quantity").value);
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = getProductById(productId);

  // Simulate buy now
  showNotification(`${product.name} sifarişi işlənməyə göndərildi!`, "success");

  // Here you would typically:
  // 1. Redirect to checkout
  // 2. Process immediate purchase
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">&times;</button>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Show with animation
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function closeNotification(closeBtn) {
  const notification = closeBtn.parentElement;
  notification.classList.remove("show");
  setTimeout(() => notification.remove(), 300);
}

// Get category display name (reusing from products.js)
function getCategoryName(category) {
  const categoryNames = {
    earphone: "Qulaqlıqlar",
    powerbank: "Powerbank",
    "car-charger": "Avtomobil Aksesuarları",
    charger: "Şarj Cihazı",
  };
  return categoryNames[category] || category;
}
