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
    const menuLinks = navLinks ? navLinks.querySelectorAll('a') : [];
    
    const toggleMenu = (forceState) => {
        const isOpen = forceState !== undefined ? forceState : !navLinks.classList.contains('open');
        
        hamburger.classList.toggle('active', isOpen);
        navLinks.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        
        // Handle tabindex for mobile accessibility
        if (window.innerWidth <= 768) {
            menuLinks.forEach(link => {
                link.setAttribute('tabindex', isOpen ? '0' : '-1');
            });
        } else {
            menuLinks.forEach(link => {
                link.removeAttribute('tabindex');
            });
        }
    };

    if (hamburger && navLinks) {
        // Initial state
        if (window.innerWidth <= 768) {
            menuLinks.forEach(link => link.setAttribute('tabindex', '-1'));
        }

        hamburger.addEventListener('click', () => toggleMenu());

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Reset state for desktop
                menuLinks.forEach(link => link.removeAttribute('tabindex'));
                hamburger.setAttribute('aria-expanded', 'false'); // Not applicable but good to reset
            } else if (!navLinks.classList.contains('open')) {
                // Ensure links are hidden for screen readers on mobile when closed
                menuLinks.forEach(link => link.setAttribute('tabindex', '-1'));
            }
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
        let lastFocusedElement;

        // Open Modal
        emailMeLink.addEventListener('click', (e) => {
            e.preventDefault();
            lastFocusedElement = document.activeElement;
            emailModal.classList.add('active');
            emailModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scroll

            // Focus trapping setup
            const focusableElements = emailModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                // Short timeout to ensure display: block/flex is applied for focus
                setTimeout(() => focusableElements[0].focus(), 100);
            }
        });

        // Close Modal Functions
        const close = () => {
            emailModal.classList.remove('active');
            emailModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
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

        // Modal Keyboard Logic (Trap + Escape)
        document.addEventListener('keydown', (e) => {
            if (!emailModal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                close();
            }

            if (e.key === 'Tab') {
                const focusableElements = emailModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
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

    // 5. Dynamic Footer Year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
