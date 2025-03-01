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

/************************************************
   * Advanced About Page Slider with Custom Timing
   ***********************************************/
  // Configuration for each slide
  const slideConfig = [
    { duration: 5000, audioStart: 0 },      // Slide 0
    { duration: 5000, audioStart: 5 },      // Slide 1
    { duration: 9000, audioStart: 19 },     // Slide 2
    { duration: 7000, audioStart: 26 },     // Slide 3
    { duration: 11000, audioStart: 37 },    // Slide 4
    { duration: 9000, audioStart: 43 },     // Slide 5
    { duration: 11000, audioStart: 52 },    // Slide 6
    { duration: 8000, audioStart: 63 },     // Slide 7
    { duration: 10000, audioStart: 111 },   // Slide 8
    { duration: 2000, audioStart: 114 }     // Slide 9
  ];

  let sliderIndex = 0;
  let sliderTimer = null;
  let isPlaying = false;
  let slideAudio = document.getElementById('slideAudio');
  
  // Only initialize slider if we're on the About page (has slider elements)
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer && slideAudio) {
    // Remove the stop-presentation class from all slides
    const slides = document.querySelectorAll(".slider-container img");
    slides.forEach(slide => {
      slide.classList.remove("stop-presentation");
      
      // Add click handler to each slide
      slide.addEventListener("click", function() {
        if (isPlaying) {
          stopPresentation();
        }
      });
    });
    
    // Make first slide active
    if (slides.length > 0) {
      slides.forEach(s => s.classList.remove("active"));
      slides[0].classList.add("active");
    }
    
    // Add event listeners to control buttons
    const startBtn = document.querySelector("button[onclick='startPresentation()']");
    const stopBtn = document.querySelector("button[onclick='stopPresentation()']");
    const prevBtn = document.querySelector("button[onclick='prevSlide()']");
    const nextBtn = document.querySelector("button[onclick='nextSlide()']");
    
    if (startBtn) startBtn.addEventListener("click", startPresentation);
    if (stopBtn) stopBtn.addEventListener("click", stopPresentation);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    
    // Pre-load the audio
    slideAudio.load();
    
    // Attempt to unlock audio on first user interaction with the page
    document.body.addEventListener('click', function audioUnlock() {
      // Create and play a silent audio element
      const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
      silentAudio.play().then(() => {
        // Once the silent audio plays, we can remove this listener
        document.body.removeEventListener('click', audioUnlock);
        console.log("Audio unlocked successfully");
      }).catch(error => {
        console.log("Audio unlock failed: ", error);
      });
    }, { once: true });
  }

  function startPresentation() {
    if (isPlaying || !slideAudio) return;
    
    isPlaying = true;
    showSlide(sliderIndex);
    
    // Schedule next slide using the current slide's custom duration
    scheduleNextSlide();
    
    // Reset audio to the current slide's position
    slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
    
    // Try to play the audio
    const playPromise = slideAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio playback failed: ", error);
        alert("Please click the Start Presentation button again to enable audio");
        isPlaying = false;
      });
    }
  }

  function stopPresentation() {
    isPlaying = false;
    
    // Clear timer
    if (sliderTimer) {
      clearTimeout(sliderTimer);
      sliderTimer = null;
    }
    
    // Pause audio
    if (slideAudio) {
      slideAudio.pause();
    }
  }

  function scheduleNextSlide() {
    // Clear any existing timer
    if (sliderTimer) clearTimeout(sliderTimer);
    
    // Schedule next slide using current slide's duration
    sliderTimer = setTimeout(() => {
      if (isPlaying) nextSlide();
    }, slideConfig[sliderIndex].duration);
  }

  function nextSlide() {
    sliderIndex++;
    let slides = document.querySelectorAll(".slider-container img");
    
    if (sliderIndex >= slides.length) {
      sliderIndex = 0;
    }
    
    showSlide(sliderIndex);
    
    // If presentation is playing, set up audio and timing for new slide
    if (isPlaying) {
      // Set audio to the start time for this slide
      if (slideAudio) {
        slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
      }
      
      // Schedule the next slide
      scheduleNextSlide();
    }
  }

  function prevSlide() {
    sliderIndex--;
    let slides = document.querySelectorAll(".slider-container img");
    
    if (sliderIndex < 0) {
      sliderIndex = slides.length - 1;
    }
    
    showSlide(sliderIndex);
    
    // If presentation is playing, set up audio and timing for new slide
    if (isPlaying) {
      // Set audio to the start time for this slide
      if (slideAudio) {
        slideAudio.currentTime = slideConfig[sliderIndex].audioStart;
      }
      
      // Schedule the next slide
      scheduleNextSlide();
    }
  }

  function showSlide(n) {
    let slides = document.querySelectorAll(".slider-container img");
    slides.forEach(s => s.classList.remove("active"));
    slides[n].classList.add("active");
  }

  // Expose the functions to the global scope for button onclick handlers
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
