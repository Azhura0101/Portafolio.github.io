import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PROJECTS = [
  {
    id: 'stride', name: 'Stride Base', nameEN: 'Stride Base',
    desc: 'Solución integral de RRHH y Finanzas: control de empleados, alertas automáticas, bitácoras, registro de transacciones multi-cuenta y dashboard interactivo.',
    descEN: 'Complete HR & Finance solution: employee control, automatic alerts, logs, multi-account transaction tracking and interactive dashboard.',
    color: '#8b5cf6', radius: 2.0, distance: 7, speed: 0.3, angle: 0,
    status: 'production', statusES: 'Comisionado', statusEN: 'Commissioned',
    tech: ['Python', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'Bootstrap'],
    metrics: '100+ empleados · 200+ tx/mes', metricsEN: '100+ employees · 200+ tx/month',
    link: 'https://sistema-base-demo.onrender.com/login'
  },
  {
    id: 'nexus', name: 'NexusAI', nameEN: 'NexusAI',
    desc: 'Plataforma web para analizar y gestionar datos de redes sociales con dashboard interactivo.',
    descEN: 'Web platform to analyze and manage social media data with interactive dashboard.',
    color: '#6366f1', radius: 1.5, distance: 11, speed: 0.2, angle: 2.1,
    status: 'demo', statusES: 'Demo', statusEN: 'Demo',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    metrics: 'Dashboard interactivo', metricsEN: 'Interactive dashboard',
    link: 'https://azhura0101.github.io/NexusAI/index.html'
  },
  {
    id: 'catalogo', name: 'Catálogo MP', nameEN: 'MP Catalog',
    desc: 'Catálogo web responsivo para bisutería artesanal con galería, filtros y pedidos por WhatsApp.',
    descEN: 'Responsive web catalog for artisan jewelry with gallery, filters and WhatsApp orders.',
    color: '#a78bfa', radius: 1.3, distance: 15, speed: 0.15, angle: 4.3,
    status: 'production', statusES: 'Comisionado', statusEN: 'Commissioned',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    metrics: '50+ productos · 5 semanas', metricsEN: '50+ products · 5 weeks',
    link: 'https://catalogomanosproductivas.vercel.app/'
  },
  {
    id: 'landing', name: 'Landing Ropa', nameEN: 'Clothing LP',
    desc: 'Landing page de e-commerce responsivo con diseño moderno y orientado a conversión.',
    descEN: 'Responsive e-commerce landing page with modern conversion-oriented design.',
    color: '#c084fc', radius: 1.1, distance: 19, speed: 0.12, angle: 1.8,
    status: 'demo', statusES: 'Demo', statusEN: 'Demo',
    tech: ['HTML5', 'CSS3'],
    metrics: 'Diseño responsivo', metricsEN: 'Responsive design',
    link: 'https://codepen.io/EMANUEL-ZAPATA-the-looper/full/VwJWKjb'
  },
  {
    id: 'donde-juan', name: 'Donde Juan', nameEN: 'Donde Juan',
    desc: 'Menú digital con pedidos directos a WhatsApp. Optimizado para móviles.',
    descEN: 'Digital menu with direct WhatsApp orders. Mobile-optimized.',
    color: '#e879f9', radius: 1.0, distance: 23, speed: 0.1, angle: 5.7,
    status: 'demo', statusES: 'Demo', statusEN: 'Demo',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    metrics: 'Pedidos en tiempo real', metricsEN: 'Real-time orders',
    link: 'https://codepen.io/EMANUEL-ZAPATA-the-looper/full/raVjQoN'
  }
];

export default class SolarSystem {
  constructor() {
    this.container = document.getElementById('solar-system-container');
    if (!this.container) return;
    this.isMobile = window.innerWidth < 768;
    this.selected = null;
    this.planets = [];
    this.orbits = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clock = new THREE.Clock();

    this.initScene();
    this.buildSun();
    this.buildPlanets();
    this.buildOrbits();
    this.buildTooltip();
    this.bindEvents();
    this.startRendering();
  }

