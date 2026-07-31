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
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

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

    setTimeout(() => {
        document.getElementById('skeleton-overlay').classList.add('hidden');
    }, 800);

    document.getElementById('lang-toggle').addEventListener('click', () => {
            track('lang_toggle', { from: currentLang, to: currentLang === 'es' ? 'en' : 'es' });
            updateLanguage(currentLang === 'es' ? 'en' : 'es');
        });

        document.getElementById('back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.querySelector('a[href*="drive.google.com"][data-i18n="hero_cv"]')?.addEventListener('click', () => track('cv_download'));

        document.getElementById('submitBtn').addEventListener('click', () => track('form_submit'));

    if (new URLSearchParams(location.search).get('success') === 'true') {
        document.getElementById('successModal').classList.add('active');
        launchConfetti();
        track('form_submit_success');
        history.replaceState(null, '', location.pathname);
    }

    document.querySelector('#successModal .modal-btn').addEventListener('click', closeModal);

    document.getElementById('termsModal').querySelector('.modal-close-btn').addEventListener('click', closeTerms);
    document.getElementById('termsModal').querySelector('.modal-btn').addEventListener('click', closeTerms);

    const isMobile = window.innerWidth < 768;

    const cursorGlow = document.getElementById('cursor-glow');
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });

        const interactiveElements = document.querySelectorAll('.glass-card');
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
                setTimeout(() => {
                    e.target.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
                }, 650);
                if (e.target.classList.contains('section-title') && !e.target.dataset.scrambled) {
                    scrambleText(e.target);
                    e.target.dataset.scrambled = "true";
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    scrollElements.forEach(el => revealObserver.observe(el));

    const tiltCards = document.querySelectorAll('.glass-card,.service-card,.project-card,.course-card,.stat-card');
    if (isMobile) {
        tiltCards.forEach(card => card.classList.remove('glare-card'));
    } else {
        tiltCards.forEach(card => {
        card.classList.add('glare-card');

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.setProperty('--glare-x', `${x}px`);
            card.style.setProperty('--glare-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = '';
            setTimeout(() => {
                card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
            }, 300);
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
        const colors = ['#a855f7', '#8b5cf6', '#a78bfa', '#c084fc', '#6d28d9'];
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
        const groups = chatTranslations[currentLang].chip_groups;
        
        groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'chat-chip-group';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'chat-chip-toggle';
            toggleBtn.innerHTML = group.label;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'chat-chip-options';
            
            Object.keys(group.options).forEach(optionText => {
                const chip = document.createElement('button');
                chip.className = 'chat-chip';
                chip.innerText = optionText;
                chip.addEventListener('click', () => {
                    handleChipSelection(optionText, group.options[optionText]);
                    optionsDiv.classList.remove('open');
                });
                optionsDiv.appendChild(chip);
            });
            
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.chat-chip-options.open').forEach(el => {
                    if (el !== optionsDiv) el.classList.remove('open');
                });
                optionsDiv.classList.toggle('open');
            });
            
            groupDiv.appendChild(toggleBtn);
            groupDiv.appendChild(optionsDiv);
            chatChipsContainer.appendChild(groupDiv);
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

    document.addEventListener('click', () => {
        document.querySelectorAll('.chat-chip-options.open').forEach(el => {
            el.classList.remove('open');
        });
    });

    chatMessages.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });

    chatMessages.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: true });

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

// Ripple effect for buttons
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.required && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)' && this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
}

// Character counter for textarea
const messageTextarea = document.querySelector('textarea[name="message"]');
if (messageTextarea) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = 'font-size: 0.75rem; color: var(--text-muted); text-align: right; margin-top: 4px;';
    counter.textContent = '0 / 500';
    messageTextarea.parentNode.appendChild(counter);
    messageTextarea.addEventListener('input', function() {
        const len = this.value.length;
        counter.textContent = len + ' / 500';
        counter.style.color = len > 500 ? '#ef4444' : 'var(--text-muted)';
    });
}

// Floating planets scale parallax (throttled on mobile)
(function() {
    const planets = document.querySelectorAll('.gs:not(.gs-ring)');
    if (!planets.length) return;
    const isMobile = window.innerWidth < 768;
    const state = [];
    planets.forEach(p => state.push({ cur: 1, target: 1 }));
    let frame = 0;

    function update() {
        frame++;
        if (isMobile && frame % 3 !== 0) {
            requestAnimationFrame(update);
            return;
        }

        const max = document.body.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

        planets.forEach((p, i) => {
            const st = state[i];
            const isSmall = p.classList.contains('gs-sm');
            const factor = parseFloat(p.dataset.scale) || (isSmall ? 1.5 : 0.55);
            st.target = isSmall ? 1 + progress * factor : 1 - progress * factor;
            st.target = Math.max(0.5, st.target);
            st.cur += (st.target - st.cur) * (isMobile ? 0.03 : 0.06);
            p.style.setProperty('--gs-scale', st.cur);
        });
        requestAnimationFrame(update);
    }
    update();
})();
