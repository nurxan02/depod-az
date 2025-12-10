// Home page scripts extracted from inline block in index.html

// Simple helper to log API base in local dev
(function () {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("API base is", localStorage.getItem("API_BASE"));
  }
})();

// Dynamically render category cards from backend categories (with fallback)
(function () {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;

  const imageMap = {
    powerbank: "image/backgrounds/powerbanks.png",
    earphone: "image/backgrounds/earphones.png",
    charger: "image/backgrounds/chargers.png",
    "car-charger": "image/backgrounds/autoadapter.png",
  };
  const descMap = {
    powerbank: "Yüksək tutumlu və sürətli şarj imkanı ilə powerbank məhsulları",
    earphone: "Mükəmməl səs keyfiyyəti və rahatlıq təmin edən qulaqlıqlar",
    charger: "Cihazlarınızı şarj etmək üçün ideal həllər",
    "car-charger": "Səyahət zamanı cihazlarınızı şarj etmək üçün ideal həllər",
  };
  const order = ["powerbank", "earphone", "charger", "car-charger"];

  async function loadCategories() {
    let categories = [];
    try {
      if (window.API && typeof window.API.listCategories === "function") {
        categories = await window.API.listCategories();
      }
    } catch (e) {
      categories = [];
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      categories = [
        {
          key: "powerbank",
          name: "Powerbank",
          image: imageMap["powerbank"],
          description: descMap["powerbank"],
        },
        {
          key: "earphone",
          name: "Qulaqlıqlar",
          image: imageMap["earphone"],
          description: descMap["earphone"],
        },
        {
          key: "charger",
          name: "Şarj Cihazları",
          image: imageMap["charger"],
          description: descMap["charger"],
        },
        {
          key: "car-charger",
          name: "Avtomobil Aksesuarlarıjı",
          image: imageMap["car-charger"],
          description: descMap["car-charger"],
        },
      ];
    } else {
      // Normalize if backend returns additional fields
      categories = categories
        .map((c) => ({
          key: c.key || c.id || "",
          name: c.name || c.key,
          description: c.description || descMap[c.key] || "",
          image: c.image || imageMap[c.key] || null,
        }))
        .filter((c) => c.key && c.image); // require an image to show card

      // Sort by our preferred order; unknown keys go after known ones alphabetically
      categories.sort((a, b) => {
        const ai = order.indexOf(a.key);
        const bi = order.indexOf(b.key);
        if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    }

    grid.innerHTML = categories
      .map(
        (c) => `
          <div class="category-card">
            <img src="${c.image}" alt="${c.name}" class="category-card-img" />
            <div class="category-card-overlay">
              <div class="category-card-content">
                <h3 class="category-card-title">${c.name}</h3>
                <p class="category-card-desc">${c.description || ""}</p>
                <a href="products.html?category=${
                  c.key
                }" class="category-card-btn">Ətraflı</a>
              </div>
            </div>
          </div>`
      )
      .join("");
  }

  // Kick off
  loadCategories();
})();
