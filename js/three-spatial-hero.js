/* ============================================================
   LIFE ADMIN COPILOT — Interactive 3D Holographic Life Admin Engine
   Physical 3D Glass Document, Laser Scanning Beam, Interactive Data Tokens & Particles.
   ============================================================ */

class SpatialHero3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.docMesh = null;
    this.laserBeam = null;
    this.laserRing = null;
    this.particles = null;
    this.sparkParticles = null;
    this.dataPlates = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.isHovering = false;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 560;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 7.5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Floating 3D Frosted Glass Document Model (The Life Clutter Item)
    const docGeo = new THREE.BoxGeometry(2.2, 3.0, 0.05);
    const docMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181B,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    this.docMesh = new THREE.Mesh(docGeo, docMat);
    this.docMesh.position.set(0, 0.2, 0);
    this.scene.add(this.docMesh);

    // Document Wireframe Border Glow
    const wireGeo = new THREE.WireframeGeometry(docGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.7
    });
    this.docWire = new THREE.LineSegments(wireGeo, wireMat);
    this.docMesh.add(this.docWire);

    // 4. Holographic Laser Scanning Sweep Plane
    const laserGeo = new THREE.PlaneGeometry(2.6, 0.08);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x60A5FA,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    this.laserBeam = new THREE.Mesh(laserGeo, laserMat);
    this.laserBeam.position.set(0, 0, 0.04);
    this.docMesh.add(this.laserBeam);

    // 5. Holographic Rotating Radar Rings
    const ringGeo = new THREE.RingGeometry(1.8, 1.83, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.laserRing = new THREE.Mesh(ringGeo, ringMat);
    this.laserRing.position.set(0, 0.2, -0.2);
    this.scene.add(this.laserRing);

    // 6. Floating Extracted Data Token Badges (3D Spatial Pills)
    const tokenData = [
      { text: "₹500 DUE TODAY", color: 0x10B981, x: 2.2, y: 0.8, z: 0.5 },
      { text: "IIT MADRAS", color: 0x3B82F6, x: -2.2, y: 1.0, z: 0.8 },
      { text: "AUG 14 · 6:00 PM", color: 0xEF4444, x: -2.0, y: -0.8, z: 0.6 },
      { text: "ID PROOF REQ", color: 0xF59E0B, x: 2.1, y: -0.9, z: 0.9 }
    ];

    tokenData.forEach((token, idx) => {
      const plateGeo = new THREE.BoxGeometry(1.4, 0.45, 0.04);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x111113,
        emissive: token.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7
      });
      const plateMesh = new THREE.Mesh(plateGeo, plateMat);
      plateMesh.position.set(token.x, token.y, token.z);
      this.scene.add(plateMesh);
      this.dataPlates.push({
        mesh: plateMesh,
        origX: token.x,
        origY: token.y,
        origZ: token.z,
        offset: idx * 1.5
      });
    });

    // 7. Ambient Particle Field
    const count = 160;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 14;
      pos[i + 1] = (Math.random() - 0.5) * 9;
      pos[i + 2] = (Math.random() - 0.5) * 6;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x60A5FA,
      transparent: true,
      opacity: 0.45
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    // 8. Cinematic Lighting
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.2);
    this.scene.add(ambient);

    const blueLight = new THREE.PointLight(0x3B82F6, 3.5, 12);
    blueLight.position.set(2, 3, 4);
    this.scene.add(blueLight);

    const emeraldLight = new THREE.PointLight(0x10B981, 2.5, 10);
    emeraldLight.position.set(-2, -2, 3);
    this.scene.add(emeraldLight);

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    this.container.addEventListener('mouseenter', () => {
      this.isHovering = true;
      if (window.tactile) window.tactile.playTick();
    });

    this.container.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.8;
        this.mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.4;
      }
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || 560;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Smooth mouse inertia
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Document 3D Rotation & Levitation
    if (this.docMesh) {
      this.docMesh.rotation.y = this.mouse.x * 0.8 + Math.sin(time * 0.8) * 0.08;
      this.docMesh.rotation.x = -this.mouse.y * 0.6 + Math.cos(time * 0.6) * 0.05;
      this.docMesh.position.y = 0.2 + Math.sin(time * 1.2) * 0.08;
    }

    // Laser Beam Sweep Cycle (Top to bottom)
    if (this.laserBeam) {
      this.laserBeam.position.y = Math.sin(time * 2.2) * 1.3;
    }

    // Radar Ring Rotation
    if (this.laserRing) {
      this.laserRing.rotation.z = time * 0.4;
    }

    // Floating Data Tokens
    this.dataPlates.forEach(plate => {
      plate.mesh.position.y = plate.origY + Math.sin(time * 1.4 + plate.offset) * 0.1;
      plate.mesh.rotation.y = Math.sin(time * 0.9 + plate.offset) * 0.15;
      plate.mesh.rotation.x = Math.cos(time * 0.7 + plate.offset) * 0.08;
    });

    // Particle Drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.03;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
