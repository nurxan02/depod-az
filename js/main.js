// Main JavaScript file for Depod website

document.addEventListener("DOMContentLoaded", function () {
  console.log("Depod website loaded successfully.");

  // Handle form submissions
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for your message! We will get back to you shortly.");
      form.reset();
    });
  });

  // Add active class to current nav link
  const currentLocation = location.href;
  const menuItem = document.querySelectorAll(".nav-link");
  const menuLength = menuItem.length;
  for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
      menuItem[i].className += " active";
    }
  }
});
