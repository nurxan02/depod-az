// Product Detail Page JavaScript

// Import products data from products.js
function getProductById(productId) {
  if (typeof PRODUCTS === "undefined") {
    console.error(
      "PRODUCTS is not defined. Make sure products.js is loaded first."
    );
    return null;
  }
  return PRODUCTS[productId] || null;
}

function getAllProducts() {
  if (typeof PRODUCTS === "undefined") {
    console.error(
      "PRODUCTS is not defined. Make sure products.js is loaded first."
    );
    return [];
  }
  return Object.values(PRODUCTS);
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("product-detail.html")) {
    initProductDetailPage();
  }
});

function initProductDetailPage() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "products.html";
    return;
  }

  // Get product data
  const product = getProductById(productId);
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
  const categoryName = getCategoryName(product.category);
  breadcrumb.innerHTML = `
        <a href="index.html">Ana Səhifə</a>
        <span>/</span>
        <a href="products.html">Məhsullar</a>
        <span>/</span>
        <a href="products.html?category=${product.category}">${categoryName}</a>
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
    "24 saat batareya ömrü": "fas fa-battery-full",
    "28 saat batareya ömrü": "fas fa-battery-full",
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
    "Kompakt dizayn": "fas fa-mobile-alt",
    "Çoxlu cihaz dəstəyi": "fas fa-tablets",
    "Universal uyğunluq": "fas fa-plug",
    "Qorunma sistemi": "fas fa-shield-alt",
    "İkili USB port": "fa-brands fa-usb",
    "USB Type-C port": "fa-brands fa-usb",
    "LED indikator": "fas fa-lightbulb",
    "Orijinal dizayn": "fa-solid fa-star",
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
  loadRelatedProducts(product.category, product.id);
}

function loadRelatedProducts(category, currentProductId) {
  const relatedProductsGrid = document.getElementById("relatedProducts");
  if (!relatedProductsGrid) return;

  // Get all products and filter by category
  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4); // Show max 4 related products

  relatedProductsGrid.innerHTML = relatedProducts
    .map(
      (product) => `
        <div class="related-product-card">
            ${
              product.discount
                ? `<div class="small-discount-badge">-${product.discount}%</div>`
                : ""
            }
            <div class="related-product-image">
                <img src="${product.images.main}" alt="${
        product.name
      }" loading="lazy">
            </div>
            <div class="related-product-info">
                <h3 class="related-product-name">${product.name}</h3>
                <p class="product-description-short">${product.description}</p>
                
                <a href="product-detail.html?id=${
                  product.id
                }" class="related-product-link">
                    Ətraflı Bax
                </a>
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

function loadRelatedProducts(category, currentProductId) {
  const relatedProducts = getProductsByCategory(category)
    .filter((product) => product.id !== currentProductId)
    .slice(0, 3); // Show max 3 related products

  const relatedContainer = document.getElementById("relatedProducts");
  relatedContainer.innerHTML = relatedProducts
    .map(
      (product) => `
        <div class="related-product-card">
            <div class="related-product-image">
                <img src="${product.images.main}" alt="${product.name}">
                ${
                  product.discount > 0
                    ? `<div class="small-discount-badge">${product.discount}% OFF</div>`
                    : ""
                }
            </div>
            <div class="related-product-info">
                <h4 class="related-product-name">${product.name}</h4>
                <p class="product-description-short">${product.description}</p>
                <div class="related-product-price">

                </div>
                <a href="product-detail.html?id=${
                  product.id
                }" class="related-product-link">Bax</a>
            </div>
        </div>
    `
    )
    .join("");
}

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
    "car-charger": "Avtomobil Şarjı",
    charger: "Şarj Cihazı",
  };
  return categoryNames[category] || category;
}
