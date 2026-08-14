/**
 * Flotilla for Friendship 2026 - Main JavaScript
 * Handles animations, interactive UI, countdowns, counters, and navigation
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  ariaMobileMenu();
  initScrollAnimations();
  initCountdown();
  initCounters();
  initAccordions();
  initChecklist();
  initForms();
  initParallaxAnd3D();
  initPartnersMarquee();
  initCursorSpotlights();
  initMagneticButtons();
});

/* ==========================================================================
   1. Header & Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function ariaMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("active", isOpen);
    toggle.textContent = isOpen ? "Close" : "Menu";
    document.body.classList.toggle("nav-open", isOpen);
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  // Close when a nav link is tapped/clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close if viewport grows back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100 && nav.classList.contains("is-open")) {
      setOpen(false);
    }
  });
}

/* ==========================================================================
   2. Scroll Animations (IntersectionObserver with Staggered Cascades)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .reveal-stagger");
  if (!revealElements.length) return;

  // Automatically apply staggered delay indices to child grids for fluid flow
  document.querySelectorAll(".stats-grid, .overview-grid, .med-quadrants-list, .contact-grid, .logo-grid").forEach(grid => {
    Array.from(grid.children).forEach((child, idx) => {
      child.style.setProperty("--stagger-index", idx);
      child.classList.add("reveal-up");
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const grid = entry.target.closest(".logo-grid");
        if (grid) grid.classList.add("is-lit");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .reveal-stagger").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      const grid = el.closest(".logo-grid");
      if (grid) grid.classList.add("is-lit");
    }
    observer.observe(el);
  });
}

/* ==========================================================================
   3. Event Countdown Timer
   ========================================================================== */
function initCountdown() {
  const countdownContainer = document.querySelector("[data-countdown]");
  if (!countdownContainer) return;

  // August 19, 2026 09:00:00 EDT
  const eventDate = new Date("2026-08-19T09:00:00-04:00").getTime();

  function update() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownContainer.innerHTML = `<div class="countdown-finished">Flotilla 2026 is Today! Welcome Paddlers!</div>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = countdownContainer.querySelector("[data-days]");
    const hEl = countdownContainer.querySelector("[data-hours]");
    const mEl = countdownContainer.querySelector("[data-minutes]");
    const sEl = countdownContainer.querySelector("[data-seconds]");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. Animated Stat Counters
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll("[data-counter]");
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-counter"), 10);
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 2000;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(animate);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Medicine Wheel Selector
   ========================================================================== */
function initMedicineWheel() {
  const quadCards = document.querySelectorAll("[data-quad]");
  const imgBox = document.querySelector(".med-wheel-graphic-box");
  const img = document.querySelector(".med-wheel-img");

  if (!quadCards.length) return;

  quadCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      const direction = card.getAttribute("data-quad");
      quadCards.forEach(c => c.classList.remove("highlighted"));
      card.classList.add("highlighted");

      if (imgBox) {
        imgBox.setAttribute("data-active-direction", direction);
      }

      if (img) {
        const rotations = { north: 0, east: 90, south: 180, west: 270 };
        const rot = rotations[direction] || 0;
        img.style.transform = `rotate(${rot}deg) scale(1.08)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("highlighted");
      if (imgBox) {
        imgBox.removeAttribute("data-active-direction");
      }
      if (img) {
        img.style.transform = "rotate(0deg) scale(1)";
      }
    });
  });
}

/* ==========================================================================
   6. Accordions
   ========================================================================== */
