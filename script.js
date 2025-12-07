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

                // 3D TILT CALCULATION
                // We calculate rotation based on how far the mouse is from center of card
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
                const rotateY = ((x - centerX) / centerX) * 5; 

                // Apply the transform
                // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        // Reset tilt on mouse leave (Optional - can feel cleaner without)
        /*
        cardsContainer.addEventListener("mouseleave", () => {
            for (const card of cards) {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            }
        });
        */
    }

    // 3. MODAL LOGIC (Fixed)
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCard = document.querySelector('.project-card');

    if (projectCard && modal && closeBtn) {
        // Open
        projectCard.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close functions
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

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

    // 5. INITIALIZE ICONS
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// 6. MAGNETIC BUTTON EFFECT
    const magneticBtns = document.querySelectorAll('.contact-links a');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            // Move the button slightly towards the mouse (divided by 5 for subtlety)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Snap back to center
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
/* ==========================
       7. PRECISION CURSOR LOGIC
       ========================== */
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
    const hoverables = document.querySelectorAll('a, button, .card, .project-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
/* ==========================
       8. LIVE SYSTEM TIME
       ========================== */
    function updateTime() {
        const timeDisplay = document.getElementById('system-time');
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateTime, 1000);
    updateTime(); // Run immediately
/* ==========================
       9. DELIVERY TRACKER TRIGGER
       ========================== */
    const eduCard = document.getElementById('edu-card');
    
    if (eduCard) {
        eduCard.addEventListener('click', () => {
            // Toggle the animation class
            eduCard.classList.toggle('tracking');
            
            // Change the hint text
            const hint = eduCard.querySelector('.click-hint');
            if(eduCard.classList.contains('tracking')) {
                hint.textContent = "Tracking History...";
            } else {
                hint.textContent = "(Click to track)";
            }
        });
    }
    /* ==========================
       11. PROJECT GALLERY LOGIC
       ========================== */
    
    // 1. List your images here
    const projectImages = [
    "assets/IMG-20251206-WA0058.jpg",
    "assets/IMG-20251206-WA0058.jpg", 
    "assets/IMG-20251206-WA0058.jpg"
];
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
