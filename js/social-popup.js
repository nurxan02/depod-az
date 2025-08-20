(function () {
  // Only desktop/tablet
  if (window.matchMedia("(max-width: 767px)").matches) return;

  // Don’t show again in this session after it’s closed
  if (sessionStorage.getItem("socialPopupDismissed") === "1") return;

  const SHOW_DELAY_MS = 5000;

  // Replace with real profiles
  const LINKS = {
    instagram: "https://instagram.com/depod",
    tiktok: "https://www.tiktok.com/@depod",
    facebook: "https://facebook.com/depod",
  };

  function createPopup() {
    const overlay = document.createElement("div");
    overlay.className = "social-popup-overlay";
    overlay.innerHTML = `
      <div class="social-popup" role="dialog" aria-modal="true" aria-label="Sosial media">
        <button class="popup-close" aria-label="Bağla">&times;</button>
        <div class="popup-left">
          <div class="popup-logo-container">
            <img src="./image/logo.png" class="popup-logo" alt="Depod Logo" />
            <span class="popup-brand">DEPOD</span>
          </div>
          <h3>Bizi sosial mediada izləyin!</h3>
          <p>Yeniliklər, aksiyalar və çəkilişlər üçün bizi izləyin.</p>
        </div>
        <div class="popup-right">
          <a class="social-btn ig" href="${LINKS.instagram}" target="_blank" rel="noopener">
            <i class="fab fa-instagram"></i> Instagram
          </a>
          <a class="social-btn tt" href="${LINKS.tiktok}" target="_blank" rel="noopener">
            <i class="fab fa-tiktok"></i> TikTok
          </a>
          <a class="social-btn fb" href="${LINKS.facebook}" target="_blank" rel="noopener">
            <i class="fab fa-facebook-f"></i> Facebook
          </a>
        </div>
      </div>
    `;

    function close() {
      overlay.classList.remove("show");
      sessionStorage.setItem("socialPopupDismissed", "1");
      setTimeout(() => overlay.remove(), 200);
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".popup-close")?.addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
  }

  window.addEventListener("load", () => {
    setTimeout(createPopup, SHOW_DELAY_MS);
  });
})();
