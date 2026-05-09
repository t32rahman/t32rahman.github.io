export function initAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded yet.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial load animations (Hero section)
    const tl = gsap.timeline();
    
    tl.from('header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-section .btn', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    }, '-=0.2');

    // Scroll animations for Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
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

    // Fade in text elements in About Section
    gsap.from('#about p', {
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
    
    // Animate Qualification feature icons
    gsap.from('.feature-icons li', {
        scrollTrigger: {
            trigger: '.feature-icons',
            start: 'top 85%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.2)'
    });

    // Fade in Experience/Timeline items
    gsap.from('.experience-item', {
        scrollTrigger: {
            trigger: '.experience-list',
            start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Stagger in Project Cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Fade in Extracurricular Cards
    gsap.from('#extracurricular .glass-card', {
        scrollTrigger: {
            trigger: '#extracurricular .grid',
            start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
    });
}
