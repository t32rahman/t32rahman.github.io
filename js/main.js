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

    // 4. Email Modal Logic
    const emailModal = document.getElementById('email-modal');
    const emailMeLink = document.getElementById('email-me-link');
    const closeModal = document.querySelector('.modal-close');
    const copyEmailBtn = document.getElementById('copy-email');
    const emailAddress = document.getElementById('email-address');
    const copyFeedback = document.getElementById('copy-feedback');

    if (emailModal && emailMeLink) {
        // Open Modal
        emailMeLink.addEventListener('click', (e) => {
            e.preventDefault();
            emailModal.classList.add('active');
            emailModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        // Close Modal Functions
        const close = () => {
            emailModal.classList.remove('active');
            emailModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll
        };

        if (closeModal) {
            closeModal.addEventListener('click', close);
        }

        // Close on overlay click
        emailModal.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emailModal.classList.contains('active')) {
                close();
            }
        });

        // Copy to Clipboard
        if (copyEmailBtn && emailAddress) {
            copyEmailBtn.addEventListener('click', () => {
                const text = emailAddress.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    // Show feedback
                    if (copyFeedback) {
                        copyFeedback.classList.add('show');
                        setTimeout(() => {
                            copyFeedback.classList.remove('show');
                        }, 2000);
                    }
                    
                    // Subtle button animation
                    copyEmailBtn.style.color = 'var(--accent-primary)';
                    setTimeout(() => {
                        copyEmailBtn.style.color = '';
                    }, 2000);
                });
            });
        }
    }
});

