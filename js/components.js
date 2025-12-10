// Header Component
function loadHeader() {
  const headerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top" id="mainNav">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="images/logo/logo.svg" alt="Depod Logo" class="logo-dark" height="50">
                <img src="images/logo/logo.svg" alt="Depod Logo" class="logo-light" height="50">
                <span class="brand-text ms-2">DEPOD</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="products.html">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-primary text-white ms-2 px-3" href="inquiry.html">Send Inquiry</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
  document.getElementById("header-placeholder").innerHTML = headerHTML;

  // Set active nav link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

// Footer Component
function loadFooter() {
  const footerHTML = `
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="d-flex align-items-center mb-3">
                        <img src="images/logo/logo.svg" alt="Depod Logo" class="logo-light" height="50">
                        <span class="footer-brand-text ms-2">DEPOD</span>
                    </div>
                    <p>Your trusted partner for gun cleaning solutions. We provide high-quality kits and accessories for all your maintenance needs.</p>
                    <div class="social-links mt-3">
                        <a href="#" class="text-white me-3"><i class="fab fa-facebook fa-lg"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-linkedin fa-lg"></i></a>
                        <a href="#" class="text-white"><i class="fab fa-instagram fa-lg"></i></a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5 class="text-primary mb-3">Quick Links</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="index.html" class="text-white text-decoration-none">Home</a></li>
                        <li class="mb-2"><a href="about.html" class="text-white text-decoration-none">About Us</a></li>
                        <li class="mb-2"><a href="products.html" class="text-white text-decoration-none">Products</a></li>
                        <li class="mb-2"><a href="contact.html" class="text-white text-decoration-none">Contact Us</a></li>
                        <li class="mb-2"><a href="inquiry.html" class="text-white text-decoration-none">Send Inquiry</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="text-primary mb-3">Contact Info</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><i class="fas fa-map-marker-alt me-2 text-primary"></i> No.503, Guangboguomao, Ningbo, China</li>
                        <li class="mb-2"><i class="fas fa-phone me-2 text-primary"></i> +86 19584441761</li>
                        <li class="mb-2"><i class="fas fa-envelope me-2 text-primary"></i> 2776792683@qq.com</li>
                    </ul>
                </div>
            </div>
            <hr class="my-4 border-secondary">
            <div class="text-center text-secondary">
                <p>&copy; 2025 Depod. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
    `;
  document.getElementById("footer-placeholder").innerHTML = footerHTML;
}

// Initialize header and footer
document.addEventListener("DOMContentLoaded", function () {
  loadHeader();
  loadFooter();

  // Navbar blur effect on scroll
  const navbar = document.getElementById("mainNav");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Handle form submissions
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for your message! We will get back to you shortly.");
      form.reset();
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
