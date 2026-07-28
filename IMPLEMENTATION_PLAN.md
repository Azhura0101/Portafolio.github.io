# Plan Técnico Completo — Portfolio Azhura.dev (Nivel Senior)

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Core** | HTML5, CSS3, Vanilla JS (ES2023+) | Zero deps, 60fps, control total |
| **3D/GPU** | Three.js (r160+) via CDN | WebGL maduro, shaders custom, tree-shakable |
| **Fonts** | Outfit + JetBrains Mono (Google Fonts) | Variable fonts, `font-display: swap` |
| **Icons** | Font Awesome 6 (lazy) | Solo lo que se usa |
| **Forms** | Web3Forms (serverless) | Sin backend, spam protection |
| **Deploy** | GitHub Pages + Cloudflare | Gratis, CDN global, HTTPS |
| **PWA** | Service Worker + Manifest | Offline-first, installable |
| **Analytics** | Plausible/Umami (self-hosted) | Privacy-first, no cookies |

---

## Arquitectura de Componentes

```
├── index.html                 # Single-page, semantic HTML
├── style.css                  # CSS Custom Properties, BEM-ish
├── script.js                  # Módulos IIFE, event-driven
├── translations.js            # i18n ES/EN, lazy-loaded
├── sw.js                      # Workbox-style caching
├── manifest.json              # PWA config
├── 404.html                   # Custom 404
├── sitemap.xml                # SEO
├── robots.txt                 # Crawlers
└── img/                       # WebP/AVIF optimized
```

---

## 1. WARP DRIVE STARFIELD (Hero)

### Features
- [x] 6,000 estrellas (2,000 mobile) en BufferGeometry
- [x] Efecto warp: vertices se estiran en vertex shader según `uWarp` (scroll)
- [x] Cometa cursor: 60 partículas con life decay siguiendo mouse/touch
- [x] Nebulosas: 5 Points con shader noise + color cycling
- [x] Shooting stars: 3 con trail, spawn aleatorio
- [x] Parallax mouse (0.03 rad) + cámara dolly en scroll
- [ ] Constelaciones: conectar estrellas "skill" al hover (líneas Bézier)
- [ ] Skill tooltips: al click en estrella skill → mini-card

### Shader Architecture
```glsl
// Vertex: warp = uWarp * depth * distanceFromCenter
// Fragment: glow radial + ring pulse at high warp
uniform float uWarp;     // 0.0 – 1.0 (scroll progress)
uniform float uTime;
attribute float depth;   // 0-1 (radio normalizado)
attribute float warp;    // 0.2-1.5 (factor individual)
```

### Performance Targets
| Métrica | Target |
|---------|--------|
| FPS desktop | 60 |
| FPS mobile (mid) | 45+ |
| JS heap | < 15 MB |
| First Paint | < 1.2 s |
| LCP | < 2.0 s |

---

## 2. TERMINAL INTERACTIVA (Command Interface)

### Comandos Implementados
| Comando | Descripción | Output |
|---------|-------------|--------|
| `help` | Lista comandos | Tabla formateada |
| `about` | Bio corta | Multi-line typing |
| `skills` | Stack con barras | ASCII bars |
| `projects` | Lista proyectos | Cards con links |
| `experiencia` | Timeline | Chronological |
| `services` | Servicios + precios | Cards |
| `contact` | Info contacto | Formatted |
| `social` | Redes | Clickable |
| `whoami` | Identidad | One-liner |
| `date` | Fecha local CO | Intl.DateTimeFormat |
| `neofetch` | System info ASCII | Styled block |
| `banner` | ASCII logo | Gradient text |
| `clear` | Limpia pantalla | — |
| `sudo hire me` | Easter egg | ASCII rocket + CTA |

