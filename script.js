let currentLang = localStorage.getItem('selectedLang') || (navigator.language.startsWith('en') ? 'en' : 'es');

const typingStrings = {
    es: ['Python & Flask', 'Desarrollo Backend', 'Sistemas Web', 'Automatización', 'Bases de datos'],
    en: ['Python & Flask', 'Backend Development', 'Web Systems', 'Automation', 'Databases']
};

let typingIndex = 0, charIndex = 0, isDeleting = false;

function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1500;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            const target = parseInt(el.dataset.count);
            const suffix = el.textContent.includes('+') ? '+' : '';
            animateCounter(el, target, suffix);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function typeEffect() {
    const lang = currentLang || 'es';
    const words = typingStrings[lang] || typingStrings.es;
    const typingEl = document.getElementById('typing-target');
    if (!typingEl) return;
    const currentWord = words[typingIndex % words.length];
    const speed = isDeleting ? 60 : 110;

    if (!isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2200);
            return;
        }
    } else {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            typingIndex = (typingIndex + 1) % words.length;
        }
    }
    setTimeout(typeEffect, speed);
}
setTimeout(typeEffect, 800);

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('selectedLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = translations[lang][key];
        if (val !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else if (val.includes('<')) {
                el.innerHTML = val;
            } else {
                el.textContent = val;
            }
        }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';

    if (typeof updateChatLanguage === 'function') {
        updateChatLanguage(lang);
    }
}


function closeModal() { document.getElementById('successModal').classList.remove('active'); }
function openTerms() {
    const el = document.querySelector('#termsModal .terms-content');
    el.innerHTML = translations[currentLang].terms_content;
    document.getElementById('termsModal').classList.add('active');
}
function closeTerms() { document.getElementById('termsModal').classList.remove('active'); }

function launchConfetti() {
    if (typeof confetti === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        s.onload = () => fireConfetti();
        document.head.appendChild(s);
    } else {
        fireConfetti();
    }
}
function fireConfetti() {
    const end = Date.now() + 3000;
    const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        const count = 50 * ((end - Date.now()) / 3000);
        confetti({ particleCount: count, origin: { x: Math.random() * 0.4, y: Math.random() * 0.4 } });
        confetti({ particleCount: count, origin: { x: 0.6 + Math.random() * 0.4, y: Math.random() * 0.4 } });
    }, 250);
}

document.getElementById('currentYear').textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

function track(event, data) {
    try {
        const log = JSON.parse(localStorage.getItem('_track') || '[]');
        log.push({ event, data, ts: Date.now() });
        localStorage.setItem('_track', JSON.stringify(log.slice(-50)));
    } catch (e) {}
}

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    document.querySelectorAll('section').forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    document.querySelectorAll('nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    const open = navToggle.classList.contains('active');
    document.body.classList.toggle('nav-open');
    document.documentElement.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.documentElement.style.overflow = '';
    });
});

