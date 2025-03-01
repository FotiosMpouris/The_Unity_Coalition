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
 * Improved About Page Slider
 ***********************************************/
let sliderIndex = 0;
let sliderTimer = null;
let isPlaying = false; // Track if presentation is playing
let slideAudio = document.getElementById('slideAudio');

// Initialize once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Make sure we have the audio element
  slideAudio = document.getElementById('slideAudio');
  
  // Add click handlers to slides
  const slides = document.querySelectorAll(".slider-container img");
  slides.forEach(slide => {
    slide.addEventListener("click", function() {
      togglePresentation();
    });
  });
});

// Toggle between play and pause
function togglePresentation() {
  if (isPlaying) {
    stopPresentation();
  } else {
    startPresentation();
  }
}

window.startPresentation = function() {
  if (isPlaying) return; // Prevent multiple timers
  
  isPlaying = true;
  showSlide(sliderIndex);
  
  // Clear any existing timer
  if (sliderTimer) clearInterval(sliderTimer);
  
  // Set new timer
  sliderTimer = setInterval(nextSlide, 4000);
  
  // Play audio from where it was paused
  if (slideAudio) {
    // Only reset to beginning if we're at the first slide
    if (sliderIndex === 0) {
      slideAudio.currentTime = 0;
    }
    
    // Add a promise to handle playback
    const playPromise = slideAudio.play();
    
    // Handle potential play() promise rejection (browser autoplay policy)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio playback failed: ", error);
        alert("Please interact with the page again to enable audio");
      });
    }
  }
};

window.stopPresentation = function() {
  isPlaying = false;
  
  // Clear timer
  if (sliderTimer) {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }
  
  // Pause audio (but don't reset position)
  if (slideAudio) {
    slideAudio.pause();
  }
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

// Remove the old click handler that might be causing issues
document.removeEventListener("click", function(e) {
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