  get lang() {
    return localStorage.getItem('selectedLang') || 'es';
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 100);
    this.camera.position.set(0, 18, 28);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: !this.isMobile,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 2));
    this.renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;
    this.controls.enableZoom = !this.isMobile;
    this.controls.maxDistance = 50;
    this.controls.minDistance = 8;
    this.controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    this.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);
  }

  buildSun() {
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#8b5cf6') }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          float pulse = 0.9 + 0.1 * sin(uTime * 0.5);
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = pow(rim, 3.0) * 0.6;
          vec3 color = uColor * pulse + vec3(0.4, 0.2, 0.6) * glow;
          float alpha = 0.85 + glow * 0.15;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.sun = new THREE.Mesh(geometry, material);
    this.sunMat = material;
    this.scene.add(this.sun);

    const glowGeo = new THREE.SphereGeometry(4, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#8b5cf6') } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float alpha = pow(rim, 2.0) * 0.3 * (0.9 + 0.1 * sin(uTime * 0.3));
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false
    });
    this.sunGlow = new THREE.Mesh(glowGeo, glowMat);
    this.sunGlowMat = glowMat;
    this.scene.add(this.sunGlow);

    const ringParts = 200;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringParts * 3);
    for (let i = 0; i < ringParts; i++) {
      const a = (i / ringParts) * Math.PI * 2;
      const r = 3.8 + Math.random() * 0.4;
      ringPos[i * 3] = Math.cos(a) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0xa78bfa, size: 0.06, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
    });
    this.sunRing = new THREE.Points(ringGeo, ringMat);
    this.scene.add(this.sunRing);
  }

  buildPlanets() {
    const proj = PROJECTS;
    const lang = this.lang;

    proj.forEach((p, i) => {
      const geo = new THREE.SphereGeometry(p.radius, 24, 24);
      const col = new THREE.Color(p.color);
      const mat = new THREE.MeshPhongMaterial({
        color: col, emissive: col, emissiveIntensity: 0.15,
        shininess: 30, transparent: true, opacity: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = p.angle || (i * 1.5);
      mesh.position.x = Math.cos(angle) * p.distance;
      mesh.position.z = Math.sin(angle) * p.distance;
      mesh.userData = { project: p, index: i, angle };

      const glowMat = new THREE.SpriteMaterial({
        map: this.createGlowTexture(col),
        blending: THREE.AdditiveBlending,
        transparent: true, opacity: 0.4,
        depthWrite: false
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(p.radius * 5, p.radius * 5, 1);
      mesh.add(glow);

      this.scene.add(mesh);
      this.planets.push(mesh);
    });
  }

  createGlowTexture(color) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    const c = new THREE.Color(color);
    gradient.addColorStop(0, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.8)`);
    gradient.addColorStop(0.3, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.3)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  buildOrbits() {
    PROJECTS.forEach(p => {
      const segments = 64;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pos[i * 3] = Math.cos(a) * p.distance;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = Math.sin(a) * p.distance;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.LineBasicMaterial({
        color: p.color, transparent: true, opacity: 0.15
      });
      const line = new THREE.Line(geo, mat);
      this.scene.add(line);
      this.orbits.push(line);
    });
  }

  buildTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'solar-tooltip';
    this.tooltip.innerHTML = '';
    this.container.appendChild(this.tooltip);
  }

  showTooltip(project, mesh) {
    const lang = this.lang;
    const isEs = lang === 'es';
    const statusText = isEs ? project.statusES : project.statusEN;
    const statusClass = project.status === 'production' ? 'prod' : 'demo';
    const descText = isEs ? project.desc : project.descEN;
    const metricsText = isEs ? project.metrics : project.metricsEN;

    this.tooltip.innerHTML = `
      <div class="solar-tooltip-header">
        <span class="solar-tooltip-name">${project.name}</span>
        <span class="solar-tooltip-badge ${statusClass}">${statusText}</span>
      </div>
      <p class="solar-tooltip-desc">${descText}</p>
      <div class="solar-tooltip-tech">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="solar-tooltip-metrics">${metricsText}</div>
      <a href="${project.link}" target="_blank" class="solar-tooltip-link">${isEs ? 'Ver proyecto →' : 'View project →'}</a>
    `;
    this.tooltip.style.display = 'block';

    const rect = this.container.getBoundingClientRect();
    const pos = mesh.position.clone();
    pos.project(this.camera);
    const x = (pos.x * 0.5 + 0.5) * rect.width;
    const y = (-pos.y * 0.5 + 0.5) * rect.height;
    this.tooltip.style.left = Math.min(x, rect.width - 240) + 'px';
    this.tooltip.style.top = Math.max(10, y - 10) + 'px';
  }

  hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  bindEvents() {
    this.renderer.domElement.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.planets);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const proj = mesh.userData.project;
        if (proj) {
          this.selected = mesh;
          this.showTooltip(proj, mesh);
        }
      } else {
        this.selected = null;
        this.hideTooltip();
      }
    });

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = this.container.getBoundingClientRect();
          const visible = rect.top < window.innerHeight && rect.bottom > 0;
          if (!visible && this.selected) {
            this.hideTooltip();
            this.selected = null;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  startRendering() {
    const render = () => {
      requestAnimationFrame(render);
      const dt = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      this.sunMat.uniforms.uTime.value = time;
      this.sunGlowMat.uniforms.uTime.value = time;
      if (this.sunRing) {
        this.sunRing.rotation.y = time * 0.2;
      }

      this.planets.forEach((mesh, i) => {
        const p = PROJECTS[i];
        const angle = p.angle + time * p.speed;
        mesh.position.x = Math.cos(angle) * p.distance;
        mesh.position.z = Math.sin(angle) * p.distance;
        mesh.rotation.y = time * 0.5;
      });

      this.controls.update();

      if (this.selected) {
        this.showTooltip(this.selected.userData.project, this.selected);
      }

      this.renderer.render(this.scene, this.camera);
    };
    render();
  }
}




