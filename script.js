// ==========================================
// SELEN İÇİN ÖZEL WEB DENEYİMİ // JAVASCRIPT
// ==========================================

// Audio Elements
const audioHappy = new Audio('audio/happy-to-hang-around.mp3');
const audioHeaven = new Audio('audio/heaven-tonight.mp3');
const audioMedia = new Audio('audio/media-naranja.mp3');

audioHappy.preload = 'auto';
audioHeaven.preload = 'auto';
audioMedia.preload = 'auto';

let currentAudio = null;

// Smooth Audio Crossfade Helper
function playSong(audio, startTime = 0) {
  if (currentAudio && currentAudio !== audio) {
    const prev = currentAudio;
    let vol = prev.volume;
    const fadeOut = setInterval(() => {
      vol = Math.max(0, vol - 0.1);
      prev.volume = vol;
      if (vol <= 0) {
        clearInterval(fadeOut);
        prev.pause();
      }
    }, 50);
  }

  audio.currentTime = startTime;
  audio.volume = 0;
  audio.play().catch(e => console.warn('Audio play prevented:', e));

  let inVol = 0;
  const fadeIn = setInterval(() => {
    inVol = Math.min(1, inVol + 0.1);
    audio.volume = inVol;
    if (inVol >= 1) clearInterval(fadeIn);
  }, 60);

  currentAudio = audio;
}

// Background Canvas Particles & Weather System
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Weather & Atmosphere Modes: 'autumn' | 'tears' | 'twilight' | 'climax'
let atmosphere = 'autumn';

// Particle Arrays
const rainDrops = [];
const leaves = [];
const fireflies = [];
const hearts = [];
const fireworks = [];

// Initialize Rain (180 drops)
for (let i = 0; i < 180; i++) {
  rainDrops.push({
    x: Math.random() * width,
    y: Math.random() * height,
    len: Math.random() * 22 + 10,
    speed: Math.random() * 7 + 10,
    opacity: Math.random() * 0.4 + 0.2
  });
}

// Initialize Autumn Leaves (35 leaves)
const leafColors = ['#e67e22', '#d35400', '#f39c12', '#c0392b', '#b9770e'];
for (let i = 0; i < 35; i++) {
  leaves.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 14 + 10,
    color: leafColors[Math.floor(Math.random() * leafColors.length)],
    speedY: Math.random() * 1.5 + 1.2,
    speedX: Math.random() * 1.5 - 0.75,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04
  });
}

// Initialize Twilight Fireflies (60 fireflies)
for (let i = 0; i < 60; i++) {
  fireflies.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1.5,
    opacity: Math.random(),
    pulseSpeed: Math.random() * 0.03 + 0.01,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8
  });
}

// Mouse Position Tracking & Interactive Ripples
const mouse = { x: -100, y: -100, prevX: -100, prevY: -100 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (atmosphere === 'climax' && Math.random() < 0.35) {
    spawnHeart(mouse.x, mouse.y, true);
  }
});

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    if (atmosphere === 'climax' && Math.random() < 0.35) {
      spawnHeart(mouse.x, mouse.y, true);
    }
  }
});

// Helper: Spawn Floating Hearts
function spawnHeart(x, y, fromMouse = false) {
  hearts.push({
    x: x || Math.random() * width,
    y: y || (fromMouse ? mouse.y : height + 20),
    size: Math.random() * 22 + 14,
    speedY: fromMouse ? (Math.random() * -2 - 1) : (Math.random() * -3 - 2),
    speedX: (Math.random() - 0.5) * 2,
    color: ['#ff4d6d', '#ff758f', '#ffb3c1', '#f4c068', '#ff2a5f'][Math.floor(Math.random() * 5)],
    opacity: 1,
    angle: (Math.random() - 0.5) * 0.4
  });
}

// Helper: Firework Particle Burst
function triggerFireworks(x, y) {
  const count = 45;
  const colors = ['#f4c068', '#ff4d6d', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    fireworks.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      size: Math.random() * 3.5 + 1.5
    });
  }
}

