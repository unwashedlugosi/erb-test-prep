import { useState, useEffect, useRef } from 'react';

export function SpaceInvadersOverlay({ onClose }) {
  const [phase, setPhase] = useState('splash');
  const canvasRef = useRef(null);
  const scanRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [finalStats, setFinalStats] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [waveNum, setWaveNum] = useState(1);

  useEffect(() => {
    if (phase === 'splash') {
      const t = setTimeout(() => setPhase('game'), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // CRT scanline overlay with color banding + vignette
  useEffect(() => {
    if (phase !== 'game') return;
    const scan = scanRef.current;
    if (!scan) return;
    const sctx = scan.getContext('2d');
    sctx.clearRect(0, 0, scan.width, scan.height);
    for (let y = 0; y < scan.height; y += 3) {
      sctx.fillStyle = 'rgba(0,0,0,0.15)';
      sctx.fillRect(0, y, scan.width, 1);
    }
    // Subtle CRT color banding
    for (let y = 0; y < scan.height; y += 6) {
      sctx.fillStyle = `rgba(${y % 2 === 0 ? '40,0,0' : '0,0,40'},0.03)`;
      sctx.fillRect(0, y, scan.width, 3);
    }
    // Vignette
    const vg = sctx.createRadialGradient(scan.width/2, scan.height/2, scan.height*0.32, scan.width/2, scan.height/2, scan.height*0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.4)');
    sctx.fillStyle = vg;
    sctx.fillRect(0, 0, scan.width, scan.height);
  }, [phase]);

  // ===== MAIN GAME ENGINE =====
  useEffect(() => {
    if (phase !== 'game') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const W = canvas.width;
    const H = canvas.height;
    const PX = 3;

    // ========================================
    // WEB AUDIO SYNTH ENGINE
    // ========================================
    let audioCtx = null;
    let ufoNodes = null;

    function initAudio() {
      if (audioCtx) return audioCtx;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
      } catch(e) { /* audio not available */ }
      return audioCtx;
    }

    function sfxShoot() {
      const ac = initAudio(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.07);
      gain.gain.setValueAtTime(0.10, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07);
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.07);
    }

    function sfxExplode() {
      const ac = initAudio(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(700, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ac.currentTime + 0.18);
      gain.gain.setValueAtTime(0.13, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.18);
    }

    // Iconic 4-note march beat that speeds up as invaders die
    const MARCH_FREQS = [73.4, 69.3, 65.4, 61.7];
    let marchIdx = 0;
    function sfxMarch() {
      const ac = initAudio(); if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(MARCH_FREQS[marchIdx % 4], ac.currentTime);
      marchIdx++;
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.08);
    }

    function sfxUFOStart() {
      const ac = initAudio(); if (!ac || ufoNodes) return;
      const osc = ac.createOscillator();
      const lfo = ac.createOscillator();
      const lfoGain = ac.createGain();
      const gain = ac.createGain();
      lfo.type = 'sine'; lfo.frequency.value = 6;
      lfoGain.gain.value = 80;
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      osc.type = 'triangle'; osc.frequency.value = 400;
      osc.connect(gain); gain.gain.value = 0.06; gain.connect(ac.destination);
      lfo.start(); osc.start();
      ufoNodes = { osc, lfo, gain };
    }

    function sfxUFOStop() {
      if (!ufoNodes) return;
      try { ufoNodes.osc.stop(); ufoNodes.lfo.stop(); } catch(e) {}
      ufoNodes = null;
    }

    function sfxPlayerDeath() {
      const ac = initAudio(); if (!ac) return;
      for (let i = 0; i < 6; i++) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.type = 'sawtooth';
        const t = ac.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(440 - i * 55, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.09);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.start(t); osc.stop(t + 0.1);
      }
    }

    function sfxShieldHit() {
      const ac = initAudio(); if (!ac) return;
      const bufSize = ac.sampleRate * 0.04;
      const buffer = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const src = ac.createBufferSource(); src.buffer = buffer;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04);
      src.connect(gain); gain.connect(ac.destination); src.start();
    }

    function sfxWaveClear() {
      const ac = initAudio(); if (!ac) return;
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.type = 'square';
        const t = ac.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.10, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t); osc.stop(t + 0.12);
      });
    }

    function sfxBonusLife() {
      const ac = initAudio(); if (!ac) return;
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.type = 'triangle';
        const t = ac.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
      });
    }

    function sfxGameOver() {
      const ac = initAudio(); if (!ac) return;
      [392, 330, 262, 196].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain); gain.connect(ac.destination);
        osc.type = 'square';
        const t = ac.currentTime + i * 0.2;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.10, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t); osc.stop(t + 0.25);
      });
    }

    // ========================================
    // SPRITES
    // ========================================
    const SPRITES = [
      { a:[[0,0,0,1,0,0,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,0,1,0,1,0,0],[0,1,0,0,0,1,0]],
        b:[[0,0,0,1,0,0,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,1,0,0,0,1,0],[1,0,0,0,0,0,1]] },
      { a:[[0,1,0,0,0,1,0],[0,0,1,0,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[0,1,0,0,0,1,0],[1,0,0,0,0,0,1]],
        b:[[0,1,0,0,0,1,0],[1,0,1,0,1,0,1],[1,1,1,1,1,1,1],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,0,1,0,1,0,0],[0,1,0,1,0,1,0],[0,0,0,0,0,0,0]] },
      { a:[[0,0,1,0,0,0,1,0,0],[0,0,0,1,0,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,1,0,1,0,1,1,0],[1,1,1,1,1,1,1,1,1],[1,0,1,1,1,1,1,0,1],[1,0,1,0,0,0,1,0,1],[0,0,0,1,1,1,0,0,0]],
        b:[[0,0,1,0,0,0,1,0,0],[1,0,0,1,0,1,0,0,1],[1,0,1,1,1,1,1,0,1],[1,1,1,0,1,0,1,1,1],[1,1,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,0,0],[0,0,1,0,0,0,1,0,0],[0,1,0,0,0,0,0,1,0]] },
      { a:[[0,0,0,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1],[1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1],[0,0,1,0,0,0,1,0,0],[0,1,0,1,0,1,0,1,0],[1,0,1,0,0,0,1,0,1]],
        b:[[0,0,0,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1],[1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1],[0,0,0,1,0,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0]] },
      { a:[[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,1,0,1,0,1,1,0],[1,1,1,1,1,1,1,1,1],[0,0,1,0,0,0,1,0,0],[0,1,0,0,0,0,0,1,0],[0,0,1,0,0,0,1,0,0]],
        b:[[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,1,0,1,0,1,1,0],[1,1,1,1,1,1,1,1,1],[0,0,0,1,0,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,1,0,0,0,0,0,1,0]] },
      { a:[[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1],[1,0,0,1,0,1,0,0,1],[1,1,1,1,1,1,1,1,1],[0,0,1,0,0,0,1,0,0],[0,1,0,0,0,0,0,1,0]],
        b:[[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1],[1,0,0,1,0,1,0,0,1],[1,1,1,1,1,1,1,1,1],[0,1,0,0,0,0,0,1,0],[1,0,0,0,0,0,0,0,1]] },
    ];

    const CANNON_SPRITE = [[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1]];
    const EXPLOSION = [[0,0,1,0,0,0,1,0,0],[1,0,0,1,0,1,0,0,1],[0,1,0,0,0,0,0,1,0],[0,0,0,1,1,1,0,0,0],[1,1,0,1,1,1,0,1,1],[0,0,0,1,1,1,0,0,0],[0,1,0,0,0,0,0,1,0],[1,0,0,1,0,1,0,0,1],[0,0,1,0,0,0,1,0,0]];
    const UFO_SPRITE = [[0,0,0,0,1,1,1,1,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0],[1,0,1,0,1,0,1,0,1,0,1,0],[1,1,1,1,1,1,1,1,1,1,1,1],[0,0,1,1,1,0,0,1,1,1,0,0]];

    // ========================================
    // COLORS & DIMENSIONS
    // ========================================
    const ROW_COLORS = ['#d4e84b', '#6acd5b', '#3fbf7f', '#4da6ff', '#9966ff', '#ff6644'];
    const CANNON_COLOR = '#4dff4d';
    const SHIELD_COLOR = '#4da6ff';
    const UFO_COLOR = '#ff4444';

    const COLS = 6, ROWS = 6;
    const ROW_POINTS = [30, 25, 20, 15, 10, 5];
    const INV_W = 9 * PX, INV_H = 8 * PX;
    const GAP_X = 5 * PX, GAP_Y = 6 * PX;
    const CANNON_W = 9 * PX, CANNON_H = 6 * PX;
    const GROUND_Y = H - 38;
    const PLAYER_Y = GROUND_Y - CANNON_H - 8;
    const UFO_SCORES = [50, 50, 100, 100, 100, 150, 150, 200, 200, 300];

    // ========================================
    // GAME STATE
    // ========================================
    let invaders = [];
    let shields = [];
    let player = { x: W / 2 - CANNON_W / 2, hit: 0, invincible: 0 };
    let bullet = null;
    let bulletTrail = [];
    let bombs = [];
    let explosions = [];
    let particles = [];
    let popups = [];
    let ufo = null;
    let stars = [];

    let sc = 0, lv = 3, wave = 0;
    let running = true, started = false;
    let timer = 60, timerInterval = null;
    let frame = 0, moveDir = 1, moveTimer = 0, stepCount = 0;
    let keys = {}, touchX = null, touchFiring = false, spaceDown = false;
    let shakeAmount = 0, waveTransition = 0, waveFlash = 0;
    let bonusAwarded = false, kills = 0, shots = 0, muzzleFlash = 0;
    let hiScore = parseInt(localStorage.getItem('si_high') || '0');

    // ========================================
    // INIT
    // ========================================
    function initInvaders(startWave) {
      invaders = [];
      const gridW = COLS * INV_W + (COLS - 1) * GAP_X;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          invaders.push({
            r, c,
            x: (W - gridW) / 2 + c * (INV_W + GAP_X),
            y: 44 + r * (INV_H + GAP_Y) + Math.min(startWave, 4) * 8,
            alive: true, sprite: SPRITES[r], color: ROW_COLORS[r],
            points: ROW_POINTS[r], exploding: 0,
          });
        }
      }
    }

    function initShields() {
      shields = [];
      const SH_W = 44, SH_H = 26;
      const shieldY = PLAYER_Y - 50;
      const spacing = W / 4;
      for (let s = 0; s < 3; s++) {
        const sx = spacing * (s + 1) - SH_W / 2;
        for (let py = 0; py < SH_H; py += 2) {
          for (let px = 0; px < SH_W; px += 2) {
            const inArch = py > SH_H * 0.58 && Math.abs(px - SH_W / 2) < SH_W * 0.24;
            if (!inArch) shields.push({ x: sx + px, y: shieldY + py, alive: true });
          }
        }
      }
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < 50; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.85,
          brightness: 0.08 + Math.random() * 0.2,
          speed: 0.01 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
          size: Math.random() < 0.12 ? 2 : 1,
        });
      }
    }

    initInvaders(0);
    initShields();
    initStars();

    // ========================================
    // DIFFICULTY SCALING
    // ========================================
    function moveInterval() {
      const alive = invaders.filter(i => i.alive && i.exploding === 0).length;
      const base = Math.max(18 - wave * 2, 10);
      return Math.max(2, Math.floor(base * (alive / (ROWS * COLS))));
    }
    function maxBombs() { return wave >= 3 ? 4 : wave >= 1 ? 3 : 2; }
    function bombDropRate() { return Math.min(0.45, 0.25 + wave * 0.05); }
    function bombSpeed() { return 2.0 + Math.min(wave, 4) * 0.25; }

    // ========================================
    // HELPERS
    // ========================================
    function drawSprite(sprite, x, y, color) {
      ctx.fillStyle = color;
      for (let r = 0; r < sprite.length; r++)
        for (let c = 0; c < sprite[r].length; c++)
          if (sprite[r][c]) ctx.fillRect(x + c * PX, y + r * PX, PX, PX);
    }

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function spawnParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 15 + Math.random() * 15, color,
        });
      }
    }

    function addKillPopup(x, y, text, color) {
      popups.push({ x, y, text, ttl: 35, color });
    }

    function checkBonusLife() {
      if (!bonusAwarded && sc >= 1500) {
        bonusAwarded = true;
        lv++; setLives(lv);
        sfxBonusLife();
        popups.push({ x: W / 2, y: H / 2, text: '1UP!', ttl: 60, color: '#4dff4d' });
      }
    }

    // ========================================
    // ACTIONS
    // ========================================
    function fire() {
      if (!started) {
        started = true;
        initAudio();
        timerInterval = setInterval(() => {
          timer--;
          setTimeLeft(timer);
          if (timer <= 0) endGame();
        }, 1000);
      }
      if (!bullet && player.hit === 0 && player.invincible <= 0 && waveTransition === 0) {
        bullet = { x: player.x + CANNON_W / 2, y: PLAYER_Y };
        muzzleFlash = 4;
        shots++;
        sfxShoot();
      }
    }

    function endGame() {
      if (!running) return;
      running = false;
      if (timerInterval) clearInterval(timerInterval);
      sfxUFOStop();
      sfxGameOver();
      shakeAmount = 6;
      const isNewHi = sc > hiScore;
      if (isNewHi) localStorage.setItem('si_high', String(sc));
      setScore(sc);
      setFinalStats({
        score: sc, wave: wave + 1, kills, shots,
        accuracy: shots > 0 ? Math.round((kills / shots) * 100) : 0,
        hiScore: isNewHi ? sc : hiScore, isNewHi,
      });
      setTimeout(() => setPhase('score'), 1200);
    }

    function respawnWave() {
      wave++;
      setWaveNum(wave + 1);
      waveTransition = 80;
      waveFlash = 12;
      sfxWaveClear();
      const gridW = COLS * INV_W + (COLS - 1) * GAP_X;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          invaders[idx].alive = true;
          invaders[idx].exploding = 0;
          invaders[idx].x = (W - gridW) / 2 + c * (INV_W + GAP_X);
          invaders[idx].y = 44 + r * (INV_H + GAP_Y) + Math.min(wave, 4) * 8;
        }
      }
      moveDir = 1;
      bombs = [];
    }

    // ========================================
    // MAIN LOOP
    // ========================================
    function loop() {
      if (!running) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      frame++;

      // Wave clear flash
      if (waveFlash > 0) {
        waveFlash--;
        ctx.fillStyle = `rgba(255,255,255,${waveFlash / 12 * 0.25})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Screen shake
      const shaking = shakeAmount > 0.5;
      if (shaking) {
        ctx.save();
        ctx.translate((Math.random() - 0.5) * shakeAmount, (Math.random() - 0.5) * shakeAmount);
        shakeAmount *= 0.88;
      }

      // ---- Stars ----
      for (const s of stars) {
        s.phase += s.speed;
        const a = s.brightness + Math.sin(s.phase) * 0.06;
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, a)})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // ---- Player ----
      if (player.hit > 0) {
        player.hit--;
        if (player.hit === 0) player.invincible = 50;
      } else {
        const spd = 4;
        if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(4, player.x - spd);
        if (keys['ArrowRight'] || keys['d']) player.x = Math.min(W - CANNON_W - 4, player.x + spd);
        if (touchX !== null) {
          const target = touchX - CANNON_W / 2;
          const clamped = Math.max(4, Math.min(W - CANNON_W - 4, target));
          player.x += (clamped - player.x) * 0.3;
        }
        if (player.invincible > 0) player.invincible--;
      }

      // ---- Invaders ----
      if (started && waveTransition === 0) {
        moveTimer++;
        if (moveTimer >= moveInterval()) {
          moveTimer = 0;
          stepCount++;
          sfxMarch();
          let hitEdge = false;
          const alive = invaders.filter(i => i.alive && i.exploding === 0);
          const stepX = 4 + Math.max(0, 2 - Math.floor(alive.length / 8));
          for (const inv of alive) {
            inv.x += moveDir * stepX;
            if (inv.x <= 2 || inv.x + INV_W >= W - 2) hitEdge = true;
          }
          if (hitEdge) {
            moveDir *= -1;
            for (const inv of alive) {
              inv.x += moveDir * stepX;
              inv.y += 6 + Math.min(wave, 3);
            }
          }
          for (const inv of alive) {
            if (inv.y + INV_H >= GROUND_Y) { endGame(); return; }
          }
          // Bombs
          if (alive.length > 0 && bombs.length < maxBombs()) {
            const bottomPerCol = {};
            for (const inv of alive) {
              if (!bottomPerCol[inv.c] || inv.r > bottomPerCol[inv.c].r) bottomPerCol[inv.c] = inv;
            }
            const bottoms = Object.values(bottomPerCol);
            if (Math.random() < bombDropRate()) {
              const shooter = bottoms[Math.floor(Math.random() * bottoms.length)];
              bombs.push({
                x: shooter.x + INV_W / 2, y: shooter.y + INV_H,
                zigPhase: Math.random() * Math.PI * 2,
                type: Math.random() < 0.5 ? 'zigzag' : 'plunger',
              });
            }
          }
        }
      }

      // ---- UFO ----
      if (started && !ufo && waveTransition === 0 && Math.random() < 0.002) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        ufo = { x: dir === 1 ? -40 : W + 40, dir };
        sfxUFOStart();
      }
      if (ufo) {
        ufo.x += ufo.dir * 1.5;
        if ((ufo.dir === 1 && ufo.x > W + 44) || (ufo.dir === -1 && ufo.x < -44)) {
          sfxUFOStop(); ufo = null;
        }
      }

      // ---- Bullet ----
      if (bullet) {
        bulletTrail.push({ x: bullet.x, y: bullet.y, alpha: 0.5 });
        bullet.y -= 8;
        if (bullet.y < 26) {
          bullet = null;
        } else {
          // Hit invader?
          for (const inv of invaders) {
            if (!inv.alive || inv.exploding > 0) continue;
            if (bullet.x >= inv.x && bullet.x <= inv.x + INV_W &&
                bullet.y >= inv.y && bullet.y <= inv.y + INV_H) {
              inv.exploding = 14;
              sc += inv.points; kills++;
              setScore(sc); sfxExplode();
              spawnParticles(inv.x + INV_W / 2, inv.y + INV_H / 2, inv.color, 8);
              addKillPopup(inv.x + INV_W / 2, inv.y, `+${inv.points}`, inv.color);
              checkBonusLife();
              bullet = null;
              break;
            }
          }
          // Hit UFO?
          if (bullet && ufo && bullet.x >= ufo.x && bullet.x <= ufo.x + 36 &&
              bullet.y >= 28 && bullet.y <= 46) {
            const ufoScore = UFO_SCORES[Math.floor(Math.random() * UFO_SCORES.length)];
            sc += ufoScore; kills++;
            setScore(sc); sfxExplode(); sfxUFOStop();
            spawnParticles(ufo.x + 18, 38, UFO_COLOR, 12);
            addKillPopup(ufo.x + 18, 30, `+${ufoScore}`, '#ff8866');
            explosions.push({ x: ufo.x + 8, y: 28, ttl: 20 });
            ufo = null; bullet = null;
            checkBonusLife();
          }
          // Hit shield?
          if (bullet) {
            for (const sp of shields) {
              if (sp.alive && Math.abs(bullet.x - sp.x) < 3 && Math.abs(bullet.y - sp.y) < 3) {
                for (const sp2 of shields) {
                  if (sp2.alive && Math.abs(sp2.x - sp.x) < 5 && Math.abs(sp2.y - sp.y) < 4) sp2.alive = false;
                }
                sfxShieldHit();
                bullet = null;
                break;
              }
            }
          }
        }
      }

      // ---- Bullet trail ----
      for (let i = bulletTrail.length - 1; i >= 0; i--) {
        bulletTrail[i].alpha -= 0.08;
        if (bulletTrail[i].alpha <= 0) bulletTrail.splice(i, 1);
      }

      // ---- Invader explosions ----
      for (const inv of invaders) {
        if (inv.exploding > 0) {
          inv.exploding--;
          if (inv.exploding === 0) {
            inv.alive = false;
            if (invaders.every(i => !i.alive)) respawnWave();
          }
        }
      }

      // ---- Bombs ----
      const bSpd = bombSpeed();
      for (let i = bombs.length - 1; i >= 0; i--) {
        const b = bombs[i];
        b.y += bSpd;
        if (b.type === 'zigzag') b.x += Math.sin(b.y * 0.15 + b.zigPhase) * 0.8;
        let removed = false;
        // Hit shield?
        for (const sp of shields) {
          if (sp.alive && Math.abs(b.x - sp.x) < 4 && Math.abs(b.y - sp.y) < 4) {
            for (const sp2 of shields) {
              if (sp2.alive && Math.abs(sp2.x - sp.x) < 6 && Math.abs(sp2.y - sp.y) < 6) sp2.alive = false;
            }
            sfxShieldHit();
            bombs.splice(i, 1); removed = true;
            break;
          }
        }
        if (removed) continue;
        // Hit player?
        if (player.hit === 0 && player.invincible <= 0 &&
            b.y >= PLAYER_Y && b.y <= PLAYER_Y + CANNON_H &&
            b.x >= player.x && b.x <= player.x + CANNON_W) {
          bombs.splice(i, 1);
          lv--; setLives(lv);
          player.hit = 50;
          shakeAmount = 10;
          sfxPlayerDeath();
          spawnParticles(player.x + CANNON_W / 2, PLAYER_Y + CANNON_H / 2, CANNON_COLOR, 16);
          explosions.push({ x: player.x, y: PLAYER_Y, ttl: 24 });
          if (lv <= 0) { endGame(); return; }
          continue;
        }
        if (b.y > H) bombs.splice(i, 1);
      }

      // ---- Explosions ----
      for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].ttl--;
        if (explosions[i].ttl <= 0) explosions.splice(i, 1);
      }

      // ---- Particles ----
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // ---- Popups ----
      for (let i = popups.length - 1; i >= 0; i--) {
        popups[i].y -= 0.8; popups[i].ttl--;
        if (popups[i].ttl <= 0) popups.splice(i, 1);
      }

      if (waveTransition > 0) waveTransition--;
      if (muzzleFlash > 0) muzzleFlash--;

      // ============ DRAW ============

      // Bullet trail glow
      for (const t of bulletTrail) {
        ctx.fillStyle = `rgba(255,255,255,${t.alpha * 0.4})`;
        ctx.fillRect(t.x - 1, t.y, PX, 6);
      }

      // Shields
      ctx.fillStyle = SHIELD_COLOR;
      for (const sp of shields) {
        if (sp.alive) ctx.fillRect(sp.x, sp.y, 2, 2);
      }

      // Invaders
      for (const inv of invaders) {
        if (!inv.alive) continue;
        if (inv.exploding > 0) {
          drawSprite(EXPLOSION, inv.x, inv.y, inv.exploding % 4 < 2 ? '#fff' : inv.color);
        } else {
          drawSprite(stepCount % 2 === 0 ? inv.sprite.a : inv.sprite.b, inv.x, inv.y, inv.color);
        }
      }

      // UFO
      if (ufo) {
        const uCol = frame % 8 < 4 ? UFO_COLOR : '#ff8866';
        drawSprite(UFO_SPRITE, ufo.x, 30, uCol);
        ctx.fillStyle = 'rgba(255,68,68,0.15)';
        ctx.fillRect(ufo.x - 4, 28, 44, 22);
      }

      // Cannon
      if (player.hit === 0 || (player.hit > 0 && frame % 4 < 2)) {
        if (player.invincible <= 0 || frame % 4 < 2) {
          drawSprite(CANNON_SPRITE, player.x, PLAYER_Y, CANNON_COLOR);
          if (muzzleFlash > 0) {
            ctx.fillStyle = `rgba(255,255,200,${muzzleFlash / 4 * 0.7})`;
            ctx.fillRect(player.x + CANNON_W / 2 - 3, PLAYER_Y - 5, 6, 5);
          }
        }
      }

      // Bullet
      if (bullet) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(bullet.x - 1, bullet.y, PX, 10);
        ctx.fillStyle = 'rgba(255,255,200,0.8)';
        ctx.fillRect(bullet.x - 1, bullet.y - 2, PX, 3);
      }

      // Bombs
      for (const b of bombs) {
        if (b.type === 'zigzag') {
          ctx.fillStyle = '#ff8a4d';
          for (let yy = 0; yy < 12; yy += 2)
            ctx.fillRect(b.x - 1 + (yy % 4 < 2 ? -1 : 1), b.y + yy, PX, 2);
        } else {
          ctx.fillStyle = '#ffcc00';
          ctx.fillRect(b.x - 1, b.y, PX, 10);
          ctx.fillRect(b.x - 3, b.y + 10, PX + 4, 2);
        }
      }

      // Explosions
      for (const e of explosions)
        drawSprite(EXPLOSION, e.x, e.y, e.ttl % 4 < 2 ? '#fff' : '#ff8a4d');

      // Particles
      for (const p of particles) {
        ctx.fillStyle = hexToRgba(p.color, p.life / 30);
        ctx.fillRect(p.x, p.y, 2, 2);
      }

      // Popups
      for (const p of popups) {
        const alpha = Math.min(1, p.ttl / 15);
        ctx.fillStyle = hexToRgba(p.color, alpha);
        ctx.font = p.text === '1UP!' ? 'bold 16px monospace' : 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      }

      // Ground line (pulses red when timer low)
      ctx.fillStyle = timer <= 10 && frame % 20 < 10 ? '#ff4444' : CANNON_COLOR;
      ctx.fillRect(0, GROUND_Y, W, 2);

      // ---- HUD ----
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE  ${String(sc).padStart(5, '0')}`, 8, 18);

      ctx.fillStyle = '#666';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`HI ${String(Math.max(sc, hiScore)).padStart(5, '0')}`, W / 2, 10);

      ctx.fillStyle = '#888';
      ctx.font = '9px monospace';
      ctx.fillText(`WAVE ${wave + 1}`, W / 2, 22);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${lv}`, W - 8, 18);
      for (let i = 0; i < lv - 1; i++) {
        const lx = W - 26 - i * 22;
        ctx.fillStyle = CANNON_COLOR;
        ctx.fillRect(lx, 10, 15, 3);
        ctx.fillRect(lx + 6, 7, 3, 3);
      }

      if (started) {
        ctx.fillStyle = timer <= 10 ? (frame % 30 < 15 ? '#ff4444' : '#ff8866') : '#888';
        ctx.font = timer <= 10 ? 'bold 14px monospace' : 'bold 12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${timer}s`, W - 8, GROUND_Y + 16);
      }

      if (!started) {
        const hintAlpha = 0.4 + Math.sin(frame * 0.06) * 0.3;
        ctx.fillStyle = `rgba(255,255,255,${hintAlpha})`;
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TAP OR PRESS SPACE TO START', W / 2, H - 12);
      }

      // Wave transition overlay
      if (waveTransition > 0) {
        const alpha = waveTransition > 60 ? 1 : waveTransition / 60;
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.08})`;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`WAVE ${wave + 1}`, W / 2, H / 2 - 10);
        ctx.font = '12px monospace';
        ctx.fillText('GET READY', W / 2, H / 2 + 14);
      }

      if (shaking) ctx.restore();
      requestAnimationFrame(loop);
    }

    loop();

    // ========================================
    // EVENT HANDLERS
    // ========================================
    const handleKeyDown = (e) => {
      keys[e.key] = true;
      if ((e.key === ' ' || e.code === 'Space') && !spaceDown) {
        e.preventDefault(); spaceDown = true; fire();
      }
    };
    const handleKeyUp = (e) => {
      keys[e.key] = false;
      if (e.key === ' ' || e.code === 'Space') spaceDown = false;
    };
    const handleTouch = (e) => {
      e.preventDefault();
      fire();
      const touch = e.touches[0]; if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      touchX = (touch.clientX - rect.left) * (W / rect.width);
      touchFiring = true;
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0]; if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      touchX = (touch.clientX - rect.left) * (W / rect.width);
    };
    const handleTouchEnd = () => { touchX = null; touchFiring = false; };
    const fireInterval = setInterval(() => { if (touchFiring && started) fire(); }, 200);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    gameRef.current = { cleanup: () => {
      running = false;
      if (timerInterval) clearInterval(timerInterval);
      clearInterval(fireInterval);
      sfxUFOStop();
      try { if (audioCtx) audioCtx.close(); } catch(e) {}
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    }};
    return () => { gameRef.current?.cleanup(); };
  }, [phase]);

  // ========================================
  // RENDER
  // ========================================
  if (phase === 'splash') {
    return (
      <div className="si-overlay">
        <div className="si-splash">
          <div className="si-splash-icon">👾</div>
          <h1 className="si-splash-title">15-IN-A-ROW!</h1>
          <p className="si-splash-sub">SPACE INVADERS</p>
          <div className="si-splash-bar-track">
            <div className="si-splash-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'score') {
    return (
      <div className="si-overlay">
        <div className="si-score-card">
          <div style={{ fontSize: 48, marginBottom: 8 }}>👾</div>
          <h2 style={{ color: '#fff', marginBottom: 4, letterSpacing: 2 }}>GAME OVER</h2>
          <div className="si-score-num">{finalStats?.score ?? score}</div>
          <p style={{ color: 'var(--text-dim)', marginBottom: 4 }}>points</p>
          {finalStats?.isNewHi && <div className="si-new-hi">NEW HIGH SCORE!</div>}
          {finalStats && (
            <div className="si-stats">
              Wave {finalStats.wave} &bull; {finalStats.kills} invaders &bull; {finalStats.accuracy}% accuracy
            </div>
          )}
          {finalStats && !finalStats.isNewHi && (
            <div className="si-hi-score">High Score: {finalStats.hiScore}</div>
          )}
          <button className="si-back-btn" onClick={onClose} style={{ marginTop: 16 }}>Back to Practice</button>
        </div>
      </div>
    );
  }

  return (
    <div className="si-overlay">
      <div className="si-game-wrap">
        <div className="si-timer-bar">
          <span>👾 SPACE INVADERS</span>
          <span style={{ color: timeLeft <= 10 ? 'var(--wrong)' : 'var(--text-dim)', fontFamily: 'monospace' }}>{timeLeft}s</span>
        </div>
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={360} height={520} className="si-canvas-main si-canvas" />
          <canvas ref={scanRef} width={360} height={520} className="si-scanlines" />
        </div>
      </div>
    </div>
  );
}
