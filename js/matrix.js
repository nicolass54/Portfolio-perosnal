/**
 * Interactive Background System: Cyber Particles + Matrix Rain
 * High performance HTML5 Canvas with smooth 60fps animation
 */

class TechBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'particles'; // 'particles', 'matrix', 'off'
    this.particles = [];
    this.matrixChars = '01{}[]<>/\\;:=+-*#@$!_&?%ABCDEF0123456789';
    this.columns = [];
    this.fontSize = 14;
    this.animId = null;
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.setupParticles();
    this.setupMatrix();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.setupMatrix();
  }

  setupParticles() {
    this.particles = [];
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 100);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  setupMatrix() {
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = [];
    for (let i = 0; i < colCount; i++) {
      this.columns.push(Math.floor(Math.random() * -100));
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    if (this.mode === 'off') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = requestAnimationFrame(() => this.animate());
      return;
    }

    if (this.mode === 'matrix') {
      this.renderMatrix();
    } else {
      this.renderParticles();
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  renderParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#38bdf8';
    
    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          this.ctx.strokeStyle = particleColor;
          this.ctx.globalAlpha = alpha;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw and update particles
    for (let p of this.particles) {
      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.fillStyle = particleColor;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  renderMatrix() {
    this.ctx.fillStyle = 'rgba(6, 9, 18, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#22c55e';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      // Glow first character
      this.ctx.fillStyle = '#86efac';
      this.ctx.fillText(char, x, y);
      this.ctx.fillStyle = '#22c55e';

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }
  }
}

window.TechBackground = TechBackground;