document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
});

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
    track('pageview', { lang: currentLang });

        document.getElementById('lang-toggle').addEventListener('click', () => {
            track('lang_toggle', { from: currentLang, to: currentLang === 'es' ? 'en' : 'es' });
            updateLanguage(currentLang === 'es' ? 'en' : 'es');
        });

        document.querySelector('a[href*="drive.google.com"][data-i18n="hero_cv"]')?.addEventListener('click', () => track('cv_download'));

        document.getElementById('submitBtn').addEventListener('click', () => track('form_submit'));

    const strideImg = document.getElementById('stride-img');
    if (strideImg) {
        const images = ['img/black.webp', 'img/white.webp'];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % images.length;
            strideImg.src = images[idx];
        }, 4000);
    }

    if (new URLSearchParams(location.search).get('success') === 'true') {
        document.getElementById('successModal').classList.add('active');
        launchConfetti();
        track('form_submit_success');
        history.replaceState(null, '', location.pathname);
    }

    document.querySelector('#successModal .modal-btn').addEventListener('click', closeModal);

    document.getElementById('termsModal').querySelector('.modal-close-btn').addEventListener('click', closeTerms);
    document.getElementById('termsModal').querySelector('.modal-btn').addEventListener('click', closeTerms);

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth < 768;
    const TIER_COUNTS = isMobile
        ? [{ n: 3, rMin: 1.8, rMax: 2.8, aMin: 0.7, aMax: 1.0, vMax: 0.04, glow: true, parallax: 0.3 },
           { n: 7, rMin: 1.0, rMax: 1.8, aMin: 0.35, aMax: 0.6, vMax: 0.1, glow: false, parallax: 0.12 },
           { n: 12, rMin: 0.4, rMax: 0.9, aMin: 0.1, aMax: 0.25, vMax: 0.18, glow: false, parallax: 0.03 },
           { n: 2, rMin: 3.0, rMax: 4.5, aMin: 0.8, aMax: 1.0, vMax: 0.02, glow: true, parallax: 0.45 }]
        : [{ n: 18, rMin: 2.0, rMax: 3.2, aMin: 0.75, aMax: 1.0, vMax: 0.03, glow: true, parallax: 0.35 },
           { n: 35, rMin: 1.0, rMax: 1.8, aMin: 0.35, aMax: 0.65, vMax: 0.08, glow: false, parallax: 0.12 },
           { n: 60, rMin: 0.3, rMax: 0.9, aMin: 0.08, aMax: 0.22, vMax: 0.2, glow: false, parallax: 0.02 }];

    let scrollY = 0;
    let smoothDepth = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const particles = [];
    const explosions = [];
    class Particle {
        constructor(tier) { this.tier = tier; this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            const t = this.tier;
            this.baseR = Math.random() * (t.rMax - t.rMin) + t.rMin;
            this.r = this.baseR;
            this.vx = (Math.random() - 0.5) * t.vMax;
            this.vy = (Math.random() - 0.5) * t.vMax;
            this.baseAlpha = Math.random() * (t.aMax - t.aMin) + t.aMin;
            this.alpha = this.baseAlpha;
            this.twinkleSpeed = Math.random() * 0.003 + 0.001;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.life = 0;
            this.maxLife = 8000 + Math.random() * 12000;
            this.lifeElapsed = 0;
        }
        get lifeCurve() {
            const p = this.lifeElapsed / this.maxLife;
            if (p < 0.15) return p / 0.15;
            if (p < 0.85) return 1;
            return 1 - (p - 0.85) / 0.15;
        }
        update(time) {
            let neighbors = 0;
            const myDx = this.drawX, myDy = this.drawY;
            for (let i = 0; i < particles.length; i++) {
                if (particles[i] === this) continue;
                const ox = particles[i].drawX, oy = particles[i].drawY;
                const d = (myDx - ox) ** 2 + (myDy - oy) ** 2;
                if (d < 10000) neighbors++;
            }
            const densityBoost = neighbors > 3 ? (neighbors - 3) * 80 : 0;
            this.lifeElapsed += 16 + densityBoost;
            this.vx *= 0.99;
            this.vy *= 0.99;
            this.x += this.vx;
            this.y += this.vy;
            const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
            this.alpha = this.baseAlpha + twinkle * 0.1;
            this.r = this.baseR + twinkle * 0.15;
            const dx = this.drawX, dy = this.drawY;
            const margin = 40;
            if (this.lifeElapsed >= this.maxLife || dx < -margin || dx > canvas.width + margin || dy < -margin || dy > canvas.height + margin) {
                if (this.lifeElapsed >= this.maxLife && this.tier.glow) {
                    spawnExplosion(this.x, this.y, this.tier.parallax);
                }
                this.respawn();
            }
        }
        respawn() {
            const w = canvas.width;
            const h = canvas.height;
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            const t = this.tier;
            this.baseR = Math.random() * (t.rMax - t.rMin) + t.rMin;
            this.r = this.baseR;
            this.baseAlpha = Math.random() * (t.aMax - t.aMin) + t.aMin;
            this.alpha = this.baseAlpha;
            this.lifeElapsed = 0;
            this.maxLife = 15000 + Math.random() * 25000;
        }
        get drawX() {
            if (smoothDepth < 1) return this.x;
            const cx = canvas.width / 2;
            const dx = this.x - cx;
            const dy = this.y - canvas.height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const maxDisp = canvas.width * 0.4;
            const disp = Math.min(smoothDepth * this.tier.parallax * 0.12, maxDisp);
            return this.x + (dx / dist) * disp;
        }
        get drawY() {
            if (smoothDepth < 1) return this.y;
            const cy = canvas.height / 2;
            const dx = this.x - canvas.width / 2;
            const dy = this.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const maxDisp = canvas.height * 0.4;
            const disp = Math.min(smoothDepth * this.tier.parallax * 0.12, maxDisp);
            return this.y + (dy / dist) * disp;
        }
        draw(scrollProgress) {
            const depth = this.tier.parallax;
            const depthBoost = scrollProgress * depth * 0.6;
            const lifeFade = this.lifeCurve;
            const a = Math.max(0.02, (this.alpha + depthBoost) * lifeFade);
            const r = Math.max(0.3, this.r + this.baseR * depthBoost * 0.3);
            const dx = this.drawX, dy = this.drawY;
            if (a < 0.01) return;
            if (this.tier.glow) {
                ctx.beginPath();
                ctx.arc(dx, dy, r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 255, ${(a + depthBoost) * 0.12 * lifeFade})`;
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(dx, dy, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
            ctx.fill();
        }
    }
    TIER_COUNTS.forEach(tier => { for (let i = 0; i < tier.n; i++) particles.push(new Particle(tier)); });

    function drawConnections(scrollProgress) {
        const maxDist = isMobile ? 160 : 150;
        const glow = 0.25 + scrollProgress * 0.15;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].drawX - particles[j].drawX;
                const dy = particles[i].drawY - particles[j].drawY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].drawX, particles[i].drawY);
                    ctx.lineTo(particles[j].drawX, particles[j].drawY);
                    const opacity = glow * (1 - dist / maxDist);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = isMobile ? 0.6 : 0.85;
                    ctx.stroke();
                }
            }
        }
    }

    function spawnExplosion(x, y, parallax) {
        explosions.push({ x, y, radius: 0, maxRadius: 40 + parallax * 60, alpha: 0.3, life: 1 });
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - x;
            const dy = p.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
                const force = (1 - dist / 120) * 1.2;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        }
    }
    function updateExplosions() {
        for (let i = explosions.length - 1; i >= 0; i--) {
            const e = explosions[i];
            e.radius += 2;
            e.life -= 0.025;
            e.alpha = e.life * 0.3;
            if (e.life <= 0) explosions.splice(i, 1);
        }
    }
    function drawExplosions() {
        for (const e of explosions) {
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180, 160, 255, ${e.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 210, 255, ${e.alpha * 0.3})`;
            ctx.fill();
        }
    }

    const shootingStars = [];
    function spawnShootingStar() {
        const fromLeft = Math.random() > 0.5;
        shootingStars.push({
            x: fromLeft ? -10 : canvas.width + 10,
            y: Math.random() * canvas.height * 0.5,
            vx: fromLeft ? (4 + Math.random() * 4) : -(4 + Math.random() * 4),
            vy: 1 + Math.random() * 2,
            life: 1,
            decay: 0.008 + Math.random() * 0.006,
            len: 60 + Math.random() * 80,
        });
    }

    function drawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;
            if (s.life <= 0) { shootingStars.splice(i, 1); continue; }
            const tailX = s.x - s.vx * (s.len / Math.sqrt(s.vx * s.vx + s.vy * s.vy));
            const tailY = s.y - s.vy * (s.len / Math.sqrt(s.vx * s.vx + s.vy * s.vy));
            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * s.life})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
            ctx.fill();
        }
    }

    let lowBatteryMode = false;
    let lastTime = 0;

    if (isMobile) {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const checkBattery = () => {
                    lowBatteryMode = (battery.level <= 0.2 && !battery.charging);
                    if (canvas) canvas.style.display = lowBatteryMode ? 'none' : 'block';
                    if (!lowBatteryMode) requestAnimationFrame(animateParticles);
                };
                checkBattery();
                battery.addEventListener('levelchange', checkBattery);
                battery.addEventListener('chargingchange', checkBattery);
            });
        }
    }

    let lastShootingStar = 0;
    let startTime = performance.now();
    function animateParticles(time) {
        if (isMobile) {
            if (lowBatteryMode) return;
            if (time - lastTime < 33) {
                requestAnimationFrame(animateParticles);
                return;
            }
        }
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const elapsed = time - startTime;
        smoothDepth += (scrollY - smoothDepth) * 0.04;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? Math.min(smoothDepth / maxScroll, 1) : 0;
        const zoom = 1 + scrollProgress * 0.12;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(zoom, zoom);
        ctx.translate(-cx, -cy);
        particles.forEach(p => { p.update(elapsed); p.draw(scrollProgress); });
        drawConnections(scrollProgress);
        updateExplosions();
        drawExplosions();
        ctx.restore();
        if (time - lastShootingStar > 6000 + Math.random() * 6000) {
            spawnShootingStar();
            lastShootingStar = time;
        }
        drawShootingStars();
        const shapes = document.querySelector('.global-shapes');
        if (shapes) {
            const progress = maxScroll > 0 ? smoothDepth / maxScroll : 0;
            const rotX = -12 + progress * 24;
            const rotY = -8 + progress * 16;
            const scale = 1 + progress * 0.45;
            shapes.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        }
        requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);

    const cursorGlow = document.getElementById('cursor-glow');
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });

        const interactiveElements = document.querySelectorAll('.project-card, .glass-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '100px';
                cursorGlow.style.height = '100px';
            });
            element.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '500px';
                cursorGlow.style.height = '500px';
            });
        });
    }

    const scrollElements = document.querySelectorAll('.reveal, .section-title, .fade-in-scroll, .project-card');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.classList.contains('section-title') && !e.target.dataset.scrambled) {
                    scrambleText(e.target);
                    e.target.dataset.scrambled = "true";
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    scrollElements.forEach(el => revealObserver.observe(el));

    const tiltCards = document.querySelectorAll('.glass-card,.service-card,.project-card,.course-card,.modal-card,.stat-card');
    if (isMobile) {
        tiltCards.forEach(card => card.classList.remove('glare-card'));
    } else {
        tiltCards.forEach(card => {
        card.classList.add('glare-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            card.style.setProperty('--glare-x', `${x}px`);
            card.style.setProperty('--glare-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    }

    function scrambleText(element) {
        if (element.dataset.isScrambling === "true") return;
        element.dataset.isScrambling = "true";

        const originalText = element.innerText;
        const chars = '!<>-_\\/[]{}—=+*^?#_+-*/@$;:[]{}∑∏π';
        let frame = 0;
        const queue = [];

        for (let i = 0; i < originalText.length; i++) {
            const to = originalText[i];
            const start = Math.floor(Math.random() * 15);
            const end = start + Math.floor(Math.random() * 25);
            queue.push({ to, start, end, char: '' });
        }

        function update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < queue.length; i++) {
                let { to, start, end, char } = queue[i];
                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = chars[Math.floor(Math.random() * chars.length)];
                        queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += `<span style="opacity: 0">${to}</span>`;
                }
            }

            element.innerHTML = output;

            if (complete === queue.length) {
                element.innerText = originalText;
                element.dataset.isScrambling = "false";
            } else {
                frame++;
                requestAnimationFrame(update);
            }
        }

        update();
    }

    function color(element) {
        const originalColor = window.getComputedStyle(element).color;
        const colors = ['#a855f7', '#3b82f6', '#0ea5e9', '#e11d48', '#6d28d9'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        element.style.color = randomColor;
        setTimeout(() => {
            element.style.color = originalColor;
        }, 100);
    }

    const heroName = document.querySelector('.hero-name-gradient');
    if (heroName) {
        color(heroName);
        setTimeout(() => scrambleText(heroName), 800);
        heroName.addEventListener('click', () => {
            color(heroName);
            scrambleText(heroName);
        });
    }
    const heroBadge = document.querySelector('.section-title');
    if (heroBadge) {
        setTimeout(() => scrambleText(heroBadge), 500);
    }

    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatChipsContainer = document.getElementById('chat-chips');

    let userName = null;

    chatToggle.addEventListener('click', () => {
        chatToggle.classList.toggle('open');
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) track('chat_open');
        if (chatWidget.classList.contains('open') && !userName) {
            setTimeout(() => chatInput.focus(), 400);
        }
    });

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.innerHTML = `<span>${text}</span>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typing-dots';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typing-dots');
        if (typing) typing.remove();
    }

    function renderOptionChips() {
        chatChipsContainer.innerHTML = '';
        const chipsObj = chatTranslations[currentLang].chips;
        Object.keys(chipsObj).forEach(option => {
            const chip = document.createElement('button');
            chip.className = 'chat-chip';
            chip.innerText = option;
            chip.addEventListener('click', () => handleChipSelection(option, chipsObj[option]));
            chatChipsContainer.appendChild(chip);
        });
        chatChipsContainer.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChipSelection(optionText, answerText) {
        chatChipsContainer.style.pointerEvents = 'none';
        chatChipsContainer.style.opacity = '0.5';

        addMessage(optionText, 'user');

        showTyping();
        const delay = 800 + Math.random() * 800;

        setTimeout(() => {
            removeTyping();
            addMessage(answerText, 'bot');

            chatChipsContainer.style.pointerEvents = 'all';
            chatChipsContainer.style.opacity = '1';
        }, delay);
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!userName) {
            const inputVal = chatInput.value.trim();
            if (!inputVal) return;

            userName = inputVal;
            addMessage(userName, 'user');

            chatInput.value = '';
            chatInput.disabled = true;
            chatInput.placeholder = chatTranslations[currentLang].placeholder_chips;
            chatForm.style.opacity = '0.5';
            chatForm.style.pointerEvents = 'none';

            showTyping();

            setTimeout(() => {
                removeTyping();
                const welcomeMsg = chatTranslations[currentLang].welcome_user.replace('{name}', userName);
                addMessage(welcomeMsg, 'bot');

                setTimeout(() => {
                    renderOptionChips();
                }, 400);
            }, 1200);
        }
    });

    window.updateChatLanguage = function(lang) {
        const input = document.getElementById('chat-input');
        if (input) {
            if (userName) {
                input.placeholder = chatTranslations[lang].placeholder_chips;
            } else {
                input.placeholder = chatTranslations[lang].placeholder_name;
            }
        }
        if (userName && chatChipsContainer && chatChipsContainer.style.display !== 'none') {
            renderOptionChips();
        }
    };

    if (!isMobile) {
        setTimeout(() => {
            if (document.getElementById('top-promo-notification')) return;

            const notification = document.createElement('div');
            notification.id = 'top-promo-notification';
            notification.className = 'top-notification';
            notification.innerHTML = `
                <div class="top-notification-content" id="trigger-chat-btn">
                    <span>${translations[currentLang]?.promo_text || 'Prueba el chat 👉'}</span>
                </div>
                <button class="top-notification-close" id="close-promo-btn" aria-label="Cerrar">✕</button>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            const triggerBtn = document.getElementById('trigger-chat-btn');
            if (triggerBtn) {
                triggerBtn.addEventListener('click', () => {
                    const cToggle = document.getElementById('chat-toggle');
                    const cWidget = document.getElementById('chat-widget');
                    if (cToggle && cWidget) {
                        cToggle.classList.add('open');
                        cWidget.classList.add('open');
                        const cInput = document.getElementById('chat-input');
                        if (cInput) setTimeout(() => cInput.focus(), 400);
                    }
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 600);
                });
            }

            const closeBtn = document.getElementById('close-promo-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 600);
                });
            }
        }, 30000);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === '0' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        document.body.classList.toggle('hide-content');
        document.body.classList.toggle('show-content');
    }
});
