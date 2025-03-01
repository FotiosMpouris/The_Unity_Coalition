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
      header.classList.remove("mobile-scrolled");
      hamburger.classList.remove("scrolled-mobile");
    }
  });

  /************************************************
   * 2. Hamburger Overlay (Partial Screen)
   ***********************************************/
  // Create the overlay
  let overlay = document.createElement("div");
  overlay.classList.add("mobile-nav-overlay");
  document.body.appendChild(overlay);

  // Create navigation links for the overlay
  let overlayNavHTML = '';
  navLinks.querySelectorAll("a").forEach(link => {
    overlayNavHTML += `<a href="${link.getAttribute('href')}" class="${link.classList.contains('active') ? 'active' : ''}">${link.textContent}</a>`;
  });
  overlay.innerHTML = overlayNavHTML;

  // Show/hide overlay on hamburger click
  hamburger.addEventListener("click", () => {
    overlay.classList.toggle("show");
  });

  // Close overlay if user clicks any nav link inside
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
        <button class="close-mobile-btn">&times;</button>
        <h3>Check Out</h3>
        <a href="https://www.amazon.com" id="mobileShopBtn">Shop</a>
        <a href="contact.html#contributeSection" id="mobileContributeBtn">Contribute</a>
      </div>
    `;
    document.body.appendChild(mobileButtonsOverlay);
    
    // Close popup on click of X
    const closeBtn = mobileButtonsOverlay.querySelector(".close-mobile-btn");
    closeBtn.addEventListener("click", () => {
      mobileButtonsOverlay.classList.remove("show");
    });
    
    // Show after 10 seconds (10000 ms)
    console.log("Setting timeout to show popup in 10 seconds...");
    setTimeout(() => {
      console.log("Timeout executed, showing popup");
      mobileButtonsOverlay.classList.add("show");
    }, 10000);
  }

  // Helper function to detect "home page" (root or index.html)
  function isHomePage() {
    // Current path, e.g. "/myRepo/about.html" or "/myRepo/"
    let path = window.location.pathname;
    // Remove trailing slash if present (but not if it's just "/")
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    // If path is empty after removing slash => root ("/")
    // OR ends with "index.html" => treat as home
    // OR path is something like "/myRepo" => consider it the root if there's no .html
    const endsWithIndex = path.endsWith("index.html");
    const noHtmlInPath = !path.includes(".html"); // e.g. "/myRepo" or "/" 
    return (path === "" || endsWithIndex || noHtmlInPath);
  }

  // Only create/show popup if on home page (root or index.html)
  if (isHomePage()) {
    createPopup();
  }

 * Advanced About Page Slider with Custom Timing
   ***********************************************/
  // Configuration for each slide - customize durations and audio start times
  const slideConfig = [
    { duration: 5000, audioStart: 0 },      // Slide 0
    { duration: 5000, audioStart: 5 },      // Slide 1
    { duration: 9000, audioStart: 10 },     // Slide 2
    { duration: 7000, audioStart: 19 },     // Slide 3
    { duration: 11000, audioStart: 26 },    // Slide 4
    { duration: 9000, audioStart: 37 },     // Slide 5
    { duration: 11000, audioStart: 46 },    // Slide 6
    { duration: 8000, audioStart: 57 },     // Slide 7
    { duration: 10000, audioStart: 65 },    // Slide 8
    { duration: 2000, audioStart: 75 }      // Slide 9
  ];

  let sliderIndex = 0;
  let sliderTimer = null;
  let isPlaying = false;
  let slideAudio = document.getElementById('slideAudio');

  // Only initialize slider functionality if we're on the about page
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer && slideAudio) {
    console.log("Slide presentation initialized");
    
    // Make sure first slide is active
    const slides = document.querySelectorAll(".slider-container img");
    if (slides.length > 0) {
      slides.forEach(s => s.classList.remove("active"));
      slides[0].classList.add("active");
    }
    
    // Add click handlers to slides to stop presentation when clicked
    slides.forEach(slide => {
      slide.addEventListener("click", function() {
        if (isPlaying) {
          stopPresentation();
        }
      });
    });

    // Pre-load the audio
    slideAudio.load();
    
    // Initialize button click handlers
    const startBtn = document.querySelector("button[onclick='startPresentation()']");
    const stopBtn = document.querySelector("button[onclick='stopPresentation()']");
    const prevBtn = document.querySelector("button[onclick='prevSlide()']");
    const nextBtn = document.querySelector("button[onclick='nextSlide()']");
    
    if (startBtn) startBtn.addEventListener("click", function(e) {
      e.preventDefault();
      startPresentation();
    });
    
    if (stopBtn) stopBtn.addEventListener("click", function(e) {
      e.preventDefault();
      stopPresentation();
    });
    
    if (prevBtn) prevBtn.addEventListener("click", function(e) {
      e.preventDefault();
      prevSlide();
    });
    
    if (nextBtn) nextBtn.addEventListener("click", function(e) {
      e.preventDefault();
      nextSlide();
    });
    
    // Unlock audio on first user interaction - helps with browser autoplay policies
    document.addEventListener('click', function unlockAudio() {
      console.log("Attempting to unlock audio...");
      const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1TSU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
      // Play a short silent sound to unlock audio context
      silentSound.play().then(() => {
        document.removeEventListener('click', unlockAudio);
        console.log("Audio unlocked successfully");
      }).catch(e => {
        console.log("Audio unlock failed:", e);
      });
    }, {once: true});
  }

  // Function to start the presentation with synchronized audio
  function startPresentation() {
    if (isPlaying || !slideAudio) return;
    
    console.log("Starting presentation");
    isPlaying = true;
    
    // Show the current slide
    showSlide(sliderIndex);
    
    // Set audio to current slide's start time
    slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
    
    // Try to play audio
    const playPromise = slideAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("Audio playing from time:", slideConfig[sliderIndex].audioStart);
        // Schedule the next slide based on this slide's duration
        scheduleNextSlide();
      }).catch(error => {
        console.error("Audio playback failed:", error);
        isPlaying = false;
        alert("Please click the Start Presentation button again to enable audio");
      });
    }
  }

  // Function to stop the presentation
  function stopPresentation() {
    if (!isPlaying) return;
    
    console.log("Stopping presentation");
    isPlaying = false;
    
    // Clear the timer for next slide
    if (sliderTimer) {
      clearTimeout(sliderTimer);
      sliderTimer = null;
    }
    
    // Pause the audio
    if (slideAudio) {
      slideAudio.pause();
    }
  }

  // Schedule the next slide based on current slide's duration
  function scheduleNextSlide() {
    // Clear any existing timer
    if (sliderTimer) {
      clearTimeout(sliderTimer);
    }
    
    // Only schedule if we're playing
    if (isPlaying) {
      console.log(`Scheduling next slide in ${slideConfig[sliderIndex].duration}ms`);
      sliderTimer = setTimeout(() => {
        nextSlide();
      }, slideConfig[sliderIndex].duration);
    }
  }

  // Go to next slide
  function nextSlide() {
    const slides = document.querySelectorAll(".slider-container img");
    
    // Increment slide index (with wrap-around)
    sliderIndex++;
    if (sliderIndex >= slides.length) {
      sliderIndex = 0;
    }
    
    console.log("Moving to slide:", sliderIndex);
    
    // Show the new slide
    showSlide(sliderIndex);
    
    // If we're playing, update audio position and schedule next slide
    if (isPlaying && slideAudio) {
      slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
      scheduleNextSlide();
    }
  }

  // Go to previous slide
  function prevSlide() {
    const slides = document.querySelectorAll(".slider-container img");
    
    // Decrement slide index (with wrap-around)
    sliderIndex--;
    if (sliderIndex < 0) {
      sliderIndex = slides.length - 1;
    }
    
    console.log("Moving to slide:", sliderIndex);
    
    // Show the new slide
    showSlide(sliderIndex);
    
    // If we're playing, update audio position and schedule next slide
    if (isPlaying && slideAudio) {
      slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
      scheduleNextSlide();
    }
  }

  // Show a specific slide
  function showSlide(n) {
    const slides = document.querySelectorAll(".slider-container img");
    slides.forEach(s => s.classList.remove("active"));
    slides[n].classList.add("active");
  }

  // Make these functions available globally for the onclick attributes
  window.startPresentation = startPresentation;
  window.stopPresentation = stopPresentation;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  
  // Rest of your existing code...
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

  /************************************************
   * 7. Fix anchor links for Contribute and Volunteer
   ***********************************************/
  // Fix contribute links to target the correct section
  const contributeLinks = document.querySelectorAll('a[href*="#contributeSection"]');
  contributeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.getAttribute('href');
      // If it's on the same page
      if (targetUrl.startsWith('#') || window.location.pathname.includes('contact.html')) {
        e.preventDefault();
        const contributeSection = document.getElementById('contributeSection');
        if (contributeSection) {
          // Scroll to element with offset for the fixed header
          const headerHeight = document.querySelector('header').offsetHeight;
          const sectionTop = contributeSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: sectionTop - headerHeight - 20, // 20px additional offset
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Fix volunteer links to target the correct section
  const volunteerLinks = document.querySelectorAll('a[href*="#volunteerSection"]');
  volunteerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.getAttribute('href');
      // If it's on the same page
      if (targetUrl.startsWith('#') || window.location.pathname.includes('get-involved.html')) {
        e.preventDefault();
        const volunteerSection = document.getElementById('volunteerSection');
        if (volunteerSection) {
          // Scroll to element with offset for the fixed header
          const headerHeight = document.querySelector('header').offsetHeight;
          const sectionTop = volunteerSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: sectionTop - headerHeight - 20, // 20px additional offset
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Also handle direct URL access with hash
  function handleHashScroll() {
    // Check if there's a hash in the URL
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
      }, 100); // Small delay to ensure page is fully loaded
    }
  }
  
  // Run on page load
  handleHashScroll();
  // Run when hash changes
  window.addEventListener('hashchange', handleHashScroll);

  // Debugging the popup
  console.log("Script initialized!");
});
