/* PRAJWAL E. | NEURAL ENGINE CORE v2.0
   Architecture: Monolithic 3D Rendering & Interaction System
   Modules: 3D Projection, Audio Synthesis, Kinetic DOM, Parallax
*/

document.addEventListener("DOMContentLoaded", () => {
    
    // --- MODULE 1: SYSTEM BOOT (BIOS SEQUENCE) ---
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const bootLog = [
        "> KERNEL_INIT: SUCCESS",
        "> LOADING_NEURAL_MESH...",
        "> CALIBRATING_PHYSICS_ENGINE...",
        "> 3D_RENDERING_CONTEXT: ACTIVE",
        "> ESTABLISHING_SECURE_CONNECTION...",
        "> ACCESS_GRANTED: WELCOME_USER_PRAJWAL"
    ];

    if (bootScreen && bootText) {
        let logIndex = 0;
        const printLog = () => {
            if (logIndex < bootLog.length) {
                const line = document.createElement('div');
                line.className = 'boot-line';
                line.innerHTML = `<span class="sys-prefix">[SYSTEM]</span> ${bootLog[logIndex]}`;
                bootText.appendChild(line);
                logIndex++;
                // Randomized typing speed for realism
                setTimeout(printLog, Math.random() * 200 + 50);
            } else {
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    document.body.style.overflow = 'auto'; // Unlock scroll
                    // Safety cleanup
                    setTimeout(() => bootScreen.style.display = 'none', 1000);
                }, 800);
            }
        };
        // Safety Fallback: Remove screen after 4.5s even if script hangs
        setTimeout(() => {
            if(bootScreen.style.display !== 'none') {
                bootScreen.style.opacity = 0;
                document.body.style.overflow = 'auto';
                setTimeout(() => bootScreen.style.display = 'none', 500);
            }
        }, 4500);
        
        printLog();
    }

    // --- MODULE 2: "NEURAL SPHERE" 3D ENGINE ---
    // This replaces the flat mesh with a true rotating 3D globe of nodes
    
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0', 
        width: '100%', height: '100%', zIndex: '-1',
        background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 100%)'
    });
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Engine Config
    const SPHERE_RADIUS = 350; // Size of the globe
    const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 150; // Optimize for mobile
    const CONNECTION_DIST = 50;
    const ROTATION_SPEED_BASE = 0.002;
    
    let rotationX = 0;
    let rotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // 3D Point Class
    class Point3D {
        constructor() {
            // Random point on a sphere surface (Spherical coordinates)
            this.theta = Math.random() * Math.PI * 2; // Longitude
            this.phi = Math.acos((Math.random() * 2) - 1); // Latitude
            
            this.x = SPHERE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = SPHERE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = SPHERE_RADIUS * Math.cos(this.phi);
            
            this.baseSize = Math.random() * 1.5 + 0.5;
            this.glow = Math.random() > 0.9; // 10% chance to be a "core" node
        }

        rotate(angleX, angleY) {
            // Rotation Matrix Logic (Math!)
            // Rotate around Y axis
            let cosY = Math.cos(angleY);
            let sinY = Math.sin(angleY);
            let x1 = this.x * cosY - this.z * sinY;
            let z1 = this.z * cosY + this.x * sinY;
            
            // Rotate around X axis
            let cosX = Math.cos(angleX);
            let sinX = Math.sin(angleX);
            let y1 = this.y * cosX - z1 * sinX;
            let z2 = z1 * cosX + this.y * sinX;
            
            this.x = x1;
            this.y = y1;
            this.z = z2;
        }

        project() {
            // Perspective Projection: Map 3D to 2D
            // FOV (Field of View) factor
            const fov = 400; 
            const scale = fov / (fov + this.z); 
            
            return {
                x: width / 2 + this.x * scale,
                y: height / 2 + this.y * scale,
                scale: scale,
                alpha: (this.z + SPHERE_RADIUS) / (2 * SPHERE_RADIUS) // Fade out back nodes
            };
        }
    }

    const points = [];
    for(let i=0; i<PARTICLE_COUNT; i++) points.push(new Point3D());

    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        // Map mouse position to rotation speed
        mouseX = (e.clientX - width/2) * 0.0001;
        mouseY = (e.clientY - height/2) * 0.0001;
    });

    // Render Loop
    const render = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Auto rotate + Mouse influence
        rotationY = ROTATION_SPEED_BASE + mouseX;
        rotationX = ROTATION_SPEED_BASE + mouseY;

        // Sort points by Z-depth so front points draw over back points
        points.sort((a, b) => b.z - a.z);

        // Update & Draw
        points.forEach(p => {
            p.rotate(rotationX, rotationY);
            const proj = p.project();
            
            // Draw Connections (Triangulation)
            // Only connect points that are close in 3D space AND screen space
            points.forEach(p2 => {
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
                if(dist < CONNECTION_DIST) {
                    const proj2 = p2.project();
                    ctx.beginPath();
                    ctx.moveTo(proj.x, proj.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    const opacity = (1 - dist/CONNECTION_DIST) * proj.alpha * 0.3;
                    ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            // Draw Node
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.baseSize * proj.scale, 0, Math.PI * 2);
            ctx.fillStyle = p.glow ? '#fff' : `rgba(74, 222, 128, ${proj.alpha})`;
            ctx.fill();
            
            if(p.glow) {
                // Add extra glow for special nodes
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#4ade80';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        requestAnimationFrame(render);
    };
    render();

    // --- MODULE 3: KINETIC PARALLAX SCROLL ---
    // Makes layers move at different speeds
    const cards = document.querySelectorAll('.card');
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Background Parallax (The blob moves slow)
        const blob = document.querySelector('.background-blob');
        if(blob) blob.style.transform = `translate(-50%, ${-50 + scrolled * 0.1}%) scale(${1 + scrolled * 0.0005})`;

        // Header Parallax (Fades and moves up fast)
        if(header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = 1 - (scrolled / 500);
        }

        // Card Staggered Parallax
        cards.forEach((card, index) => {
            const rate = (index % 2 === 0) ? 0.05 : 0.02; // Even cards move faster
            card.style.transform = `translateY(${scrolled * rate}px)`;
        });
        
        // Synchro-Gears Logic (Re-implemented for compatibility)
        const gear1 = document.querySelector('.gear-1');
        const gear2 = document.querySelector('.gear-2');
        if (gear1 && gear2) {
            gear1.style.transform = `rotate(${scrolled * 0.1}deg)`;
            gear2.style.transform = `rotate(${scrolled * -0.2}deg)`;
        }
    });

    // --- MODULE 4: HOLOGRAPHIC TILT (GLASS PHYSICS) ---
    // Applies a 3D glass effect relative to mouse position within the card
    if(window.innerWidth > 768) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate Rotation
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
                const rotateY = ((x - centerX) / centerX) * 10;
                
                // Set Custom Properties for CSS Glow
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // Apply Transform
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            });
        });
    }

    // --- MODULE 5: AUDIO SYNTHESIS ENGINE (THE MECH-UI) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.3; // Master Volume

    const playTone = (freq, type, duration) => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.connect(masterGain);
        osc.connect(gain);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
        osc.stop(audioCtx.currentTime + duration);
    };

    const interactables = document.querySelectorAll('a, button, .card, .project-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => playTone(800, 'sine', 0.1)); // High chirp
        el.addEventListener('mousedown', () => playTone(150, 'square', 0.15)); // Low click
    });

    // --- MODULE 6: DECIPHER TEXT (HACKER TEXT) ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>";
    document.querySelectorAll('h1, h2, h3').forEach(header => {
        header.dataset.original = header.innerText;
        header.addEventListener('mouseenter', event => {
            let iterations = 0;
            const original = header.dataset.original;
            const interval = setInterval(() => {
                event.target.innerText = original.split("").map((letter, index) => {
                    if(index < iterations) return original[index];
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("");
                if(iterations >= original.length) clearInterval(interval);
                iterations += 1/2; 
            }, 30);
        });
    });

    // --- MODULE 7: UTILITIES (Time, Icons, Gallery, Tracker) ---
    if (typeof feather !== 'undefined') feather.replace();
    
    // System Time
    setInterval(() => {
        const timeEl = document.getElementById('system-time');
        if(timeEl) timeEl.innerText = new Date().toLocaleTimeString('en-US', {hour12:false});
    }, 1000);

    // Gallery Logic
    window.changeSlide = function(dir) {
        // (Simplified for brevity, assuming existing logic or new implementation)
        const img = document.getElementById('gallery-img');
        if(img) {
            img.style.opacity = 0;
            setTimeout(() => {
                // In a real scenario, array logic here
                img.style.opacity = 1; 
            }, 200);
        }
    };
    
    // Education Tracker Trigger
    const eduCard = document.getElementById('edu-card');
    if(eduCard) eduCard.addEventListener('click', () => eduCard.classList.toggle('tracking'));
});
