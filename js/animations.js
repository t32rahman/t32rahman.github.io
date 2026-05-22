export function initAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded yet.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Respect reduced motion — disable all GSAP animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(1000); // effectively skip all animations
        // Still set up active nav tracking (no motion involved)
        setupActiveNav();
        return;
    }

    // Initial load animations (Hero section)
    const tl = gsap.timeline();
    
    if (document.querySelector('header')) {
        tl.from('header', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }

    if (document.querySelector('.hero-eyebrow')) {
        tl.from('.hero-eyebrow', {
            y: 15,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');
    }

    if (document.querySelector('.hero-title')) {
        tl.from('.hero-title', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3');
    }

    if (document.querySelector('.hero-subtitle')) {
        tl.from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');
    }

    const heroBtns = document.querySelectorAll('.hero-cta .btn');
    if (heroBtns.length > 0) {
        tl.fromTo('.hero-cta .btn', {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        }, '-=0.2');
    }

    // Scroll animations for Section Titles
    const sectionTitles = gsap.utils.toArray('.section-title');
    if (sectionTitles.length > 0) {
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }

    // About Section - photo + text
    const aboutPhoto = document.querySelector('.about-photo');
    if (aboutPhoto) {
        gsap.from('.about-photo', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.5)'
        });
    }

    const aboutTexts = document.querySelectorAll('#about .about-text p');
    if (aboutTexts.length > 0) {
        gsap.from('#about .about-text p', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }

    // Skills grid - stagger in skill category cards
    const skillCards = document.querySelectorAll('.skill-category');
    if (skillCards.length) {
        gsap.from('.skill-category', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

    // Experience items - slide in from left
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length) {
        gsap.from('.experience-item', {
            scrollTrigger: {
                trigger: '.experience-list',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'transform'
        });
    }

    // Project cards - pop up
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length) {
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }

    // Writing cards - fade in
    const writingCards = document.querySelectorAll('.writing-card');
    if (writingCards.length) {
        gsap.from('.writing-card', {
            scrollTrigger: {
                trigger: '.writing-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // Contact section - fade in
    const contactCard = document.querySelector('#contact .glass-card');
    if (contactCard) {
        gsap.from('#contact .glass-card', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Active nav state via ScrollTrigger
    setupActiveNav();
}

/**
 * Highlights the active nav link based on scroll position.
 * Uses GSAP ScrollTrigger for efficient intersection detection.
 */
function setupActiveNav() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveLink(section.id),
            onEnterBack: () => setActiveLink(section.id),
        });
    });

    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}
