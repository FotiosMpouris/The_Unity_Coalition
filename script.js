document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.querySelector(".hamburger");
  const mainNavLinks = document.querySelector(".main-nav-links");

  /************************************************
   * 1. Hamburger Overlay
   ***********************************************/
  if (hamburger && mainNavLinks) {
      let overlay = document.createElement("div");
      overlay.classList.add("mobile-nav-overlay");
      document.body.appendChild(overlay);

      // Clone the main nav links for the overlay and add a close button
      let overlayNavHTML = `<button class="close-overlay-btn" aria-label="Close menu">×</button>${mainNavLinks.innerHTML}`;
      overlay.innerHTML = overlayNavHTML;

      const closeOverlayBtn = overlay.querySelector('.close-overlay-btn');

      const toggleOverlay = () => {
        overlay.classList.toggle("show");
        hamburger.classList.toggle("is-active");
      };

      hamburger.addEventListener("click", toggleOverlay);
      closeOverlayBtn.addEventListener("click", toggleOverlay);

      overlay.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
            if (overlay.classList.contains("show")) {
              toggleOverlay();
            }
          });
      });
  }

  /************************************************
   * 2. Homepage-Only Functionality
   ***********************************************/
  if (document.body.id === 'home-page') {
    // A. Create the Timed Popup
    function createPopup() {
      console.log("Creating image card popup...");
      let imagePopupOverlay = document.createElement("div");
      imagePopupOverlay.id = "imagePopupOverlay";
      imagePopupOverlay.innerHTML = `
          <div class="image-popup-content">
              <button class="close-popup-btn" aria-label="Close popup">×</button>
              <div class="popup-card">
                <div class="popup-image-container"></div>
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
    createPopup();

    // B. Exclusive Audio for Homepage Videos
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

    // C. Bitcoin "Coming Soon" Alert
    const homeBtcLogo = document.getElementById("homeBitcoinLogo");
    if (homeBtcLogo) {
      homeBtcLogo.addEventListener("click", () => alert("Bitcoin donation option coming soon!"));
    }
    
    // D. "Join Our Movement" Form Submission
    const joinFormHome = document.querySelector(".join-movement-form-container .modern-form-wrapper form");
    if (joinFormHome) {
        const apiGatewayUrl = "https://po1s6ptb9g.execute-api.us-east-2.amazonaws.com/dev/submit";
        
        joinFormHome.addEventListener("submit", async (event) => {
            event.preventDefault();
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const dataPayload = {
                formType: 'join',
                email: form.elements.email.value,
                zipCode: form.elements.zip.value
            };
            
            if (!dataPayload.email) {
                alert("Error: Email is required.");
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
        });
    }
  }

  /************************************************
   * 3. Site-Wide Smooth Scroll for Anchor Links
   ***********************************************/
  function smoothScrollToAnchor(hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
          const bannerHeight = document.querySelector('.top-banner')?.offsetHeight || 0;
          const totalOffset = headerHeight + navHeight + bannerHeight;

          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
  }

  document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          const targetPath = href.split('#')[0];
          const currentPath = window.location.pathname.split('/').pop() || 'index.html';

          // Only intercept if it's an anchor on the *current* page.
          if ((targetPath === '' || targetPath === currentPath) && href.includes('#')) {
              e.preventDefault();
              const targetHash = `#${href.split('#')[1]}`;
              smoothScrollToAnchor(targetHash);
          }
      });
  });

  console.log("ARL Script Initialized (V3)");
});
