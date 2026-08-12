// ========================================
// A LITTLE UNIVERSE FOR YOU - Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const pageStateKey = 'little-universe-state';
  const pageTokenKey = 'little-universe-token';

  function getStoredState() {
    try {
      return JSON.parse(localStorage.getItem(pageStateKey)) || {};
    } catch {
      return {};
    }
  }

  const pageState = getStoredState();
  const pageToken = localStorage.getItem(pageTokenKey) || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  localStorage.setItem(pageTokenKey, pageToken);

  function savePageState(nextState = {}) {
    localStorage.setItem(pageStateKey, JSON.stringify({
      ...getStoredState(),
      ...nextState,
      token: pageToken,
    }));
  }

  window.addEventListener('beforeunload', (e) => {
    savePageState({ scrollY: window.scrollY });
    e.preventDefault();
    e.returnValue = '';
  });

  window.addEventListener('keydown', (e) => {
    const isRefreshKey = e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r');
    if (isRefreshKey) {
      e.preventDefault();
    }
  });

  // ---- BACKGROUND STARS ----
  const starsContainer = document.getElementById('stars-container');
  const starCount = 320;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('bg-star');
    const size = Math.random() * 3.4 + 0.8;
    const colors = ['#ffffff', '#fff3c4', '#e8b4f8', '#dbe8ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--star-color', color);
    star.style.setProperty('--star-glow', (Math.random() * 12 + 6) + 'px');
    star.style.setProperty('--spark-width', (Math.random() * 14 + 7) + 'px');
    star.style.setProperty('--spark-opacity', Math.random() > 0.68 ? '0.65' : '0');
    star.style.setProperty('--tw-dur', (Math.random() * 4 + 2) + 's');
    star.style.setProperty('--tw-delay', (Math.random() * 5) + 's');
    star.style.setProperty('--drift-dur', (Math.random() * 18 + 14) + 's');
    star.style.setProperty('--drift-x', (Math.random() * 24 - 12) + 'px');
    star.style.setProperty('--drift-y', (Math.random() * -18 - 6) + 'px');
    starsContainer.appendChild(star);
  }

  // ---- GOLD CURSOR GLOW ----
  const cursorGlow = document.getElementById('cursor-glow');
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let glowX = pointerX;
  let glowY = pointerY;

  window.addEventListener('pointermove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  window.addEventListener('pointerleave', () => {
    cursorGlow.style.opacity = '0';
  });

  function animateCursorGlow() {
    glowX += (pointerX - glowX) * 0.16;
    glowY += (pointerY - glowY) * 0.16;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    cursorGlow.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();

  // ---- FLOATING PARTICLES ----
  const particlesContainer = document.getElementById('particles-container');
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 60 + 20;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.setProperty('--float-dur', (Math.random() * 15 + 10) + 's');
    p.style.setProperty('--float-delay', (Math.random() * 8) + 's');
    particlesContainer.appendChild(p);
  }

  // ---- SMOOTH SCROLL / ENTER BUTTON ----
  const enterBtn = document.getElementById('enter-btn');
  const journeySection = document.getElementById('journey');

  enterBtn.addEventListener('click', () => {
    journeySection.scrollIntoView({ behavior: 'smooth' });
    // Add extra stars burst effect
    createStarBurst(enterBtn, 20);
  });

  // ---- STAR BURST EFFECT ----
  function createStarBurst(originEl, count) {
    const rect = originEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.classList.add('burst-star');
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      const angle = (Math.PI * 2 / count) * i;
      const dist = Math.random() * 120 + 60;
      s.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      s.style.background = ['#e8b4f8', '#c9a0dc', '#f0c987', '#82b1ff', '#ff6b9d'][Math.floor(Math.random() * 5)];
      s.style.width = (Math.random() * 4 + 2) + 'px';
      s.style.height = s.style.width;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1600);
    }
  }

  // ---- INTERSECTION OBSERVER (FADE IN) ----
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- PARALLAX EFFECT ----
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Move background stars slightly
        starsContainer.style.transform = `translateY(${scrollY * 0.05}px)`;
        particlesContainer.style.transform = `translateY(${scrollY * 0.03}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- REASON STARS CLICK ----
  const reasonStars = document.querySelectorAll('.reason-star');
  const modalOverlay = document.getElementById('reason-modal');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  reasonStars.forEach(star => {
    star.addEventListener('click', () => {
      const reason = star.getAttribute('data-reason');
      modalText.textContent = reason;
      modalOverlay.classList.add('active');
    });
  });

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // ---- ENVELOPE OPENING ----
  const envelope = document.getElementById('envelope');
  const openLetterBtn = document.getElementById('open-letter-btn');

  openLetterBtn.addEventListener('click', () => {
    envelope.classList.add('open');
    openLetterBtn.classList.add('hidden');
  });

  // ---- FINAL QUESTION ----
  const btnYes = document.getElementById('btn-yes');
  const btnTime = document.getElementById('btn-time');
  const finalQuestion = document.getElementById('final-question');
  const finalYesResponse = document.getElementById('final-yes-response');
  const finalTimeResponse = document.getElementById('final-time-response');
  const emailStatusYes = document.getElementById('email-status-yes');
  const emailStatusTime = document.getElementById('email-status-time');

  const emailConfig = {
    publicKey: 'GmS9zaxop-MCHuCoX',
    serviceId: 'service_shfweqg',
    templateId: 'template_6idvm8r',
    toEmail: 'yusvanysv@gmail.com',
  };

  if (window.emailjs && !emailConfig.publicKey.includes('ISI_')) {
    emailjs.init({ publicKey: emailConfig.publicKey });
  }

  function sendFinalAnswer(answer, statusEl) {
    if (!window.emailjs || Object.values(emailConfig).some(value => value.includes('ISI_'))) {
      statusEl.textContent = 'Email belum aktif. Isi konfigurasi EmailJS di script.js.';
      return;
    }

    statusEl.textContent = 'Mengirim jawaban...';

    emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
      to_email: emailConfig.toEmail,
      answer,
      question: 'Maukah kamu menjadi seseorang yang aku perjuangkan?',
      sent_at: new Date().toLocaleString('id-ID'),
    }).then(() => {
      statusEl.textContent = 'Jawaban sudah terkirim ke email.';
    }).catch(() => {
      statusEl.textContent = 'Email gagal terkirim. Coba lagi nanti.';
    });
  }

  function showYesResponse(sendEmail = true) {
    finalQuestion.style.display = 'none';
    finalYesResponse.classList.add('active');
    savePageState({ finalAnswer: 'Yes' });

    if (sendEmail) {
      sendFinalAnswer('Yes', emailStatusYes);
    }

    // Trigger confetti
    launchConfetti();

    // Trigger star burst
    createStarBurst(btnYes, 40);

    // Create floating hearts
    createFloatingHearts();
  }

  btnYes.addEventListener('click', () => {
    showYesResponse(true);
  });

  let timeButtonDodgeCount = Number(pageState.timeButtonDodgeCount) || 0;
  let timeButtonX = Number(pageState.timeButtonX) || 0;
  let timeButtonY = Number(pageState.timeButtonY) || 0;

  function renderTimeButton() {
    const scale = Math.max(0, 1 - timeButtonDodgeCount * 0.1);
    const opacity = Math.max(0, 1 - timeButtonDodgeCount * 0.1);
    btnTime.style.transform = `translate(${timeButtonX}px, ${timeButtonY}px) scale(${scale})`;
    btnTime.style.opacity = opacity;

    if (timeButtonDodgeCount >= 10) {
      btnTime.style.visibility = 'hidden';
      btnTime.style.pointerEvents = 'none';
    }
  }

  function moveTimeButton(countAttempt = true) {
    if (countAttempt) {
      timeButtonDodgeCount += 1;
    }

    timeButtonX = Math.round((Math.random() * 2 - 1) * 140);
    timeButtonY = Math.round((Math.random() * 2 - 1) * 90);
    renderTimeButton();
    savePageState({ timeButtonDodgeCount, timeButtonX, timeButtonY });
  }

  btnTime.setAttribute('aria-disabled', 'true');
  btnTime.setAttribute('tabindex', '-1');
  renderTimeButton();
  btnTime.addEventListener('pointerenter', () => moveTimeButton(true));
  btnTime.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    moveTimeButton(true);
  });
  btnTime.addEventListener('click', (e) => {
    e.preventDefault();
  });

  if (pageState.finalAnswer === 'Yes') {
    showYesResponse(false);
  }

  // ---- CONFETTI ----
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#ff6b9d', '#e8b4f8', '#c9a0dc', '#f0c987', '#82b1ff', '#ff8fab', '#ffd700', '#ff4d6d'];
    const pieceCount = 200;

    for (let i = 0; i < pieceCount; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frame = 0;
    const maxFrames = 300;

    function animate() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;
        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.01;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

  // ---- FLOATING HEARTS (for Yes response) ----
  function createFloatingHearts() {
    const container = document.querySelector('#final-yes-response .response-hearts');
    if (!container) return;
    const hearts = ['❤️', '💖', '💕', '✨', '💗', '💜'];

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('span');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 14}px;
        left: ${Math.random() * 100}%;
        bottom: -30px;
        opacity: 0;
        animation: floatHeart ${Math.random() * 3 + 3}s ease-out forwards;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
      `;
      container.appendChild(heart);
    }

    // Add keyframe if not already added
    if (!document.getElementById('float-heart-style')) {
      const style = document.createElement('style');
      style.id = 'float-heart-style';
      style.textContent = `
        @keyframes floatHeart {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-40px) scale(1); }
          100% { opacity: 0; transform: translateY(-200px) scale(0.8) rotate(${Math.random() * 30 - 15}deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- GENTLE STARS (for Need Time response) ----
  function createGentleStars() {
    const container = document.querySelector('#final-time-response .floating-hearts');
    if (!container) return;
    const symbols = ['🌸', '✨', '💫', '🌙', '⭐', '🤍'];

    for (let i = 0; i < 15; i++) {
      const el = document.createElement('span');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 16 + 12}px;
        left: ${Math.random() * 100}%;
        bottom: -20px;
        opacity: 0;
        animation: gentleFloat ${Math.random() * 4 + 4}s ease-out forwards;
        animation-delay: ${Math.random() * 3}s;
        pointer-events: none;
      `;
      container.appendChild(el);
    }

    if (!document.getElementById('gentle-float-style')) {
      const style = document.createElement('style');
      style.id = 'gentle-float-style';
      style.textContent = `
        @keyframes gentleFloat {
          0% { opacity: 0; transform: translateY(0); }
          30% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-150px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- SHOOTING STAR RE-SCHEDULER ----
  // Randomize shooting star timing periodically
  setInterval(() => {
    const stars = document.querySelectorAll('.shooting-star');
    stars.forEach((s, index) => {
      s.style.left = (Math.random() * 80 + 4) + '%';
      s.style.animationDelay = (index * 2 + Math.random() * 4) + 's';
    });
  }, 12000);

  // ---- HANDLE RESIZE for Confetti Canvas ----
  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // ---- INITIAL VISIBLE CHECK (for elements already in view) ----
  setTimeout(() => {
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    });

    if (typeof pageState.scrollY === 'number') {
      window.scrollTo(0, pageState.scrollY);
    }
  }, 100);

});
