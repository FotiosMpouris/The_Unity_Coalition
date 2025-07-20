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
    function createPopup() {
      let imagePopupOverlay = document.createElement("div");
      imagePopupOverlay.id = "imagePopupOverlay";
      imagePopupOverlay.innerHTML = `
          <div class="image-popup-content"><button class="close-popup-btn" aria-label="Close popup">×</button><div class="popup-card"><div class="popup-image-container"></div><div class="popup-button-group"><a href="https://www.amazon.com" class="popup-shop-btn" target="_blank" rel="noopener noreferrer">Shop Now</a><a href="contact.html#contributeSection" class="popup-contribute-btn">Contribute</a></div></div></div>`;
      document.body.appendChild(imagePopupOverlay);
      const closeBtn = imagePopupOverlay.querySelector(".close-popup-btn");
      closeBtn.addEventListener("click", () => imagePopupOverlay.classList.remove('show'));
      imagePopupOverlay.addEventListener('click', (e) => { if (e.target === imagePopupOverlay) imagePopupOverlay.classList.remove('show'); });
      setTimeout(() => imagePopupOverlay.classList.add("show"), 10000);
    }
    createPopup();

    const homePageVideos = document.querySelectorAll("video.home-video");
    if (homePageVideos.length > 0) {
      homePageVideos.forEach(video => {
          video.muted = true;
          video.addEventListener("click", () => {
              if (video.muted) {
                  homePageVideos.forEach(otherVideo => { otherVideo.muted = true; });
                  video.muted = false;
                  video.play().catch(e => console.warn("Video play() failed:", e));
              } else { video.muted = true; }
          });
      });
    }

    const homeBtcLogo = document.getElementById("homeBitcoinLogo");
    if (homeBtcLogo) homeBtcLogo.addEventListener("click", () => alert("Bitcoin donation option coming soon!"));
  }

  /************************************************
   * 3. Form Submission Handling (Unified)
   ***********************************************/
  const apiGatewayUrl = "https://po1s6ptb9g.execute-api.us-east-2.amazonaws.com/dev/submit";
  
  const joinFormHome = document.querySelector("#home-page .join-movement-section form");
  if (joinFormHome) joinFormHome.addEventListener("submit", (event) => handleFormSubmit(event, 'join'));

  const volunteerForm = document.getElementById("volunteerForm");
  if (volunteerForm) volunteerForm.addEventListener("submit", (event) => handleFormSubmit(event, 'volunteer'));

  const subscribeForm = document.getElementById("subscribeForm");
  if (subscribeForm) subscribeForm.addEventListener("submit", (event) => handleFormSubmit(event, 'subscribe'));

  async function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const dataPayload = { formType };
    const formData = new FormData(form);

    try {
      if (formType === 'join') {
        dataPayload.email = formData.get('email');
        dataPayload.zipCode = formData.get('zip');
        if (!dataPayload.email) throw new Error("Email is required.");
      } 
      else if (formType === 'volunteer') {
        dataPayload.firstName = formData.get('firstName');
        dataPayload.lastName = formData.get('lastName');
        dataPayload.email = formData.get('email');
        dataPayload.phone = formData.get('phone');
        dataPayload.city = formData.get('city');
        dataPayload.state = formData.get('state');
        dataPayload.zipCode = formData.get('zip');
        dataPayload.interests = formData.getAll('interest');
        dataPayload.notRobotChecked = formData.get('not_robot') === 'on';
        dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on';
        if (!dataPayload.firstName || !dataPayload.lastName || !dataPayload.email) throw new Error("First Name, Last Name, and Email are required.");
        if (!dataPayload.notRobotChecked) throw new Error("Please confirm you are not a robot.");
        if (!dataPayload.privacyPolicyAgreed) throw new Error("You must agree to the Privacy Policy.");
      }
      else if (formType === 'subscribe') {
        dataPayload.name = formData.get('name');
        dataPayload.email = formData.get('email');
        dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on';
        if (!dataPayload.name || !dataPayload.email) throw new Error("Name and Email are required.");
        if (!dataPayload.privacyPolicyAgreed) throw new Error("You must agree to the Privacy Policy.");
      }
    } catch (validationError) {
        alert(`Error: ${validationError.message}`);
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }
    
    try {
        const response = await fetch(apiGatewayUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataPayload),
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
        console.error("Submission Error:", error);
        alert("An error occurred while sending your submission. Please check your connection.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
  }

  /******************************************************************
   * 4. Site-Wide Smooth Scroll for Anchor Links (REVISED & SIMPLIFIED)
   ******************************************************************/
  function smoothScrollToAnchor(hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
      }
  }

  // Listener for on-page anchor clicks
  document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          const targetPath = href.split('#')[0];
          const currentPath = window.location.pathname.endsWith('/') 
              ? window.location.pathname 
              : window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

          if ((targetPath === '' || targetPath === currentPath) && href.includes('#')) {
              e.preventDefault();
              const targetHash = `#${href.split('#')[1]}`;
              history.pushState(null, null, targetHash); // Optionally update URL
              smoothScrollToAnchor(targetHash);
          }
      });
  });

  // Also check for a hash in the URL when the page loads
  if (window.location.hash) {
    setTimeout(() => {
        smoothScrollToAnchor(window.location.hash);
    }, 100);
  }
  
  // Specific handler for Bitcoin logos on different pages
  const bitcoinDonateButton = document.getElementById("bitcoinDonate");
  if(bitcoinDonateButton) bitcoinDonateButton.addEventListener("click", () => alert("Bitcoin donation option coming soon!"));

  console.log("ARL Script Initialized (V8)");
});