### UX Features
- [x] Typing animation (3-8ms/char variable)
- [x] Tab completion (prefix match + multi-match list)
- [x] History navigation (↑/↓, 50 entries)
- [x] Fuzzy suggestion ("pro" → "projects")
- [x] KBD shortcuts click-to-run
- [x] Prompt `azhura@portfolio:~$` traducible
- [x] Focus trap + auto-focus on section reveal
- [x] Responsive: ayuda oculta en <768px, font 0.7rem

### Arquitectura
```js
// Module pattern IIFE
const cmds = {
  about: { es: [...], en: [...] },
  // ...
};
// runCmd() → print(lines, typing)
// print() → crea .terminal-block → .terminal-line
// Tab: input.value.startsWith() + matches[]
```

---

## 3. SISTEMA SOLAR INTERACTIVO (Proyectos)

### Features
- [x] Sol: shader pulsante + corona back-face + anillo 200 particulas
- [x] 5 planetas: geometría, color, distancia, velocidad, ángulo inicial únicos
- [x] Órbitas: Line (opacidad 0.08) + Glow Line (scale 1.02, opacidad 0.03)
- [x] Planetas: MeshPhong + glow MeshBasic aditivo pulsante
- [x] Click → Raycaster → Tooltip HTML glassmorphism
- [x] Tooltip: nombre, status badge, desc, tech stack, métricas, link externo
- [x] Hover cursor `pointer` + posicionamiento smart (edge detection)
- [x] Scroll → cámara dolly out (22→42) + height (4→16)
- [ ] Labels orbitando: CSS2D sprite con nombre + status dot
- [ ] Timeline orbital: al click → highlight órbita + muestra fechas hitos
- [ ] Partículas "polvo" en plano eclíptico (sutil)

### Data Structure
```js
{
  id: 'stride',
  name: 'Stride Base',
  nameEN: 'Stride Base',
  desc: 'Sistema gestión empresarial...',
  descEN: 'Business management system...',
  color: '#8b5cf6',
  radius: 2.2,
  distance: 8,
  speed: 0.3,
  angle: 0,
  status: 'production',
  statusES: 'Producción',
  tech: 'Flask, SQLAlchemy, Chart.js, PostgreSQL',
  metrics: '100+ empleados · 200+ tx/mes',
  metricsEN: '100+ employees · 200+ tx/month',
  link: 'https://sistema-base-demo.onrender.com',
}
```

---

## 4. SEO & PERFORMANCE CHECKLIST

### Technical SEO
- [x] Semantic HTML5 (`header`, `main`, `section`, `article`, `footer`)
- [x] Meta tags: title, description, canonical, viewport, theme-color
- [x] Open Graph + Twitter Card completos
- [x] JSON-LD Person + WebSite + Service
- [x] `lang` + `hreflang` ES/EN
- [x] Sitemap.xml + robots.txt
- [x] Structured data: `knowsAbout`, `hasSkill`, `areaServed: CO`

### Performance
- [x] Fonts: `preconnect` + `display=swap` + variable font
- [x] FA: `media="print" onload="this.media='all'"`
- [x] Critical CSS inline (hero, nav) — resto async
- [x] Images: WebP + `loading="lazy"` + `width`/`height`
- [x] Three.js: CDN + `defer` + `crossorigin`
- [x] Service Worker: cache-first (static), network-first (API)
- [x] Preload: favicon, hero font
- [x] DNS prefetch: render.com, vercel.app, credly.com

### Core Web Vitals Targets
| Métrica | Bueno | Meta |
|---------|-------|------|
| LCP | < 2.5s | **< 1.8s** |
| INP | < 200ms | **< 100ms** |
| CLS | < 0.1 | **< 0.05** |
| TTFB | < 800ms | **< 400ms** |

---

## 5. A11Y (WCAG 2.1 AA)

- [x] Skip to content link
- [x] Focus visible: `outline: 2px solid var(--accent-purple)` + offset
- [x] ARIA labels en nav, chat, terminal, form
- [x] `role="status"` en chat messages
- [x] Contraste: texto primario 12:1, secundario 7:1
- [x] `prefers-reduced-motion`: desactiva animaciones CSS + Three.js
- [x] `prefers-color-scheme`: solo dark (brand), pero respetado
- [x] Touch targets ≥ 44×44px
- [x] Form: `required`, `aria-describedby` para errors, contador chars

