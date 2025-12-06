document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. SPOTLIGHT EFFECT (Mouse Tracking)
       ========================================= */
    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
        cardsContainer.onmousemove = e => {
            for (const card of document.getElementsByClassName("card")) {
                const rect = card.getBoundingClientRect(),
                      x = e.clientX - rect.left,
                      y = e.clientY - rect.top,
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        };
    }

    /* =========================================
       2. MODAL LOGIC (Project Pop-up)
       ========================================= */
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

        // Close Modal (X Button)
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume scrolling
        });

        // Close Modal (Click Outside)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close Modal (Escape Key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* =========================================
       3. SCROLL ANIMATIONS (Reveal on Scroll)
       ========================================= */
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, observerOptions);

    // Target all hidden elements (Header + Cards)
    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach((el) => observer.observe(el));

    /* =========================================
       4. INITIALIZE ICONS
       ========================================= */
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
