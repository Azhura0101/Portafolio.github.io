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

function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    fetch("https://formsubmit.co/ajax/azhura.dev@gmail.com", { method: "POST", body: new FormData(e.target) })
        .then(r => r.json())
        .then(() => {
            btn.textContent = translations[currentLang]?.btn_send || 'Enviar Mensaje';
            btn.disabled = false;
            document.getElementById('successModal').classList.add('active');
                e.target.reset();
                launchConfetti();
                track('form_submit');
        })
        .catch(() => {
            btn.textContent = 'Error — intenta de nuevo';
            btn.disabled = false;
            setTimeout(() => { btn.textContent = translations[currentLang]?.btn_send || 'Enviar Mensaje'; }, 3000);
        });
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
    navbar.classList.toggle('scrolled', window.scrollY > 50);

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

const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
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

        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');
        document.getElementById('theme-toggle').textContent = savedTheme === 'light' ? '☀️' : '🌙';
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            document.getElementById('theme-toggle').textContent = next === 'light' ? '☀️' : '🌙';
            particles.forEach(p => p.applyThemeColor());
            track('theme_toggle', { theme: next });
        });

        document.querySelector('a[href*="drive.google.com"][data-i18n="hero_cv"]')?.addEventListener('click', () => track('cv_download'));

        document.getElementById('contactForm').addEventListener('submit', handleSubmit);

    document.querySelector('#successModal .modal-btn').addEventListener('click', closeModal);

    document.getElementById('termsModal').querySelector('.modal-close-btn').addEventListener('click', closeTerms);
    document.getElementById('termsModal').querySelector('.modal-btn').addEventListener('click', closeTerms);

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let mouse = { x: -9999, y: -9999 };
    let shockwaves = [];

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX + window.scrollX;
        mouse.y = e.clientY + window.scrollY;
    });

    document.addEventListener('click', (e) => {
        shockwaves.push({
            x: e.clientX + window.scrollX,
            y: e.clientY + window.scrollY,
            radius: 0,
            maxRadius: 200,
            speed: 5,
            alpha: 0.8
        });
    });

    const PARTICLE_COUNT = 70;
    const particles = [];
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 2 + 0.5;
            this.baseVx = (Math.random() - 0.5) * 0.4;
            this.baseVy = (Math.random() - 0.5) * 0.4;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.alpha = Math.random() * 0.5 + 0.25;
            this.applyThemeColor();
        }
        applyThemeColor() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            this.color = isLight
                ? (Math.random() > 0.5 ? '30, 20, 60' : '80, 60, 120')
                : (Math.random() > 0.5 ? '0, 242, 254' : '0, 245, 160');
        }
        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                const force = (180 - dist) / 180 * 1.2;
                this.vx += (dx / dist) * force * 0.15;
                this.vy += (dy / dist) * force * 0.15;
            }

            shockwaves.forEach(sw => {
                const sdx = this.x - sw.x;
                const sdy = this.y - sw.y;
                const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
                if (Math.abs(sdist - sw.radius) < 20) {
                    const force = 6 * sw.alpha;
                    this.vx += (sdx / sdist) * force;
                    this.vy += (sdy / sdist) * force;
                }
            });

            this.vx += (this.baseVx - this.vx) * 0.04;
            this.vy += (this.baseVy - this.vy) * 0.04;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    grad.addColorStop(0, `rgba(${particles[i].color}, ${0.18 * (1 - dist / 140)})`);
                    grad.addColorStop(1, `rgba(${particles[j].color}, ${0.18 * (1 - dist / 140)})`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }
    }

    function updateShockwaves() {
        shockwaves.forEach((sw, idx) => {
            sw.radius += sw.speed;
            sw.alpha = 1 - (sw.radius / sw.maxRadius);

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 242, 254, ${sw.alpha * 0.45})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            if (sw.radius >= sw.maxRadius) {
                shockwaves.splice(idx, 1);
            }
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        updateShockwaves();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const cursorGlow = document.getElementById('cursor-glow');
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

    setTimeout(() => {
        if (document.getElementById('top-promo-notification')) return;

        const notification = document.createElement('div');
        notification.id = 'top-promo-notification';
        notification.className = 'top-notification';
        notification.innerHTML = `
            <div class="top-notification-content" id="trigger-chat-btn">
                <span>${translations[currentLang]?.promo_text || '💡 ¿Quieres saber más sobre el portafolio de Azhura.dev? ¡Prueba nuestro asistente virtual en el chat abajo a la derecha! 🤖'}</span>
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
});
