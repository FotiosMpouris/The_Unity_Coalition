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
      if (src) { // Check if data attributes exist before setting src
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
  // Only create overlay if hamburger exists
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
   * 3. "Shop & Contribute" Popup - Modified
   ***********************************************/
  function createPopup() {
    console.log("Creating popup...");
    let mobileButtonsOverlay = document.createElement("div");
    mobileButtonsOverlay.id = "mobileButtonsOverlay";
    mobileButtonsOverlay.innerHTML = `
        <div class="mobile-buttons-content">
            <button class="close-mobile-btn" aria-label="Close popup">×</button>
            <h3>Check It Out</h3>
            <a href="https://www.amazon.com" id="mobileShopBtn" target="_blank" rel="noopener noreferrer">Shop</a>
            <a href="contact.html#contributeSection" id="mobileContributeBtn">Contribute</a>
        </div>
        `;
    document.body.appendChild(mobileButtonsOverlay);

    const closeBtn = mobileButtonsOverlay.querySelector(".close-mobile-btn");
    closeBtn.addEventListener("click", () => {
      mobileButtonsOverlay.classList.remove("show");
    });

    // Close popup if clicking outside the content
    mobileButtonsOverlay.addEventListener('click', (event) => {
        if (event.target === mobileButtonsOverlay) {
             mobileButtonsOverlay.classList.remove('show');
        }
    });

    console.log("Setting timeout to show popup in 10 seconds...");
    setTimeout(() => {
      console.log("Timeout executed, showing popup");
      // Only show if it hasn't been closed/interacted with? Add logic if needed.
      mobileButtonsOverlay.classList.add("show");
    }, 10000); // 10 seconds
  }

  function isHomePage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename === "" || filename === "index.html";
  }

  if (isHomePage()) {
    // Check screen width before creating popup if it should be mobile only
    // Example: if (window.innerWidth <= 768) { createPopup(); }
    // Currently runs regardless of width based on previous script logic:
    createPopup();
  }


  /************************************************
   * 4. About Page Video (Static Image, Play on Click, Pause on Scroll)
   ***********************************************/
  // NOTE: Ensure these selectors match your About page HTML if the video section exists there
  const videoWrapper = document.querySelector(".video-wrapper"); // Assuming you have a .video-wrapper div
  const playButton = document.querySelector(".play-button"); // Assuming you have a .play-button
  const videoContainer = document.querySelector(".video-container"); // Assuming you have a .video-container
  const homePageVideo = document.querySelector("main section video.home-video"); // Select the other video

  if (videoWrapper && playButton && videoContainer) {
      let aboutVideo = null; // Renamed to avoid conflict if another video exists

      // Create video element when play button is clicked
      playButton.addEventListener("click", () => {
          if (!aboutVideo) {
              aboutVideo = document.createElement("video");
              aboutVideo.classList.add("about-video"); // Add a class if needed for specific styling
              aboutVideo.setAttribute("playsinline", "");
              aboutVideo.setAttribute("controls", ""); // Add controls for easier interaction
              aboutVideo.innerHTML = `
                  <source src="slidevideo.mp4" type="video/mp4">
                  Your browser does not support the video tag.
                  `;
              videoContainer.innerHTML = ''; // Clear container before adding
              videoContainer.appendChild(aboutVideo);
          }

          aboutVideo.play();
          videoWrapper.classList.add("playing"); // Hide preview/button

          // Toggle audio is handled by controls now, removed click listener for mute
      });

      // Pause video when it scrolls out of view
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (!entry.isIntersecting && aboutVideo && !aboutVideo.paused) {
                      aboutVideo.pause();
                      // Optionally, restore the preview image when paused?
                      // videoWrapper.classList.remove("playing");
                  }
              });
          }, { threshold: 0.1 } // Lower threshold means it pauses sooner when scrolling out
      );

      observer.observe(videoWrapper);
  } else if (homePageVideo) {
      // Fallback or alternative logic if the about page video elements aren't found,
      // but the homepage video element IS found (on the current page).
      console.log("About page video elements not found. Checking homepage video.");
      homePageVideo.addEventListener("click", () => {
          homePageVideo.muted = !homePageVideo.muted;
          if (!homePageVideo.muted) {
              homePageVideo.play().catch(e => console.error("Error playing video:", e));
          }
      });
  } else {
      console.log("No video elements found matching About page or Homepage selectors.");
  }


  /************************************************
   * 5. Home Page Video (Click-to-toggle-audio) - Covered partially above
   ***********************************************/
   // The logic in section 4 now handles the homepage video if the about page video isn't present.


  /************************************************
   * 6. Bitcoin "Coming Soon" Popup
   ***********************************************/
  const homeBtcLogo = document.getElementById("homeBitcoinLogo");
  if (homeBtcLogo) {
    homeBtcLogo.addEventListener("click", () => {
      alert("Bitcoin donation option coming soon!"); // Slightly more informative
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
          const headerHeight = header ? header.offsetHeight : 0; // Use 0 if header not found
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // 20px buffer

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  }

  document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
          const targetUrl = this.getAttribute('href');
          const currentPath = window.location.pathname.split('/').pop(); // Get current page filename
          const targetPath = targetUrl.split('#')[0]; // Get path part of the link
          const targetHash = `#${targetUrl.split('#')[1]}`; // Get hash part

          // Check if it's an anchor link on the *current* page
          if (targetHash && (targetPath === "" || targetPath === currentPath)) {
              // Specific handling for known sections
              if (targetHash === '#contributeSection' || targetHash === '#volunteerSection') {
                  e.preventDefault();
                  smoothScrollToAnchor(targetHash);
              }
              // Add more specific hashes here if needed
              // else { /* Handle other same-page anchors if necessary */ }
          }
          // If it links to a different page's anchor, let the browser handle it,
          // but the handleHashScroll function below will smooth scroll on page load.
      });
  });

  // Function to handle scrolling on page load or hash change
  function handleHashScroll() {
      if (window.location.hash) {
          // Use setTimeout to ensure page layout is stable
          setTimeout(() => {
              smoothScrollToAnchor(window.location.hash);
          }, 100); // Delay might need adjustment
      }
  }

  handleHashScroll(); // Check hash on initial load
  window.addEventListener('hashchange', handleHashScroll, false); // Check if hash changes


  // ==========================================================
  // == NEW CODE BLOCK STARTS HERE ==
  // ==========================================================

  /************************************************
   * 8. API Form Submission Handling
   ***********************************************/
  // Selectors might need adjustment based on final HTML structure
  const joinFormHome = document.querySelector(".join-movement-form-container form"); // Target home page join form
  // Ensure the selector below uniquely identifies the Contact page form
  const subscribeFormContact = document.querySelector("main form:not(#volunteerForm):not(.join-movement-form-container form)"); // Attempt to select non-volunteer/join forms in main
  const volunteerForm = document.getElementById("volunteerForm"); // Target volunteer form by ID

  // !!! IMPORTANT: Replace with your actual API Gateway Invoke URL !!!
  const apiGatewayUrl = "https://po1s6ptb9g.execute-api.us-east-2.amazonaws.com/dev"; // e.g., https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/submit

  // --- Function to handle form submission ---
  async function handleFormSubmit(event, formType) {
    event.preventDefault(); // Prevent default HTML submission
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Check if submit button exists before proceeding
    if (!submitButton) {
        console.error("Submit button not found in form:", form);
        alert("An error occurred: Could not find the submit button.");
        return;
    }
    const originalButtonText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);
    const dataPayload = { formType: formType };

    // Populate payload based on form type
    try { // Wrap data gathering in try block for safety
        if (formType === 'join') {
            dataPayload.email = formData.get('email');
            dataPayload.zipCode = formData.get('zip');
            if (!dataPayload.email) throw new Error("Email is required."); // Basic validation
        } else if (formType === 'subscribe') {
            dataPayload.name = formData.get('name');
            dataPayload.email = formData.get('email');
            dataPayload.zipCode = formData.get('zip');
            dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on'; // Checkbox value is 'on' if checked
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
            // Get all checked interests
            const interests = [];
            form.querySelectorAll('input[name="interest"]:checked').forEach(checkbox => {
                interests.push(checkbox.value);
            });
            dataPayload.interests = interests; // Send empty array if none checked
            dataPayload.notRobotChecked = formData.get('not_robot') === 'on';
            dataPayload.privacyPolicyAgreed = formData.get('privacy_policy') === 'on';
             if (!dataPayload.email || !dataPayload.firstName || !dataPayload.lastName) throw new Error("First Name, Last Name, and Email are required.");
             if (!dataPayload.notRobotChecked) throw new Error("Please confirm you are not a robot.");
             if (!dataPayload.privacyPolicyAgreed) throw new Error("Privacy policy agreement is required.");
        } else {
            throw new Error(`Unknown form type: ${formType}`);
        }
    } catch (validationError) {
        console.error("Form validation/data error:", validationError);
        alert(`Error: ${validationError.message}`);
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return; // Stop processing
    }


    console.log(`Submitting ${formType} payload:`, JSON.stringify(dataPayload, null, 2));

    if (!apiGatewayUrl || apiGatewayUrl === "YOUR_API_GATEWAY_INVOKE_URL_HERE") {
        console.error("API Gateway URL is not configured!");
        alert("Error: API endpoint is not configured. Please contact support.");
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        return;
    }

    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPayload),
      });

      // Try parsing response body regardless of status code, as backend might send error details
      let responseData = {};
      try {
          responseData = await response.json();
      } catch (e) {
          console.warn("Could not parse JSON response body:", e);
          // If parsing fails, maybe use text?
          // responseData.message = await response.text(); // Uncomment if needed
      }


      if (response.ok) { // Checks status code 200-299
        console.log("Submission successful:", responseData);
        alert("Thank you! Your submission was successful.");
        form.reset(); // Clear the form
      } else {
        console.error("Submission failed:", response.status, responseData);
        // Try to show a more specific error from the backend if available
        const errorMessage = responseData.message || `Server responded with status ${response.status}. Please try again.`;
        alert(`Submission Failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network or other error sending request:", error);
      alert("An error occurred while sending your submission. Please check your connection and try again.");
    } finally {
      // Re-enable button regardless of success or failure
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }

  // --- Add event listeners to forms ---
  if (joinFormHome) {
    joinFormHome.addEventListener("submit", (event) => handleFormSubmit(event, 'join'));
    console.log("Join form listener added.");
  } else {
      console.log("Join form (home) not found on this page.");
  }

  if (subscribeFormContact) {
    // Verify this selector works reliably for the Contact page form
    subscribeFormContact.addEventListener("submit", (event) => handleFormSubmit(event, 'subscribe'));
    console.log("Subscribe form listener added.");
  } else {
      console.log("Subscribe form (contact) not found on this page.");
  }

  if (volunteerForm) {
    volunteerForm.addEventListener("submit", (event) => handleFormSubmit(event, 'volunteer'));
    console.log("Volunteer form listener added.");
  } else {
      console.log("Volunteer form (get involved) not found on this page.");
  }

  console.log("Form submission handlers potentially initialized."); // Updated log

  // ==========================================================
  // == NEW CODE BLOCK ENDS HERE ==
  // ==========================================================


  console.log("Script fully initialized!"); // This should be the last line inside the DOMContentLoaded listener
});

// --- END OF COMPLETE SCRIPT.JS ---
