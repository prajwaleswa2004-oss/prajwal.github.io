/* Prajwal E. Portfolio Main JavaScript 
   Features: Boot Sequence, FEA Mesh, Synchro-Gears, Mech-Audio, Decipher Text, Tab Ticker, Modals
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ====== 
       1. SYSTEM BOOT SEQUENCE (Professional Fail-Safe)
    ====== */
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');

    const bootMessages = [
        "> INITIALIZING PORTFOLIO...",
        "> LOADING PROJECT ARCHIVES...",
        "> RENDERING VISUAL ASSETS...",
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
       3. AUDIO FEEDBACK SYSTEM (Mech-UI)
    ====== */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playSound = (type) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    };

    const interactiveElements = document.querySelectorAll('a, button, .card, .trigger-modal, .resume-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('mousedown', () => playSound('click'));
    });

    /* ====== 
       4. SYNCHRO-GEAR SCROLL ENGINE
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
       5. DECIPHER TEXT EFFECT (Hacker Style)
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
       6. CUSTOM PRECISION CURSOR
    ====== */
    if (window.matchMedia("(min-width: 768px)").matches) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        window.addEventListener("mousemove", (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    /* ====== 
       7. TYPEWRITER EFFECT
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
       8. MAGNETIC BUTTONS
    ====== */
    const magneticBtns = document.querySelectorAll('.contact-links a');
    if (window.innerWidth > 768) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const position = btn.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* ====== 
       9. SPOTLIGHT & 3D TILT
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
       10. ORIGINAL PROJECT MODAL & GALLERY
    ====== */
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCard = document.querySelector('.project-card');

    const projectImages = [
        "assets/IMG-20251206-WA0058.jpg",
        "assets/IMG-20251206-WA0058.jpg",
        "assets/IMG-20251206-WA0058.jpg"
    ];
    let currentSlide = 0;
    const galleryImg = document.getElementById('gallery-img');
    const counterDisplay = document.getElementById('current-slide');

    window.changeSlide = function (direction) {
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
        projectCard.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

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

    /* ====== 
       11. EDUCATION TRACKER (Animation Only)
       Note: Click functionality moved to Generic Modal System
    ====== */
    const eduCard = document.getElementById('edu-card');
    if (eduCard) {
        // We keep the logic to animate the line if needed, or we can let the modal handle it.
        // For now, let's allow the "tracking" class to toggle for visual effect when clicked,
        // but the modal will also open.
        eduCard.addEventListener('click', () => {
            eduCard.classList.toggle('tracking');
            const hint = eduCard.querySelector('.click-hint');
            if (hint) {
                hint.textContent = eduCard.classList.contains('tracking') 
                    ? "Tracking History..." 
                    : "(Click for Details)";
            }
        });
    }

    /* ====== 
       12. SCROLL REVEAL & COUNTERS
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
                            const inc = target / 100;
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
       13. SYSTEM TIME & ICONS
    ====== */
    function updateTime() {
        const timeDisplay = document.getElementById('system-time');
        if (timeDisplay) timeDisplay.innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    if (typeof feather !== 'undefined') feather.replace();

    /* ====== 
       14. TAB TITLE TICKER
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
       15. GENERIC INFO MODAL SYSTEM (UPDATED)
    ====== */
    const infoModal = document.getElementById('info-modal');
    const infoTitle = document.getElementById('info-title');
    const infoBody = document.getElementById('info-body');
    const infoTags = document.getElementById('info-tags');
    // Select the close button inside the specific generic modal
    const closeInfoBtn = infoModal ? infoModal.querySelector('.close-modal') : null;

    if (infoModal && closeInfoBtn) {
        const openInfoModal = (title, tags = [], bodyHTML = "") => {
            infoTitle.innerText = title;
            infoTags.innerHTML = tags.map(t => `<span>${t}</span>`).join('');
            infoBody.innerHTML = bodyHTML;
            infoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeInfoModal = () => {
            infoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeInfoBtn.addEventListener('click', closeInfoModal);
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfoModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && infoModal.classList.contains('active')) {
                closeInfoModal();
            }
        });

        // --- ATTACH EVENT LISTENERS TO CARDS ---

        // 1. Profile Card
        const profileCard = document.getElementById('profile-card');
        if (profileCard) {
            profileCard.addEventListener('click', () => {
                openInfoModal(
                    "The Profile",
                    ["Mechanical Engineer", "Designer", "Innovator"],
                    `<p>I am an aspiring Mechanical Engineer skilled in CAD modelling, mechanism design, and automation. Seeking an internship to apply practical engineering skills in real-world product development and smart machine projects.
</p>
                     <br>
                     <h3>Core Focus</h3>
                     <ul>
                        <li>Designing automated systems using Fusion 360</li>
                        <li>Merging hardware with software logic</li>
                        <li>Visualizing complex engineering concepts</li>
                     </ul>`
                );
            });
        }

        // 2. Engineering Card
        const engCard = document.getElementById('engineering-card');
        if (engCard) {
            engCard.addEventListener('click', () => {
                openInfoModal(
                    "Engineering Skills",
                    ["CAD", "Manufacturing", "Analysis"],
                    `<p>My engineering toolkit is built for prototyping and production.</p>
                     <ul>
                        <li><strong>Fusion 360:</strong> Advanced parametric modeling and assembly.</li>
                        <li><strong>AutoCAD & UG NX:</strong> Industry-standard drafting.</li>
                        <li><strong>Hypermesh:</strong> Finite Element Analysis (FEA).</li>
                        <li><strong>3D Printing:</strong> Rapid prototyping from digital mesh to physical object.</li>
                     </ul>`
                );
            });
        }

        // 3. Creative Card
        const creativeCard = document.getElementById('creative-card');
        if (creativeCard) {
            creativeCard.addEventListener('click', () => {
                openInfoModal(
                    "Creative Works",
                    ["Filmmaking", "Photography", "Design"],
                    `<p>Engineering builds the product; creativity tells its story. I specialize in:</p>
                     <ul>
                        <li><strong>Video Editing:</strong> Creating compelling narratives using Davinci Resolve.</li>
                        <li><strong>Short Films:</strong> Directing and shooting visual stories.</li>
                        <li><strong>Photography:</strong> Capturing industrial and natural aesthetics.</li>
                        <li><strong>Sketching:</strong> Concept art and visualization.</li>
                     </ul>`
                );
            });
        }

        // 4. Programming Card
        const progCard = document.getElementById('programming-card');
        if (progCard) {
            progCard.addEventListener('click', () => {
                openInfoModal(
                    "Programming Stack",
                    ["Automation", "Logic", "Embedded"],
                    `<p>I use code to control machinery and analyze data.</p>
                     <ul>
                        <li><strong>Python:</strong> Automation scripts and data processing.</li>
                        <li><strong>C Language:</strong> Embedded programming for microcontrollers.</li>
                        <li><strong>Java:</strong> Object-oriented software development.</li>
                     </ul>
                     <p>Currently integrating IoT solutions with mechanical designs.</p>`
                );
            });
        }

        // 5. Social Impact Card
        const socialCard = document.getElementById('social-card');
        if (socialCard) {
            socialCard.addEventListener('click', () => {
                openInfoModal(
                    "Social Impact",
                    ["Volunteering", "Leadership"],
                    `<p>Engineering serves society. My contributions include:</p>
                     <h3>CRPF Mega Plantation Drive</h3>
                     <p>Volunteered in a massive drive planting over 10,000 trees, managing logistics and irrigation planning.</p>
                     <br>
                     <h3>Student Leadership</h3>
                     <p>Served as Class Representative for 2 semesters, bridging the gap between faculty and students and organizing technical workshops.</p>`
                );
            });
        }

        // 6. Education Card (New Modal integration)
        const eduCardModal = document.getElementById('edu-card');
        if (eduCardModal) {
            eduCardModal.addEventListener('click', () => {
                openInfoModal(
                    "Education Journey",
                    ["Academics", "Timeline"],
                    `<div class="tracker-container" style="opacity:1; margin-top:0;">
                        <div class="tracker-line-bg"></div>
                        
                        <div class="tracker-item" style="opacity:1;">
                            <div class="tracker-dot" style="background:#4ade80; box-shadow:0 0 10px #4ade80;"></div>
                            <div class="tracker-info">
                                <span class="date">2023 - Present</span>
                                <strong>B.Tech Mechanical Engineering</strong>
                                <span class="school">JNTUA College</span>
                                <p style="font-size:0.85rem; color:#888; margin-top:5px;">Focusing on CAD, Thermodynamics, and Kinematics. Active member of the Robotics Club.</p>
                            </div>
                        </div>
                        
                        <div class="tracker-item" style="opacity:1;">
                            <div class="tracker-dot"></div>
                            <div class="tracker-info">
                                <span class="date">2021 - 2023</span>
                                <strong>Intermediate (MPC)</strong>
                                <span class="school">Narayana Junior College</span>
                                <p style="font-size:0.85rem; color:#888; margin-top:5px;">Foundation in Mathematics, Physics, and Chemistry.</p>
                            </div>
                        </div>

                        <div class="tracker-item" style="opacity:1;">
                            <div class="tracker-dot"></div>
                            <div class="tracker-info">
                                <span class="date">2021</span>
                                <strong>Secondary School (SSC)</strong>
                                <span class="school">ZPHS School</span>
                            </div>
                        </div>
                    </div>`
                );
            });
        }
    }

    /* ====== 
       19. KINETIC SCROLL PHYSICS (Inertia & Skew)
    ====== */
    const gridContainer = document.querySelector('.bento-grid');
    let lastScrollY = window.scrollY;
    let currentSkew = 0;
    let targetSkew = 0;

    const animateScrollPhysics = () => {
        const currentScrollY = window.scrollY;
        const velocity = currentScrollY - lastScrollY;
        targetSkew = velocity * 0.15;
        targetSkew = Math.max(Math.min(targetSkew, 7), -7);
        currentSkew += (targetSkew - currentSkew) * 0.1;

        if (gridContainer) {
            const scale = 1 - Math.abs(currentSkew) * 0.005;
            gridContainer.style.transform = `perspective(1000px) rotateX(${-currentSkew}deg) scale(${scale})`;
        }

        lastScrollY = currentScrollY;
        requestAnimationFrame(animateScrollPhysics);
    };
    animateScrollPhysics();

    /* ====== 
       20. BLUEPRINT MODE TOGGLE
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
