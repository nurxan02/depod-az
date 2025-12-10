document.addEventListener("DOMContentLoaded", function () {
  // Typewriter animation
  const text = "Müasir Texnologiyanı Depod ilə əldə et";
  const el = document.getElementById("typewriter-title");
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 60);
    }
  }
  typeWriter();

  // Hero image slider animation
  const sliderImages = [
    "image/material/earphone/png/peak-black.png",
    "image/material/earphone/png/peak-black-tips.png",
    "image/material/earphone/png/peak-beige.png",
    "image/material/earphone/png/peak-beige-tips.png",
  ];
  let sliderIndex = 0;
  const sliderImgEl = document.getElementById("hero-slider-img");
  function changeSliderImage() {
    // Animate out (move down and fade out)
    sliderImgEl.style.transform = "translateY(-40px)";
    sliderImgEl.style.opacity = "0";
    setTimeout(() => {
      sliderIndex = (sliderIndex + 1) % sliderImages.length;
      sliderImgEl.src = sliderImages[sliderIndex];
      // Animate in (move from up to normal and fade in)
      sliderImgEl.style.transform = "translateY(40px)";
      setTimeout(() => {
        sliderImgEl.style.transform = "translateY(0)";
        sliderImgEl.style.opacity = "1";
      }, 50);
    }, 700);
  }
  setInterval(changeSliderImage, 4000);
});
