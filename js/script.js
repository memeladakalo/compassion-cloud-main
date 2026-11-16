/* Compassion Cloud interactive behaviour */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });
  }

  // Filter the demonstration disaster response cards.
  const disasterFilter = document.querySelector("#disaster-filter");
  if (disasterFilter) {
    disasterFilter.addEventListener("change", event => {
      const selected = event.target.value;
      document.querySelectorAll(".response-card").forEach(card => {
        card.hidden = selected !== "all" && card.dataset.status !== selected;
      });
    });
  }

  const showMessage = (element, message, type) => {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
  };

  const validateForm = form => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    return true;
  };

  const reliefForm = document.querySelector("#relief-form");
  const requestList = document.querySelector("#request-list");
  const clearRequests = document.querySelector("#clear-requests");

  const renderRequests = () => {
    if (!requestList) return;
    const requests = JSON.parse(localStorage.getItem("compassionCloudRequests") || "[]");
    requestList.innerHTML = requests.length ? requests.map(request => `
      <article class="request-item">
        <h3>${escapeHtml(request.type)} — ${escapeHtml(request.location)}</h3>
        <p><strong>${escapeHtml(request.name)}</strong> · ${escapeHtml(request.date)}</p>
        <p>${escapeHtml(request.details)}</p>
      </article>
    `).join("") : "<p>No demonstration requests have been submitted yet.</p>";
  };

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));

  if (reliefForm) {
    reliefForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(reliefForm)) return;
      const request = {
        name: document.querySelector("#requester-name").value.trim(),
        email: document.querySelector("#requester-email").value.trim(),
        type: document.querySelector("#request-type").value,
        location: document.querySelector("#request-location").value.trim(),
        details: document.querySelector("#request-details").value.trim(),
        date: new Date().toLocaleDateString()
      };
      const requests = JSON.parse(localStorage.getItem("compassionCloudRequests") || "[]");
      requests.unshift(request);
      localStorage.setItem("compassionCloudRequests", JSON.stringify(requests.slice(0, 10)));
      reliefForm.reset();
      showMessage(document.querySelector("#relief-message"), "Relief request saved successfully for this browser.", "success");
      renderRequests();
    });
  }

  if (clearRequests) {
    clearRequests.addEventListener("click", () => {
      localStorage.removeItem("compassionCloudRequests");
      renderRequests();
    });
  }
  renderRequests();

  const volunteerForm = document.querySelector("#volunteer-form");
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(volunteerForm)) return;
      showMessage(document.querySelector("#volunteer-message"), "Thank you. Your volunteer registration has been captured for this demonstration.", "success");
      volunteerForm.reset();
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateForm(contactForm)) return;
      showMessage(document.querySelector("#contact-message-status"), "Thank you. Your message has been prepared successfully for this demonstration.", "success");
      contactForm.reset();
    });
  }
});


/* ==========================================================================
   Single Sign-On (SSO) - Sign in with Google (Google Identity Services)
   --------------------------------------------------------------------------
   - Uses the OAuth 2.0 / OpenID Connect "Sign in with Google" button.
   - Google returns a signed ID token (JWT); we read the user's name, email
     and picture from it and keep a session in this browser.
   - The same Google account is used by the Zensa Android app (SSO across
     both the website and the mobile app).
   - Note: this is a front-end demonstration. The site has no server, so the
     token is checked in the browser only (audience and expiry).
   ========================================================================== */
(function () {
  "use strict";

  // Paste the Client ID of the "Compassion Cloud Web" OAuth client here.
  const GOOGLE_CLIENT_ID = "120335523489-jru0nlm8fr5f1rm5sljs6fu3ej1ljn2g.apps.googleusercontent.com";
  const SESSION_KEY = "compassionCloudUser";

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!user || user.exp * 1000 < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  };

  // Decode the payload (middle part) of the Google ID token.
  const decodeToken = token => {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  };

  const handleCredential = response => {
    try {
      const payload = decodeToken(response.credential);
      if (payload.aud !== GOOGLE_CLIENT_ID || payload.exp * 1000 < Date.now()) {
        throw new Error("Token audience or expiry check failed");
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture || "",
        exp: payload.exp
      }));
      window.location.reload();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };

  const signOut = () => {
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  const addStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      .auth-item { display: flex; align-items: center; gap: 0.5rem; }
      .auth-item img { width: 28px; height: 28px; border-radius: 50%; }
      .auth-item .auth-name { font-weight: 600; }
      .auth-item button { cursor: pointer; border: 1px solid currentColor; background: transparent;
        color: inherit; border-radius: 6px; padding: 0.25rem 0.6rem; font: inherit; }
    `;
    document.head.appendChild(style);
  };

  const buildNav = () => {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;
    const item = document.createElement("li");
    item.className = "auth-item";
    const user = getUser();

    if (user) {
      if (user.picture) {
        const img = document.createElement("img");
        img.src = user.picture;
        img.alt = "";
        img.referrerPolicy = "no-referrer";
        item.appendChild(img);
      }
      const name = document.createElement("span");
      name.className = "auth-name";
      name.textContent = user.name.split(" ")[0];
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Sign out";
      button.addEventListener("click", signOut);
      item.append(name, button);
      navLinks.appendChild(item);
    } else {
      navLinks.appendChild(item);
      const loadGoogle = () => {
        if (GOOGLE_CLIENT_ID.startsWith("PASTE_")) {
          console.warn("Set GOOGLE_CLIENT_ID in js/script.js to enable Google sign-in.");
          return;
        }
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential });
        google.accounts.id.renderButton(item, { theme: "outline", size: "medium", text: "signin_with" });
      };
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGoogle;
      document.head.appendChild(script);
    }
  };

  // Relief requests require a signed-in user; prefill their details.
  const protectReliefForm = () => {
    const form = document.querySelector("#relief-form");
    if (!form) return;
    const user = getUser();
    const message = document.querySelector("#relief-message");

    if (user) {
      const nameField = document.querySelector("#requester-name");
      const emailField = document.querySelector("#requester-email");
      if (nameField && !nameField.value) nameField.value = user.name;
      if (emailField && !emailField.value) emailField.value = user.email;
    }

    form.addEventListener("submit", event => {
      if (getUser()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (message) {
        message.textContent = "Please sign in with Google (top right) before submitting a relief request.";
        message.className = "form-message error";
      }
    }, true);
  };

  const start = () => {
    addStyles();
    buildNav();
    protectReliefForm();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
