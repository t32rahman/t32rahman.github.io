import { createScene } from './scene3d.js';
import { initAnimations } from './animations.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize 3D Background
    createScene();

    // 2. We use a small timeout to ensure GSAP recognizes DOM layout
    setTimeout(() => {
        initAnimations();
    }, 100);

    // 3. Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
});
