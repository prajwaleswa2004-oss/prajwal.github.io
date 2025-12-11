/* script.js — Neon toggle + desktop-first enable + persistence
   Also keeps accessibility, reduced-motion, modal focus-trap, performance improvements
*/

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const particleCountBase = isMobile ? 24 : 80;
  const particleCount = prefersReducedMotion ? Math.max(12, Math.floor(particleCountBase / 3)) : particleCountBase;
  const connectionDistance = isMobile ? 100 : 150;
  const mouseDistance = 200;

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
  const neonToggle = document.getElementById("neon-toggle");
  const eduCard = document.getElementById("edu-card");

  /* BOOT sequence */
  const bootMessages = ["> INITIALIZING PORTFOLIO...", "> LOADING PROJECT ARCHIVES...", "> RENDERING VISUAL ASSETS...", "> WELCOME, PRAJWAL."];
  if (bootScreen && bootText) {
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
    const hideBoot = () => { bootScreen.classList.add("fade-out"); document.body.style.overflow = "auto"; setTimeout(()=>{ bootScreen.style.display = "none"; }, 500); };
    typeLine();
    setTimeout(()=>{ if (bootScreen.style.display !== "none") hideBoot(); }, 4000);
  }

  /* Canvas particles (same as before, conditional on reduced-motion) */
  // ... (same canvas particle code as earlier) ...
  // For brevity/clarity in this message, assume the particle code block from earlier full script remains unchanged here.
  // In your file, keep the particle creation/animation code exactly as provided previously (it was already optimized).

  /* Lazy Audio Init */
  let audioCtx = null;
  function ensureAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ audioCtx = null; }
    }
    return audioCtx;
  }
  function playSound(type) {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode); gainNode.connect(ctx.destination);
    if (type === "hover") {
      osc.type = "sine"; osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.04);
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === "click") {
      osc.type = "square"; osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    }
  }
  function initAudioOnFirstGesture() {
    const onFirst = () => { ensureAudioCtx(); window.removeEventListener("pointerdown", onFirst); window.removeEventListener("keydown", onFirst); };
    window.addEventListener("pointerdown", onFirst, { once:true }); window.addEventListener("keydown", onFirst, { once:true });
  }
  initAudioOnFirstGesture();

  /* Interactive elements: focusable & small audio */
  interactiveElements.forEach(el => {
    if (!el.hasAttribute("tabindex")) {
      const tag = el.tagName.toLowerCase();
      const focusableTags = ["a","button","input","select","textarea"];
      if (!focusableTags.includes(tag)) el.setAttribute("tabindex","0");
    }
    el.addEventListener("mouseenter", ()=>playSound("hover"), { passive:true });
    el.addEventListener("mousedown", ()=>playSound("click"), { passive:true });
  });

  /* Decipher header effect, typewriter, gears, reveal observers, modal focus-trap etc.
     Keep the same implementations from previous script — they remain unchanged.
     (Modal focus-trap, open/close, gallery navigation, intersection observer, time updater.)
  */

  /* ---------- NEON TOGGLE & AUTO ENABLE (desktop-first) ---------- */
  // Behavior:
  // - On first load, preference order:
  //   1) localStorage 'neonPreference' (true/false string)
  //   2) if not set, enable neon if viewport >= 900px AND user hasn't requested reduced-motion
  // - neonToggle button toggles body.neon-on and stores preference

  const NEON_KEY = "neonPreference";
  function setNeonState(on, persist=true) {
    if (on) document.body.classList.add("neon-on"); else document.body.classList.remove("neon-on");
    if (neonToggle) {
      neonToggle.setAttribute("aria-pressed", String(!!on));
      neonToggle.innerText = `Neon: ${on ? "ON" : "OFF"}`;
    }
    if (persist) {
      try { localStorage.setItem(NEON_KEY, on ? "true" : "false"); } catch(e){}
    }
  }

  function initialNeonSetup() {
    const stored = (function(){ try { return localStorage.getItem(NEON_KEY); } catch(e){ return null; } })();
    if (stored === "true" || stored === "false") {
      setNeonState(stored === "true", false);
      return;
    }
    // no stored preference: enable by default on desktop if allowed
    const desktopAllowed = window.innerWidth >= 900 && !prefersReducedMotion;
    setNeonState(desktopAllowed, false);
  }

  if (neonToggle) {
    neonToggle.addEventListener("click", () => {
      const currentlyOn = document.body.classList.contains("neon-on");
      setNeonState(!currentlyOn, true);
      neonToggle.focus();
    });
    neonToggle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); neonToggle.click(); } });
  }

  // run initial setup
  initialNeonSetup();

  // if user resizes across the desktop threshold and they have NOT persisted a choice,
  // we update default behavior (but we do not overwrite user-saved preference).
  window.addEventListener("resize", () => {
    const stored = (function(){ try { return localStorage.getItem(NEON_KEY); } catch(e){ return null; } })();
    if (stored === null) {
      const desktopAllowed = window.innerWidth >= 900 && !prefersReducedMotion;
      setNeonState(desktopAllowed, false);
    }
  }, { passive:true });

  /* Blueprint toggle (unchanged) */
  if (bpToggle) {
    bpToggle.addEventListener("click", () => {
      document.body.classList.toggle("blueprint-active");
      const isActive = document.body.classList.contains("blueprint-active");
      bpToggle.innerText = isActive ? "SCHEMATIC" : "RENDER";
      bpToggle.setAttribute("aria-pressed", String(isActive));
      bpToggle.style.background = isActive ? "transparent" : "#4ade80";
      bpToggle.style.color = isActive ? "#fff" : "#000";
      bpToggle.style.border = isActive ? "1px solid #fff" : "none";
    });
  }

  /* Final init touches */
  if (typeof feather !== "undefined") feather.replace();
  console.log("Script initialized — neon toggle ready.");
});
