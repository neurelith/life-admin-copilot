/* ============================================================
   LIFE ADMIN COPILOT — 3D WebGL Operations Hub (Three.js)
   Interactive geometric core with orbiting life obligation nodes.
   ============================================================ */

class LifeHub3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coreMesh = null;
    this.outerMesh = null;
    this.particles = null;
    this.orbitNodes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.hoveredNode = null;
    this.tooltipEl = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 260;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 7;

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Central Geometric Core (Iridescent Icosahedron + Wireframe cage)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x1A7A5C,
      emissive: 0x0D4D38,
      specular: 0xC85A2A,
      shininess: 90,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.scene.add(this.coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xF8F7F4,
      wireframe: false,
      transparent: true,
      opacity: 0.18
    });
    this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.scene.add(this.innerMesh);

    // 4. Orbiting Category Nodes
    const categories = [
      { name: "Urgent Attention", color: 0xD9601A, radius: 2.8, speed: 0.008, angle: 0, count: "3 items", view: "today" },
      { name: "Financial Bills", color: 0x4F46E5, radius: 3.1, speed: -0.006, angle: 1.2, count: "₹4,230", view: "inbox" },
      { name: "Travel & Transit", color: 0x0D7C8F, radius: 2.6, speed: 0.011, angle: 2.4, count: "Aug 15", view: "calendar" },
      { name: "Identity & Passports", color: 0x0284C7, radius: 3.3, speed: -0.009, angle: 3.6, count: "Valid 2030", view: "documents" },
      { name: "Warranties & Tax", color: 0xB45309, radius: 2.9, speed: 0.007, angle: 4.8, count: "Sony XM5", view: "documents" }
    ];

    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    categories.forEach(cat => {
      const nodeMat = new THREE.MeshBasicMaterial({ color: cat.color });
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.userData = cat;
      this.scene.add(mesh);
      this.orbitNodes.push({ mesh, cat });
    });

    // 5. Floating Dust Particle Field
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = (Math.random() - 0.5) * 12;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xC85A2A,
      transparent: true,
      opacity: 0.4
    });
    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xC85A2A, 2, 20);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1A7A5C, 2, 20);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);

    // 7. HTML Floating Tooltip
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'three-tooltip';
    this.tooltipEl.style.cssText = `
      position: absolute;
      display: none;
      padding: 6px 12px;
      background: rgba(24, 24, 22, 0.92);
      color: #FFF;
      font-size: 11px;
      font-weight: 500;
      border-radius: 6px;
      pointer-events: none;
      z-index: 20;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid rgba(255,255,255,0.1);
      transform: translate(-50%, -120%);
      white-space: nowrap;
    `;
    this.container.appendChild(this.tooltipEl);

    // 8. Event Listeners
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.mouse.x = x;
      this.mouse.y = y;

      this.targetRotation.x = y * 0.4;
      this.targetRotation.y = x * 0.6;

      // Tooltip position
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.orbitNodes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.hoveredNode = hit;
        this.tooltipEl.style.display = 'block';
        this.tooltipEl.style.left = `${e.clientX - rect.left}px`;
        this.tooltipEl.style.top = `${e.clientY - rect.top}px`;
        this.tooltipEl.innerHTML = `<strong>${hit.userData.name}</strong> · <span style="color: #FFA07A;">${hit.userData.count}</span>`;
        this.container.style.cursor = 'pointer';
      } else {
        this.hoveredNode = null;
        this.tooltipEl.style.display = 'none';
        this.container.style.cursor = 'default';
      }
    });

    this.container.addEventListener('click', () => {
      if (this.hoveredNode && window.app) {
        const view = this.hoveredNode.userData.view;
        if (view) {
          window.app.switchView(view);
          if (window.tactile) window.tactile.playClick();
        }
      }
    });

    this.container.addEventListener('mouseleave', () => {
      this.targetRotation.x = 0;
      this.targetRotation.y = 0;
      this.hoveredNode = null;
      this.tooltipEl.style.display = 'none';
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width > 0 && height > 0) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Inertia rotation smoothing
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

    if (this.coreMesh) {
      this.coreMesh.rotation.x += 0.003 + this.currentRotation.x * 0.02;
      this.coreMesh.rotation.y += 0.005 + this.currentRotation.y * 0.02;
    }

    if (this.innerMesh) {
      this.innerMesh.rotation.x -= 0.002;
      this.innerMesh.rotation.y -= 0.003;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }

    // Animate Orbiting Nodes
    this.orbitNodes.forEach(item => {
      item.cat.angle += item.cat.speed;
      item.mesh.position.x = Math.cos(item.cat.angle) * item.cat.radius;
      item.mesh.position.y = Math.sin(item.cat.angle * 1.5) * (item.cat.radius * 0.4);
      item.mesh.position.z = Math.sin(item.cat.angle) * (item.cat.radius * 0.8);
    });

    this.renderer.render(this.scene, this.camera);
  }
}
