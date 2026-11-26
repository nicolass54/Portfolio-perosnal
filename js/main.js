/**
 * Main Application Logic for Developer Portfolio (Black & White Minimalist)
 * Typing animation, CV Modal, Skills scroll animation, Contact handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Monochrome Particles Background
  if (typeof TechBackground !== 'undefined') {
    window.techBg = new TechBackground('bg-canvas');
  }

  // 2. Typing Effect in Hero
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const phrases = [
      'Full Stack Developer',
      'Ingeniero de Software',
      'Desarrollador React & Node.js',
      'Arquitectura Web Limpia',
      'Desarrollo Potenciado con IA'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
      mobileMenuBtn.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        mobileMenuBtn.classList.remove('open');
      });
    });
  }

  // 4. CV Viewer Modal ("CV" from whiteboard)
  const cvModal = document.getElementById('cv-modal');
  const cvModalClose = document.getElementById('cv-modal-close');
  const openCvBtns = document.querySelectorAll('.open-cv-btn');

  function openCv() {
    if (cvModal) {
      cvModal.classList.add('active');
    }
  }

  function closeCv() {
    if (cvModal) cvModal.classList.remove('active');
  }

  openCvBtns.forEach(btn => btn.addEventListener('click', openCv));
  if (cvModalClose) cvModalClose.addEventListener('click', closeCv);

  window.addEventListener('click', (e) => {
    if (e.target === cvModal) closeCv();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCv();
    }
  });

  // 5. Animated Skills Progress Bars on Scroll
  const skillsSection = document.getElementById('habilidades');
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  let skillsAnimated = false;

  function animateSkills() {
    skillBars.forEach(bar => {
      const targetPercent = bar.getAttribute('data-percent');
      bar.style.width = targetPercent + '%';
    });
    skillsAnimated = true;
  }

  if (skillsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          animateSkills();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(skillsSection);
  } else {
    animateSkills();
  }

  // 6. Copy Discord ID & Toast notifications (Real data: 772297081121407007)
  const discordBtn = document.getElementById('copy-discord-btn');
  if (discordBtn) {
    discordBtn.addEventListener('click', () => {
      const discordId = discordBtn.getAttribute('data-discord') || '772297081121407007';
      navigator.clipboard.writeText(discordId).then(() => {
        showToast(`✓ ID de Discord copiado: "${discordId}"`);
      }).catch(() => {
        showToast(`Discord: ${discordId}`);
      });
    });
  }

  // Copy Email button (Real data: estebangonzalezyt@gmail.com)
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'estebangonzalezyt@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`✓ Correo copiado: "${email}"`);
      });
    });
  }

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Por favor completa todos los campos obligatorios');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Enviando mensaje...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 6000);
        }
        showToast('✓ Mensaje recibido. Me comunicaré contigo a la brevedad.');
      }, 800);
    });
  }

  // WhatsApp Quick Generator (Real number: 1128658563 / +54 9 11 2865-8563)
  const waBtn = document.getElementById('whatsapp-quick-btn');
  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('form-name');
      const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Colega / Reclutador';
      const text = encodeURIComponent(`Hola Esteban, soy ${clientName}. Vi tu portfolio y me gustaría conversar sobre un proyecto / propuesta.`);
      window.open(`https://wa.me/5491128658563?text=${text}`, '_blank');
    });
  }

  // 8. Toast Notification System
  function showToast(message) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'portfolio-toast';
      toast.className = 'portfolio-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Global exposure for CV modal
  window.PortfolioApp = {
    openCvModal: openCv,
    closeCvModal: closeCv,
    showToast: showToast
  };
});
