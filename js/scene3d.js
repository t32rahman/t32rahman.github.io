import * as THREE from 'three';

export function createScene() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // --- Performance Configuration ---
    const isMobile = window.innerWidth < 768;
    const rackRows = isMobile ? 2 : 4;
    const racksPerRow = isMobile ? 6 : 10;
    const serversPerRack = 15;
    const ledsPerServer = 10;
    
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 40);

    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: !isMobile, // Disable antialias on mobile for performance
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // --- Geometries & Materials ---
    const pillarGeom = new THREE.BoxGeometry(0.4, 45, 0.4);
    const serverGeom = new THREE.BoxGeometry(11.5, 2.2, 7.5);
    const ledGeom = new THREE.PlaneGeometry(0.2, 0.2); // Planes for LEDs are faster

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x16181d, metalness: 0.7, roughness: 0.3 });
    const serverMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.4, roughness: 0.6 });
    const ledMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4f46e5, 
        transparent: true,
        opacity: 0.8
    });

    // --- Instancing ---
    const totalRacks = rackRows * racksPerRow;
    const pillarInstances = new THREE.InstancedMesh(pillarGeom, frameMaterial, totalRacks * 4);
    const serverInstances = new THREE.InstancedMesh(serverGeom, serverMaterial, totalRacks * serversPerRack);
    const ledInstances = new THREE.InstancedMesh(ledGeom, ledMaterial, totalRacks * serversPerRack * ledsPerServer);

    const dummy = new THREE.Object3D();
    let pillarIdx = 0;
    let serverIdx = 0;
    let ledIdx = 0;

    const rackWidth = 12;
    const rackDepth = 8;
    const corridorWidth = 18;
    const rackSpacing = 15;

    // Store LED data for animation
    const ledData = [];

    for (let row = 0; row < rackRows; row++) {
        const side = row % 2 === 0 ? 1 : -1;
        const xOffset = (corridorWidth / 2 + rackWidth / 2) * side;
        
        for (let i = 0; i < racksPerRow; i++) {
            const zPos = (i * rackSpacing) - (racksPerRow * rackSpacing / 2);
            
            // Pillars
            const pillarPositions = [
                [xOffset - rackWidth/2, 0, zPos - rackDepth/2],
                [xOffset + rackWidth/2, 0, zPos - rackDepth/2],
                [xOffset - rackWidth/2, 0, zPos + rackDepth/2],
                [xOffset + rackWidth/2, 0, zPos + rackDepth/2]
            ];

            pillarPositions.forEach(pos => {
                dummy.position.set(...pos);
                dummy.updateMatrix();
                pillarInstances.setMatrixAt(pillarIdx++, dummy.matrix);
            });

            // Servers
            for (let s = 0; s < serversPerRack; s++) {
                const yPos = (s * 2.8) - (serversPerRack * 1.4);
                dummy.position.set(xOffset, yPos, zPos);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                serverInstances.setMatrixAt(serverIdx++, dummy.matrix);

                // LEDs on the server face
                for (let l = 0; l < ledsPerServer; l++) {
                    const ledX = xOffset + (side * (rackWidth / 2 + 0.1));
                    const ledOffset = (l * 0.6) - (ledsPerServer * 0.3);
                    
                    dummy.position.set(ledX, yPos + ledOffset, zPos + (rackDepth / 2) - 0.5);
                    dummy.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
                    dummy.updateMatrix();
                    ledInstances.setMatrixAt(ledIdx, dummy.matrix);
                    
                    // Assign a color and phase to each LED
                    const isBlue = Math.random() > 0.5;
                    const color = new THREE.Color(isBlue ? 0x3b82f6 : 0x8b5cf6);
                    ledInstances.setColorAt(ledIdx, color);
                    
                    ledData.push({
                        idx: ledIdx,
                        baseColor: color,
                        phase: Math.random() * Math.PI * 2,
                        freq: 2 + Math.random() * 3
                    });
                    
                    ledIdx++;
                }
            }
        }
    }

    scene.add(pillarInstances);
    scene.add(serverInstances);
    scene.add(ledInstances);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x4f46e5, 500, 150);
    mainLight.position.set(0, 20, 0);
    scene.add(mainLight);

    // Adding some colored strip lights for the corridor
    for(let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0x3b82f6 : 0x8b5cf6, 200, 80);
        light.position.set(0, 10, (i - 1) * 60);
        scene.add(light);
    }

    // --- Interaction & Parallax ---
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 1000;
        mouseY = (e.clientY - window.innerHeight / 2) / 1000;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY / 500;
    });

    // --- Background Points (Dust/Data) ---
    const pointsGeom = new THREE.BufferGeometry();
    const pointsCount = isMobile ? 500 : 1500;
    const pointsPos = new Float32Array(pointsCount * 3);
    for(let i = 0; i < pointsCount * 3; i++) {
        pointsPos[i] = (Math.random() - 0.5) * 150;
    }
    pointsGeom.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
    const pointsMat = new THREE.PointsMaterial({ size: 0.15, color: 0x4f46e5, transparent: true, opacity: 0.4 });
    const points = new THREE.Points(pointsGeom, pointsMat);
    scene.add(points);

    // GSAP Scroll Integration if available
    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.to(camera.position, {
            z: -20,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
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
    const tempColor = new THREE.Color();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Animate LEDs - Updating instance colors is very fast
        ledData.forEach(led => {
            const blink = Math.sin(elapsed * led.freq + led.phase) * 0.5 + 0.5;
            if (blink > 0.8) {
                tempColor.copy(led.baseColor).multiplyScalar(1.5);
            } else if (blink < 0.2) {
                tempColor.setHex(0x111111);
            } else {
                tempColor.copy(led.baseColor).multiplyScalar(0.5);
            }
            ledInstances.setColorAt(led.idx, tempColor);
        });
        ledInstances.instanceColor.needsUpdate = true;

        // Background rotation
        points.rotation.y = elapsed * 0.05;
        points.position.z = Math.sin(elapsed * 0.2) * 5;

        // Smooth Camera Parallax
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        camera.rotation.y = -targetX * 0.1;
        camera.rotation.x = -targetY * 0.1;
        
        // Constant slow forward drift
        if (!window.gsap) {
            camera.position.z -= 0.02;
            if (camera.position.z < -40) camera.position.z = 40;
        }

        renderer.render(scene, camera);
    }

    animate();
}


