/**
 * Interactive Developer Terminal CLI
 * Provides real CLI capabilities, history, and commands
 */

class DevTerminal {
  constructor() {
    this.modal = document.getElementById('terminal-modal');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.toggleBtns = document.querySelectorAll('.toggle-terminal-btn');
    this.closeBtn = document.getElementById('terminal-close-btn');
    
    this.commandHistory = [];
    this.historyIndex = -1;
    this.availableCommands = [
      'help', 'about', 'skills', 'projects', 'education', 
      'contact', 'video', 'cv', 'theme', 'matrix', 'particles', 
      'clear', 'sudo', 'date', 'whoami', 'exit'
    ];

    this.init();
  }

  init() {
    if (!this.modal || !this.input) return;

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Toggle terminal on Ctrl + ` or Backquote alone if not in an input
      if ((e.ctrlKey && e.key === '`') || (e.key === 'F2')) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Initial greeting
    this.printGreeting();
  }

  isOpen() {
    return this.modal.classList.contains('active');
  }

  open() {
    this.modal.classList.add('active');
    setTimeout(() => this.input.focus(), 150);
  }

  close() {
    this.modal.classList.remove('active');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  printGreeting() {
    this.appendLine(`<span class="term-cyan">╭─────────────────────────────────────────────────────────────╮</span>`);
    this.appendLine(`<span class="term-cyan">│</span>  <span class="term-yellow">🚀 DevShell v2.6.4</span> - Sistema Interactivo de Desarrollador    <span class="term-cyan">│</span>`);
    this.appendLine(`<span class="term-cyan">│</span>  Escribe <span class="term-green">'help'</span> para listar todos los comandos disponibles. <span class="term-cyan">│</span>`);
    this.appendLine(`<span class="term-cyan">╰─────────────────────────────────────────────────────────────╯</span>`);
    this.appendLine(`<span class="term-gray">Atajo rápido: Puedes abrir/cerrar esta consola con [F2] o botón >_ CLI</span>\n`);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      const rawCmd = this.input.value.trim();
      if (rawCmd) {
        this.commandHistory.push(rawCmd);
        this.historyIndex = this.commandHistory.length;
        this.executeCommand(rawCmd);
        this.input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.commandHistory[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = this.input.value.trim();
      if (current) {
        const matches = this.availableCommands.filter(c => c.startsWith(current));
        if (matches.length === 1) {
          this.input.value = matches[0];
        } else if (matches.length > 1) {
          this.appendLine(`<span class="term-gray">Sugerencias: ${matches.join(', ')}</span>`);
        }
      }
    }
  }

  appendLine(html) {
    const p = document.createElement('div');
    p.className = 'term-line';
    p.innerHTML = html;
    this.output.appendChild(p);
    this.output.scrollTop = this.output.scrollHeight;
  }

  executeCommand(fullCmd) {
    // Print command line
    this.appendLine(`<span class="term-prompt">dev@portfolio:~$</span> <span class="term-user-cmd">${this.escapeHTML(fullCmd)}</span>`);

    const parts = fullCmd.toLowerCase().split(' ');
    const cmd = parts[0];
    const arg = parts[1];

    switch (cmd) {
      case 'help':
        this.appendLine(`
<span class="term-yellow">Comandos disponibles en DevShell:</span>
  <span class="term-green">about</span>       - Resumen profesional, visión y enfoque
  <span class="term-green">skills</span>      - Lista de tecnologías y porcentajes de dominio (%)
  <span class="term-green">projects</span>    - Proyectos destacados con links y arquitectura
  <span class="term-green">education</span>   - Formación académica, universidad y certificaciones
  <span class="term-green">contact</span>     - Canales de contacto (WhatsApp, Discord, Mail, etc.)
  <span class="term-green">video</span>       - Abrir el video pitch de presentación
  <span class="term-green">cv</span>          - Ver y descargar Curriculum Vitae (PDF)
  <span class="term-green">theme [mode]</span> - Cambiar tema: dark, cyberpunk, matrix, tokyo
  <span class="term-green">matrix</span>      - Activar efecto de lluvia Matrix en fondo
  <span class="term-green">particles</span>   - Activar fondo de red de partículas
  <span class="term-green">whoami</span>      - Información del usuario actual
  <span class="term-green">date</span>        - Muestra la fecha y hora del sistema
  <span class="term-green">clear</span>       - Limpiar la pantalla
  <span class="term-green">sudo [action]</span>- Intentar ejecutar como superusuario 😉
  <span class="term-green">exit</span>        - Cerrar la terminal
        `);
        break;

      case 'about':
      case 'bio':
        this.appendLine(`
<span class="term-cyan">=================== [ SOBRE MÍ ] ===================</span>
Soy desarrollador Full Stack apasionado por construir aplicaciones web
rápidas, intuitivas y escalables. Mi enfoque combina código limpio,
arquitectura modular y la optimización del flujo de trabajo con IA.

📍 Ubicación: Buenos Aires, Argentina (Modalidad Remota / Híbrida)
🎯 Enfoque: Frontend React/Next.js + Backend Node/Express + Cloud
⚡ Filosofía: "Menos deuda técnica, más valor real entregado".
        `);
        break;

      case 'skills':
        this.appendLine(`
<span class="term-cyan">=============== [ HABILIDADES &amp; DOMINIO (%) ] ===============</span>
<span class="term-yellow">Frontend:</span>
  • JavaScript (ES6+)     [██████████] 95%
  • React & Next.js       [█████████░] 92%
  • TypeScript            [████████░░] 85%
  • CSS3 / Tailwind CSS   [██████████] 95%
  • Responsive Web Design [██████████] 98%

<span class="term-yellow">Backend &amp; Cloud:</span>
  • Node.js & Express     [█████████░] 88%
  • REST APIs & WebSockets[█████████░] 90%
  • PostgreSQL / MongoDB  [████████░░] 84%
  • Git / GitHub / CI/CD  [█████████░] 92%
  • Netlify & Vercel      [██████████] 96%
        `);
        break;

      case 'projects':
        this.appendLine(`
<span class="term-cyan">================== [ PROYECTOS DESTACADOS ] ==================</span>
1.  <span class="term-green">Rotisería SYM</span>: Pedidos y gestión gastronómica con QR (Full Stack)
2.  <span class="term-green">Notas Firebase</span>: "Mi Cuaderno" - Gestión de pendientes en tiempo real
3.  <span class="term-green">App Asistencias</span>: Control y automatización de asistencias escolares
4.  <span class="term-green">Cursos MI</span>: Plataforma e-learning y capacitación (Servidor Cloud)
5.  <span class="term-green">Acceso Gimnasio</span>: Prototipo físico con RFID, teclado y LCD (Hardware)
6.  <span class="term-green">Recorrido Berazategui</span>: Puntos de interés y transporte urbano (Maps)
7.  <span class="term-green">AutoBot (TPR)</span>: Robot móvil autónomo con tracción diferencial (Robótica)
8.  <span class="term-green">Viajes Los Choris</span>: Sistema de reserva y compra de pasajes de micro
9.  <span class="term-green">PerroBot</span>: Robot cuadrúpedo bioinspirado impreso en 3D (Robótica)
10. <span class="term-green">Moda Circular</span>: Plataforma comunitaria de ropero escolar sustentable

<span class="term-gray">Tip: Puedes explorar cada proyecto y acceder a sus repositorios o demos en la sección de Proyectos.</span>
        `);
        break;

      case 'education':
      case 'formacion':
        this.appendLine(`
<span class="term-cyan">================ [ FORMACIÓN ACADÉMICA ] ================</span>
🎓 <span class="term-yellow">Tecnicatura / Grado en Programación y Sistemas</span> (2022 - 2025)
   Universidad / Instituto Tecnológico - Algoritmos, Estructuras y Arquitectura.

📜 <span class="term-yellow">Bootcamp Full Stack Web & Cloud</span> (2024)
   800+ Horas de proyectos prácticos con React, Node.js y Docker.

🏅 <span class="term-yellow">Certificaciones Continuas</span>:
   • Arquitectura Limpia & Clean Code (2025)
   • Git & Flujos de Trabajo en GitHub (2024)
   • Integración de Modelos de Inteligencia Artificial (2025)
        `);
        break;

      case 'contact':
        this.appendLine(`
<span class="term-cyan">================= [ CANALES DE CONTACTO ] =================</span>
📧 <span class="term-yellow">Email:</span> estebangonzalezyt@gmail.com
💬 <span class="term-yellow">WhatsApp:</span> <a href="https://wa.me/5491128658563?text=Hola%20vi%20tu%20portfolio" target="_blank" class="term-link">+54 9 11 2865-8563</a>
💻 <span class="term-yellow">GitHub:</span> <a href="https://github.com" target="_blank" class="term-link">github.com</a>
🎮 <span class="term-yellow">Discord:</span> <span class="term-green">772297081121407007</span> (Click para copiar en el sitio)
        `);
        break;

      case 'video':
        this.appendLine(`<span class="term-green">Abriendo modal de Video Presentación...</span>`);
        if (window.PortfolioApp && window.PortfolioApp.openVideoModal) {
          window.PortfolioApp.openVideoModal();
        }
        break;

      case 'cv':
        this.appendLine(`<span class="term-green">Abriendo Curriculum Vitae...</span>`);
        if (window.PortfolioApp && window.PortfolioApp.openCvModal) {
          window.PortfolioApp.openCvModal();
        }
        break;

      case 'matrix':
        if (window.techBg) {
          window.techBg.setMode('matrix');
          this.appendLine(`<span class="term-green">✓ Modo Matrix activado. ¡Sigue al conejo blanco! 🐇</span>`);
        }
        break;

      case 'particles':
        if (window.techBg) {
          window.techBg.setMode('particles');
          this.appendLine(`<span class="term-cyan">✓ Fondo de red de partículas restaurado.</span>`);
        }
        break;

      case 'theme':
        const themes = ['dark', 'cyberpunk', 'matrix', 'tokyo'];
        if (arg && themes.includes(arg)) {
          if (window.PortfolioApp && window.PortfolioApp.setTheme) {
            window.PortfolioApp.setTheme(arg);
            this.appendLine(`<span class="term-cyan">✓ Tema cambiado exitosamente a: <strong>${arg}</strong></span>`);
          }
        } else {
          this.appendLine(`<span class="term-yellow">Uso: theme [dark | cyberpunk | matrix | tokyo]</span>`);
        }
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'whoami':
        this.appendLine(`<span class="term-cyan">visitante@reclutador-o-programador.net (Acceso: Invitado Especial)</span>`);
        break;

      case 'date':
        this.appendLine(`<span class="term-yellow">${new Date().toLocaleString()}</span>`);
        break;

      case 'sudo':
        this.appendLine(`<span class="term-red">Permiso denegado: Este incidente será reportado al Administrador de Sistemas. 😉</span>`);
        break;

      case 'exit':
      case 'close':
      case 'quit':
        this.close();
        break;

      default:
        this.appendLine(`<span class="term-red">Comando no reconocido: '${this.escapeHTML(cmd)}'. Escribe <span class="term-green">'help'</span> para ver opciones.</span>`);
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

window.DevTerminal = DevTerminal;
