document.addEventListener("DOMContentLoaded", function() {
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  /************************************************
   * 0. Dark Mode Toggle and Banner Swap
   ***********************************************/
  const themeToggle = document.querySelectorAll(".theme-toggle");
  const htmlElement = document.documentElement;
  const bannerDesktop = document.querySelector(".banner-desktop");

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  console.log(`Loaded theme: ${savedTheme}`);
  updateBanner(savedTheme);

  // Toggle theme on button click
  themeToggle.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      console.log(`Switched to theme: ${newTheme}`);
      updateBanner(newTheme);
    });
  });

  // Function to swap banner image
  function updateBanner(theme) {
    if (bannerDesktop) {
      const src = theme === "dark" ? bannerDesktop.dataset.dark : bannerDesktop.dataset.light;
      bannerDesktop.src = src;
    }
  }

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

  let overlayNavHTML = '';
  navLinks.querySelectorAll("a").forEach(link => {
    overlayNavHTML += `<a href="${link.getAttribute('href')}" class="${link.classList.contains('active') ? 'active' : ''}">${link.textContent}</a>`;
  });
  overlay.innerHTML = overlayNavHTML;

  hamburger.addEventListener("click", () => {
    overlay.classList.toggle("show");
  });

  overlay.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      overlay.classList.remove("show");
    });
  });

  /************************************************
   * 3. "Shop & Contribute" Popup - Modified
   ***********************************************/
  function createPopup() {
    console.log("Creating popup...");
    let mobileButtonsOverlay = document.createElement("div");
    mobileButtonsOverlay.id = "mobileButtonsOverlay";
   mobileButtonsOverlay.innerHTML = `
  <div class="mobile-buttons-content">
    <button class="close-mobile-btn">×</button>
    <h3>Check It Out</h3>
    <a href="https://www.amazon.com" id="mobileShopBtn">Shop</a>
    <a href="contact.html#contributeSection" id="mobileContributeBtn">Contribute</a>
  </div>
`;
    document.body.appendChild(mobileButtonsOverlay);
    
    const closeBtn = mobileButtonsOverlay.querySelector(".close-mobile-btn");
    closeBtn.addEventListener("click", () => {
      mobileButtonsOverlay.classList.remove("show");
    });
    
    console.log("Setting timeout to show popup in 10 seconds...");
    setTimeout(() => {
      console.log("Timeout executed, showing popup");
      mobileButtonsOverlay.classList.add("show");
    }, 10000);
  }

  function isHomePage() {
    let path = window.location.pathname;
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    const endsWithIndex = path.endsWith("index.html");
    const noHtmlInPath = !path.includes(".html");
    return (path === "" || endsWithIndex || noHtmlInPath);
  }

  if (isHomePage()) {
    createPopup();
  }

  /************************************************
   * 4. Advanced About Page Slider with Continuous Audio and Auto-Restart
   ***********************************************/
  /************************************************
 * 4. Modern Slideshow with Fade Transitions, Dots, and Touch Support
 ***********************************************/
initSlidePresentation();

function initSlidePresentation() {
  const sliderContainer = document.querySelector(".slider-container");
  const slideAudio = document.getElementById("slideAudio");

  if (!sliderContainer || !slideAudio) {
    return;
  }

  console.log("Initializing modern slide presentation");

  const slides = document.querySelectorAll(".slider-container img");
  const prevSlideBtn = document.getElementById("prevSlideBtn");
  const nextSlideBtn = document.getElementById("nextSlideBtn");
  const startPresentationBtn = document.getElementById("startPresentationBtn");
  const stopPresentationBtn = document.getElementById("stopPresentationBtn");
  const muteAudioBtn = document.getElementById("muteAudioBtn");
  const slideCounter = document.querySelector(".slide-counter");
  const sliderDots = document.querySelector(".slider-dots");
  let currentSlide = 0;
  let slideInterval;
  let isMuted = false;

  // Create navigation dots
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => {
      stopPresentation();
      showSlide(index);
    });
    sliderDots.appendChild(dot);
  });

  const dots = document.querySelectorAll(".slider-dots .dot");

  function updateSlideCounter() {
    slideCounter.textContent = `${currentSlide + 1}/${slides.length}`;
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    currentSlide = index;
    updateSlideCounter();
    updateDots();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function startPresentation() {
    if (!isMuted) slideAudio.play();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopPresentation() {
    clearInterval(slideInterval);
    slideAudio.pause();
    slideAudio.currentTime = 0;
  }

  function toggleMute() {
    isMuted = !isMuted;
    slideAudio.muted = isMuted;
    muteAudioBtn.querySelector(".icon").textContent = isMuted ? "🔇" : "🔊";
    muteAudioBtn.setAttribute("aria-label", isMuted ? "Unmute Audio" : "Mute Audio");
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      stopPresentation();
      nextSlide();
    }
    if (touchEndX - touchStartX > 50) {
      stopPresentation();
      prevSlide();
    }
  });

  // Event listeners
  prevSlideBtn.addEventListener("click", () => {
    stopPresentation();
    prevSlide();
  });

  nextSlideBtn.addEventListener("click", () => {
    stopPresentation();
    nextSlide();
  });

  startPresentationBtn.addEventListener("click", startPresentation);

  stopPresentationBtn.addEventListener("click", stopPresentation);

  muteAudioBtn.addEventListener("click", toggleMute);

  slides.forEach(slide => {
    slide.addEventListener("click", stopPresentation);
  });

  // Keyboard navigation
  sliderContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopPresentation();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      stopPresentation();
      nextSlide();
    }
  });

  // Pause when the slideshow loses focus
  sliderContainer.addEventListener("focusout", stopPresentation);

  // Initialize
  updateSlideCounter();
}

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
  const homeBtcLogo = document.getElementById("homeBitcoinLogo");
  if (homeBtcLogo) {
    homeBtcLogo.addEventListener("click", () => {
      alert("Coming soon");
    });
  }

  const contactBtcLogo = document.getElementById("bitcoinDonate");
  if (contactBtcLogo) {
    contactBtcLogo.addEventListener("click", () => {
      alert("Coming soon");
    });
  }

  /************************************************
   * 7. Fix anchor links for Contribute and Volunteer
   ***********************************************/
  const contributeLinks = document.querySelectorAll('a[href*="#contributeSection"]');
  contributeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.getAttribute('href');
      if (targetUrl.startsWith('#') || window.location.pathname.includes('contact.html')) {
        e.preventDefault();
        const contributeSection = document.getElementById('contributeSection');
        if (contributeSection) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const sectionTop = contributeSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: sectionTop - headerHeight - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  const volunteerLinks = document.querySelectorAll('a[href*="#volunteerSection"]');
  volunteerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.getAttribute('href');
      if (targetUrl.startsWith('#') || window.location.pathname.includes('get-involved.html')) {
        e.preventDefault();
        const volunteerSection = document.getElementById('volunteerSection');
        if (volunteerSection) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const sectionTop = volunteerSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: sectionTop - headerHeight - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  function handleHashScroll() {
    if (window.location.hash) {
      setTimeout(function() {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: targetTop - headerHeight - 20,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  
  handleHashScroll();
  window.addEventListener('hashchange', handleHashScroll);

  console.log("Script fully initialized!");
});
