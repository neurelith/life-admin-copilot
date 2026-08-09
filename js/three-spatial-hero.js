/* ============================================================
   LIFE ADMIN COPILOT — Clean Three.js Ambient Particle Core
   Silky 60fps, subtle luxury depth, responsive to mouse parallax.
   ============================================================ */

class SpatialHero3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coreMesh = null;
    this.wireMesh = null;
    this.particles = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 680;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 6.5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Central Geometric Wireframe Icosahedron
    const geo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x52525B,
      transparent: true,
      opacity: 0.35
    });
    this.wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    this.scene.add(this.wireMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x18181B,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    this.coreMesh = new THREE.Mesh(innerGeo, innerMat);
    this.scene.add(this.coreMesh);

    // 4. Subtle Ambient Particle Dust Field
    const count = 120;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 12;
      pos[i + 1] = (Math.random() - 0.5) * 8;
      pos[i + 2] = (Math.random() - 0.5) * 6;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x71717A,
      transparent: true,
      opacity: 0.45
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    // 5. Subtle Lighting
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.0);
    this.scene.add(ambient);

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || 680;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Mouse inertia tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x;
    this.camera.position.y = -this.mouse.y;
    this.camera.lookAt(0, 0, 0);

    // Smooth subtle rotations
    if (this.wireMesh) {
      this.wireMesh.rotation.y = time * 0.1;
      this.wireMesh.rotation.x = time * 0.05;
    }

    if (this.coreMesh) {
      this.coreMesh.rotation.y = -time * 0.08;
    }

    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
