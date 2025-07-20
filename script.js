// --- START OF COMPLETE SCRIPT.JS (V3) ---

document.addEventListener("DOMContentLoaded", function() {
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".main-nav-links"); // Target new nav bar for mobile

  /************************************************
   * 1. Header Scroll Effect (Mobile Only)
   ***********************************************/
  // This might not be needed with a non-fixed header, but we can keep it for now.
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 50) {
        header.classList.add("mobile-scrolled");
      } else {
        header.classList.remove("mobile-scrolled");
      }
    }
  });

  /************************************************
   * 2. Hamburger Overlay (Updated)
   ***********************************************/
  if (hamburger && navLinks) {
      let overlay = document.createElement("div");
      overlay.classList.add("mobile-nav-overlay");
      document.body.appendChild(overlay);

      // Clone the main nav links for the overlay
      let overlayNavHTML = navLinks.innerHTML;
      overlay.innerHTML = overlayNavHTML;

      hamburger.addEventListener("click", () => {
          overlay.classList.toggle("show");
          hamburger.classList.toggle("is-active"); // Optional: for X animation
      });

      overlay.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
              overlay.classList.remove("show");
              hamburger.classList.remove("is-active");
          });
      });
  }

  /************************************************
   * 3. "Shop & Contribute" Popup - REBUILT
   ***********************************************/
  function createPopup() {
    console.log("Creating image card popup...");
    let imagePopupOverlay = document.createElement("div");
    imagePopupOverlay.id = "imagePopupOverlay";
    
    // New structure: A single "card" holds the image and the buttons
    imagePopupOverlay.innerHTML = `
        <div class="image-popup-content">
            <button class="close-popup-btn" aria-label="Close popup">×</button>
            <div class="popup-card">
              <div class="popup-image-container">
                <!-- BG image set in CSS -->
              </div>
              <div class="popup-button-group">
                  <a href="https://www.amazon.com" class="popup-shop-btn" target="_blank" rel="noopener noreferrer">Shop Now</a>
                  <a href="contact.html#contributeSection" class="popup-contribute-btn">Contribute</a>
              </div>
            </div>
        </div>
    `;
    document.body.appendChild(imagePopupOverlay);

    const closeBtn = imagePopupOverlay.querySelector(".close-popup-btn");
    closeBtn.addEventListener("click", () => imagePopupOverlay.classList.remove('show'));
    imagePopupOverlay.addEventListener('click', (e) => {
        if (e.target === imagePopupOverlay) imagePopupOverlay.classList.remove('show');
    });

    setTimeout(() => imagePopupOverlay.classList.add("show"), 10000);
  }

  function isHomePage() {
    return document.body.id === 'home-page';
  }

  if (isHomePage()) {
    createPopup();
  }
  
  // New Popup CSS injected via JS
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
        width: 90%; max-width: 450px;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    #imagePopupOverlay.show .image-popup-content { transform: scale(1); }
    .popup-card {
        background-color: #0E203F; /* Match card backgrounds */
        border: 1px solid var(--light-slate);
        border-radius: 8px;
        overflow: hidden; /* Important for rounded corners on image */
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .popup-image-container {
        width: 100%;
        padding-top: 75%; /* Aspect ratio for the image, adjust if needed */
        background-image: url('images/popup.png');
        background-size: cover;
        background-position: center;
    }
    .close-popup-btn {
        position: absolute; top: 0px; right: 0px;
        width: 40px; height: 40px;
        background: var(--patriot-white); color: var(--patriot-blue);
        border: none;
        border-radius: 0 8px 0 8px; /* Stylish corner radius */
        font-size: 24px; font-weight: bold; cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        line-height: 1; z-index: 10; transition: all 0.2s ease;
    }
    .close-popup-btn:hover { background: var(--patriot-red); color: white; }
    .popup-button-group {
        display: flex; gap: 15px; padding: 20px;
        justify-content: center;
    }
    .popup-button-group a {
        flex: 1; padding: 12px; border-radius: 4px; text-transform: uppercase;
        font-weight: bold; text-align: center; color: white;
        text-decoration: none; transition: all 0.2s ease;
    }
    .popup-shop-btn { background-color: transparent; border: 2px solid var(--patriot-cyan); color: var(--patriot-cyan); }
    .popup-shop-btn:hover { background-color: var(--patriot-cyan); color: var(--patriot-blue); }
    .popup-contribute-btn { background-color: var(--patriot-red); border: 2px solid var(--patriot-red); }
    .popup-contribute-btn:hover { filter: brightness(1.2); transform: scale(1.02); }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = popupStyles;
  document.head.appendChild(styleSheet);


  /************************************************
   * 4. Homepage Videos Exclusive Audio
   ***********************************************/
  const homePageVideos = document.querySelectorAll("video.home-video");
  if (homePageVideos.length > 0) {
    homePageVideos.forEach(video => {
        video.muted = true;
        video.addEventListener("click", () => {
            if (video.muted) {
                homePageVideos.forEach(otherVideo => { otherVideo.muted = true; });
                video.muted = false;
                video.play().catch(e => console.warn("Video play() failed:", e));
            } else {
                video.muted = true;
            }
        });
    });
  }

  /************************************************
   * 5. Bitcoin "Coming Soon" Popup
   ***********************************************/
  const homeBtcLogo = document.getElementById("homeBitcoinLogo");
  if (homeBtcLogo) {
    homeBtcLogo.addEventListener("click", () => alert("Bitcoin donation option coming soon!"));
  }

  /************************************************
   * 6. Smooth Scroll Anchors
   ***********************************************/
  function smoothScrollToAnchor(hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
          // Calculate offset from new header/nav structure
          const headerTotalHeight = 130; // approx height of all top bars
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerTotalHeight;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
  }
  document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
          const targetUrl = this.getAttribute('href');
          const currentPath = window.location.pathname.split('/').pop();
          const targetPath = targetUrl.split('#')[0];
          const targetHash = `#${targetUrl.split('#')[1]}`;
          if (targetHash && (targetPath === "" || targetPath === currentPath)) {
              e.preventDefault();
              smoothScrollToAnchor(targetHash);
          }
      });
  });

  /************************************************
   * 7. API Form Submission Handling
   ***********************************************/
  const joinFormHome = document.querySelector(".join-movement-form-container .modern-form-wrapper form");
  const apiGatewayUrl = "https://po1s6ptb9g.execute-api.us-east-2.amazonaws.com/dev/submit";
  async function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
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
        } else { throw new Error(`Unknown form type: ${formType}`); }
    } catch (validationError) {
        alert(`Error: ${validationError.message}`);
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }
    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload),
      });
      if (response.ok) {
        alert("Thank you! Your submission was successful.");
        form.reset();
      } else {
        const responseData = await response.json().catch(() => ({}));
        const errorMessage = responseData.message || `Server responded with status ${response.status}.`;
        alert(`Submission Failed: ${errorMessage}`);
      }
    } catch (error) {
      alert("An error occurred while sending your submission.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
  if (joinFormHome) {
    joinFormHome.addEventListener("submit", (event) => handleFormSubmit(event, 'join'));
  }
});

// --- END OF COMPLETE SCRIPT.JS (V3) ---
