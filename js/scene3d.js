import * as THREE from 'three';

export function createScene() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;

    // Respect reduced motion — skip 3D entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer setup — cap DPR at 2 for mobile performance
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Object creation - Wireframe Icosahedron
    const geometry = new THREE.IcosahedronGeometry(10, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x8b5cf6, // Accent Primary
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // Object creation - Particles for extra depth
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x3b82f6, // Accent Secondary
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse interaction variable
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Slow rotation of main object
        icosahedron.rotation.x = elapsedTime * 0.1;
        icosahedron.rotation.y = elapsedTime * 0.15;

        // Subtle parallax effect on main object based on mouse
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        icosahedron.rotation.y += 0.05 * (targetX - icosahedron.rotation.y);
        icosahedron.rotation.x += 0.05 * (targetY - icosahedron.rotation.x);

        // Rotate particles slowly
        particlesMesh.rotation.y = -elapsedTime * 0.05;

        renderer.render(scene, camera);
    }

    animate();
}
