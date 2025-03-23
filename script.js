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
        <h3>Check Out</h3>
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
  initSlidePresentation();
  
  function initSlidePresentation() {
    const sliderContainer = document.querySelector(".slider-container");
    const slideAudio = document.getElementById("slideAudio");
    
    if (!sliderContainer || !slideAudio) {
      return;
    }
    
    console.log("Initializing slide presentation with continuous audio and auto-restart");
    
    const slideConfig = [
      { duration: 3300 },  // Slide 0
      { duration: 6600 },  // Slide 1
      { duration: 9000 },  // Slide 2
      { duration: 6000 },  // Slide 3
      { duration: 11500 }, // Slide 4
      { duration: 17500 }, // Slide 5
      { duration: 5500 },  // Slide 6
      { duration: 8000 },  // Slide 7
      { duration: 6000 },  // Slide 8
      { duration: 1000 }   // Slide 9
    ];
    
    let sliderIndex = 0;
    let sliderTimer = null;
    let isPlaying = false;
    let hasCompletedFullCycle = false;
    
    const slides = document.querySelectorAll(".slider-container img");
    slides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
      
      slide.addEventListener("click", function() {
        if (isPlaying) {
          stopPresentation();
        }
      });
    });
    
    // Simplified audio unlock
    const unlockAudio = function() {
      console.log("Attempting to unlock audio...");
      slideAudio.muted = true;
      slideAudio.play().then(() => {
        slideAudio.muted = false;
        console.log("Audio unlocked successfully");
        document.removeEventListener("click", unlockAudio);
      }).catch(e => {
        console.log("Failed to unlock audio:", e);
      });
    };
    document.addEventListener("click", unlockAudio, { once: true });
    
    const startBtn = document.getElementById("startPresentationBtn");
    const stopBtn = document.getElementById("stopPresentationBtn");
    const prevBtn = document.getElementById("prevSlideBtn");
    const nextBtn = document.getElementById("nextSlideBtn");
    
    if (startBtn) startBtn.addEventListener("click", startPresentation);
    if (stopBtn) stopBtn.addEventListener("click", stopPresentation);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    
    slideAudio.addEventListener('ended', function() {
      if (isPlaying) {
        console.log("Audio ended, restarting audio");
        slideAudio.currentTime = 0;
        slideAudio.play().catch(error => {
          console.error("Error restarting audio:", error);
        });
      }
    });
    
    function startPresentation() {
      if (isPlaying) return;
      
      console.log("Starting presentation at slide", sliderIndex);
      isPlaying = true;
      
      if (hasCompletedFullCycle || sliderIndex === 0) {
        slideAudio.currentTime = 0;
        hasCompletedFullCycle = false;
      }
      
      const playPromise = slideAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Audio playing continuously");
          scheduleNextSlide();
        }).catch(error => {
          console.error("Audio playback failed:", error);
          isPlaying = false;
          alert("Please click the Start Presentation button again to enable audio");
        });
      }
    }
    
    function stopPresentation() {
      if (!isPlaying) return;
      
      console.log("Stopping presentation");
      isPlaying = false;
      
      if (sliderTimer) {
        clearTimeout(sliderTimer);
        sliderTimer = null;
      }
      
      slideAudio.pause();
    }
    
    function scheduleNextSlide() {
      if (sliderTimer) {
        clearTimeout(sliderTimer);
      }
      
      if (isPlaying) {
        console.log(`Scheduling next slide in ${slideConfig[sliderIndex].duration}ms`);
        sliderTimer = setTimeout(() => {
          nextSlide();
        }, slideConfig[sliderIndex].duration);
      }
    }
    
    function nextSlide() {
      sliderIndex++;
      
      if (sliderIndex >= slides.length) {
        sliderIndex = 0;
        hasCompletedFullCycle = true;
        console.log("Completed full cycle, restarting from slide 0");
      }
      
      console.log("Moving to next slide:", sliderIndex);
      
      slides.forEach((slide, index) => {
        if (index === sliderIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
      
      if (isPlaying) {
        scheduleNextSlide();
      }
    }
    
    function prevSlide() {
      sliderIndex--;
      if (sliderIndex < 0) {
        sliderIndex = slides.length - 1;
      }
      
      console.log("Moving to previous slide:", sliderIndex);
      
      slides.forEach((slide, index) => {
        if (index === sliderIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
      
      if (isPlaying) {
        scheduleNextSlide();
      }
    }
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
