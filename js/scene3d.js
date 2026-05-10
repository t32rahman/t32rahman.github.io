import * as THREE from 'three';

export function createScene() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 0;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Group to hold the entire rack
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    // --- Rack Construction ---
    const rackWidth = 12;
    const rackHeight = 40;
    const rackDepth = 8;
    const unitsCount = 12;

    // Frame Pillars
    const pillarGeom = new THREE.BoxGeometry(0.5, rackHeight, 0.5);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1d23, metalness: 0.8, roughness: 0.2 });
    
    const positions = [
        [-rackWidth/2, 0, rackDepth/2],
        [rackWidth/2, 0, rackDepth/2],
        [-rackWidth/2, 0, -rackDepth/2],
        [rackWidth/2, 0, -rackDepth/2]
    ];

    positions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeom, frameMaterial);
        pillar.position.set(...pos);
        rackGroup.add(pillar);
    });

    // Server Units
    const unitGeom = new THREE.BoxGeometry(rackWidth - 0.5, 2.5, rackDepth - 0.2);
    const unitMaterial = new THREE.MeshStandardMaterial({ color: 0x0f1115, metalness: 0.5, roughness: 0.5 });
    
    const ledGeom = new THREE.BoxGeometry(0.15, 0.15, 0.1);
    const leds = [];

    for (let i = 0; i < unitsCount; i++) {
        const yPos = (i * 3) - (unitsCount * 1.5);
        const unit = new THREE.Mesh(unitGeom, unitMaterial);
        unit.position.y = yPos;
        rackGroup.add(unit);

        // Add "faceplate" detail
        const faceplateGeom = new THREE.PlaneGeometry(rackWidth - 1, 2);
        const faceplateMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
        const faceplate = new THREE.Mesh(faceplateGeom, faceplateMat);
        faceplate.position.set(0, yPos, rackDepth/2 + 0.01);
        rackGroup.add(faceplate);

        // Add LEDs to faceplate
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 12; col++) {
                const ledColor = Math.random() > 0.8 ? 0x3b82f6 : 0x8b5cf6; // Blue or Purple
                const ledMat = new THREE.MeshStandardMaterial({ 
                    color: ledColor, 
                    emissive: ledColor, 
                    emissiveIntensity: Math.random() * 2 
                });
                const led = new THREE.Mesh(ledGeom, ledMat);
                led.position.set(
                    (col * 0.8) - (11 * 0.4), 
                    yPos + (row * 0.5) - 0.25, 
                    rackDepth/2 + 0.05
                );
                rackGroup.add(led);
                leds.push({
                    mesh: led,
                    baseIntensity: ledMat.emissiveIntensity,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 200, 100);
    pointLight.position.set(10, 10, 20);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 150, 100);
    blueLight.position.set(-10, -10, 20);
    scene.add(blueLight);

    // --- Interaction ---
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 200;
        mouseY = (e.clientY - window.innerHeight / 2) / 200;
    });

    // Background depth points
    const pointsGeom = new THREE.BufferGeometry();
    const pointsCount = 1000;
    const pointsPos = new Float32Array(pointsCount * 3);
    for(let i = 0; i < pointsCount * 3; i++) {
        pointsPos[i] = (Math.random() - 0.5) * 200;
    }
    pointsGeom.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
    const pointsMat = new THREE.PointsMaterial({ size: 0.1, color: 0x3b82f6, transparent: true, opacity: 0.4 });
    const points = new THREE.Points(pointsGeom, pointsMat);
    scene.add(points);

    // Scroll Reactivity using GSAP
    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        
        window.gsap.to(rackGroup.rotation, {
            y: Math.PI * 0.3,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        window.gsap.to(rackGroup.position, {
            z: -10,
            y: 5,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Blink LEDs with varying phases
        leds.forEach(led => {
            const pulse = Math.sin(elapsed * 4 + led.phase) * 0.5 + 0.5;
            led.mesh.material.emissiveIntensity = (led.baseIntensity * pulse) + (Math.random() * 0.3);
        });

        // Background rotation
        points.rotation.y = elapsed * 0.02;

        // Mouse Parallax with smoothing
        targetX = mouseX;
        targetY = mouseY;
        rackGroup.rotation.y += 0.03 * (targetX - rackGroup.rotation.y);
        rackGroup.rotation.x += 0.03 * (targetY - rackGroup.rotation.x);

        renderer.render(scene, camera);
    }

    animate();
}