function initAccordions() {
  const accordionTriggers = document.querySelectorAll("[data-accordion-trigger]");
  if (!accordionTriggers.length) return;

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const content = item.querySelector(".accordion-content");
      const isOpen = item.classList.contains("is-open");

      // Close sibling accordions in same group if desired
      const parent = item.closest(".accordion-group");
      if (parent) {
        parent.querySelectorAll(".accordion-item").forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove("is-open");
            const sibContent = sibling.querySelector(".accordion-content");
            if (sibContent) sibContent.style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        item.classList.remove("is-open");
        content.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   7. Interactive Event Preparation Checklist
   ========================================================================== */
function initChecklist() {
  const checklistItems = document.querySelectorAll(".checklist-item input[type='checkbox']");
  const progressFill = document.querySelector(".checklist-progress-fill");
  const progressText = document.querySelector(".checklist-progress-text");

  if (!checklistItems.length) return;

  function updateChecklist() {
    let checkedCount = 0;
    checklistItems.forEach(item => {
      if (item.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / checklistItems.length) * 100);

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${checkedCount} of ${checklistItems.length} items ready (${percent}%)`;
  }

  checklistItems.forEach(item => {
    item.addEventListener("change", updateChecklist);
  });

  updateChecklist();
}

/* ==========================================================================
   8. Form Handling & Toast Notifications
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll("form[data-subscribe], form[data-contact]");
  const CONTACT_EMAIL = "drr@ottawapolice.ca";

  forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isSubscribe = form.hasAttribute("data-subscribe");
      const isContact = form.hasAttribute("data-contact");
      const submitBtn = form.querySelector("button[type='submit']");
      const statusEl = form.querySelector("[data-contact-status], [data-subscribe-status]");
      const originalText = submitBtn ? submitBtn.innerHTML : "Submit";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;
      }

      if (statusEl) {
        statusEl.hidden = true;
        statusEl.textContent = "";
      }

      // Newsletter: send to configured FormSubmit endpoint when present
      if (isSubscribe) {
        const endpoint = form.getAttribute("action");
        if (endpoint && endpoint.includes("formsubmit.co")) {
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData.entries());
          try {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Subscribe failed");
            showToast("Miigwech! You've been subscribed to Flotilla updates.");
            form.reset();
          } catch (err) {
            showToast("Could not subscribe online. Please email drr@ottawapolice.ca.");
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          }
          return;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          showToast("Miigwech! You've been subscribed to Flotilla updates.");
          form.reset();
        }, 1000);
        return;
      }

      if (isContact) {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        // Drop honeypot field from payload noise if empty
        if (!payload._honey) delete payload._honey;

        try {
          const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(payload)
          });

          const result = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(result.message || "Unable to send message.");
          }

          showToast("Miigwech! Your message has been sent successfully.");
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.style.color = "var(--mw-east)";
            statusEl.textContent = `Message sent to ${CONTACT_EMAIL}.`;
          }
          form.reset();
        } catch (err) {
          showToast("Sorry — the message could not be sent. Please try again or call (343) 597-6699.");
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.style.color = "var(--mw-south)";
            statusEl.textContent = "Send failed. Please email drr@ottawapolice.ca or call (343) 597-6699.";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      }
    });
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    </div>
  `;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/* ==========================================================================
   9. Partners Marquee (seamless infinite slide)
   ========================================================================== */
function initPartnersMarquee() {
  const marquees = document.querySelectorAll("[data-partners-marquee], [data-logo-marquee]");
  if (!marquees.length) return;

  // Reduced motion: CSS shows a static wrapped grid, no duplication needed
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  marquees.forEach(marquee => {
    const track = marquee.querySelector(".partners-marquee-track, .logo-marquee-track");
    if (!track || track.dataset.marqueeReady === "true") return;

    const originals = Array.from(track.children);
    if (!originals.length) return;

    // Pad short rows so the strip is wide enough to feel continuous
    const targetWidth = Math.max(marquee.clientWidth * 1.6, 700);
    let guard = 0;
    while (track.scrollWidth < targetWidth && guard < 8) {
      originals.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      guard++;
    }

    // Duplicate the full padded set once → seamless translateX(-50%) loop
    Array.from(track.children).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      track.appendChild(clone);
    });

    const speed = Number(marquee.getAttribute("data-speed")) || 55;
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth > 0) {
      track.style.setProperty("--marquee-duration", `${(halfWidth / speed).toFixed(2)}s`);
    }

    track.dataset.marqueeReady = "true";
  });
}

function isTouchOrMobile() {
  return (
    window.matchMedia("(max-width: 1100px)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/* ==========================================================================
   10. Smooth 3D Tilt Effect (rAF-interpolated, glitch-free)
   ========================================================================== */
function initParallaxAnd3D() {
  // Respect users who prefer reduced motion / touch devices (prevents layout shifting)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (isTouchOrMobile()) return;

  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach(card => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let hovering = false;

    const MAX_TILT = 4;       // degrees — a bit more range so motion is felt
    const EASE_HOVER = 0.28;  // fast, snappy tracking while the cursor drives it
    const EASE_SETTLE = 0.1;  // softer glide back to rest after the cursor leaves

    function animate() {
      // Track quickly under the cursor; settle gently when it leaves
      const ease = hovering ? EASE_HOVER : EASE_SETTLE;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      card.style.transform =
        `perspective(1200px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

      // Stop the loop once settled back to rest
      if (!hovering && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
        card.style.transform = "";
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);
    }

    function startLoop() {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    }

    card.addEventListener("pointerenter", () => {
      hovering = true;
      // Disable CSS transitions on transform so they never fight the rAF loop
      card.style.transition = "box-shadow 0.3s ease";
      startLoop();
    });

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0 .. 1
      const py = (e.clientY - rect.top) / rect.height;  // 0 .. 1

      targetY = (px - 0.5) * 2 * MAX_TILT;   // left/right
      targetX = -(py - 0.5) * 2 * MAX_TILT;  // up/down
    });

    card.addEventListener("pointerleave", () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
      startLoop();
    });
  });
}

/* ==========================================================================
   11. Interactive Dynamic Spotlight Following Cursor (Apple Glass)
   ========================================================================== */
function initCursorSpotlights() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (isTouchOrMobile()) return;

  const glassCards = document.querySelectorAll(
    ".hero-card, .stat-card, .quad-card, .overview-card, .card-insta, .card-subscribe, .checklist-box, .content-card, .contact-card, .route-banner"
  );

  glassCards.forEach(card => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
      card.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
    });
  });
}

/* ==========================================================================
   12. Magnetic Buttons Interactive Pull
   ========================================================================== */
function initMagneticButtons() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (isTouchOrMobile()) return;

  const magneticBtns = document.querySelectorAll(".btn, .btn-nav-cta");

  magneticBtns.forEach(btn => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.03)`;
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "translate3d(0, 0, 0) scale(1)";
    });
  });
}

/* ==========================================================================
   13. YouTube / CTV Video Facade Players
   ========================================================================== */
function playVideo(wrapperId, videoId) {
  // YouTube embeds require a valid HTTP origin. When the site is opened
  // directly from disk (file://), the embed always fails with Error 153,
  // so open the video on YouTube instead.
  if (window.location.protocol === "file:") {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener");
    return;
  }

  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  wrapper.innerHTML = `
    <iframe 
      src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
      title="Flotilla for Friendship Video" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  `;
}

function playCtvVideo(wrapperId) {
  const ctvUrl = "https://www.ctvnews.ca/ottawa/video/2026/08/13/flotilla-for-friendships-25th-anniversary/";
  const embedUrl = "https://embed.jasperplayer.com/?brand=ctv_news&destination=ctvnews_web&language=EN&contentId=3427443";

  // file:// and many local previews block third-party video embeds — open CTV directly
  if (window.location.protocol === "file:") {
    window.open(ctvUrl, "_blank", "noopener");
    return;
  }

  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) {
    window.open(ctvUrl, "_blank", "noopener");
    return;
  }

  wrapper.innerHTML = `
    <iframe
      src="${embedUrl}"
      title="Flotilla for Friendship's 25th Anniversary — CTV News"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  `;
}
