import { createScene } from './scene3d.js';
import { initAnimations } from './animations.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize 3D Background
    createScene();

    // 2. We use a small timeout to ensure GSAP recognizes DOM layout
    setTimeout(() => {
        initAnimations();
    }, 100);
});
