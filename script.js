/* Prajwal E. Portfolio - Main JavaScript
   Features: Boot Sequence, FEA Mesh, Synchro-Gears, Mech-Audio, Decipher Text, Tab Ticker
*/

document.addEventListener("DOMContentLoaded", () => {

/* =========================================
   1. SYSTEM BOOT SEQUENCE (Professional + Fail-Safe)
========================================= */
const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');

const bootMessages = [
  "> INITIALIZING PORTFOLIO...",
  "> LOADING PROJECT ARCHIVES...",
  "> RENDERING VISUAL ASSETS...",
  "> WELCOME, PRAJWAL."
];

if (bootScreen && bootText) {
  // FAIL-SAFE: Remove screen after 4 sec (prevents mobile hang)
  setTimeout(() => {
    if (bootScreen.style.display !== 'none') {
      bootScreen.classList.add('fade-out');
      document.body.style.overflow = 'auto';
      setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
    }
  }, 4000);

  // Typing Animation
  let lineIndex = 0;
  const typeLine = () => {
    if (lineIndex < bootMessages.length) {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = bootMessages[lineIndex];
      bootText.appendChild(line);
      lineIndex++;
      setTimeout(typeLine, 200);
    } else {
      setTimeout(() => {
        bootScreen.classList.add('fade-out');
        document.body.style.overflow = 'auto';
        setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
      }, 500);
    }
  };
  typeLine();
}

/* =========================================
   2. FEA MESH NETWORK (Background)
========================================= */
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.background = 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 40 : 80;
const connectionDistance = isMobile ? 100 : 150;
const mouseDistance = 200;

const resize = () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.fillStyle = 'rgba(74, 222, 128, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

let mouse = { x: null, y: null };

window.addEventListener("mousemove", e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX; 
  mouse.y = e.touches[0].clientY;
});

const animate = () => {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.update();
    p.draw();

    // Connect particles
    for (let j = i; j < particles.length; j++) {
      const dx = p.x - particles[j].x;
      const dy = p.y - particles[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist < connectionDistance) {
        ctx.beginPath();
        const opacity = 1 - (dist / connectionDistance);
        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.15})`;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Mouse connections
    if (mouse.x != null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouseDistance) {
        ctx.beginPath();
        const opacity = 1 - (dist / mouseDistance);
        ctx.strokeStyle = `rgba(74,222,128,${opacity * 0.4})`;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
};
animate();

/* =========================================
   3. AUDIO FEEDBACK SYSTEM
========================================= */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playSound = (type) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "hover") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  else if (type === "click") {
    osc.type = "square";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }
};

const interactiveElements = document.querySelectorAll("a, button, .card, .project-card, .resume-btn");
interactiveElements.forEach(el => {
  el.addEventListener("mouseenter", () => playSound("hover"));
  el.addEventListener("mousedown", () => playSound("click"));
});

/* =========================================
   4. SYNCHRO-GEAR SCROLL ENGINE
========================================= */
const gear1 = document.querySelector(".gear-1");
const gear2 = document.querySelector(".gear-2");

if (gear1 && gear2) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    gear1.style.transform = `rotate(${y / 10}deg)`;
    gear2.style.transform = `rotate(${y / -5}deg)`;
  });
}

/* =========================================
   5. DECIPHER TEXT EFFECT
========================================= */
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const headers = document.querySelectorAll(".card h3");

headers.forEach(header => {
  header.addEventListener("mouseenter", event => {
    let iterations = 0;
    const original = event.target.dataset.value || event.target.innerText;
    if (!event.target.dataset.value) event.target.dataset.value = original;

    const interval = setInterval(() => {
      event.target.innerText = original
        .split("")
        .map((letter, i) => (i < iterations ? original[i] : letters[Math.floor(Math.random() * 36)]))
        .join("");

      if (iterations >= original.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  });
});

/* =========================================
   6. CUSTOM PRECISION CURSOR
========================================= */
if (window.matchMedia("(min-width: 768px)").matches) {
  const cursorDot = document.createElement("div");
  const cursorOutline = document.createElement("div");

  cursorDot.className = "cursor-dot";
  cursorOutline.className = "cursor-outline";

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  window.addEventListener("mousemove", e => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;

    cursorOutline.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, { duration: 500, fill: "forwards" });
  });

  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
  });
}

/* =========================================
   7. TYPEWRITER EFFECT
========================================= */
const subtitle = document.querySelector(".subtitle");
if (subtitle) {
  const text = "Mechanical Engineer & Visual Storyteller";
  subtitle.textContent = "";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 40);
    }
  }
  setTimeout(typeWriter, 2500);
}

/* =========================================
   8. MAGNETIC BUTTONS
========================================= */
const magneticBtns = document.querySelectorAll(".contact-links a");
if (window.innerWidth > 768) {
  magneticBtns.forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

/* =========================================
   9. SPOTLIGHT & 3D TILT
========================================= */
const cardsContainer = document.getElementById("cards");
const cards = document.querySelectorAll(".card");

if (cardsContainer && window.innerWidth > 768) {
  cardsContainer.addEventListener("mousemove", e => {
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  });
}

/* =========================================
   10. MODAL & GALLERY
========================================= */
const modal = document.getElementById("project-modal");
const closeBtn = document.querySelector(".close-modal");
const projectCard = document.querySelector(".project-card");

const projectImages = [
  "assets/IMG-20251206-WA0058.jpg",
  "assets/IMG-20251206-WA0058.jpg",
  "assets/IMG-20251206-WA0058.jpg"
];

let currentSlide = 0;
const galleryImg = document.getElementById("gallery-img");
const counterDisplay = document.getElementById("current-slide");

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
  }, 300);
};

if (projectCard && modal && closeBtn) {
  projectCard.addEventListener("click", e => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

/* =========================================
   11. EDUCATION TRACKER
========================================= */
const eduCard = document.getElementById("edu-card");
if (eduCard) {
  eduCard.addEventListener("click", () => {
    eduCard.classList.toggle("tracking");
    const hint = eduCard.querySelector(".click-hint");
    if (hint) {
      hint.textContent = eduCard.classList.contains("tracking")
        ? "Tracking History..."
        : "(Click to track)";
    }
  });
}

/* =========================================
   12. SCROLL REVEAL & COUNTERS
========================================= */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("hidden-element")) {
        entry.target.classList.add("show-element");
      }

      const counters = entry.target.querySelectorAll(".counter");
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");

        const updateCount = () => {
          const count = +counter.innerText;
          const inc = target / 100;

          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 25);
          } else counter.innerText = target;
        };

        updateCount();
      });

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".hidden-element").forEach(el => observer.observe(el));
document.querySelectorAll(".card").forEach(el => {
  if (el.querySelector(".counter")) observer.observe(el);
});

/* =========================================
   13. SYSTEM TIME
========================================= */
function updateTime() {
  const t = document.getElementById("system-time");
  if (t) t.innerText = new Date().toLocaleTimeString("en-US", { hour12: false });
}
setInterval(updateTime, 1000);
updateTime();

if (typeof feather !== "undefined") feather.replace();

/* =========================================
   14. TAB TITLE TICKER
========================================= */
const titleAlt = ["System Online", "Engineer", "Creator", "Open for Internships"];
let titleIndex = 0;

setInterval(() => {
  if (document.hidden) {
    document.title = "⚠️ Connection Lost...";
  } else {
    titleIndex = (titleIndex + 1) % titleAlt.length;
    document.title = `Prajwal E. | ${titleAlt[titleIndex]}`;
  }
}, 2500);

/* =========================================
   19. KINETIC SCROLL PHYSICS
========================================= */
const gridContainer = document.querySelector(".bento-grid");
let lastScrollY = window.scrollY;
let currentSkew = 0;
let targetSkew = 0;

const animateScrollPhysics = () => {
  const y = window.scrollY;
  const velocity = y - lastScrollY;

  targetSkew = velocity * 0.15;
  targetSkew = Math.max(Math.min(targetSkew, 7), -7);

  currentSkew += (targetSkew - currentSkew) * 0.1;

  if (gridContainer) {
    const scale = 1 - Math.abs(currentSkew) * 0.005;
    gridContainer.style.transform =
      `perspective(1000px) rotateX(${-currentSkew}deg) scale(${scale})`;
  }

  lastScrollY = y;
  requestAnimationFrame(animateScrollPhysics);
};

animateScrollPhysics();

/* =========================================
   20. BLUEPRINT MODE TOGGLE
========================================= */
const bpToggle = document.getElementById("blueprint-toggle");

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

});
