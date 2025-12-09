/* Prajwal E. Portfolio - Main JavaScript
   Features: Boot Sequence, Custom Cursor, 3D Tilt, Gallery, Animations
*/

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. SYSTEM BOOT SEQUENCE (Professional + Fail-Safe)
       ========================================= */
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');

    // Professional Engineering Boot Messages
    const bootMessages = [
        "> INITIALIZING PORTFOLIO...",
        "> LOADING PROJECT ARCHIVES...",
        "> RENDERING VISUAL ASSETS...",
        "> WELCOME, PRAJWAL."
    ];

    if (bootScreen && bootText) {
        // FAIL-SAFE: Force remove screen after 4 seconds (prevents mobile stuck)
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
                // Faster typing speed for better UX
                setTimeout(typeLine, 200); 
            } else {
                // Sequence Complete -> Fade Out
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    document.body.style.overflow = 'auto';
                    setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
                }, 500);
            }
        };
        // Start typing
        typeLine();
    }

    /* =========================================
       2. CUSTOM PRECISION CURSOR
       ========================================= */
    // Only create cursor if not on mobile (Simple check)
    if (window.matchMedia("(min-width: 768px)").matches) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with smooth physics
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effects (Expand cursor on interactive elements)
        const hoverables = document.querySelectorAll('a, button, .card, .project-card, .resume-btn');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    /* =========================================
       3. TYPEWRITER EFFECT (Subtitle)
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
        // Start typing after boot sequence roughly finishes
        setTimeout(typeWriter, 2500);
    }

    /* =========================================
       4. MAGNETIC BUTTONS (Header Links)
       ========================================= */
    const magneticBtns = document.querySelectorAll('.contact-links a');
    if (window.innerWidth > 768) { // Only on desktop
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const position = btn.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;

                // Subtle magnetic pull
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* =========================================
       5. SPOTLIGHT & 3D TILT EFFECT
       ========================================= */
    const cardsContainer = document.getElementById("cards");
    const cards = document.querySelectorAll(".card");

    if (cardsContainer && window.innerWidth > 768) {
        cardsContainer.addEventListener("mousemove", (e) => {
            for (const card of cards) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Spotlight Position
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

                // 3D Tilt Math
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
                const rotateY = ((x - centerX) / centerX) * 5; 

                // Apply Tilt (Commented out if you prefer just spotlight)
                // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
    }

    /* =========================================
       6. MODAL & GALLERY LOGIC
       ========================================= */
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCard = document.querySelector('.project-card');

    // -- Gallery Data --
    const projectImages = [
        "assets/IMG-20251206-WA0058.jpg", // Main Image
        "assets/IMG-20251206-WA0058.jpg", // Duplicate for testing (Replace later)
        "assets/IMG-20251206-WA0058.jpg"  // Duplicate for testing (Replace later)
    ];
    
    let currentSlide = 0;
    const galleryImg = document.getElementById('gallery-img');
    const counterDisplay = document.getElementById('current-slide');

    // -- Global Function for HTML Buttons --
    window.changeSlide = function(direction) {
        if (!galleryImg) return;
        
        // Fade Out
        galleryImg.style.opacity = 0;

        setTimeout(() => {
            currentSlide += direction;
            // Loop logic
            if (currentSlide >= projectImages.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = projectImages.length - 1;

            // Update Source & Counter
            galleryImg.src = projectImages[currentSlide];
            if (counterDisplay) counterDisplay.innerText = currentSlide + 1;

            // Fade In
            galleryImg.style.opacity = 1;
        }, 300);
    };

    // -- Modal Open/Close --
    if (projectCard && modal && closeBtn) {
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        projectCard.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    /* =========================================
       7. EDUCATION TRACKER (Delivery Style)
       ========================================= */
    const eduCard = document.getElementById('edu-card');
    if (eduCard) {
        eduCard.addEventListener('click', () => {
            eduCard.classList.toggle('tracking');
            const hint = eduCard.querySelector('.click-hint');
            if (hint) {
                hint.textContent = eduCard.classList.contains('tracking') 
                    ? "Tracking History..." 
                    : "(Click to track)";
            }
        });
    }

    /* =========================================
       8. SCROLL ANIMATIONS & COUNTERS
       ========================================= */
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Reveal Elements
                if (entry.target.classList.contains('hidden-element')) {
                    entry.target.classList.add('show-element');
                }
                
                // Trigger Number Counters (Digital Odometer)
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-target');
                            const count = +counter.innerText;
                            const inc = target / 100; // Speed
                            
                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 25);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe hidden elements
    document.querySelectorAll('.hidden-element').forEach((el) => observer.observe(el));
    // Observe cards that contain counters
    document.querySelectorAll('.card').forEach((el) => {
        if(el.querySelector('.counter')) observer.observe(el);
    });

    /* =========================================
       9. LIVE SYSTEM TIME (Footer)
       ========================================= */
    function updateTime() {
        const timeDisplay = document.getElementById('system-time');
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    /* =========================================
       10. INITIALIZE ICONS
       ========================================= */
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
    /* =========================================
       13. WELDING SPARKS (PHYSICS ENGINE)
       ========================================= */
    // Create the canvas for sparks
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Click through it
    canvas.style.zIndex = '9998'; // Below the cursor, above bg
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    // Resize canvas to fill screen
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // The Particle Class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Random explosion direction
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.life = 1; // 100% life
            this.decay = Math.random() * 0.02 + 0.01; // Random fade speed
            this.color = [255, 150 + Math.random() * 100, 50]; // Orange/Yellow fire colors
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // Gravity (Sparks fall down)
            this.life -= this.decay;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2 * this.life, 0, Math.PI * 2);
            // Color changes from Hot Yellow -> Orange -> Grey as it dies
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.life})`;
            ctx.fill();
        }
    }

    // Spawn sparks on mouse move
    let lastX = 0;
    let lastY = 0;
    window.addEventListener('mousemove', (e) => {
        // Only spawn if mouse moved fast enough (optimizes performance)
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (dist > 5) {
            // Spawn 2 particles per movement event
            particles.push(new Particle(e.clientX, e.clientY));
            particles.push(new Particle(e.clientX, e.clientY));
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // Animation Loop
    const animateSparks = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw(ctx);
            // Remove dead particles
            if (p.life <= 0) particles.splice(index, 1);
        });
        
        requestAnimationFrame(animateSparks);
    };
    animateSparks();
    /* =========================================
       14. AUDIO FEEDBACK SYSTEM (Web Audio API)
       ========================================= */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to generate a synth beep
    const playSound = (type) => {
        if (audioCtx.state === 'suspended') audioCtx.resume(); // Wake up audio engine
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'hover') {
            // High pitched, short "chirp"
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'click') {
            // Lower pitched "mechanical clunk"
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    };

    // Attach sounds to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .project-card, .resume-btn');
    
    interactiveElements.forEach(el => {
        // Add "Chirp" on hover
        el.addEventListener('mouseenter', () => playSound('hover'));
        // Add "Clunk" on click
        el.addEventListener('mousedown', () => playSound('click'));
    });
