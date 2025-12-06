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
