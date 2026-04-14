/* Prajwal E. Portfolio Main JavaScript 
   Aligned with Index.html & Style.css
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ====== 
       0. NATURAL CURSOR RESTORATION
       (Overrides CSS 'cursor: none' for natural feel)
    ====== */
    document.body.style.cursor = 'default';
    const linksAndBtns = document.querySelectorAll('a, button, .card, .trigger-modal');
    linksAndBtns.forEach(el => el.style.cursor = 'pointer');

    /* ====== 
       1. SYSTEM BOOT SEQUENCE
    ====== */
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');

    const bootMessages = [
        "> INITIALIZING PORTFOLIO...",
        "> LOADING PROJECT ARCHIVES...",
        "> WELCOME, PRAJWAL."
    ];

    if (bootScreen && bootText) {
        // FAIL-SAFE: Force remove screen after 4 seconds
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

    /* ====== 
       2. FEA MESH NETWORK (Background Simulation)
    ====== */
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

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    });

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            for (let j = index; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const distance = Math.hypot(dx, dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouseDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / mouseDistance);
                    ctx.strokeStyle = `rgba(74, 222, 128, ${opacity * 0.4})`;
                    ctx.lineWidth = 2;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };
    animate();

    /* ====== 
       3. SYNCHRO-GEAR SCROLL ENGINE
    ====== */
    const gear1 = document.querySelector('.gear-1');
    const gear2 = document.querySelector('.gear-2');
    if (gear1 && gear2) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            gear1.style.transform = `rotate(${scrollY / 10}deg)`;
            gear2.style.transform = `rotate(${scrollY / -5}deg)`;
        });
    }

    /* ====== 
       4. DECIPHER TEXT EFFECT (Hacker Style)
    ====== */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const headers = document.querySelectorAll('.card h3');
    headers.forEach(header => {
        header.addEventListener('mouseenter', event => {
            let iterations = 0;
            const originalText = event.target.dataset.value || event.target.innerText;
            if (!event.target.dataset.value) event.target.dataset.value = event.target.innerText;

            const interval = setInterval(() => {
                event.target.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (index < iterations) return originalText[index];
                        return letters[Math.floor(Math.random() * 36)];
                    })
                    .join("");
                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    /* ====== 
       5. TYPEWRITER EFFECT
    ====== */
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

    /* ====== 
       6. SPOTLIGHT (Card Hover Effect)
    ====== */
    const cardsContainer = document.getElementById("cards");
    const cards = document.querySelectorAll(".card");
    if (cardsContainer && window.innerWidth > 768) {
        cardsContainer.addEventListener("mousemove", (e) => {
            for (const card of cards) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        });
    }

    /* ====== 
       7. PROJECT MODAL & SLIDER
    ====== */
    const projectCard = document.querySelector('.project-card');
    const projectModal = document.getElementById('project-modal');
    
    // Project Slider Logic
    const projectImages = [
        "assets/IMG-20251206-WA0055.jpg",
        "assets/IMG-20251206-WA0056.jpg",
        "assets/IMG-20251206-WA0057.jpg"
    ];
    let currentSlide = 0;
    const galleryImg = document.getElementById('gallery-img');
    const counterDisplay = document.getElementById('current-slide');

    const changeSlide = function (direction) {
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

    // Attach slide navigation via event listeners (no inline onclick)
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); changeSlide(-1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); changeSlide(1); });

    if (projectCard && projectModal) {
        projectCard.addEventListener('click', (e) => {
            e.preventDefault();
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    /* ====== 
       8. EDUCATION MODAL (Standardized Logic)
    ====== */
    const eduCard = document.getElementById('edu-card');
    const eduModal = document.getElementById('education-modal');
    const eduItems = document.querySelectorAll('.edu-item');

    if (eduCard && eduModal) {
        eduCard.addEventListener('click', () => {
            eduModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Trigger Timeline Animation
            eduItems.forEach((item, index) => {
                item.classList.remove('show');
                setTimeout(() => item.classList.add('show'), index * 300);
            });
        });
    }

    /* =========================================
       9. UNIFIED MODAL CLOSE HANDLER
       Handles: Project, Education, and Info Modals
    ========================================= */
    const allModals = document.querySelectorAll('.modal-overlay');

    const closeGenericModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Reset Education Animations if present
        const items = modal.querySelectorAll('.edu-item.show');
        items.forEach(i => i.classList.remove('show'));
    };

    allModals.forEach(modal => {
        // 1. Close Button Click
        const closeBtn = modal.querySelector('.close-modal, .close-education');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeGenericModal(modal));
        }

        // 2. Click Outside (Background)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGenericModal(modal);
        });
    });

    // 3. Global ESC Key Handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) closeGenericModal(activeModal);
        }
    });

    /* ====== 
       10. SCROLL REVEAL & COUNTERS
    ====== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hidden-element')) {
                    entry.target.classList.add('show-element');
                }
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const updateCount = () => {
                            const count = +counter.innerText;
                            const inc = Math.max(1, target / 100);
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
    }, { threshold: 0.1 });

    document.querySelectorAll('.hidden-element').forEach((el) => observer.observe(el));
    document.querySelectorAll('.card').forEach((el) => {
        if(el.querySelector('.counter')) observer.observe(el);
    });

    /* ====== 
       11. GENERIC INFO MODAL SYSTEM (Populator)
    ====== */
    const infoModal = document.getElementById('info-modal');
    const infoTitle = document.getElementById('info-title');
    const infoBody = document.getElementById('info-body');
    const infoTags = document.getElementById('info-tags');

    if (infoModal) {
        const openInfoModal = (title, tags = [], bodyContent = null) => {
            infoTitle.textContent = title;

            // Build tags safely using DOM methods instead of innerHTML
            infoTags.textContent = '';
            tags.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                infoTags.appendChild(span);
            });

            // Clear and append body content safely
            infoBody.textContent = '';
            if (bodyContent) {
                infoBody.appendChild(bodyContent);
            }
            infoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        // Helper to build modal body content using safe DOM methods
        const createModalBody = (sections) => {
            const fragment = document.createDocumentFragment();
            sections.forEach(section => {
                if (section.type === 'p') {
                    const p = document.createElement('p');
                    p.textContent = section.text;
                    fragment.appendChild(p);
                } else if (section.type === 'h3') {
                    const h3 = document.createElement('h3');
                    h3.textContent = section.text;
                    fragment.appendChild(h3);
                } else if (section.type === 'ul') {
                    const ul = document.createElement('ul');
                    section.items.forEach(item => {
                        const li = document.createElement('li');
                        if (item.bold) {
                            const strong = document.createElement('strong');
                            strong.textContent = item.bold;
                            li.appendChild(strong);
                            li.appendChild(document.createTextNode(' ' + item.text));
                        } else {
                            li.textContent = item.text;
                        }
                        ul.appendChild(li);
                    });
                    fragment.appendChild(ul);
                } else if (section.type === 'br') {
                    fragment.appendChild(document.createElement('br'));
                }
            });
            return fragment;
        };

        // Profile Card
        document.getElementById('profile-card')?.addEventListener('click', () => {
            openInfoModal(
                "The Profile",
                ["Mechanical Engineer", "Designer", "Innovator"],
                createModalBody([
                    { type: 'p', text: 'I am an aspiring Mechanical Engineer skilled in CAD modelling, mechanism design, and automation. Seeking an internship to apply practical engineering skills in real-world product development and smart machine projects.' },
                    { type: 'br' },
                    { type: 'h3', text: 'Core Focus' },
                    { type: 'ul', items: [
                        { text: 'Designing automated systems using Fusion 360' },
                        { text: 'Merging hardware with software logic' },
                        { text: 'Visualizing complex engineering concepts' }
                    ]}
                ])
            );
        });

        // Engineering Card
        document.getElementById('engineering-card')?.addEventListener('click', () => {
            openInfoModal(
                "Engineering Skills",
                ["CAD", "Manufacturing", "Analysis"],
                createModalBody([
                    { type: 'p', text: 'My engineering toolkit is built for prototyping and production.' },
                    { type: 'ul', items: [
                        { bold: 'Fusion 360:', text: 'Advanced parametric modeling and assembly.' },
                        { bold: 'AutoCAD & UG NX:', text: 'Industry-standard drafting.' },
                        { bold: 'Hypermesh:', text: 'Finite Element Analysis (FEA).' },
                        { bold: '3D Printing:', text: 'Rapid prototyping from digital mesh to physical object.' }
                    ]}
                ])
            );
        });

        // Creative Card
        document.getElementById('creative-card')?.addEventListener('click', () => {
            openInfoModal(
                "Creative Works",
                ["Filmmaking", "Photography", "Design"],
                createModalBody([
                    { type: 'p', text: 'Engineering builds the product; creativity tells its story. I specialize in:' },
                    { type: 'ul', items: [
                        { bold: 'Video Editing:', text: 'Creating compelling narratives using Davinci Resolve.' },
                        { bold: 'Short Films:', text: 'Directing and shooting visual stories.' },
                        { bold: 'Photography:', text: 'Capturing industrial and natural aesthetics.' },
                        { bold: 'Sketching:', text: 'Concept art and visualization.' }
                    ]}
                ])
            );
        });

        // Programming Card
        document.getElementById('programming-card')?.addEventListener('click', () => {
            openInfoModal(
                "Programming Stack",
                ["Automation", "Logic", "Embedded"],
                createModalBody([
                    { type: 'p', text: 'I use code to control machinery and analyze data.' },
                    { type: 'ul', items: [
                        { bold: 'Python:', text: 'Automation scripts and data processing.' },
                        { bold: 'C Language:', text: 'Embedded programming for microcontrollers.' },
                        { bold: 'Java:', text: 'Object-oriented software development.' }
                    ]},
                    { type: 'p', text: 'Currently integrating IoT solutions with mechanical designs.' }
                ])
            );
        });

        // Social Impact Card
        document.getElementById('social-card')?.addEventListener('click', () => {
            openInfoModal(
                "Social Impact",
                ["Volunteering", "Leadership"],
                createModalBody([
                    { type: 'p', text: 'Engineering serves society. My contributions include:' },
                    { type: 'h3', text: 'CRPF Mega Plantation Drive' },
                    { type: 'p', text: 'Volunteered in a massive drive planting over 10,000 trees, managing logistics and irrigation planning.' },
                    { type: 'br' },
                    { type: 'h3', text: 'Student Leadership' },
                    { type: 'p', text: 'Served as Class Representative for 2 semesters, bridging the gap between faculty and students and organizing technical workshops.' }
                ])
            );
        });
    }

    /* ====== 
       12. SYSTEM TIME & ICONS
    ====== */
    function updateTime() {
        const timeDisplay = document.getElementById('system-time');
        if (timeDisplay) timeDisplay.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    if (typeof feather !== 'undefined') feather.replace();

    // Graceful fallback for profile image (replaces inline onerror handler)
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.style.display = 'none';
        });
    }

    /* ====== 
       13. TAB TITLE TICKER
    ====== */
    const titleAlt = ["System Online", "Engineer", "Creator", "Open for Internships"];
    let titleIndex = 0;
    setInterval(() => {
        if (document.hidden) {
            document.title = "Connection Lost...";
        } else {
            titleIndex = (titleIndex + 1) % titleAlt.length;
            document.title = `Prajwal E. | ${titleAlt[titleIndex]}`;
        }
    }, 2500);

    /* ====== 
       14. BLUEPRINT MODE TOGGLE
    ====== */
    const bpToggle = document.getElementById('blueprint-toggle');
    if (bpToggle) {
        bpToggle.addEventListener('click', () => {
            document.body.classList.toggle('blueprint-active');
            if (document.body.classList.contains('blueprint-active')) {
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
