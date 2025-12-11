/* UPDATED script.js
   - Accessibility: keyboard focus, ARIA modal, focus trap
   - Performance: lazy AudioContext init, reduced-motion handling, mobile-friendly particles
   - UX: clearer keyboard interactions, tab indices, modal ARIA attributes
   - Author: Updated for Prajwal E. portfolio
*/

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     Helpers & Feature Flags
     --------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const particleCountBase = isMobile ? 24 : 80; // base values
  const particleCount = prefersReducedMotion ? Math.max(12, Math.floor(particleCountBase / 3)) : particleCountBase;
  const connectionDistance = isMobile ? 100 : 150;
  const mouseDistance = 200;

  /* ---------------------------
     DOM Shortcuts
     --------------------------- */
  const bootScreen = document.getElementById("boot-screen");
  const bootText = document.getElementById("boot-text");
  const interactiveSelector = "a, button, input, textarea, [role='button'], .card, .project-card, .resume-btn, .nav-btn, .sticky-contact";
  const interactiveElements = Array.from(document.querySelectorAll(interactiveSelector));
  const cardsContainer = document.getElementById("cards");
  const projectCard = document.querySelector(".project-card");
  const modal = document.getElementById("project-modal");
  const closeBtn = modal ? modal.querySelector(".close-modal") : null;
  const galleryImg = document.getElementById("gallery-img");
  const prevBtn = modal ? modal.querySelector(".prev-btn") : null;
  const nextBtn = modal ? modal.querySelector(".next-btn") : null;
  const counterDisplay = document.getElementById("current-slide");
  const bpToggle = document.getElementById("blueprint-toggle");
  const eduCard = document.getElementById("edu-card");

  /* ---------------------------
     1) BOOT SEQUENCE (safe)
     --------------------------- */
  const bootMessages = [
    "> INITIALIZING PORTFOLIO...",
    "> LOADING PROJECT ARCHIVES...",
    "> RENDERING VISUAL ASSETS...",
    "> WELCOME, PRAJWAL."
  ];

  if (bootScreen && bootText) {
    // Fail-safe remove after 3.5s (but try to animate lines first)
    let lineIndex = 0;
    const typeLine = () => {
      if (lineIndex < bootMessages.length) {
        const line = document.createElement("div");
        line.className = "boot-line";
        line.textContent = bootMessages[lineIndex++];
        bootText.appendChild(line);
        setTimeout(typeLine, 200);
      } else {
        setTimeout(hideBoot, 500);
      }
    };
    const hideBoot = () => {
      bootScreen.classList.add("fade-out");
      document.body.style.overflow = "auto";
      setTimeout(() => { bootScreen.style.display = "none"; }, 500);
    };
    // Start typing, but ensure we don't keep the screen forever
    typeLine();
    setTimeout(() => {
      if (bootScreen.style.display !== "none") hideBoot();
    }, 4000);
  }

  /* ---------------------------
     2) PARTICLE CANVAS (optimized)
     --------------------------- */
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";
  // If user prefers reduced motion, hide the canvas entirely
  if (!prefersReducedMotion) document.body.appendChild(canvas);

  const ctx = canvas.getContext && canvas.getContext("2d");
  let width = 0, height = 0, particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  if (ctx) {
    resizeCanvas();
    window.addEventListener("resize", () => {
      resizeCanvas();
    });
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 1.0 : 1.5);
      this.vy = (Math.random() - 0.5) * (isMobile ? 1.0 : 1.5);
      this.size = Math.random() * 1.5 + 0.6;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = "rgba(74, 222, 128, 0.45)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (ctx && !prefersReducedMotion) {
    particles = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  }

  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  function animateParticles() {
    if (!ctx || prefersReducedMotion) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();
      // connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < connectionDistance) {
          ctx.beginPath();
          const opacity = 1 - (dist / connectionDistance);
          ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.12})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      // mouse link
      if (mouse.x != null) {
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const distm = Math.hypot(dxm, dym);
        if (distm < mouseDistance) {
          ctx.beginPath();
          const opacity = 1 - (distm / mouseDistance);
          ctx.strokeStyle = `rgba(74,222,128,${opacity * 0.35})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  if (ctx && !prefersReducedMotion) animateParticles();

  /* ---------------------------
     3) Audio feedback (lazy init)
     --------------------------- */
  let audioCtx = null;
  function ensureAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        audioCtx = null;
      }
    }
    return audioCtx;
  }

  function playSound(type) {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.04);
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "click") {
      osc.type = "square";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  }

  // only attach simple audio on the first user gesture (to satisfy browser autoplay)
  function initAudioOnFirstGesture() {
    const onFirst = () => {
      ensureAudioCtx();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("keydown", onFirst, { once: true });
  }
  initAudioOnFirstGesture();

  /* ---------------------------
     4) Interactive element handling (keyboard friendly)
     --------------------------- */
  // ensure interactive elements have tabindex for keyboard
  interactiveElements.forEach(el => {
    if (!el.hasAttribute("tabindex")) {
      // only add if element is not inherently focusable
      const tag = el.tagName.toLowerCase();
      const focusableTags = ["a", "button", "input", "select", "textarea"];
      if (!focusableTags.includes(tag)) el.setAttribute("tabindex", "0");
    }
    // attach small audio feedback for pointer interactions (but not mandatory)
    el.addEventListener("mouseenter", () => { playSound("hover"); }, { passive: true });
    el.addEventListener("mousedown", () => { playSound("click"); }, { passive: true });
  });

  /* ---------------------------
     5) Decipher / hacker text effect (gentle)
     --------------------------- */
  (function decipherEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const headers = document.querySelectorAll(".card h3");
    headers.forEach(header => {
      header.addEventListener("mouseenter", event => {
        if (prefersReducedMotion) return;
        let iterations = 0;
        const element = event.target;
        const original = element.dataset.value || element.innerText;
        if (!element.dataset.value) element.dataset.value = original;
        const interval = setInterval(() => {
          element.innerText = original.split("").map((ch, i) => {
            if (i < iterations) return original[i];
            return letters[Math.floor(Math.random() * letters.length)];
          }).join("");
          iterations += 1/3;
          if (iterations >= original.length) {
            clearInterval(interval);
            element.innerText = original;
          }
        }, 30);
      }, { passive: true });
    });
  })();

  /* ---------------------------
     6) Cursor (optional) - kept optional
     --------------------------- */
  (function optionalCursor() {
    if (window.matchMedia("(min-width:768px)").matches) {
      // Only create cursor if developer activates via adding class "use-custom-cursor" on <body>
      if (!document.body.classList.contains("use-custom-cursor")) return;
      const cursorDot = document.createElement("div");
      const cursorOutline = document.createElement("div");
      cursorDot.className = "cursor-dot";
      cursorOutline.className = "cursor-outline";
      document.body.appendChild(cursorDot);
      document.body.appendChild(cursorOutline);

      window.addEventListener("mousemove", (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
      }, { passive: true });

      interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
      });
    }
  })();

  /* ---------------------------
     7) Gear scroll sync
     --------------------------- */
  (function gearsOnScroll() {
    const gear1 = document.querySelector(".gear-1");
    const gear2 = document.querySelector(".gear-2");
    if (!gear1 || !gear2) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      gear1.style.transform = `rotate(${y / 10}deg)`;
      gear2.style.transform = `rotate(${y / -5}deg)`;
    }, { passive: true });
  })();

  /* ---------------------------
     8) Typewriter subtitle (kept short)
     --------------------------- */
  (function typewriter() {
    const subtitle = document.querySelector(".subtitle");
    if (!subtitle || prefersReducedMotion) return;
    const text = "Mechanical Engineer & Visual Storyteller";
    subtitle.textContent = "";
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i++);
        setTimeout(typeWriter, 35);
      }
    }
    setTimeout(typeWriter, 900);
  })();

  /* ---------------------------
     9) Spotlight card tilt (low-impact)
     --------------------------- */
  if (cardsContainer && !prefersReducedMotion && window.innerWidth > 768) {
    cardsContainer.addEventListener("mousemove", (e) => {
      const cards = document.querySelectorAll(".card");
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    }, { passive: true });
  }

  /* ---------------------------
     10) Modal & Gallery (accessible)
     --------------------------- */
  const projectImages = [
    "assets/IMG-20251206-WA0058.jpg",
    "assets/IMG-20251206-WA0058.jpg",
    "assets/IMG-20251206-WA0058.jpg"
  ];
  let currentSlide = 0;
  if (galleryImg) galleryImg.src = projectImages[currentSlide];

  // utility to trap focus inside modal
  let lastFocusedElementBeforeModal = null;
  function trapFocus(modalEl) {
    const focusable = modalEl.querySelectorAll("a, button, input, textarea, [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleKey(e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        closeModal();
      }
    }
    modalEl.addEventListener("keydown", handleKey);
    return () => modalEl.removeEventListener("keydown", handleKey);
  }

  let releaseTrap = null;
  function openModal() {
    if (!modal) return;
    lastFocusedElementBeforeModal = document.activeElement;
    modal.classList.add("active");
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-hidden", "false");
    // mark main as inert-ish to screen readers
    document.querySelectorAll("main, header, footer, .bento-grid, .gear-container").forEach(el => el.setAttribute("aria-hidden", "true"));
    // set focus to close button
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
      // trap focus
      releaseTrap = trapFocus(modal);
    }, 40);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    modal.setAttribute("aria-hidden", "true");
    document.querySelectorAll("main, header, footer, .bento-grid, .gear-container").forEach(el => el.removeAttribute("aria-hidden"));
    if (releaseTrap) { releaseTrap(); releaseTrap = null; }
    if (lastFocusedElementBeforeModal) lastFocusedElementBeforeModal.focus();
  }

  window.changeSlide = function(direction) {
    if (!galleryImg) return;
    galleryImg.style.opacity = 0;
    setTimeout(() => {
      currentSlide += direction;
      if (currentSlide >= projectImages.length) currentSlide = 0;
      if (currentSlide < 0) currentSlide = projectImages.length - 1;
      galleryImg.src = projectImages[currentSlide];
      if (counterDisplay) counterDisplay.innerText = currentSlide + 1;
      galleryImg.style.opacity = 1;
    }, 220);
  };

  if (projectCard && modal && closeBtn) {
    projectCard.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
    // also open on keyboard Enter
    projectCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(); }
    });

    closeBtn.addEventListener("click", closeModal);
    if (prevBtn) prevBtn.addEventListener("click", () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => changeSlide(1));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });
  }

  /* ---------------------------
     11) Education tracker (small UI)
     --------------------------- */
  if (eduCard) {
    eduCard.addEventListener("click", () => {
      eduCard.classList.toggle("tracking");
      const hint = eduCard.querySelector(".click-hint");
      if (hint) hint.textContent = eduCard.classList.contains("tracking") ? "Tracking History..." : "(Click to track)";
    });
    eduCard.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") eduCard.click(); });
  }

  /* ---------------------------
     12) Intersection reveal & counters
     --------------------------- */
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("hidden-element")) entry.target.classList.add("show-element");
        const counters = entry.target.querySelectorAll(".counter");
        counters.forEach(counter => {
          const target = +counter.getAttribute("data-target") || 0;
          if (target <= 0) return;
          const step = Math.max(1, Math.floor(target / 80));
          let current = 0;
          const updater = () => {
            current += step;
            if (current < target) {
              counter.innerText = Math.min(current, target);
              setTimeout(updater, 18);
            } else counter.innerText = target;
          };
          updater();
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".hidden-element").forEach(el => observer.observe(el));
  document.querySelectorAll(".card").forEach(el => { if (el.querySelector(".counter")) observer.observe(el); });

  /* ---------------------------
     13) System time & icons
     --------------------------- */
  function updateTime() {
    const timeDisplay = document.getElementById("system-time");
    if (timeDisplay) timeDisplay.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
  }
  setInterval(updateTime, 1000);
  updateTime();

  if (typeof feather !== "undefined") feather.replace();

  /* ---------------------------
     14) Tab title ticker
     --------------------------- */
  (function titleTicker() {
    const titleAlt = ["System Online", "Engineer", "Creator", "Open for Internships"];
    let idx = 0;
    setInterval(() => {
      if (document.hidden) {
        document.title = "⚠️ Connection Lost...";
      } else {
        idx = (idx + 1) % titleAlt.length;
        document.title = `Prajwal E. | ${titleAlt[idx]}`;
      }
    }, 2800);
  })();

  /* ---------------------------
     15) Kinetic scroll physics (gentle)
     --------------------------- */
  (function kineticScroll() {
    const grid = document.querySelector(".bento-grid");
    if (!grid) return;
    let lastY = window.scrollY;
    let currentSkew = 0;
    let targetSkew = 0;
    const loop = () => {
      const y = window.scrollY;
      const velocity = y - lastY;
      targetSkew = velocity * 0.12;
      targetSkew = Math.max(Math.min(targetSkew, 7), -7);
      currentSkew += (targetSkew - currentSkew) * 0.08;
      const scale = 1 - Math.abs(currentSkew) * 0.004;
      grid.style.transform = `perspective(1000px) rotateX(${-currentSkew}deg) scale(${scale})`;
      lastY = y;
      requestAnimationFrame(loop);
    };
    loop();
  })();

  /* ---------------------------
     16) Blueprint toggle
     --------------------------- */
  if (bpToggle) {
    bpToggle.addEventListener("click", () => {
      document.body.classList.toggle("blueprint-active");
      if (document.body.classList.contains("blueprint-active")) {
        bpToggle.innerText = "SCHEMATIC";
        bpToggle.style.background = "transparent";
        bpToggle.style.color = "#fff";
        bpToggle.style.border = "1px solid #fff";
      } else {
        bpToggle.innerText = "RENDER";
        bpToggle.style.background = "#4ade80";
        bpToggle.style.color = "#000";
        bpToggle.style.border = "none";
      }
    });
  }

  /* ---------------------------
     17) Small accessibility helpers
     --------------------------- */
  // Make sure .project-card is keyboard-activatable
  if (projectCard) {
    projectCard.setAttribute("role", "button");
    if (!projectCard.hasAttribute("tabindex")) projectCard.setAttribute("tabindex", "0");
  }

  // ensure resume link accessible (already present)
  document.querySelectorAll("a[href^='mailto:']").forEach(a => {
    a.addEventListener("keydown", (e) => { if (e.key === "Enter") a.click(); });
  });

  /* ---------------------------
     18) Lazy image handling for gallery (improve perf)
     --------------------------- */
  if (galleryImg) {
    galleryImg.setAttribute("loading", "lazy");
    galleryImg.alt = galleryImg.alt || "Project image - Automated Curry Maker";
    // src already set above
  }

  /* ---------------------------
     19) Safety timeout for any open overlays on resize (small fix)
     --------------------------- */
  window.addEventListener("resize", () => {
    // If modal open and window resized, keep it centered; no special action required.
    // But if canvas exists, recalc size:
    if (canvas && ctx) resizeCanvas();
  }, { passive: true });

  /* ---------------------------
     20) End
     --------------------------- */
  console.log("Portfolio script initialized — Accessibility & performance features active.");
});
