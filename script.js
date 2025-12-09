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
