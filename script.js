document.addEventListener("DOMContentLoaded", function() {

  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  /************************************************
   * 1. Transparent Header on Mobile Scroll
   ***********************************************/
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 50) {
        header.classList.add("mobile-scrolled");
        hamburger.classList.add("scrolled-mobile");
      } else {
        header.classList.remove("mobile-scrolled");
        hamburger.classList.remove("scrolled-mobile");
      }
    } else {
      // On desktop, remain solid
      header.classList.remove("mobile-scrolled");
      hamburger.classList.remove("scrolled-mobile");
    }
  });

  /************************************************
   * 2. Hamburger Overlay (Partial Screen)
   ***********************************************/
  let overlay = document.createElement("div");
  overlay.classList.add("mobile-nav-overlay");
  document.body.appendChild(overlay);

  let overlayNav = navLinks.cloneNode(true);
  overlay.appendChild(overlayNav);

  hamburger.addEventListener("click", () => {
    overlay.classList.toggle("show");
  });

  // Close overlay when user clicks a link
  overlayNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      overlay.classList.remove("show");
    });
  });

  /************************************************
   * 3. "Shop & Contribute" Popup - Show Once
   ***********************************************/
  let mobileButtonsOverlay = document.createElement("div");
  mobileButtonsOverlay.id = "mobileButtonsOverlay";
  mobileButtonsOverlay.innerHTML = `
    <div class="mobile-buttons-content">
      <button class="close-mobile-btn">&times;</button>
      <h3>Check Out</h3>
      <a href="https://www.amazon.com" id="mobileShopBtn">Shop</a>
      <a href="contact.html#contributeSection" id="mobileContributeBtn">Contribute</a>
    </div>
  `;
  document.body.appendChild(mobileButtonsOverlay);

  // Only show once per session
  if (!sessionStorage.getItem("popupShown")) {
    setTimeout(() => {
      mobileButtonsOverlay.classList.add("show");
    }, 10000); // 10 seconds
    sessionStorage.setItem("popupShown", "true");
  }

  // Close popup
  const closeBtn = mobileButtonsOverlay.querySelector(".close-mobile-btn");
  closeBtn.addEventListener("click", () => {
    mobileButtonsOverlay.classList.remove("show");
  });

  /************************************************
   * 4. About Page Slider
   ***********************************************/
  let sliderIndex = 0;
  let sliderTimer = null;
  let aboutAudio = new Audio("audio/ucdynamics_audio.mp3");
  let audioPlaying = false;

  window.startPresentation = function() {
    showSlide(sliderIndex);
    sliderTimer = setInterval(nextSlide, 4000);

    aboutAudio.play();
    audioPlaying = true;
  };

  window.stopPresentation = function() {
    clearInterval(sliderTimer);
    sliderTimer = null;
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

  // Stop presentation by clicking the slide
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("stop-presentation")) {
      window.stopPresentation();
    }
  });

  /************************************************
   * 5. Home Page Video (Click-to-toggle-audio)
   ***********************************************/
  const homeVideo = document.querySelector(".home-video");
  if (homeVideo) {
    homeVideo.addEventListener("click", () => {
      if (homeVideo.muted) {
        homeVideo.muted = false;
        homeVideo.play();
      } else {
        homeVideo.muted = true;
      }
    });
  }

  /************************************************
   * 6. Bitcoin "Coming Soon" Popup
   ***********************************************/
  // On Home Page
  const homeBtcLogo = document.getElementById("homeBitcoinLogo");
  if (homeBtcLogo) {
    homeBtcLogo.addEventListener("click", () => {
      alert("Coming soon");
    });
  }
  // On Contact Page
  const contactBtcLogo = document.getElementById("bitcoinDonate");
  if (contactBtcLogo) {
    contactBtcLogo.addEventListener("click", () => {
      alert("Coming soon");
    });
  }

});
