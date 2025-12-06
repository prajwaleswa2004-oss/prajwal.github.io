// 1. The Spotlight Effect
document.getElementById("cards").onmousemove = e => {
  for(const card of document.getElementsByClassName("card")) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }// 1. The Spotlight Effect
document.getElementById("cards").onmousemove = e => {
  for(const card of document.getElementsByClassName("card")) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};

// 2. Smooth Reveal Animation on Load
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const header = document.querySelector("header");

    // Fade in Header
    header.style.opacity = "0";
    header.style.transform = "translateY(20px)";
    header.style.transition = "all 0.8s ease-out";
    
    setTimeout(() => {
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
    }, 100);

    // Staggered fade in for cards
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 300 + (index * 100)); // Stagger effect
    });
});
};

// 2. Smooth Reveal Animation on Load
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const header = document.querySelector("header");

    // Fade in Header
    header.style.opacity = "0";
    header.style.transform = "translateY(20px)";
    header.style.transition = "all 0.8s ease-out";
    
    setTimeout(() => {
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
    }, 100);

    // Staggered fade in for cards
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease-out";
        
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 300 + (index * 100)); // Stagger effect
    });
});
// --- MODAL LOGIC ---
const modal = document.getElementById('project-modal');
const closeBtn = document.querySelector('.close-modal');
const projectCard = document.querySelector('.project-card'); // Targets your Curry Maker card

// Open Modal
projectCard.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevents scrolling behind modal
});

// Close Modal (Clicking 'X')
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close Modal (Clicking outside the box)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
