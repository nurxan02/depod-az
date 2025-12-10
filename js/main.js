// Mobile Navigation
document.addEventListener("DOMContentLoaded", function () {
  // Per-tab, once-per-day site visit tracking
  try {
    // Send visit ping to backend (uses deployed base by default, localhost in dev)
    const deployed = "https://depod-api.onrender.com";
    const isLocal =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const fallback =
      isLocal && location.port !== "8000" ? "http://127.0.0.1:8000" : deployed;
    const API_BASE = (
      window.API && typeof window.API._url === "function"
        ? window.API._url("")
        : window.DEPOD_API_BASE || fallback
    ).replace(/\/$/, "");
    const key = "depod_visit_ping";
    const today = new Date().toISOString().slice(0, 10);
    const stored = sessionStorage.getItem(key);
    if (stored !== today) {
      const tabKey = "depod_tab_id";
      let tabId = sessionStorage.getItem(tabKey);
      if (!tabId) {
        tabId = Math.random().toString(36).slice(2);
        sessionStorage.setItem(tabKey, tabId);
      }
      const form = new FormData();
      form.append("tab_id", tabId);
      fetch(`${API_BASE}/api/visit/track/`, {
        method: "POST",
        body: form,
        credentials: "include",
      })
        .then(() => sessionStorage.setItem(key, today))
        .catch(() => {});
    }
  } catch (e) {}

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 0) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(
    ".product-card, .feature-item"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Service Worker Registration (PWA)
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then(function (registration) {
//         console.log(
//           "ServiceWorker registration successful with scope: ",
//           registration.scope
//         );
//       })
//       .catch(function (err) {
//         console.log("ServiceWorker registration failed: ", err);
//       });
//   });
// }

// Install prompt for PWA
// let deferredPrompt;

// window.addEventListener("beforeinstallprompt", (e) => {
//   // Prevent Chrome 67 and earlier from automatically showing the prompt
//   e.preventDefault();
//   // Stash the event so it can be triggered later
//   deferredPrompt = e;

//   // Show install button if needed
//   const installButton = document.querySelector(".install-button");
//   if (installButton) {
//     installButton.style.display = "block";

//     installButton.addEventListener("click", (e) => {
//       // Hide our user interface that shows our A2HS button
//       installButton.style.display = "none";
//       // Show the prompt
//       deferredPrompt.prompt();
//       // Wait for the user to respond to the prompt
//       deferredPrompt.userChoice.then((choiceResult) => {
//         if (choiceResult.outcome === "accepted") {
//           console.log("User accepted the A2HS prompt");
//         } else {
//           console.log("User dismissed the A2HS prompt");
//         }
//         deferredPrompt = null;
//       });
//     });
//   }
// });

// Form validation helper
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
    }

    // Email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add("error");
        isValid = false;
      }
    }
  });

  return isValid;
}

// Loading state helper
function showLoading(element) {
  element.classList.add("loading");
  element.disabled = true;
}

function hideLoading(element) {
  element.classList.remove("loading");
  element.disabled = false;
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Image lazy loading
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

// Performance monitoring
window.addEventListener("load", function () {
  // Log performance metrics
  if ("performance" in window) {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log("Page load time:", pageLoadTime + "ms");
  }
});

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  // You can add error reporting here
});

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // You can add error reporting here
});

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  // Support for ESC key to close mobile menu
  if (e.key === "Escape") {
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");

    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }
});

// Theme detection (optional for future dark mode support)
function detectColorScheme() {
  let theme = "light";

  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") === "dark") {
      theme = "dark";
    }
  } else if (!window.matchMedia) {
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  }

  return theme;
}

// Initialize theme
document.addEventListener("DOMContentLoaded", function () {
  const theme = detectColorScheme();
  document.documentElement.setAttribute("data-theme", theme);
});
