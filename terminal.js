const commands = {
  es: {
    help: { desc: 'Muestra esta ayuda', output: () => buildHelp('es') },
    about: { desc: 'Info sobre mí',
      output: () => ['Soy <strong>Emanuel Zapata</strong> (Azhura), desarrollador web Python y Flask en Colombia.',
        'Especializado en sistemas de gestión empresarial, APIs REST y dashboards interactivos.',
        'Estudiante de Ingeniería de Sistemas en ITM desde 2026.',
        '> En constante evolución.'] },
    skills: { desc: 'Mi stack técnico',
      output: () => ['Python  ██████████░░  3-4 proyectos', 'Flask   ██████████░░  3+ sistemas',
        'JS     ████████░░░░  3 años', 'SQL/DB █████████░░░░  PostgreSQL + SQLite',
        'HTML5  ████████████  3 años', 'CSS3   ████████████  Responsive',
        'Git    ██████████░░  Control de versiones', 'Linux  ████████░░░░  Entorno diario'] },
    projects: { desc: 'Mis proyectos destacados',
      output: () => ['📌 <strong>Stride Base</strong> — Sistema RRHH/Finanzas (Flask, SQLAlchemy)',
        '📌 <strong>NexusAI</strong> — Análisis de redes sociales (JS, Bootstrap)',
        '📌 <strong>Catálogo MP</strong> — Tienda online (HTML, CSS, JS)',
        '📌 <strong>Donde Juan</strong> — Menú digital con WhatsApp',
        '→ Más detalles en la sección Proyectos'] },
    experience: { desc: 'Mi trayectoria',
      output: () => ['2021  — Inicio en la programación', '2022-23 — Descubrimiento de Python',
        '2024  — Full Stack con Flask + clientes reales', '2025  — Freelance y automatización',
        '2026  — Ingeniería de Sistemas ITM'] },
    services: { desc: 'Lo que ofrezco',
      output: () => ['💻 Desarrollo Web (Landing pages, portafolios, rediseño)',
        '⚙️  Apps Web & Backend (Sistemas de gestión, APIs REST, dashboards)',
        '📊 Bases de Datos & Automatización (Migraciones, reportes, scripts)',
        '📱 Presencia Digital (Catálogos, Linktree, contenido)'] },
    contact: { desc: 'Cómo contactarme',
      output: () => ['📧 azhura.dev@gmail.com', '📷 Instagram: @azhura.dev',
        '💻 GitHub: Azhura0101', '🔗 LinkedIn: Emanuel Zapata'] },
    social: { desc: 'Mis redes', output: () => ['📷 Instagram: @azhura.dev', '💻 GitHub: Azhura0101', '🔗 LinkedIn: Emanuel Zapata'] },
    whoami: { desc: 'Identidad', output: () => ['azhura@portfolio — Emanuel Zapata Hincapié'] },
    date: { desc: 'Fecha y hora local',
      output: () => [new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })] },
    banner: { desc: 'Logo ASCII',
      output: () => ['  ╔══════════════════════╗',
        '  ║   AZHURA.DEV         ║',
        '  ║   Python • Flask     ║',
        '  ║   Web Developer      ║',
        '  ╚══════════════════════╝'] },
    neofetch: { desc: 'Info del sistema',
      output: () => ['azhura@portfolio', '--------------', 'OS: Ubuntu 22.04 LTS x86_64',
        'Host: Portfolio v3', 'Kernel: Custom CSS/JS', 'Shell: Bash', 'DE: Azhura Dark',
        'CPU: Intel Dedication', 'GPU: WebGL Three.js'] },
    clear: { desc: 'Limpia la terminal', output: () => null, clear: true },
    planets: { desc: '🌌 Activa el sistema solar',
      output: () => {
        if (typeof window.initSolarSystem === 'function') {
          const c = document.getElementById('solar-system-container');
          if (c?.dataset.ssActive) return ['⚡ El sistema solar ya está activo.'];
          window.initSolarSystem();
          return ['🚀 Sistema solar activado', 'Haz clic en los planetas para ver los proyectos.'];
        }
        return ['❌ No se pudo activar el sistema solar.'];
      } },
    'sudo hire me': { desc: '?',
      output: () => ['🚀 INICIANDO CONTRATACIÓN...', '', '  ◉ Nombre: Emanuel Zapata',
        '  ◉ Rol: Desarrollador Python/Flask', '  ◉ Estado: Disponible inmediato',
        '  ◉ Email: azhura.dev@gmail.com', '', '  ✅ Listo para trabajar en tu proyecto.',
        '  → Contáctame y construyamos algo increíble juntos.'] }
  },
  en: {
    help: { desc: 'Shows this help', output: () => buildHelp('en') },
    about: { desc: 'About me', output: () => ['I\'m <strong>Emanuel Zapata</strong> (Azhura), a Python and Flask web developer in Colombia.',
        'Specialized in business management systems, REST APIs and interactive dashboards.',
        'Systems Engineering student at ITM since 2026.', '> Constantly evolving.'] },
    skills: { desc: 'My tech stack',
      output: () => ['Python  ██████████░░  3-4 projects', 'Flask   ██████████░░  3+ systems',
        'JS     ████████░░░░  3 years', 'SQL/DB █████████░░░░  PostgreSQL + SQLite',
        'HTML5  ████████████  3 years', 'CSS3   ████████████  Responsive',
        'Git    ██████████░░  Version control', 'Linux  ████████░░░░  Daily driver'] },
    projects: { desc: 'Featured projects',
      output: () => ['📌 <strong>Stride Base</strong> — HR/Finance System (Flask, SQLAlchemy)',
        '📌 <strong>NexusAI</strong> — Social media analytics (JS, Bootstrap)',
        '📌 <strong>MP Catalog</strong> — Online store (HTML, CSS, JS)',
        '📌 <strong>Donde Juan</strong> — Digital menu with WhatsApp',
        '→ More details in the Projects section'] },
    experience: { desc: 'My journey',
      output: () => ['2021  — Started programming', '2022-23 — Discovered Python',
        '2024  — Full Stack with Flask + real clients', '2025  — Freelance & automation',
        '2026  — Systems Engineering ITM'] },
    services: { desc: 'What I offer',
      output: () => ['💻 Web Dev (Landing pages, portfolios, redesign)',
        '⚙️  Web Apps & Backend (Management systems, REST APIs, dashboards)',
        '📊 Databases & Automation (Migrations, reports, scripts)',
        '📱 Digital Presence (Catalogs, Linktree, content)'] },
    contact: { desc: 'How to reach me',
      output: () => ['📧 azhura.dev@gmail.com', '📷 Instagram: @azhura.dev',
        '💻 GitHub: Azhura0101', '🔗 LinkedIn: Emanuel Zapata'] },
    social: { desc: 'My networks',
      output: () => ['📷 Instagram: @azhura.dev', '💻 GitHub: Azhura0101', '🔗 LinkedIn: Emanuel Zapata'] },
    whoami: { desc: 'Identity', output: () => ['azhura@portfolio — Emanuel Zapata Hincapié'] },
    date: { desc: 'Date and time',
      output: () => [new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })] },
    banner: { desc: 'ASCII logo',
      output: () => ['  ╔══════════════════════╗',
        '  ║   AZHURA.DEV         ║',
        '  ║   Python • Flask     ║',
        '  ║   Web Developer      ║',
        '  ╚══════════════════════╝'] },
    neofetch: { desc: 'System info',
      output: () => ['azhura@portfolio', '--------------', 'OS: Ubuntu 22.04 LTS x86_64',
        'Host: Portfolio v3', 'Kernel: Custom CSS/JS', 'Shell: Bash', 'DE: Azhura Dark',
        'CPU: Intel Dedication', 'GPU: WebGL Three.js'] },
    clear: { desc: 'Clears terminal', output: () => null, clear: true },
    planets: { desc: '🌌 Activates solar system mode',
      output: () => {
        if (typeof window.initSolarSystem === 'function') {
          const c = document.getElementById('solar-system-container');
          if (c?.dataset.ssActive) return ['⚡ Solar system already active.'];
          window.initSolarSystem();
          return ['🚀 Solar system activated', 'Click on planets to see project details.'];
        }
        return ['❌ Could not activate solar system.'];
      } },
    'sudo hire me': { desc: '?',
      output: () => ['🚀 INITIATING HIRING PROCESS...', '', '  ◉ Name: Emanuel Zapata',
        '  ◉ Role: Python/Flask Developer', '  ◉ Status: Available immediately',
        '  ◉ Email: azhura.dev@gmail.com', '', '  ✅ Ready to work on your project.',
        '  → Contact me and let\'s build something amazing together.'] }
  }
};

