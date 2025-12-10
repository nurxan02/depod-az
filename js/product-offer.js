/**
 * Product Offer Modal Functionality
 * Handles the offer form modal, validation, and API submission
 */

class ProductOfferModal {
  constructor() {
    this.modal = document.getElementById("offerModal");
    this.form = document.getElementById("offerForm");
    this.successDiv = document.getElementById("offerSuccess");
    this.currentProductId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.getCurrentProductId();
  }

  bindEvents() {
    // Open modal button
    const offerBtn = document.getElementById("offerBtn");
    if (offerBtn) {
      offerBtn.addEventListener("click", () => this.openModal());
    }

    // Close modal events
    const closeBtn = document.getElementById("offerModalClose");
    const cancelBtn = document.getElementById("offerFormCancel");
    const successCloseBtn = document.getElementById("successClose");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.closeModal());
    if (successCloseBtn)
      successCloseBtn.addEventListener("click", () => this.closeModal());

    // Close on backdrop click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.closeModal();
      }
    });

    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Phone number formatting and number-only input
    const phoneInput = document.getElementById("customerPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", this.formatPhoneNumber);

      // Allow only numbers, plus sign, space, dash, and parentheses
      phoneInput.addEventListener("keypress", (e) => {
        const allowedChars = /[0-9\+\-\(\)\s]/;
        if (
          !allowedChars.test(e.key) &&
          !e.ctrlKey &&
          !e.metaKey &&
          e.key !== "Backspace" &&
          e.key !== "Delete" &&
          e.key !== "Tab" &&
          e.key !== "Enter"
        ) {
          e.preventDefault();
        }
      });

      // Also prevent pasting non-numeric content
      phoneInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const numbersOnly = paste.replace(/[^\d\+\-\(\)\s]/g, "");
        e.target.value = e.target.value + numbersOnly;
        this.formatPhoneNumber(e);
      });
    }

    // Quantity counter functionality
    const quantityInput = document.getElementById("quantity");
    const quantityMinus = document.querySelector(".quantity-minus");
    const quantityPlus = document.querySelector(".quantity-plus");

    if (quantityInput && quantityMinus && quantityPlus) {
      quantityMinus.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });

      quantityPlus.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 1000) {
          quantityInput.value = currentValue + 1;
        }
      });
    }
  }

  getCurrentProductId() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.currentProductId = urlParams.get("id");

    if (!this.currentProductId) {
      console.warn("Product ID not found in URL");
    }
  }

  openModal() {
    if (!this.currentProductId) {
      alert("Məhsul ID tapılmadı. Zəhmət olmasa səhifəni yenidən yükləyin.");
      return;
    }

    this.modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Focus on first input
    setTimeout(() => {
      const firstInput = this.form.querySelector('input[type="text"]');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  closeModal() {
    this.modal.classList.remove("show");
    document.body.style.overflow = "";

    // Reset form and states
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  resetForm() {
    this.form.reset();
    this.form.style.display = "flex";
    this.successDiv.style.display = "none";

    // Remove any error states
    const inputs = this.form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.classList.remove("error");
    });
  }

  formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, "");

    // Add +994 prefix if not present
    if (value && !value.startsWith("994")) {
      if (value.startsWith("0")) {
        value = "994" + value.substring(1);
      } else if (value.length <= 9) {
        value = "994" + value;
      }
    }

    // Format: +994 XX XXX XX XX
    if (value.length >= 3) {
      let formatted = "+" + value.substring(0, 3);
      if (value.length > 3) {
        formatted += " " + value.substring(3, 5);
      }
      if (value.length > 5) {
        formatted += " " + value.substring(5, 8);
      }
      if (value.length > 8) {
        formatted += " " + value.substring(8, 10);
      }
      if (value.length > 10) {
        formatted += " " + value.substring(10, 12);
      }
      e.target.value = formatted;
    }
  }

  validateForm() {
    const formData = new FormData(this.form);
    const errors = [];

    // Required fields validation
    const firstName = formData.get("first_name")?.trim();
    const lastName = formData.get("last_name")?.trim();
    const phoneNumber = formData.get("phone_number")?.trim();
    const city = formData.get("city");

    if (!firstName || firstName.length < 2) {
      errors.push({
        field: "first_name",
        message: "Ad ən azı 2 hərf olmalıdır",
      });
    }

    if (!lastName || lastName.length < 2) {
      errors.push({
        field: "last_name",
        message: "Soyad ən azı 2 hərf olmalıdır",
      });
    }

    if (!phoneNumber) {
      errors.push({
        field: "phone_number",
        message: "Telefon nömrəsi tələb olunur",
      });
    } else {
      // Phone validation
      const phonePattern = /^\+994\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phonePattern.test(phoneNumber)) {
        errors.push({
          field: "phone_number",
          message: "Düzgün telefon nömrəsi formatı: +994 XX XXX XX XX",
        });
      }
    }

    if (!city) {
      errors.push({ field: "city", message: "Şəhər seçmək məcburidir" });
    }

    // Quantity validation
    const quantity = parseInt(formData.get("quantity"));
    if (!quantity || quantity < 1) {
      errors.push({
        field: "quantity",
        message: "Miqdar ən azı 1 olmalıdır",
      });
    } else if (quantity > 1000) {
      errors.push({
        field: "quantity",
        message: "Miqdar 1000-dən çox ola bilməz",
      });
    }

    // Email validation (if provided)
    const email = formData.get("email")?.trim();
    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errors.push({
          field: "email",
          message: "Düzgün e-mail adresi daxil edin",
        });
      }
    }

    return errors;
  }

  displayValidationErrors(errors) {
    // Clear previous errors
    const inputs = this.form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.classList.remove("error");
      const errorDiv = input.parentNode.querySelector(".error-message");
      if (errorDiv) errorDiv.remove();
    });

    // Display new errors
    errors.forEach((error) => {
      const field = this.form.querySelector(`[name="${error.field}"]`);
      if (field) {
        field.classList.add("error");

        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = error.message;
        errorDiv.style.cssText =
          "color: #dc2626; font-size: 12px; margin-top: 4px;";

        field.parentNode.appendChild(errorDiv);
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate form
    const errors = this.validateForm();
    if (errors.length > 0) {
      this.displayValidationErrors(errors);
      return;
    }

    const submitBtn = this.form.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;

    try {
      // Show loading state
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Prepare form data
      const formData = new FormData(this.form);
      const data = {
        first_name: formData.get("first_name").trim(),
        last_name: formData.get("last_name").trim(),
        phone_number: formData.get("phone_number").trim(),
        email: formData.get("email")?.trim() || "",
        city: formData.get("city"),
        quantity: parseInt(formData.get("quantity")),
        product: this.currentProductId,
        offer_text: formData.get("offer_text")?.trim() || "",
      };

      // Debug: log the data being sent
      console.log("Sending offer data:", data);

      // Submit to API
      const response = await fetch(API._url("/api/offers/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        // Show success state
        this.form.style.display = "none";
        this.successDiv.style.display = "block";

        // Track conversion (if analytics available)
        if (typeof gtag !== "undefined") {
          gtag("event", "offer_submitted", {
            event_category: "engagement",
            event_label: "product_offer",
            product_id: this.currentProductId,
          });
        }
      } else {
        // Handle API errors
        if (result.errors || result.error) {
          const errorMessage = result.errors
            ? Object.values(result.errors).flat().join(", ")
            : result.error;
          throw new Error(errorMessage);
        } else {
          throw new Error(
            "Təklif göndərilmədi. Zəhmət olmasa yenidən cəhd edin."
          );
        }
      }
    } catch (error) {
      console.error("Offer submission error:", error);
      alert(
        error.message || "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
      );
    } finally {
      // Reset loading state
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ProductOfferModal();
});

// Add error styles for form validation
const errorStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    .error-message {
        color: #dc2626;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 400;
    }
`;

// Inject error styles
const styleSheet = document.createElement("style");
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);
