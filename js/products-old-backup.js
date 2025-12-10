// Products data
const productsData = [
  {
    id: 1,
    name: "Deluxe Wooden Case Universal Gun Cleaning Kit",
    category: "Gun Cleaning",
    image:
      "images/products/deluxe-wooden-case-universal-gun-cleaning-kit-with-gun-rest-544209.jpg",
    description: "Universal cleaning kit with gun rest in premium wooden case.",
  },
  {
    id: 2,
    name: "Universal Gun Cleaning Kit Transparent Plastic Casing",
    category: "Gun Cleaning",
    image: "images/products/universal-transparent-plastic.jpg",
    description: "Professional universal supplies for all guns cleaning kit with transparent plastic casing.",
  },
  {
    id: 3,
    name: "Shotgun Cleaning Kit Orange Case Oil Bottle",
    category: "Gun Cleaning",
    image: "images/products/shotgun-cleaning-kit-orange-case-oil-bottle_40697.jpg",
    description: "Compact shotgun cleaning kit with oil bottle included.",
  },
  {
    id: 4,
    name: "Gun Cleaning Kit Rifle Kit",
    category: "Gun Cleaning",
    image: "images/products/gun-cleaning-kit-rifle.jpg",
    description: "Complete rifle cleaning kit with all essential tools.",
  },
  {
    id: 5,
    name: "Shotgun Cleaning Kit Big Size Orange Case",
    category: "Gun Cleaning",
    image: "images/products/shotgun-big-orange.jpg",
    description: "Large size universal gun cleaning kit with oil bottle.",
  },
  {
    id: 6,
    name: "Gun Cleaning Kit Bore Bronze Brush Transparent Case",
    category: "Gun Cleaning",
    image: "images/products/bronze-brush-transparent.jpg",
    description: "Hot sale gun cleaning kit with bore bronze brush in transparent orange strong case.",
  },
  {
    id: 7,
    name: "Gun Cleaning Kit Bronze Brush",
    category: "Gun Cleaning",
    image:
      "images/products/gun-cleaning-kit-bore-bronze-brush-transparent-orange-strong-case_77190.jpg",
    description: "Transparent orange case with bronze brushes.",
  },
  {
    id: 8,
    name: "Circular Running Bore Rope Snake",
    category: "Cleaning Brush",
    image:
      "images/products/circular-running-gun-cleaning-bore-rope-snake_190523.jpg",
    description: "Innovative circular running bore snake design.",
  },
  {
    id: 9,
    name: "Bore Snake with Extra Brush",
    category: "Cleaning Brush",
    image:
      "images/products/circular-running-gun-cleaning-bore-rope-snake-extra-brush_439478.jpg",
    description: "Enhanced cleaning with extra brush attachment.",
  },
  {
    id: 10,
    name: "Deluxe Aluminum Case Kit",
    category: "Gun Cleaning",
    image:
      "images/products/all-in-one-deluxe-aluminum-case-gun-cleaning-kit_334722.jpg",
    description: "All-in-one professional kit in aluminum case.",
  },
  {
    id: 11,
    name: "Tactical Bore Snake Wallet",
    category: "Tactical Gear",
    image:
      "images/products/oem-tactical-durable-polyester-zipper-wallet-keychain-hunting-accessories-bore-cleaning-rope-cleaning-snake-gun-cleaning-kit-559963.jpg",
    description: "Compact tactical wallet with bore snake.",
  },
  {
    id: 12,
    name: "Cotton Cleaning Patches",
    category: "Cleaning Brush",
    image:
      "images/products/white-cotton-square-and-round-cloth-gun-cleaning-pathces-high-absorbed_67356.jpg",
    description: "High-absorption cotton cleaning patches.",
  },
  {
    id: 13,
    name: "Gun Cleaning Wool Pellets",
    category: "Cleaning Brush",
    image:
      "images/products/gun-cleaning-wool-pellets-cylindrical-cases-screw-together-packed_737248.jpg",
    description: "Premium wool pellets in cylindrical case.",
  },
  {
    id: 14,
    name: "Universal Plastic Casing Kit",
    category: "Gun Cleaning",
    image:
      "images/products/universal-gun-cleaning-kit-big-size-green-plastic-case_772203.jpg",
    description:
      "Professional universal supplies for all guns with transparent plastic casing.",
  },
  {
    id: 15,
    name: "Compact Rifle Cleaning Kit",
    category: "Gun Cleaning",
    image:
      "images/products/shotgun-cleaning-kit-orange-case-oil-bottle_40697.jpg",
    description: "Compact rifle kit with essential cleaning tools.",
  },
  {
    id: 16,
    name: "Big Orange Case Shotgun Kit",
    category: "Gun Cleaning",
    image:
      "images/products/gun-cleaning-kit-bore-bronze-brush-transparent-orange-strong-case_77190.jpg",
    description: "Big size orange case for shotgun maintenance.",
  },
  {
    id: 17,
    name: "Multilayer Bore Snake Pack",
    category: "Cleaning Brush",
    image:
      "images/products/circular-running-gun-cleaning-bore-rope-snake_190523.jpg",
    description: "Gun cleaning bore snake ropes multilayer combination.",
  },
  {
    id: 18,
    name: "Aluminum Case Professional Kit",
    category: "Gun Cleaning",
    image:
      "images/products/all-in-one-deluxe-aluminum-case-gun-cleaning-kit_334722.jpg",
    description: "Universal gun cleaning kit with 2 sets of gun cleaning rods.",
  },
  {
    id: 19,
    name: "Bronze Wire Brushes",
    category: "Cleaning Brush",
    image:
      "images/products/circular-running-gun-cleaning-bore-rope-snake-extra-brush_439478.jpg",
    description: "Bronze wires gun cleaning brushes for bore cleaning.",
  },
  {
    id: 20,
    name: "Tactical Cloth Bag Kit",
    category: "Tactical Gear",
    image:
      "images/products/oem-tactical-durable-polyester-zipper-wallet-keychain-hunting-accessories-bore-cleaning-rope-cleaning-snake-gun-cleaning-kit-559963.jpg",
    description: "Small tactical cloth bag gun cleaning kit for rifles.",
  },
  {
    id: 21,
    name: "Premium Gun Oil Set",
    category: "Gun Oil",
    image: "images/products/anti-rust-gun-cleaning-oil_747985.jpg",
    description: "Premium anti-rust gun cleaning oil for long-term protection.",
  },
  {
    id: 22,
    name: "Magazine Speed Loader",
    category: "Hunting and Shooting",
    image: "images/products/magazine-speed-loader-for-5-56-x-45mm_663493.jpg",
    description: "Magazine speed loader for 5.56x45mm ammunition.",
  },
  {
    id: 23,
    name: "Gunsmith Patch Catcher",
    category: "Gunsmith",
    image:
      "images/products/gun-cleaning-patch-catcher-for-collecting-residues_860344.jpg",
    description:
      "Gun cleaning patch catcher for collecting residues efficiently.",
  },
  {
    id: 24,
    name: "Professional Bore Snake",
    category: "Cleaning Brush",
    image:
      "images/products/circular-running-gun-cleaning-bore-rope-snake_190523.jpg",
    description: "Circular running gun cleaning bore rope snake.",
  },
  {
    id: 25,
    name: "Deluxe Cleaning Set",
    category: "Gun Cleaning",
    image:
      "images/products/deluxe-wooden-case-universal-gun-cleaning-kit-with-gun-rest-544209.jpg",
    description: "Deluxe wooden case universal gun cleaning kit with gun rest.",
  },
  {
    id: 26,
    name: "Tactical Zipper Wallet",
    category: "Tactical Gear",
    image:
      "images/products/oem-tactical-durable-polyester-zipper-wallet-keychain-hunting-accessories-bore-cleaning-rope-cleaning-snake-gun-cleaning-kit-559963.jpg",
    description:
      "OEM tactical durable polyester zipper wallet with cleaning accessories.",
  },
  {
    id: 27,
    name: "Cotton Cleaning Patches Pro",
    category: "Cleaning Brush",
    image:
      "images/products/white-cotton-square-and-round-cloth-gun-cleaning-pathces-high-absorbed_67356.jpg",
    description:
      "White cotton square and round cloth gun cleaning patches high absorbed.",
  },
  {
    id: 28,
    name: "Wool Pellet Storage Set",
    category: "Cleaning Brush",
    image:
      "images/products/gun-cleaning-wool-pellets-cylindrical-cases-screw-together-packed_737248.jpg",
    description:
      "Gun cleaning wool pellets cylindrical cases screw together packed.",
  },
  {
    id: 29,
    name: "Universal Green Kit Pro",
    category: "Gun Cleaning",
    image:
      "images/products/universal-gun-cleaning-kit-big-size-green-plastic-case_772203.jpg",
    description:
      "Universal gun cleaning kit big size green plastic case for all calibers.",
  },
  {
    id: 30,
    name: "Orange Case Oil Bottle Kit",
    category: "Gun Cleaning",
    image:
      "images/products/shotgun-cleaning-kit-orange-case-oil-bottle_40697.jpg",
    description: "Shotgun cleaning kit orange case with oil bottle included.",
  },
];

