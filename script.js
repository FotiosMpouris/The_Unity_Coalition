// --- START OF COMPLETE SCRIPT.JS ---

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

  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  console.log(`Loaded theme: ${savedTheme}`);
  updateBanner(savedTheme);

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

  function updateBanner(theme) {
    if (bannerDesktop) {
      const src = theme === "dark" ? bannerDesktop.dataset.dark : bannerDesktop.dataset.light;
      if (src) {
          bannerDesktop.src = src;
      } else {
          console.warn("Dark/Light mode banner source not found for theme:", theme);
      }
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
  if (hamburger && navLinks) {
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
  } else {
      console.warn("Hamburger or NavLinks not found, mobile overlay not initialized.");
  }


  /************************************************
   * 3. "Shop & Contribute" Popup - MODIFIED FOR IMAGE
   ***********************************************/
  function createPopup() {
    console.log("Creating image popup...");
    // The main container for the overlay
    let imagePopupOverlay = document.createElement("div");
    imagePopupOverlay.id = "imagePopupOverlay"; // New ID for new CSS styling
    
    // The content inside the overlay, including the image and buttons
    imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <button class="close-popup-btn" aria-label="Close popup">×</button>
            <div class="popup-image-container">
              <!-- The background image will be set in CSS using popup.png -->
            </div>
            <div class="popup-button-group">
                <a href="https://www.amazon.com" class="popup-shop-btn" target="_blank" rel="noopener noreferrer">Shop Now</a>
                <a href="contact.html#contributeSection" class="popup-contribute-btn">Contribute</a>
            </div>
        </div>
    `;
    document.body.appendChild(imagePopupOverlay);

    const closeBtn = imagePopupOverlay.querySelector(".close-popup-btn");
    closeBtn.addEventListener("click", () => {
      imagePopupOverlay.classList.remove("show");
    });

    // Close popup if clicking the dark overlay area
    imagePopupOverlay.addEventListener('click', (event) => {
        if (event.target === imagePopupOverlay) {
             imagePopupOverlay.classList.remove('show');
        }
    });

    console.log("Setting timeout to show image popup in 10 seconds...");
    setTimeout(() => {
      console.log("Timeout executed, showing image popup");
      imagePopupOverlay.classList.add("show");
    }, 10000); // 10 seconds
  }

  function isHomePage() {
    return document.body.id === 'home-page';
  }

  // Only create the popup on the home page
  if (isHomePage()) {
    createPopup();
  }
  
  // --- ADD THIS NEW CSS BLOCK FOR THE NEW POPUP ---
  const popupStyles = `
    #imagePopupOverlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(10, 25, 47, 0.85);
        display: flex; justify-content: center; align-items: center;
        z-index: 10000;
        opacity: 0; visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    #imagePopupOverlay.show { opacity: 1; visibility: visible; }
    .image-popup-content {
        position: relative;
        width: 90%; max-width: 500px;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    #imagePopupOverlay.show .image-popup-content { transform: scale(1); }
    .popup-image-container {
        width: 100%;
        padding-top: 100%; /* Creates a square aspect ratio box */
        background-image: url('images/popup.png');
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .close-popup-btn {
        position: absolute; top: -15px; right: -15px;
        width: 40px; height: 40px;
        background: var(--patriot-white); color: var(--patriot-blue);
        border: 2px solid var(--patriot-blue);
        border-radius: 50%;
        font-size: 24px; font-weight: bold;
        cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        line-height: 1;
        z-index: 10;
        transition: all 0.2s ease;
    }
    .close-popup-btn:hover { transform: rotate(90deg) scale(1.1); background: var(--patriot-red); color: white; border-color:white; }
    .popup-button-group {
        display: flex;
        gap: 15px;
        margin-top: 20px;
        justify-content: center;
    }
    .popup-button-group a {
        padding: 12px 25px;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: bold;
        text-align: center;
        color: white;
        text-decoration: none;
        transition: all 0.2s ease;
    }
    .popup-shop-btn { background-color: var(--patriot-blue); border: 2px solid var(--patriot-cyan); }
    .popup-shop-btn:hover { background-color: var(--patriot-cyan); color: var(--patriot-blue); }
    .popup-contribute-btn { background-color: var(--patriot-red); }
    .popup-contribute-btn:hover { background-color: #ff505f; transform: scale(1.05); }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = popupStyles;
  document.head.appendChild(styleSheet);


  /************************************************
   * 4. About Page Video (Static Image, Play on Click, Pause on Scroll)
   ***********************************************/
  const videoWrapper = document.querySelector(".video-wrapper");
  const playButton = document.querySelector(".play-button");
  const videoContainer = document.querySelector(".video-container");

  if (videoWrapper && playButton && videoContainer) {
    console.log("About page video elements found. Initializing player.");
    let aboutPageVideo = null; 

    playButton.addEventListener("click", () => {
        if (!aboutPageVideo) {
            aboutPageVideo = document.createElement("video");
            aboutPageVideo.classList.add("about-video");
            aboutPageVideo.setAttribute("playsinline", "");
            aboutPageVideo.setAttribute("controls", "");
            aboutPageVideo.innerHTML = `<source src="slidevideo.mp4" type="video/mp4">Your browser does not support the video tag.`;
            videoContainer.innerHTML = '';
            videoContainer.appendChild(aboutPageVideo);
        }
        aboutPageVideo.play().catch(e => console.error("Error playing about page video:", e));
        videoWrapper.classList.add("playing");
    });

    const aboutObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting && aboutPageVideo && !aboutPageVideo.paused) {
                    aboutPageVideo.pause();
                }
            });
        }, { threshold: 0.1 }
    );
    aboutObserver.observe(videoWrapper);

  } else {
    console.log("About page video elements (.video-wrapper, .play-button, .video-container) not found on this page.");
  }

  /************************************************
  * 5. Homepage Videos (Click-to-toggle-audio, Exclusive Audio)
  ***********************************************/
  const homePageVideos = document.querySelectorAll("video.home-video");

  if (homePageVideos.length > 0) {
    homePageVideos.forEach(video => {
        video.muted = true;
        video.addEventListener("click", () => {
            if (video.muted) {
                homePageVideos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.muted = true;
                    }
                });
                video.muted = false;
                video.play().catch(e => console.warn("Video play() failed:", e));
            } else {
                video.muted = true;
            }
        });
    });
  }

  /************************************************
   * 6. Bitcoin "Coming Soon" Popup
   ***********************************************/
  const homeBtcLogo = document.getElementById("homeBitcoinLogo");
  if (homeBtcLogo) {
    homeBtcLogo.addEventListener("click", () => {
      alert("Bitcoin donation option coming soon!");
    });
  }

  const contactBtcLogo = document.getElementById("bitcoinDonate");
  if (contactBtcLogo) {
    contactBtcLogo.addEventListener("click", () => {
      alert("Bitcoin donation option coming soon!");
    });
  }

  /************************************************
   * 7. Fix anchor links for Contribute and Volunteer
   ***********************************************/
  function smoothScrollToAnchor(hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  }

  document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
          const targetUrl = this.getAttribute('href');
          const currentPath = window.location.pathname.split('/').pop();
          const targetPath = targetUrl.split('#')[0];
          const targetHash = `#${targetUrl.split('#')[1]}`;

          if (targetHash && (targetPath === "" || targetPath === currentPath)) {
              if (targetHash === '#contributeSection' || targetHash === '#volunteerSection') {
                  e.preventDefault();
                  smoothScrollToAnchor(targetHash);
              }
          }
      });
  });

  function handleHashScroll() {
      if (window.location.hash) {
          setTimeout(() => {
              smoothScrollToAnchor(window.location.hash);
          }, 100);
      }
  }

  handleHashScroll();
  window.addEventListener('hashchange', handleHashScroll, false);


  /************************************************
   * 8. API Form Submission Handling
   ***********************************************/
  const joinFormHome = document.querySelector(".join-movement-form-container .modern-form-wrapper form");
  const subscribeFormContact = document.querySelector("main form:not(#volunteerForm):not(.join-movement-form-container form)");
  const volunteerForm = document.getElementById("volunteerForm");
  const apiGatewayUrl = "https://po1s6ptb9g.execute-api.us-east-2.amazonaws.com/dev/submit";

  async function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    if (!submitButton) {
        console.error("Submit button not found in form:", form);
        alert("An error occurred: Could not find the submit button.");
        return;
    }
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);
    const dataPayload = { formType: formType };

    try {
        if (formType === 'join') {
            dataPayload.email = formData.get('email');
            dataPayload.zipCode = formData.get('zip');
            if (!dataPayload.email) throw new Error("Email is required.");
        } else if (formType === 'subscribe') {
            dataPayload.name = formData.get('name');
            dataPayload.email = formData.get('email');
            dataPayload.zipCode = formData.get('zip');
            dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on';
            if (!dataPayload.email) throw new Error("Email is required.");
            if (!dataPayload.privacyPolicyAgreed) throw new Error("Privacy policy agreement is required.");
        } else if (formType === 'volunteer') {
            dataPayload.firstName = formData.get('firstName');
            dataPayload.lastName = formData.get('lastName');
            dataPayload.email = formData.get('email');
            dataPayload.phone = formData.get('phone');
            dataPayload.zipCode = formData.get('zip');
            dataPayload.city = formData.get('city');
            dataPayload.state = formData.get('state');
            const interests = [];
            form.querySelectorAll('input[name="interest"]:checked').forEach(checkbox => {
                interests.push(checkbox.value);
            });
            dataPayload.interests = interests;
            dataPayload.notRobotChecked = formData.get('not_robot') === 'on';
            dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on';
             if (!dataPayload.email || !dataPayload.firstName || !dataPayload.lastName) throw new Error("First Name, Last Name, and Email are required.");
             if (!dataPayload.notRobotChecked) throw new Error("Please confirm you are not a robot.");
             if (!dataPayload.privacyPolicyAgreed) throw new Error("Privacy policy agreement is required.");
        } else {
            throw new Error(`Unknown form type: ${formType}`);
        }
    } catch (validationError) {
        alert(`Error: ${validationError.message}`);
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }

    if (!apiGatewayUrl || apiGatewayUrl.includes("YOUR_API_GATEWAY")) {
        alert("Error: API endpoint is not configured. Please contact support.");
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }

    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload),
      });

      let responseData = {};
      try {
          responseData = await response.json();
      } catch (e) { console.warn("Could not parse JSON response body:", e); }

      if (response.ok) {
        alert("Thank you! Your submission was successful.");
        form.reset();
      } else {
        const errorMessage = responseData.message || `Server responded with status ${response.status}. Please try again.`;
        alert(`Submission Failed: ${errorMessage}`);
      }
    } catch (error) {
      alert("An error occurred while sending your submission. Please check your connection and try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }

  if (joinFormHome) {
    joinFormHome.addEventListener("submit", (event) => handleFormSubmit(event, 'join'));
  }
  if (subscribeFormContact) {
    subscribeFormContact.addEventListener("submit", (event) => handleFormSubmit(event, 'subscribe'));
  }
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", (event) => handleFormSubmit(event, 'volunteer'));
  }

  console.log("Script fully initialized!");
});

// --- END OF COMPLETE SCRIPT.JS ---
