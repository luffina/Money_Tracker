document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category_select');
    const amountInput = document.getElementById('amount_input');
    const infoInput = document.getElementById('info');
    const dateInput = document.getElementById('date_input');

    // Autofocus on the first input field when the page loads
    categorySelect.focus();

    // Handle 'Enter' key to move to next field
    const inputs = [categorySelect, amountInput, infoInput, dateInput];
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    document.getElementById('generate-btn').focus();
                }
            }
        });
    });

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Create particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000; // X coordinate
        positions[i + 1] = (Math.random() - 0.5) * 2000; // Y coordinate
        positions[i + 2] = (Math.random() - 0.5) * 2000; // Z coordinate
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 1000;

    // Animation loop
    const animate = function () {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.001;

        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});
