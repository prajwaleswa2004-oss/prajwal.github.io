/* =========================================
   PRAJWAL E. PORTFOLIO - MAIN LOGIC
   Features: Boot Sequence, Particle Mesh, Dynamic Modals, Audio, & Physics
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. SYSTEM BOOT SEQUENCE
  ========================================= */
  const bootScreen = document.getElementById('boot-screen');
  const bootText = document.getElementById('boot-text');
  
  const bootMessages = [
    "> INITIALIZING KERNEL...",
    "> LOADING ASSETS [||||||||||] 100%",
    "> CONNECTING TO SERVER...",
    "> WELCOME, PRAJWAL."
  ];
  
  if (bootScreen && bootText) {
    // Fail-safe to remove boot screen if it hangs
    setTimeout(() => {
      if (bootScreen.style.display !== 'none') {
        bootScreen.classList.add('fade-out');
        document.body.style.overflow = 'auto';
        setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
      }
    }, 3500);
  
    // Typewriter effect for boot text
    let lineIndex = 0;
    const typeLine = () => {
      if (lineIndex < bootMessages.length) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = bootMessages[lineIndex];
        bootText.appendChild(line);
        lineIndex++;
        setTimeout(typeLine, 200); // Speed of typing
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
     2. FEA MESH NETWORK (Background Animation)
  ========================================= */
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  // Subtle radial gradient background
  canvas.style.background = 'radial-gradient(circle at center, #111 0%, #000 100%)';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  // Responsive settings
  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 30 : 70;
  const connectionDistance = isMobile ? 90 : 140;
  const mouseDistance = 180;
  
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
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = 'rgba(74, 222, 128, 0.4)'; // Green tint
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  
  let mouse = { x: null, y: null };
  
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("touchmove", e => {
    mouse.x = e.touches[0].clientX; 
    mouse.y = e.touches[0].clientY;
  });
  
  const animateParticles = () => {
    ctx.clearRect(0, 0, width, height);
  
    particles.forEach((p, i) => {
      p.update();
      p.draw();
  
      // Connect particles to each other
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
  
      // Connect particles to mouse
      if (mouse.x != null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseDistance) {
          ctx.beginPath();
          const opacity = 1 - (dist / mouseDistance);
          ctx.strokeStyle = `rgba(74,222,128,${opacity * 0.3})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animateParticles);
  };
  animateParticles();
  
  /* =========================================
     3. AUDIO INTERFACE (Sci-Fi Sounds)
  ========================================= */
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  const playSound = (type) => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
  
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
  
    if (type === "hover") {
      // High pitched blip
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }
    else if (type === "click") {
      // Low mechanical thud
      osc.type = "square";
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    }
  };
  
  // Attach sound to interactive elements
  const interactiveElements = document.querySelectorAll("a, button, .clickable-card");
  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => playSound("hover"));
    el.addEventListener("mousedown", () => playSound("click"));
  });
  
  /* =========================================
     4. CARD EXPANSION DATABASE (The Content)
  ========================================= */
  const cardDatabase = {
    "curry-maker": {
      title: "Automated Curry Maker",
      tags: ["Fusion 360", "Automation", "Mechatronics"],
      images: ["assets/IMG-20251206-WA0058.jpg"], // Replace with real paths if you have more images
      body: `
        <h3>The Problem</h3>
        <p>Cooking consistently requires precise timing and stirring. Manual methods are labor-intensive.</p>
        <h3>The Solution</h3>
        <p>I designed a smart cooking machine that automates the entire process using low-cost mechanical components.</p>
        <h3>Key Mechanisms</h3>
        <ul class="tech-details">
          <li><strong>Rotating Spoon:</strong> A custom gear-driven assembly to ensure even mixing.</li>
          <li><strong>Slotted Lid Timing:</strong> Automated ingredient release system.</li>
          <li><strong>Control Logic:</strong> Arduino-based timing sequence.</li>
        </ul>
      `
    },
    "engineering": {
      title: "Engineering Arsenal",
      tags: ["CAD/CAM", "FEA Analysis", "Prototyping"],
      images: ["assets/IMG-20251206-WA0058.jpg"], // Placeholder - use a different image if available
      body: `
        <h3>Core Competencies</h3>
        <p>My mechanical engineering journey focuses on the intersection of design, analysis, and manufacturing.</p>
        <h3>Software Proficiency</h3>
        <ul class="tech-details">
          <li><strong>Fusion 360:</strong> Advanced generative design & rendering.</li>
          <li><strong>Hypermesh:</strong> Finite Element Analysis (FEA) and meshing.</li>
          <li><strong>AutoCAD & UG NX:</strong> 2D drafting and complex surface modeling.</li>
        </ul>
        <h3>Design Philosophy</h3>
        <p>I believe in "Function First, Form Follows." Every line in my CAD drawings serves a mechanical purpose.</p>
      `
    },
    "creative": {
      title: "Visual Storytelling",
      tags: ["Cinematography", "Editing", "Direction"],
      images: ["assets/profile.jpg"], // Placeholder
      body: `
        <h3>The Art of the Cut</h3>
        <p>Beyond engineering, I explore narratives through the lens. Editing is where the story is truly rewritten.</p>
        <h3>Tools of Trade</h3>
        <ul class="tech-details">
          <li><strong>DaVinci Resolve / Premiere:</strong> Color grading and non-linear editing.</li>
          <li><strong>Photography:</strong> Street and mechanical macro photography.</li>
          <li><strong>Sketching:</strong> Concept art and product ideation.</li>
        </ul>
        <p style="margin-top:15px; font-style:italic; color:#888;">"Engineering builds the world; Art makes it worthwhile."</p>
      `
    },
    "programming": {
      title: "Computational Logic",
      tags: ["Python", "Automation", "Embedded Systems"],
      images: ["assets/profile.jpg"], // Placeholder
      body: `
        <h3>Code & Mechanics</h3>
        <p>I use programming primarily to control hardware and automate repetitive analysis tasks.</p>
        <h3>Projects</h3>
        <ul class="tech-details">
          <li><strong>Python Scripts:</strong> Automating data entry for engineering reports.</li>
          <li><strong>Arduino/C:</strong> Controlling servos and stepper motors for robotics.</li>
        </ul>
        <div style="background: #111; padding: 10px; border-left: 3px solid #4ade80; font-family: monospace; margin-top: 10px; font-size: 0.8rem;">
          > while(alive) { <br>
          &nbsp;&nbsp; learn(); <br>
          &nbsp;&nbsp; build(); <br>
          }
        </div>
      `
    }
  };
  
  /* =========================================
     5. DYNAMIC MODAL LOGIC
  ========================================= */
  const modal = document.getElementById("project-modal");
  const closeBtn = document.querySelector(".close-modal");
  const clickableCards = document.querySelectorAll(".clickable-card");
  
  // Modal Internal Elements
  const modalTitle = document.querySelector(".modal-title h2");
  const modalTags = document.querySelector(".modal-title .tags");
  const modalBody = document.querySelector(".modal-body");
  const galleryImg = document.getElementById("gallery-img");
  const counterDisplay = document.getElementById("current-slide");
  
  let currentGalleryImages = [];
  let currentSlideIndex = 0;
  
  // Open Modal Function
  function openModal(cardKey) {
    const data = cardDatabase[cardKey];
    if (!data) return;
  
    // Populate Text
    modalTitle.innerText = data.title;
    modalBody.innerHTML = data.body;
  
    // Populate Tags
    modalTags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
  
    // Setup Gallery
    currentGalleryImages = data.images;
    currentSlideIndex = 0;
    
    if (currentGalleryImages.length > 0) {
      galleryImg.src = currentGalleryImages[0];
      galleryImg.style.display = "block";
      if(counterDisplay) counterDisplay.innerText = `IMG 1 / ${currentGalleryImages.length}`;
    } else {
      galleryImg.style.display = "none";
      if(counterDisplay) counterDisplay.innerText = "";
    }
  
    // Show Modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }
  
  // Close Modal Function
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
  
  // Attach Click Listeners
  clickableCards.forEach(card => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-expand");
      openModal(key);
    });
  });
  
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  
  // Gallery Navigation (Global function for HTML buttons)
  window.changeSlide = function(direction) {
    if (currentGalleryImages.length <= 1) return;
  
    galleryImg.style.opacity = 0;
    
    setTimeout(() => {
      currentSlideIndex += direction;
      // Loop functionality
      if (currentSlideIndex >= currentGalleryImages.length) currentSlideIndex = 0;
      if (currentSlideIndex < 0) currentSlideIndex = currentGalleryImages.length - 1;
  
      galleryImg.src = currentGalleryImages[currentSlideIndex];
      if (counterDisplay) counterDisplay.innerText = `IMG ${currentSlideIndex + 1} / ${currentGalleryImages.length}`;
      
      galleryImg.style.opacity = 1;
    }, 200);
  };
  
  /* =========================================
     6. SYNCHRO-GEAR SCROLL
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
     7. EDUCATION TRACKER
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
     8. SCROLL REVEAL & COUNTERS
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
            const inc = Math.ceil(target / 100);
  
            if (count < target) {
              counter.innerText = count + inc;
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
     9. SYSTEM TIME
  ========================================= */
  function updateTime() {
    const t = document.getElementById("system-time");
    if (t) t.innerText = new Date().toLocaleTimeString("en-US", { hour12: false });
  }
  setInterval(updateTime, 1000);
  updateTime();
  
  // Initialize Icons
  if (typeof feather !== "undefined") feather.replace();
  
  /* =========================================
     10. BLUEPRINT MODE TOGGLE
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
        bpToggle.style.background = "#4ade80"; // var(--accent-green)
        bpToggle.style.color = "#000";
        bpToggle.style.border = "none";
      }
    });
  }
  
  /* =========================================
     11. KINETIC SCROLL SKEW (Physics)
  ========================================= */
  const gridContainer = document.querySelector(".bento-grid");
  let lastScrollY = window.scrollY;
  let currentSkew = 0;
  let targetSkew = 0;
  
  const animateScrollPhysics = () => {
    const y = window.scrollY;
    const velocity = y - lastScrollY;
  
    // Calculate target skew based on scroll speed
    targetSkew = velocity * 0.15;
    // Clamp values to prevent dizziness
    targetSkew = Math.max(Math.min(targetSkew, 5), -5);
  
    // Smooth interpolation (lerp)
    currentSkew += (targetSkew - currentSkew) * 0.1;
  
    if (gridContainer) {
      // Apply subtle 3D tilt
      const scale = 1 - Math.abs(currentSkew) * 0.002;
      gridContainer.style.transform =
        `perspective(1000px) rotateX(${-currentSkew}deg) scale(${scale})`;
    }
  
    lastScrollY = y;
    requestAnimationFrame(animateScrollPhysics);
  };
  animateScrollPhysics();

});
