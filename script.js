/******************************************************
 Hamburger Toggle for Mobile
*******************************************************/
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  let mobileNavOpen = false;

  hamburger.addEventListener("click", () => {
    mobileNavOpen = !mobileNavOpen;
    if (mobileNavOpen) {
      navLinks.classList.remove("mobile-inactive");
      navLinks.classList.add("mobile-active");
      navLinks.style.display = "flex";
    } else {
      navLinks.classList.remove("mobile-active");
      navLinks.classList.add("mobile-inactive");
      setTimeout(() => {
        // Hide the nav after animation finishes
        if (navLinks.classList.contains("mobile-inactive")) {
          navLinks.style.display = "none";
        }
      }, 500);
    }
  });
});

/******************************************************
 About Page Slider for 8 PNGs + Audio
*******************************************************/
let sliderIndex = 0;
let sliderTimer = null;
let audioPlaying = false;
let aboutAudio = new Audio("audio/ucdynamics_audio.mp3"); 
// ^ Placeholder path. Replace with your actual audio.

function startPresentation() {
  // Start cycling images every 4 seconds
  showSlide(sliderIndex);
  sliderTimer = setInterval(nextSlide, 4000);

  // Start audio
  aboutAudio.play();
  audioPlaying = true;
}

function stopPresentation() {
  clearInterval(sliderTimer);
  sliderTimer = null;

  // Stop audio
  aboutAudio.pause();
  aboutAudio.currentTime = 0;
  audioPlaying = false;
}

function nextSlide() {
  sliderIndex++;
  let slides = document.querySelectorAll(".slider-container img");
  if (sliderIndex >= slides.length) {
    sliderIndex = 0;
  }
  showSlide(sliderIndex);
}

function prevSlide() {
  sliderIndex--;
  let slides = document.querySelectorAll(".slider-container img");
  if (sliderIndex < 0) {
    sliderIndex = slides.length - 1;
  }
  showSlide(sliderIndex);
}

function showSlide(n) {
  let slides = document.querySelectorAll(".slider-container img");
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[n].classList.add("active");
}

/******************************************************
 Optional: For about page images “click to stop”
*******************************************************/
document.addEventListener("click", function(e){
  if(e.target.classList.contains("stop-presentation")){
    // If user clicks on the slide, stop the show & audio
    stopPresentation();
  }
});

/******************************************************
 Optional: For videos that loop & are muted until clicked
*******************************************************/
// Example usage:
// - Add a 'click-to-toggle-audio' class to your video
// - Then handle the event
document.addEventListener("click", function(e){
  if(e.target.tagName === "VIDEO" && e.target.classList.contains("click-to-toggle-audio")){
    if(e.target.muted) {
      e.target.muted = false;
      e.target.play();
    } else {
      e.target.muted = true;
    }
  }
});