---

## 6. PWA

- [x] `manifest.json`: name, icons (192/512), display: standalone
- [x] `sw.js`: install → cache shell; fetch → stale-while-revalidate
- [x] Offline page: `/offline.html` cached
- [x] Update prompt: `registration.updatefound`
- [x] `apple-touch-icon` + `msapplication-TileColor`

---

## 7. INTERNACIONALIZACIÓN (i18n)

- [x] `translations.js`: objeto `es`/`en` plano
- [x] `data-i18n` en HTML → `textContent`/`innerHTML` swap
- [x] Selector persistente: `localStorage` + `<html lang>`
- [x] 120+ keys cubriendo: nav, hero, about, skills, projects, terminal, solar, contact, chat, footer
- [x] Sin librería externa (2 KB gzipped)

---

## 8. CHAT WIDGET (Existente — Mantener)

- [x] 3 grupos de chips: ¿Qué hago? / ¿Cómo trabajo? / Contacto
- [x] Animación typing bot + chips expandibles
- [x] `overscroll-behavior: contain` en móvil
- [x] Promo banner 30s post-load
- [x] i18n completo

---

## 9. ROADMAP DE MEJORAS FUTURAS

| Prioridad | Feature | Esfuerzo | Impacto |
|-----------|---------|----------|---------|
| 🔴 | Constelaciones skills en starfield | 8h | Alto (wow factor) |
| 🔴 | Labels CSS2D en sistema solar | 4h | Alto (UX) |
| 🟡 | Timeline orbital interactiva | 6h | Medio |
| 🟡 | Blog/Devlog (MDX + SSG) | 16h | Alto (SEO/autoridad) |
| 🟡 | Modo "Mission Log" en terminal | 4h | Medio |
| 🟢 | WebGL cursor trail (partículas) | 6h | Bajo (delight) |
| 🟢 | Shader "aurora" en backgrounds sección | 4h | Bajo |
| 🟢 | Micro-interacciones Framer Motion style | 8h | Medio |

---

## 10. COMANDOS DE DESARROLLO

```bash
# Servidor local con live reload
npx serve -l 3000

# Lint CSS
npx stylelint style.css --fix

# Lint JS
npx eslint script.js --fix

# Test Lighthouse CI
npx lighthouse http://localhost:3000 --output=json --output-path=./lhci.json

# Build producción (minify manual si se desea)
# GitHub Pages deploy: push a main
```

---

## 11. ESTRUCTURA DE CARPETAS FINAL

```
Portafolio.github.io/
├── index.html
├── 404.html
├── offline.html
├── style.css
├── script.js
├── translations.js
├── sw.js
├── manifest.json
├── sitemap.xml
├── robots.txt
├── IMPLEMENTATION_PLAN.md
├── img/
│   ├── og-image.png (1200×630)
│   ├── favicon.svg
│   ├── black.webp
│   ├── white.webp
│   ├── Catalogo.webp
│   ├── Wisamy.webp
│   └── juan.webp
└── .github/workflows/  (opcional: lighthouse CI)
```

---

## 12. CHECKLIST PRE-DEPLOY

- [ ] `npm run lint` (css + js) pasa
- [ ] Lighthouse ≥ 95 en todas las categorías
- [ ] Test manual: ES/EN, móvil/desktop, chat, terminal, solar, formulario
- [ ] `prefers-reduced-motion` desactiva Three.js + CSS animaciones
- [ ] Formulario envía a Web3Forms → redirect `?success=true#contacto`
- [ ] 404.html estilizado + link a home
- [ ] `sw.js` version bump → `azhura-v3`
- [ ] Commit message: `feat: warp starfield + terminal + solar system v2`
- [ ] Push → verificar GitHub Pages build ✓