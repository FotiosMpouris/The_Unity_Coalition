document.addEventListener("DOMContentLoaded", function() {
  /**************************************
   * 1. Hamburger + Mobile Nav Overlay
   *************************************/
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  
  // We'll create an overlay for mobile
  let overlay = document.createElement("div");
  overlay.classList.add("mobile-nav-overlay");
  document.body.appendChild(overlay);

  // Clone the nav-links inside the overlay
  let overlayNav = navLinks.cloneNode(true);
  overlay.appendChild(overlayNav);

  hamburger.addEventListener("click", () => {
    // Toggle show/hide
    overlay.classList.toggle("show");
  });

  // Close overlay when user clicks a link
  overlayNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      overlay.classList.remove("show");
    });
  });

  /**************************************
   * 2. About Page Slider
   *************************************/
  let sliderIndex = 0;
  let sliderTimer = null;
  let audioPlaying = false;

  // If you have an audio file for the about page:
  let aboutAudio = new Audio("audio/ucdynamics_audio.mp3"); 
  // Adjust path & name as needed

  window.startPresentation = function() {
    showSlide(sliderIndex);
    sliderTimer = setInterval(nextSlide, 4000);

    // Start audio
    aboutAudio.play();
    audioPlaying = true;
  };

  window.stopPresentation = function() {
    clearInterval(sliderTimer);
    sliderTimer = null;
    // Stop audio
    aboutAudio.pause();
    aboutAudio.currentTime = 0;
    audioPlaying = false;
  };

  window.nextSlide = function() {
    sliderIndex++;
    let slides = document.querySelectorAll(".slider-container img");
    if (sliderIndex >= slides.length) {
      sliderIndex = 0;
    }
    showSlide(sliderIndex);
  };

  window.prevSlide = function() {
    sliderIndex--;
    let slides = document.querySelectorAll(".slider-container img");
    if (sliderIndex < 0) {
      sliderIndex = slides.length - 1;
    }
    showSlide(sliderIndex);
  };

  function showSlide(n) {
    let slides = document.querySelectorAll(".slider-container img");
    slides.forEach(s => s.classList.remove("active"));
    slides[n].classList.add("active");
  }

  // Stop presentation by clicking on the slide
  document.addEventListener("click", function(e) {
    if(e.target.classList.contains("stop-presentation")) {
      window.stopPresentation();
    }
  });
});
