/* === COPY & REPLACE ALL CONTENT IN script.js === */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. TYPEWRITER EFFECT (Subtitle)
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) {
        const text = "Mechanical Engineer & Visual Storyteller";
        subtitle.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // 2. SPOTLIGHT & 3D TILT EFFECT
    const cardsContainer = document.getElementById("cards");
    const cards = document.querySelectorAll(".card");

    if (cardsContainer) {
        cardsContainer.addEventListener("mousemove", (e) => {
            for (const card of cards) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Spotlight position
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

                // 3D TILT CALCULATION (Subtle rotation)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Multipliers (-5 and 5) control the intensity of the tilt
                const rotateX = ((y - centerY) / centerY) * -5; 
                const rotateY = ((x - centerX) / centerX) * 5; 

                // Uncomment the line below if you want the tilt effect to be active
                // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
    }

    // 3. MODAL LOGIC (Project Pop-up)
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCard = document.querySelector('.project-card');

    if (projectCard && modal && closeBtn) {
        // Open Modal
        projectCard.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });

        // Close functions
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume scrolling
        };

        closeBtn.addEventListener('click', closeModal);
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // 4. SCROLL REVEAL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach((el) => observer.observe(el));

    // 5. INITIALIZE ICONS (Feather Icons)
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 6. MAGNETIC BUTTON EFFECT
    const magneticBtns = document.querySelectorAll('.contact-links a');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            // Move the button slightly towards the mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // 7. PRECISION CURSOR LOGIC
    // Create cursor elements only if they don't exist
    if (!document.querySelector('.cursor-dot')) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot moves instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline moves with a slight delay (smooth physics)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Expand cursor on hoverable elements
        const hoverables = document.querySelectorAll('a, button, .card, .project-card, .resume-btn');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // 8. LIVE SYSTEM TIME
    function updateTime() {
        const timeDisplay = document.getElementById('system-time');
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateTime, 1000);
    updateTime(); // Run immediately

    // 9. DELIVERY TRACKER TRIGGER
    const eduCard = document.getElementById('edu-card');
    if (eduCard) {
        eduCard.addEventListener('click', () => {
            // Toggle the animation class
            eduCard.classList.toggle('tracking');
            
            // Change the hint text
            const hint = eduCard.querySelector('.click-hint');
            if (hint) {
                if (eduCard.classList.contains('tracking')) {
                    hint.textContent = "Tracking History...";
                } else {
                    hint.textContent = "(Click to track)";
                }
            }
        });
    }

    // 10. DIGITAL ODOMETER (Counter)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const runCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20); 
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger counting when the card scrolls into view
    const impactCard = document.querySelector('.card .icon-box i[data-feather="heart"]')?.closest('.card');
    if (impactCard) {
        const counterObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                runCounters();
                counterObserver.disconnect(); // Only run once
            }
        });
        counterObserver.observe(impactCard);
    }

    // 11. PROJECT GALLERY LOGIC
    // List your images here
    const projectImages = [
        "assets/IMG-20251206-WA0058.jpg",
        "assets/IMG-20251206-WA0058.jpg", 
        "assets/IMG-20251206-WA0058.jpg"
    ];

    let currentSlide = 0;
    const galleryImg = document.getElementById('gallery-img');
    const counterDisplay = document.getElementById('current-slide');

    // Make the function global so the HTML buttons can see it
    window.changeSlide = function(direction) {
        if (!galleryImg) return;

        // Fade out
        galleryImg.style.opacity = 0;

        setTimeout(() => {
            // Update Index
            currentSlide += direction;

            // Loop Logic (If at end, go to start)
            if (currentSlide >= projectImages.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = projectImages.length - 1;
            }

            // Change Source
            galleryImg.src = projectImages[currentSlide];
            
            // Update Counter
            if (counterDisplay) counterDisplay.innerText = currentSlide + 1;

            // Fade In
            galleryImg.style.opacity = 1;
        }, 300); // Wait for fade out
    };

    // 12. SYSTEM BOOT SEQUENCE
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    
const bootMessages = [
    "> INITIALIZING PORTFOLIO...",
    "> LOADING PROJECT ARCHIVES...",
    "> RENDERING VISUAL ASSETS...",
    "> PREPARING INTERFACE...",
    "> WELCOME "
];
];

    if (bootScreen && bootText) {
        let lineIndex = 0;

        const typeLine = () => {
            if (lineIndex < bootMessages.length) {
                // Create a new line element
                const line = document.createElement('div');
                line.className = 'boot-line';
                line.textContent = bootMessages[lineIndex];
                bootText.appendChild(line);
                
                lineIndex++;
                
                // Random typing speed (makes it feel real)
                const randomDelay = Math.floor(Math.random() * 300) + 100;
                setTimeout(typeLine, randomDelay);
            } else {
                // Sequence finished: Fade out
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    // Allow scrolling again
                    document.body.style.overflow = 'auto';
                }, 800); // Wait a bit after "SYSTEM ONLINE"
            }
        };

        // Start the sequence
        setTimeout(typeLine, 500);
    }
});
