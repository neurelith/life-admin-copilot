/* ============================================================
   LIFE ADMIN COPILOT — Fine-Tuned 3D Holographic Spatial Console
   Dynamic Canvas-Textured Spatial Token Chips, Glowing Document Sheet, Dual Orbiting Rings, Mouse Inertia.
   ============================================================ */

class SpatialHero3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.docMesh = null;
    this.docSheet = null;
    this.laserBeam = null;
    this.laserRingGold = null;
    this.laserRingTeal = null;
    this.particles = null;
    this.dataPlates = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.isHovering = false;

    this.init();
  }

  // Generate dynamic 2D canvas texture with typography & icons for 3D chips
  createTokenTexture(tag, text, colorHex, iconChar) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Dark Pill Background
    ctx.fillStyle = '#181715';
    ctx.fillRect(0, 0, 512, 160);

    // Glowing Colored Border
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 504, 152);

    // Icon & Tag
    ctx.fillStyle = colorHex;
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText(`${iconChar}  [${tag}]`, 24, 50);

    // Primary Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px "Space Grotesk", sans-serif';
    ctx.fillText(text, 24, 112);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  // Generate Document Sheet Texture with scanning lines
  createDocSheetTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');

    // Document Paper Surface
    ctx.fillStyle = 'rgba(26, 25, 23, 0.95)';
    ctx.fillRect(0, 0, 512, 680);

    // Header Bar
    ctx.fillStyle = '#E8C872';
    ctx.fillRect(40, 50, 220, 16);

    // Lines of Document Text
    ctx.fillStyle = 'rgba(232, 228, 220, 0.35)';
    for (let y = 100; y < 580; y += 32) {
      const width = y % 64 === 0 ? 320 : (y % 96 === 0 ? 240 : 430);
      ctx.fillRect(40, y, width, 10);
    }

    // Extracted Bounding Box
    ctx.strokeStyle = '#E8C872';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 190, 440, 80);
    ctx.fillStyle = 'rgba(232, 200, 114, 0.15)';
    ctx.fillRect(36, 190, 440, 80);

    // Bounding Box Label
    ctx.fillStyle = '#E8C872';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText('[EXTRACTED DUE: AUG 14 · ₹500]', 48, 238);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 460;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 7.5);

    // 2. Renderer with Filmic Tonemapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Physical Frosted Glass Document Vault
    const docGeo = new THREE.BoxGeometry(2.4, 3.2, 0.08);
    const docMat = new THREE.MeshPhysicalMaterial({
      color: 0x1A1917,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.85,
      opacity: 0.92,
      transparent: true,
      reflectivity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });
    this.docMesh = new THREE.Mesh(docGeo, docMat);
    this.docMesh.position.set(0, 0.1, 0);
    this.scene.add(this.docMesh);

    // Document Wireframe Edge Glow
    const wireGeo = new THREE.WireframeGeometry(docGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xE8C872,
      transparent: true,
      opacity: 0.55
    });
    this.docWire = new THREE.LineSegments(wireGeo, wireMat);
    this.docMesh.add(this.docWire);

    // 4. Inner Scanning Document Sheet
    const sheetGeo = new THREE.PlaneGeometry(2.1, 2.9);
    const sheetMat = new THREE.MeshBasicMaterial({
      map: this.createDocSheetTexture(),
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    this.docSheet = new THREE.Mesh(sheetGeo, sheetMat);
    this.docSheet.position.set(0, 0, 0.01);
    this.docMesh.add(this.docSheet);

    // 5. Holographic Laser Scanning Sweep Plane
    const laserGeo = new THREE.PlaneGeometry(2.6, 0.08);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xE8C872,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    this.laserBeam = new THREE.Mesh(laserGeo, laserMat);
    this.laserBeam.position.set(0, 0, 0.06);
    this.docMesh.add(this.laserBeam);

    // 6. Dual Orbiting Holographic Rings (Gold + Dusty Teal)
    const ringGeo1 = new THREE.RingGeometry(1.85, 1.88, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xE8C872,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    this.laserRingGold = new THREE.Mesh(ringGeo1, ringMat1);
    this.laserRingGold.position.set(0, 0.1, -0.2);
    this.scene.add(this.laserRingGold);

    const ringGeo2 = new THREE.RingGeometry(2.15, 2.18, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x7CAABD,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.laserRingTeal = new THREE.Mesh(ringGeo2, ringMat2);
    this.laserRingTeal.position.set(0, 0.1, -0.3);
    this.scene.add(this.laserRingTeal);

    // 7. Floating Extracted Data Token Badges with Dynamic Canvas Textures
    const tokenData = [
      { tag: "SETTLEMENT", text: "₹500 DUE TODAY", color: "#E8C872", icon: "⚡", x: 2.35, y: 0.95, z: 0.6 },
      { tag: "DOCUMENT", text: "IIT MADRAS NOTICE", color: "#7CAABD", icon: "🏛️", x: -2.35, y: 1.05, z: 0.8 },
      { tag: "DEADLINE", text: "AUG 14 · 6:00 PM", color: "#D4715E", icon: "📅", x: -2.2, y: -0.95, z: 0.7 },
      { tag: "VERIFIED", text: "PROVENANCE 98.4%", color: "#E8C872", icon: "🛡️", x: 2.35, y: -0.95, z: 0.9 }
    ];

    tokenData.forEach((token, idx) => {
      const plateGeo = new THREE.PlaneGeometry(1.8, 0.56);
      const texture = this.createTokenTexture(token.tag, token.text, token.color, token.icon);
      const plateMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
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

    // 8. Ambient Particle Dust Field
    const count = 180;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 14;
      pos[i + 1] = (Math.random() - 0.5) * 9;
      pos[i + 2] = (Math.random() - 0.5) * 6;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xE8C872,
      transparent: true,
      opacity: 0.45
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    // 9. Warm Lighting
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.4);
    this.scene.add(ambient);

    const goldLight = new THREE.PointLight(0xE8C872, 3.8, 12);
    goldLight.position.set(3, 3, 4);
    this.scene.add(goldLight);

    const tealLight = new THREE.PointLight(0x7CAABD, 3.0, 10);
    tealLight.position.set(-3, -2, 3);
    this.scene.add(tealLight);

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
      const height = this.container.clientHeight || 460;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Smooth mouse inertia tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Document 3D Rotation & Levitation
    if (this.docMesh) {
      this.docMesh.rotation.y = this.mouse.x * 0.8 + Math.sin(time * 0.8) * 0.08;
      this.docMesh.rotation.x = -this.mouse.y * 0.6 + Math.cos(time * 0.6) * 0.05;
      this.docMesh.position.y = 0.1 + Math.sin(time * 1.2) * 0.08;
    }

    // Laser Beam Sweep Cycle (Top to bottom)
    if (this.laserBeam) {
      this.laserBeam.position.y = Math.sin(time * 2.2) * 1.4;
      this.laserBeam.material.opacity = 0.6 + Math.sin(time * 5.0) * 0.35;
    }

    // Orbiting Holographic Rings Rotation
    if (this.laserRingGold) {
      this.laserRingGold.rotation.z = time * 0.35;
      this.laserRingGold.rotation.x = Math.sin(time * 0.4) * 0.2;
    }

    if (this.laserRingTeal) {
      this.laserRingTeal.rotation.z = -time * 0.28;
      this.laserRingTeal.rotation.y = Math.cos(time * 0.5) * 0.25;
    }

    // Floating Data Plates Orbit & Float
    this.dataPlates.forEach((plate) => {
      plate.mesh.position.y = plate.origY + Math.sin(time * 1.6 + plate.offset) * 0.12;
      plate.mesh.position.x = plate.origX + Math.cos(time * 1.2 + plate.offset) * 0.08;
      plate.mesh.rotation.y = this.mouse.x * 0.4;
      plate.mesh.rotation.x = -this.mouse.y * 0.3;
    });

    // Particle Slow Drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.04;
      this.particles.rotation.x = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.SpatialHero3D = SpatialHero3D;