// Helper: Spawn Emotion Emojis on Click
function spawnFloatingEmoji(emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.innerText = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 120}px`);
  el.style.setProperty('--rot', `${(Math.random() - 0.5) * 40}deg`);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// Main Canvas Animation Loop
function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Rain (Active during 'autumn' and 'tears')
  if (atmosphere === 'autumn' || atmosphere === 'tears') {
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = atmosphere === 'tears' ? 'rgba(147, 197, 253, 0.45)' : 'rgba(203, 213, 225, 0.35)';

    for (const drop of rainDrops) {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + 2, drop.y + drop.len);
      ctx.stroke();

      drop.y += drop.speed;
      drop.x += 1.2;

      // Mouse Wind Reaction
      const dx = mouse.x - drop.x;
      const dy = mouse.y - drop.y;
      if (Math.sqrt(dx * dx + dy * dy) < 80) {
        drop.x -= dx * 0.08;
      }

      if (drop.y > height) {
        drop.y = -20;
        drop.x = Math.random() * width;
      }
    }

    // Draw Autumn Leaves
    for (const leaf of leaves) {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);
      ctx.fillStyle = leaf.color;
      ctx.globalAlpha = 0.85;

      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      leaf.y += leaf.speedY;
      leaf.x += leaf.speedX + Math.sin(leaf.angle) * 0.8;
      leaf.angle += leaf.spin;

      if (leaf.y > height + 20) {
        leaf.y = -20;
        leaf.x = Math.random() * width;
      }
    }
  }

  // 2. Draw Twilight Fireflies (Active during 'twilight' and 'climax')
  if (atmosphere === 'twilight' || atmosphere === 'climax') {
    for (const f of fireflies) {
      f.x += f.vx;
      f.y += f.vy;
      f.opacity += f.pulseSpeed;
      if (f.opacity > 1 || f.opacity < 0.2) f.pulseSpeed = -f.pulseSpeed;

      if (f.x < 0) f.x = width;
      if (f.x > width) f.x = 0;
      if (f.y < 0) f.y = height;
      if (f.y > height) f.y = 0;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 192, 104, ${f.opacity})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f4c068';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // 3. Draw Floating Hearts (Active during 'climax')
  if (atmosphere === 'climax') {
    if (Math.random() < 0.18) {
      spawnHeart();
    }

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.speedY;
      h.x += h.speedX;
      h.opacity -= 0.005;

      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.angle);
      ctx.font = `${h.size}px serif`;
      ctx.fillStyle = h.color;
      ctx.globalAlpha = Math.max(0, h.opacity);
      ctx.fillText('❤️', 0, 0);
      ctx.restore();

      if (h.opacity <= 0 || h.y < -50) {
        hearts.splice(i, 1);
      }
    }

    // Draw Fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.alpha -= p.decay;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ==========================================
// STAGE TRANSITIONS & STORYLINE CONTROLLER
// ==========================================

const introModal = document.getElementById('intro-modal');
const mainContainer = document.getElementById('main-container');
const audioHud = document.getElementById('audio-hud');
const trackNameLabel = document.getElementById('current-track-name');
const vignette = document.getElementById('vignette-overlay');

const stage1 = document.getElementById('stage-1');
const stage2 = document.getElementById('stage-2');
const stage3 = document.getElementById('stage-3');
const stage4 = document.getElementById('stage-4');

const quote1 = document.getElementById('quote-1');
const quote2 = document.getElementById('quote-2');

const btnStart = document.getElementById('btn-start');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

// Helper to switch active stage smoothly
function setStage(hideEl, showEl) {
  hideEl.classList.remove('active');
  setTimeout(() => {
    hideEl.classList.add('hidden');
    showEl.classList.remove('hidden');
    setTimeout(() => {
      showEl.classList.add('active');
    }, 50);
  }, 600);
}

// Stage 0 -> Stage 1: Initial Touch
btnStart.addEventListener('click', (e) => {
  introModal.classList.remove('active');
  mainContainer.classList.remove('hidden');
  audioHud.classList.remove('hidden');

  // Start Travis - Happy To Hang Around AT EXACT CHORUS 50.0s
  trackNameLabel.textContent = 'Travis - Happy To Hang Around';
  playSong(audioHappy, 50.0);

  // Spawn initial emotional autumn breeze
  for (let i = 0; i < 5; i++) {
    spawnFloatingEmoji('🍂', e.clientX + (i - 2) * 30, e.clientY - 20);
  }
});

// Stage 1 -> Stage 2: "Seni kırdığımı biliyorum" clicked
quote1.addEventListener('click', (e) => {
  atmosphere = 'tears';
  vignette.style.background = 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 40%, rgba(3, 7, 18, 0.9) 100%)';

  // Burst crying & tear emojis
  const emojis = ['🥺', '💔', '😭', '💧', '🥀'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const em = emojis[Math.floor(Math.random() * emojis.length)];
      const x = e.clientX + (Math.random() - 0.5) * 160;
      const y = e.clientY + (Math.random() - 0.5) * 80;
      spawnFloatingEmoji(em, x, y);
    }, i * 70);
  }

  setStage(stage1, stage2);
});

// Stage 2 -> Stage 3: "Özür dilerim" clicked
quote2.addEventListener('click', (e) => {
  atmosphere = 'twilight';
  vignette.style.background = 'radial-gradient(circle at center, rgba(76, 29, 149, 0.2) 30%, rgba(15, 7, 36, 0.85) 100%)';

  // Crossfade to HIM - Heaven Tonight AT CHORUS 39.0s
  trackNameLabel.textContent = 'HIM - Heaven Tonight (You Are My Heaven)';
  playSong(audioHeaven, 39.0);

  // Floating stars and dove emojis
  const emojis = ['🕊️', '✨', '💖', '⭐', '🤍'];
  for (let i = 0; i < 9; i++) {
    setTimeout(() => {
      const em = emojis[Math.floor(Math.random() * emojis.length)];
      const x = e.clientX + (Math.random() - 0.5) * 180;
      const y = e.clientY + (Math.random() - 0.5) * 90;
      spawnFloatingEmoji(em, x, y);
    }, i * 60);
  }

  setStage(stage2, stage3);
});

// ==========================================
// PLAYFUL "HAYIR" BUTTON LOGIC (CANNOT SAY NO!)
// ==========================================
let noAttempts = 0;

function dodgeOrMorphNoButton() {
  noAttempts++;

  if (noAttempts === 1) {
    // 1st attempt: Dodges with bounce physics
    const offsetX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 80 + 60);
    const offsetY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 40 + 20);
    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    btnNo.innerText = 'Emin misin? 🥺';
  } else {
    // 2nd attempt: Morphs into "Evet! ❤️"
    btnNo.style.transform = 'translate(0px, 0px)';
    btnNo.innerText = 'Evet tabii ki! 🥰';
    btnNo.classList.remove('no-btn');
    btnNo.classList.add('yes-btn', 'morphed-yes');

    // Trigger sweet heart burst
    const rect = btnNo.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      spawnFloatingEmoji('💖', rect.left + rect.width / 2, rect.top);
    }

    // Now clicking this button acts as YES!
    btnNo.onclick = handleYesVictory;
  }
}

btnNo.addEventListener('mouseenter', dodgeOrMorphNoButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeOrMorphNoButton();
});

// ==========================================
// GRAND CLIMAX: "EVET" CLICKED!
// ==========================================
function handleYesVictory(e) {
  atmosphere = 'climax';
  vignette.style.background = 'radial-gradient(circle at center, rgba(244, 63, 94, 0.25) 30%, rgba(20, 5, 15, 0.88) 100%)';

  // Crossfade to Fey - Media Naranja (Sped Up Nightcore) AT PEAK 38.0s!
  trackNameLabel.textContent = 'Media Naranja - Fey (Sped Up Nightcore)';
  playSong(audioMedia, 38.0);

  // Explosive Fireworks Celebration
  const clientX = e?.clientX || window.innerWidth / 2;
  const clientY = e?.clientY || window.innerHeight / 2;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      triggerFireworks(
        Math.random() * (width * 0.8) + width * 0.1,
        Math.random() * (height * 0.5) + height * 0.1
      );
    }, i * 250);
  }

  // Continuous floating emojis
  const loveEmojis = ['❤️', '💖', '✨', '🌹', '🥰', '🎉'];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const em = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
      spawnFloatingEmoji(em, Math.random() * width, height - 80);
    }, i * 120);
  }

  setStage(stage3, stage4);
}

btnYes.addEventListener('click', handleYesVictory);
