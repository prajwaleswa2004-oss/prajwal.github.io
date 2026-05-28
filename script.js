/* Prajwal E. Portfolio - Advanced JavaScript */

document.addEventListener("DOMContentLoaded", () => {

    /* ====== 0. CURSOR RESTORATION ====== */
    document.body.style.cursor = 'default';
    document.querySelectorAll('a, button, .tilt-card, .project-card-adv').forEach(el => el.style.cursor = 'pointer');

    /* ====== 1. BOOT SEQUENCE ====== */
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const bootMessages = [
        "> INITIALIZING PORTFOLIO...",
        "> LOADING PROJECT ARCHIVES...",
        "> WELCOME, PRAJWAL."
    ];
    if (bootScreen && bootText) {
        setTimeout(() => {
            if (bootScreen.style.display !== 'none') {
                bootScreen.classList.add('fade-out');
                document.body.style.overflow = 'auto';
                setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
            }
        }, 4000);
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

    /* ====== 2. FEA MESH NETWORK ====== */
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;background:radial-gradient(circle at center,#1a1a1a 0%,#000 100%)';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 40 : 80;
    const connectionDistance = isMobile ? 100 : 150;
    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width; this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5; this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.5)';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, i) => {
            p.update(); p.draw();
            for (let j = i; j < particles.length; j++) {
                const d = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
                if (d < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${(1 - d / connectionDistance) * 0.15})`;
                    ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
            if (mouse.x != null) {
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < 200) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(74,222,128,${(1 - d / 200) * 0.4})`;
                    ctx.lineWidth = 2; ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };
    animate();

    /* ====== 4. SCROLL PROGRESS BAR ====== */
    /* ===== PARALLAX SCROLL EFFECT ===== */

    window.addEventListener('scroll',()=>{

    const scrollY = window.scrollY;

    // Hero content
    const hero = document.querySelector('.hero-content');

    if(hero){
        hero.style.transform =
        `translateY(${scrollY * 0.2}px)`;
    }

    // Section headers
    document.querySelectorAll('.section-header')
    .forEach(header=>{

        const speed = 0.08;

        header.style.transform =
        `translateY(${scrollY * speed}px)`;

    });

    // Project cards depth
    document.querySelectorAll('.project-card-adv')
    .forEach((card,index)=>{

        const speed = (index % 2 === 0)
        ? 0.05
        : 0.08;

        card.style.transform =
        `translateY(${scrollY * speed}px)`;

    });

    });

    /* ====== 5. STICKY NAVBAR ====== */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ====== 6. ACTIVE NAV LINK HIGHLIGHT ====== */
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const highlightNav = () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) link.classList.add('active');
        });
    };
    window.addEventListener('scroll', highlightNav);

    /* ====== 7. MOBILE NAV TOGGLE ====== */
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* ====== 8. SKILL TABS ====== */
    const skillTabs = document.querySelectorAll('.skill-tab');
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('panel-' + tab.dataset.tab);
            if (panel) {
                panel.classList.add('active');
                animateSkillBars(panel);
            }
        });
    });

    /* ====== 9. ANIMATED SKILL BARS ====== */
    function animateSkillBars(container) {
        const fills = container ? container.querySelectorAll('.skill-fill') : document.querySelectorAll('.skill-panel.active .skill-fill');
        fills.forEach(fill => {
            fill.style.width = '0';
            fill.style.setProperty('--target-width', fill.dataset.width + '%');
            setTimeout(() => { fill.classList.add('animated'); fill.style.width = fill.dataset.width + '%'; }, 100);
        });
    }

    /* ====== 10. PROJECT FILTERING ====== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-adv');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ====== 11. 3D TILT CARD EFFECT ====== */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
            });
        });
    }

    /* ====== 12. PROJECT MODAL ====== */
    const projectModal = document.getElementById('project-modal');
    document.querySelectorAll('.project-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (projectModal) {
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const projectImages = [
        "assets/IMG-20251206-WA0055.jpg",
        "assets/IMG-20251206-WA0056.jpg",
        "assets/IMG-20251206-WA0057.jpg"
    ];
    let currentSlide = 0;
    const galleryImg = document.getElementById('gallery-img');
    const counterDisplay = document.getElementById('current-slide');

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

    /* ====== 13. MODAL CLOSE HANDLER ====== */
    const allModals = document.querySelectorAll('.modal-overlay');
    const closeGenericModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    allModals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) closeBtn.addEventListener('click', () => closeGenericModal(modal));
        modal.addEventListener('click', e => { if (e.target === modal) closeGenericModal(modal); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const active = document.querySelector('.modal-overlay.active');
            if (active) closeGenericModal(active);
        }
    });

    /* ====== 14. SCROLL REVEAL & COUNTERS ====== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hidden-element')) {
                    entry.target.classList.add('show-element');
                }
                // Animate skill bars when skills section is visible
                if (entry.target.id === 'skills') {
                    setTimeout(() => animateSkillBars(document.querySelector('.skill-panel.active')), 300);
                }
                // Counter animation
                entry.target.querySelectorAll('.counter').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const updateCount = () => {
                        const count = +counter.innerText;
                        const inc = Math.max(1, target / 100);
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 25);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hidden-element').forEach(el => observer.observe(el));

    /* ====== 15. BACK TO TOP ====== */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ====== 16. TYPEWRITER EFFECT ====== */
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) {
        const text = "Mechanical Engineer & Visual Storyteller";
        subtitle.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < text.length) { subtitle.textContent += text.charAt(i); i++; setTimeout(typeWriter, 40); }
        }
        setTimeout(typeWriter, 2500);
    }

    /* ====== 17. CONTACT FORM ====== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;
            const mailtoLink = `mailto:prajwaleswa2004@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
            window.open(mailtoLink, '_blank');
            contactForm.reset();
        });
    }

    /* ====== 18. MAGNETIC BUTTON EFFECT ====== */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    /* ====== 19. SYSTEM TIME ====== */
    function updateTime() {
        const el = document.getElementById('system-time');
        if (el) el.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    /* ====== 20. FEATHER ICONS ====== */
    if (typeof feather !== 'undefined') feather.replace();

    /* ====== 21. TAB TITLE TICKER ====== */
    const titleAlt = ["System Online", "Engineer", "Creator", "Open for Internships"];
    let titleIndex = 0;
    setInterval(() => {
        if (document.hidden) { document.title = "Connection Lost..."; }
        else { titleIndex = (titleIndex + 1) % titleAlt.length; document.title = `Prajwal E. | ${titleAlt[titleIndex]}`; }
    }, 2500);

    /* ====== 22. SMOOTH SCROLL FOR NAV LINKS ====== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});