function buildHelp(lang) {
  const cmds = commands[lang];
  const lines = ['<strong>Comandos disponibles:</strong>', ''];
  Object.keys(cmds).forEach(key => {
    lines.push(`  <span class="term-cmd">${key.padEnd(16)}</span>${cmds[key].desc}`);
  });
  return lines;
}

let history = [];
let historyIndex = -1;

export default class Terminal {
  constructor() {
    this.element = document.getElementById('terminal-body');
    if (!this.element) return;
    this.init();
  }

  init() {
    this.input = this.element.querySelector('.term-input');
    this.output = this.element.querySelector('.term-output');
    this.prompt = this.element.querySelector('.term-prompt');

    if (!this.input || !this.output) return;

    this.bindEvents();
    this.printBootMessage();
    this.printLines([`<span class="term-success">Sistema iniciado. Escribe 'help' para ver comandos disponibles.</span>`], 0, true);
  }

  get isMobile() { return window.innerWidth < 768; }

  get lang() {
    return localStorage.getItem('selectedLang') || 'es';
  }

  get cmds() {
    return commands[this.lang] || commands.es;
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.execute(this.input.value);
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });

    this.element.addEventListener('click', () => this.input.focus());
  }

  navigateHistory(dir) {
    if (history.length === 0) return;
    historyIndex += dir;
    if (historyIndex < 0) historyIndex = 0;
    if (historyIndex >= history.length) {
      historyIndex = history.length;
      this.input.value = '';
      return;
    }
    this.input.value = history[historyIndex];
  }

  autocomplete() {
    const val = this.input.value.toLowerCase().trim();
    if (!val) return;
    const matches = Object.keys(this.cmds).filter(cmd => cmd.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.printLines([`<span class="term-muted">${matches.join('  ')}</span>`], 30);
    }
  }

  execute(raw) {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    this.printLines([`<span class="term-green">$</span> ${this.escape(raw)}`], 0);

    const cmd = this.cmds[trimmed];
    if (!cmd) {
      this.printLines([`<span class="term-error">Comando no encontrado: ${this.escape(trimmed)}. Escribe 'help' para ver los disponibles.</span>`], 30);
      return;
    }

    if (cmd.clear) {
      this.output.innerHTML = '';
      return;
    }

    const lines = cmd.output();
    if (lines && lines.length) {
      this.printLines(lines, 25);
    }
  }

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  printLines(lines, delay = 25, noFocus = false) {
    let i = 0;
    const printNext = () => {
      if (i >= lines.length) {
        this.scrollToBottom();
        this.input.disabled = false;
        if (!noFocus && !this.isMobile) this.input.focus();
        return;
      }
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = lines[i];
      this.output.appendChild(line);
      this.scrollToBottom();
      i++;
      setTimeout(printNext, delay);
    };
    this.input.disabled = true;
    printNext();
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  printBootMessage() {
    const boot = [
      `<span class="term-purple">  ╔══════════════════════════════╗</span>`,
      `<span class="term-purple">  ║   AZHURA.DEV TERMINAL v3.0   ║</span>`,
      `<span class="term-purple">  ╚══════════════════════════════╝</span>`,
      ''
    ];
    boot.forEach(line => {
      const el = document.createElement('div');
      el.className = 'term-line';
      el.innerHTML = line;
      this.output.appendChild(el);
    });
  }
}