// Categories
const categories = [
  "All Products",
  "Gun Cleaning",
  "Gun Oil",
  "Gunsmith",
  "Cleaning Brush",
  "Hunting and Shooting",
  "Tactical Gear",
  "Flexible Honing",
];

// Pagination and filtering
let currentPage = 1;
const itemsPerPage = 9;
let filteredProducts = [...productsData];
let currentCategory = "All Products";
let searchQuery = "";

// Render products
function renderProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  const productsContainer = document.getElementById("productsContainer");
  if (!productsContainer) return;

  productsContainer.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="col-md-6 col-lg-4 product-item" data-category="${product.category}">
            <div class="card h-100 product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <span class="badge bg-primary mb-2">${product.category}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <a href="inquiry.html" class="btn btn-outline-primary w-100">Request Quote</a>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  renderPagination();
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginationContainer = document.getElementById("paginationContainer");

  if (!paginationContainer || totalPages <= 1) {
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = '<ul class="pagination justify-content-center">';

  // Previous button
  paginationHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${
              currentPage - 1
            }">Previous</a>
        </li>
    `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML +=
        '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
  }

  // Next button
  paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${
              currentPage + 1
            }">Next</a>
        </li>
    `;

  paginationHTML += "</ul>";
  paginationContainer.innerHTML = paginationHTML;

  // Add click handlers
  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute("data-page"));
      if (page > 0 && page <= totalPages) {
        currentPage = page;
        renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

// Filter by category
function filterByCategory(category) {
  currentCategory = category;
  currentPage = 1;
  applyFilters();
}

// Search products
function searchProducts(query) {
  searchQuery = query.toLowerCase();
  currentPage = 1;
  applyFilters();
}

// Apply all filters
function applyFilters() {
  filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      currentCategory === "All Products" ||
      product.category === currentCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });
  renderProducts();
}

// Initialize products page
if (document.getElementById("productsContainer")) {
  document.addEventListener("DOMContentLoaded", function () {
    // Render categories
    const categoriesContainer = document.getElementById("categoriesContainer");
    if (categoriesContainer) {
      categoriesContainer.innerHTML = categories
        .map(
          (cat, index) => `
                <a href="#" class="list-group-item list-group-item-action ${
                  index === 0 ? "active" : ""
                }" data-category="${cat}">
                    ${cat}
                </a>
            `
        )
        .join("");

      categoriesContainer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          categoriesContainer
            .querySelectorAll("a")
            .forEach((a) => a.classList.remove("active"));
          this.classList.add("active");
          filterByCategory(this.getAttribute("data-category"));
        });
      });
    }

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchProducts(this.value);
      });
    }

    // Initial render
    renderProducts();
  });
}
