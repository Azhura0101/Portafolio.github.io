import * as THREE from 'three';

function makeGlow() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default class Starfield {
  constructor() {
    this.container = document.getElementById('starfield-container');
    if (!this.container) return;

    this.mobile = window.innerWidth < 768;
    this.warp = 0; this.targetWarp = 0; this.prevWarp = 0;
    this.clock = new THREE.Clock();
    this.skipFrame = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: false,
      powerPreference: this.mobile ? 'low-power' : 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.mobile ? 1 : 2));
    this.renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1';
    this.container.appendChild(this.renderer.domElement);

    this.buildStars();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      this.targetWarp = max > 0 ? Math.min(window.scrollY / max * 1.5, 1) : 0;
    }, { passive: true });

    const max = document.body.scrollHeight - window.innerHeight;
    this.targetWarp = max > 0 ? Math.min(window.scrollY / max * 1.5, 1) : 0;
    this.warp = this.targetWarp;
    this.prevWarp = this.warp;

    this.animate();
  }

  buildStars() {
    const n = this.mobile ? 200 : 700;
    const pos = new Float32Array(n * 3);
    const base = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const color = new Float32Array(n * 3);
    const phase = new Float32Array(n);
    const speedArr = new Float32Array(n);
    const angle = new Float32Array(n);
    const radius = new Float32Array(n);
    const zOff = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() ** 0.5 * 120;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.35;
      const z = -r * Math.cos(phi);

      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
      angle[i] = Math.atan2(z, x);
      radius[i] = Math.sqrt(x * x + z * z);

      const rs = Math.random();
      if (rs < 0.5) size[i] = 0.4 + Math.random() * 0.6;
      else if (rs < 0.8) size[i] = 1.0 + Math.random() * 0.8;
      else size[i] = 2.0 + Math.random() * 1.5;

      phase[i] = Math.random() * Math.PI * 2;
      speedArr[i] = 0.3 + Math.random() * 0.7;

      const t = Math.random();
      if      (t < 0.25) { color[i*3]=1; color[i*3+1]=1; color[i*3+2]=1; }
      else if (t < 0.45) { color[i*3]=0.82; color[i*3+1]=0.86; color[i*3+2]=1; }
      else if (t < 0.65) { color[i*3]=1; color[i*3+1]=0.95; color[i*3+2]=0.78; }
      else if (t < 0.78) { color[i*3]=1; color[i*3+1]=0.82; color[i*3+2]=0.4; }
      else if (t < 0.90) { color[i*3]=0.95; color[i*3+1]=0.6; color[i*3+2]=0.15; }
      else               { color[i*3]=0.55; color[i*3+1]=0.72; color[i*3+2]=1; }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geom.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    geom.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geom.setAttribute('aSpeed', new THREE.BufferAttribute(speedArr, 1));

    this.starAngle = angle;
    this.starRadius = radius;
    this.starZOff = zOff;
    this.starBase = base;
    this.starGeom = geom;
    this.starCount = n;

    this.mat = new THREE.ShaderMaterial({
      uniforms: { uWarp: { value: 0 }, uTime: { value: 0 }, uGlow: { value: makeGlow() } },
      vertexShader: `
        uniform float uWarp; uniform float uTime;
        attribute float aSize; attribute vec3 aColor; attribute float aPhase; attribute float aSpeed;
        varying vec3 vColor; varying float vAlpha;

        void main() {
          vec3 p = position;
          p.xy *= 1.0 + uWarp * aSpeed * 2.5;
          p.z += uWarp * aSpeed * 15.0;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float scale = 300.0 / max(-mv.z, 1.0);
          gl_PointSize = aSize * scale * (1.0 + uWarp * aSpeed * 3.0);
          gl_PointSize = max(gl_PointSize, 0.5);
          gl_Position = projectionMatrix * mv;

          vColor = aColor * 1.2;
          vAlpha = 0.12 + (1.0 - smoothstep(0.0, 100.0, abs(position.z))) * 0.85;
          vAlpha = clamp(vAlpha + uWarp * aSpeed * 0.4, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime; uniform sampler2D uGlow;
        varying vec3 vColor; varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uGlow, gl_PointCoord);
          if (tex.a < 0.005) discard;
          float twinkle = 0.9 + 0.1 * sin(uTime * (0.6 + gl_PointCoord.x * 50.0));
          gl_FragColor = vec4(vColor * (1.0 + tex.r * 0.3), tex.a * vAlpha * twinkle);
        }
      `,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    this.starGroup = new THREE.Points(geom, this.mat);
    this.scene.add(this.starGroup);
  }

  animate() {
    if (this.mobile) {
      this.skipFrame = !this.skipFrame;
      if (this.skipFrame) {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
        return;
      }
    }

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.getElapsedTime();

    this.warp += (this.targetWarp - this.warp) * 0.06;
    const dw = this.warp - this.prevWarp;
    this.prevWarp = this.warp;
    this.mat.uniforms.uWarp.value = this.warp;
    this.mat.uniforms.uTime.value = t;

    const pos = this.starGeom.attributes.position.array;
    const base = this.starBase;
    const speedArr = this.starGeom.attributes.aSpeed.array;

    for (let i = 0; i < this.starCount; i++) {
      const b = i * 3;
      const s = speedArr[i];
      const r = this.starRadius[i];
      this.starAngle[i] += dt * (0.008 / (1 + r * 0.004));
      const a = this.starAngle[i];
      const xOrb = r * Math.cos(a);
      const zOrb = r * Math.sin(a);
      this.starZOff[i] = Math.max(-8, this.starZOff[i] + dw * s * 150);

      pos[b] = xOrb;
      pos[b + 1] = base[b + 1];
      pos[b + 2] = zOrb + this.starZOff[i];

      if ((this.warp > 0.05 && pos[b + 2] > 5) || pos[b + 2] < -120) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const rr = 60 + Math.random() * 80;
        base[b] = rr * Math.sin(phi) * Math.cos(theta);
        base[b + 1] = rr * Math.sin(phi) * Math.sin(theta) * 0.35;
        base[b + 2] = -rr * Math.cos(phi);
        this.starRadius[i] = Math.sqrt(base[b] * base[b] + base[b + 2] * base[b + 2]);
        this.starAngle[i] = Math.atan2(base[b + 2], base[b]);
        this.starZOff[i] = 0;
        pos[b] = base[b];
        pos[b + 1] = base[b + 1];
        pos[b + 2] = base[b + 2];
      }
    }
    this.starGeom.attributes.position.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

}
