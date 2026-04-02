import { useEffect, useRef, useCallback } from 'react';

const BEST_KEY = 'erb_shell_game_best';
function getBest() { try { return parseInt(localStorage.getItem(BEST_KEY) || '0'); } catch { return 0; } }
function saveBest(n) { try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* ignore */ } }

function getDiff(round) {
  if (round <= 1) return { numCaps: 3, numSwaps: 3, swapMs: 600, pauseMs: 200 };
  if (round === 2) return { numCaps: 3, numSwaps: 4, swapMs: 520, pauseMs: 160 };
  if (round === 3) return { numCaps: 3, numSwaps: 5, swapMs: 440, pauseMs: 140 };
  if (round === 4) return { numCaps: 3, numSwaps: 6, swapMs: 380, pauseMs: 120 };
  if (round === 5) return { numCaps: 4, numSwaps: 5, swapMs: 420, pauseMs: 140 };
  if (round === 6) return { numCaps: 4, numSwaps: 7, swapMs: 360, pauseMs: 120 };
  if (round === 7) return { numCaps: 4, numSwaps: 8, swapMs: 310, pauseMs: 100 };
  const x = round - 8;
  return { numCaps: 5, numSwaps: Math.min(9 + x, 14), swapMs: Math.max(280 - x * 15, 180), pauseMs: Math.max(90 - x * 5, 50) };
}

function genSwaps(count, n) {
  const s = [];
  let last = -1;
  for (let i = 0; i < count; i++) {
    let a, b;
    do {
      a = Math.floor(Math.random() * n);
      b = Math.floor(Math.random() * (n - 1));
      if (b >= a) b++;
    } while (a === last || b === last);
    s.push([a, b]);
    last = a;
  }
  return s;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function ShellGame({ onComplete }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const bestRef = useRef(getBest());
  const animRef = useRef(0);
  const sizeRef = useRef({ W: 0, H: 0, CX: 0, CY: 0 });

  const CAP_W = 90;
  const BALL_R = 12;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const slotX = useCallback((slot, numCaps) => {
    const W = sizeRef.current.W;
    const CX = sizeRef.current.CX;
    const spacing = Math.min(W * 0.22, 100);
    const totalW = (numCaps - 1) * spacing;
    return CX - totalW / 2 + slot * spacing;
  }, []);

  const drawGrass = useCallback((ctx) => {
    const { W, H, CX, CY } = sizeRef.current;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#1a5c2a'); g.addColorStop(0.3, '#2a7040');
    g.addColorStop(0.6, '#1e6030'); g.addColorStop(1, '#154820');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.06;
    for (let y = 0; y < H; y += 30) {
      if ((Math.floor(y / 30) % 2) === 0) { ctx.fillStyle = '#fff'; ctx.fillRect(0, y, W, 15); }
    }
    ctx.globalAlpha = 1;
    const vg = ctx.createRadialGradient(CX, CY, W * 0.2, CX, CY, W * 0.9);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }, []);

  const drawBall = useCallback((ctx, x, y, size) => {
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x, y + size * 0.85, size * 0.6, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
    const bg = ctx.createRadialGradient(x - size * 0.3, y - size * 0.35, size * 0.05, x + size * 0.1, y + size * 0.1, size * 1.1);
    bg.addColorStop(0, '#fffff8'); bg.addColorStop(0.25, '#f8f4ec'); bg.addColorStop(0.6, '#ede6d6');
    bg.addColorStop(0.85, '#d8ceb8'); bg.addColorStop(1, '#c0b8a4');
    ctx.fillStyle = bg; ctx.fill();
    ctx.strokeStyle = 'rgba(140,120,90,0.35)'; ctx.lineWidth = size * 0.06; ctx.stroke();
    ctx.strokeStyle = '#cc1818'; ctx.lineWidth = size * 0.09; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - size * 0.42, y - size * 0.7);
    ctx.bezierCurveTo(x - size * 0.58, y - size * 0.25, x - size * 0.48, y + size * 0.25, x - size * 0.42, y + size * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.42, y - size * 0.7);
    ctx.bezierCurveTo(x + size * 0.58, y - size * 0.25, x + size * 0.48, y + size * 0.25, x + size * 0.42, y + size * 0.7);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(x - size * 0.22, y - size * 0.28, size * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill();
    ctx.restore();
  }, []);

  const drawBucket = useCallback((ctx, x, y, w, liftY) => {
    const cy = y + liftY;
    const scale = w / 90;
    const topW = 28 * scale, botW = 42 * scale, bH = 72 * scale, rimH = 6 * scale, cornerR = 3 * scale;
    ctx.save(); ctx.translate(x, cy);

    const shadowY = -liftY;
    const ss = 1 + Math.abs(liftY) * 0.008;
    ctx.beginPath(); ctx.ellipse(0, shadowY + bH * 0.5 + 6, botW * 1.1 * ss, 14 * scale * ss, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0.06, 0.30 - Math.abs(liftY) * 0.003)})`; ctx.fill();

    function bp() {
      ctx.beginPath();
      ctx.moveTo(-topW + cornerR, -bH * 0.5); ctx.lineTo(topW - cornerR, -bH * 0.5);
      ctx.quadraticCurveTo(topW, -bH * 0.5, topW + 1 * scale, -bH * 0.5 + cornerR);
      ctx.lineTo(botW, bH * 0.5 - rimH);
      ctx.quadraticCurveTo(botW + 0.5 * scale, bH * 0.5 - rimH + cornerR, botW - 1 * scale, bH * 0.5 - rimH + cornerR);
      ctx.lineTo(-botW + 1 * scale, bH * 0.5 - rimH + cornerR);
      ctx.quadraticCurveTo(-botW - 0.5 * scale, bH * 0.5 - rimH + cornerR, -botW, bH * 0.5 - rimH);
      ctx.lineTo(-topW - 1 * scale, -bH * 0.5 + cornerR);
      ctx.quadraticCurveTo(-topW, -bH * 0.5, -topW + cornerR, -bH * 0.5);
      ctx.closePath();
    }

    bp();
    const bodyG = ctx.createLinearGradient(-botW, 0, botW, 0);
    bodyG.addColorStop(0, '#f0e8d8'); bodyG.addColorStop(0.15, '#f8f2e6'); bodyG.addColorStop(0.5, '#faf6ee');
    bodyG.addColorStop(0.85, '#f0eadc'); bodyG.addColorStop(1, '#e4dccb');
    ctx.fillStyle = bodyG; ctx.fill();

    ctx.save(); bp(); ctx.clip();
    const numStripes = 16;
    for (let i = 0; i < numStripes; i++) {
      if (i % 2 === 0) continue;
      const t1 = i / numStripes, t2 = (i + 1) / numStripes;
      const tL = -topW + t1 * topW * 2, tR = -topW + t2 * topW * 2;
      const bL = -botW + t1 * botW * 2, bR = -botW + t2 * botW * 2;
      ctx.beginPath(); ctx.moveTo(tL, -bH * 0.5); ctx.lineTo(bL, bH * 0.5);
      ctx.lineTo(bR, bH * 0.5); ctx.lineTo(tR, -bH * 0.5); ctx.closePath();
      const sg = ctx.createLinearGradient((tL + bL) / 2, 0, (tR + bR) / 2, 0);
      sg.addColorStop(0, '#c01030'); sg.addColorStop(0.5, '#e01e3e'); sg.addColorStop(1, '#b80e2a');
      ctx.fillStyle = sg; ctx.fill();
    }
    ctx.restore();

    bp(); ctx.strokeStyle = 'rgba(100,60,30,0.25)'; ctx.lineWidth = 1.5 * scale; ctx.stroke();

    // Rim
    ctx.beginPath(); ctx.ellipse(0, bH * 0.5 - rimH * 0.1, botW + 2 * scale, rimH * 1.3, 0, 0, Math.PI * 2);
    const rimG = ctx.createRadialGradient(0, bH * 0.5, rimH * 0.3, 0, bH * 0.5, botW + 4 * scale);
    rimG.addColorStop(0, '#e8e0d0'); rimG.addColorStop(0.5, '#ddd5c2'); rimG.addColorStop(1, '#c5bca8');
    ctx.fillStyle = rimG; ctx.fill();

    // Top
    ctx.beginPath(); ctx.ellipse(0, -bH * 0.5, topW + 0.5 * scale, 6.5 * scale, 0, 0, Math.PI * 2);
    const baseG = ctx.createRadialGradient(-3 * scale, -bH * 0.5 - 1 * scale, 2 * scale, 0, -bH * 0.5, topW);
    baseG.addColorStop(0, '#f0e8d8'); baseG.addColorStop(0.6, '#e0d8c6'); baseG.addColorStop(1, '#d0c8b4');
    ctx.fillStyle = baseG; ctx.fill();

    // POPCORN band
    const bandY = bH * 0.08;
    const bandH2 = 13 * scale;
    const bandTW = topW + (botW - topW) * 0.55;
    const bandBW = topW + (botW - topW) * 0.62;
    ctx.beginPath(); ctx.moveTo(-bandTW, bandY - bandH2 / 2); ctx.lineTo(-bandBW, bandY + bandH2 / 2);
    ctx.lineTo(bandBW, bandY + bandH2 / 2); ctx.lineTo(bandTW, bandY - bandH2 / 2); ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();
    ctx.save(); ctx.translate(0, bandY + 0.5 * scale); ctx.rotate(Math.PI);
    ctx.fillStyle = '#c01030'; ctx.font = `900 ${9.5 * scale}px 'Arial Black','Impact',sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('POPCORN', 0, 0);
    ctx.restore();

    ctx.restore();
  }, []);

  const startRound = useCallback((round, streak) => {
    const diff = getDiff(round);
    stateRef.current = {
      round, streak, diff, phase: 'reveal', numCaps: diff.numCaps,
      capSlots: Array.from({ length: diff.numCaps }, (_, i) => i),
      ballUnder: Math.floor(Math.random() * diff.numCaps),
      liftAmounts: new Array(diff.numCaps).fill(0),
      ballVisible: true, swaps: genSwaps(diff.numSwaps, diff.numCaps),
      swapIndex: 0, swapProgress: 0, swapStartTime: 0,
      pickedSlot: null, revealOrder: [], revealIndex: 0,
      revealTimer: 0, phaseTimer: performance.now() + 1400,
    };
    stateRef.current.liftAmounts[stateRef.current.ballUnder] = -60;
  }, []);

  const handlePick = useCallback((slot) => {
    const s = stateRef.current;
    if (!s || s.phase !== 'picking') return;
    s.phase = 'revealing'; s.pickedSlot = slot;
    const ballSlot = s.capSlots[s.ballUnder];
    const correct = slot === ballSlot;
    const allSlots = Array.from({ length: s.numCaps }, (_, i) => i);
    const wrongSlots = allSlots.filter(sl => sl !== ballSlot && sl !== slot);
    if (correct) { s.revealOrder = [...wrongSlots, slot]; }
    else {
      const otherWrong = wrongSlots.filter(sl => sl !== slot);
      s.revealOrder = [...otherWrong, slot, ballSlot];
    }
    s.revealIndex = 0; s.revealTimer = performance.now() + 400;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let gameoverShown = false;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      sizeRef.current = { W, H, CX: W / 2, CY: H * 0.48 };
    }
    resize();
    window.addEventListener('resize', resize);
    startRound(1, 0);

    function frame(now) {
      animRef.current = requestAnimationFrame(frame);
      const s = stateRef.current;
      if (!s) return;
      const { CY } = sizeRef.current;

      if (s.phase === 'reveal' && now >= s.phaseTimer) { s.phase = 'covering'; s.phaseTimer = now + 450; }
      if (s.phase === 'covering') {
        const t = 1 - Math.max(0, (s.phaseTimer - now) / 450);
        s.liftAmounts[s.ballUnder] = -60 * (1 - easeInOut(t));
        if (t >= 1) { s.liftAmounts[s.ballUnder] = 0; s.ballVisible = false; s.phase = 'shuffling'; s.swapIndex = 0; s.swapStartTime = now + 300; s.swapProgress = 0; }
      }
      if (s.phase === 'shuffling') {
        if (s.swapIndex >= s.swaps.length) { s.phase = 'picking'; }
        else if (now >= s.swapStartTime) { s.swapProgress = Math.min((now - s.swapStartTime) / s.diff.swapMs, 1); }
        if (s.swapProgress >= 1 && s.swapIndex < s.swaps.length) {
          const [a, b] = s.swaps[s.swapIndex];
          const cA = s.capSlots.indexOf(a), cB = s.capSlots.indexOf(b);
          if (cA !== -1) s.capSlots[cA] = b; if (cB !== -1) s.capSlots[cB] = a;
          s.swapIndex++; s.swapProgress = 0; s.swapStartTime = now + s.diff.pauseMs;
        }
      }
      if (s.phase === 'revealing' && now >= s.revealTimer) {
        if (s.revealIndex < s.revealOrder.length) {
          const revealSlot = s.revealOrder[s.revealIndex];
          const capIdx = s.capSlots.indexOf(revealSlot);
          if (capIdx !== -1) s.liftAmounts[capIdx] = -55;
          s.ballVisible = true; s.revealIndex++;
          s.revealTimer = now + (s.revealIndex >= s.revealOrder.length ? 1200 : 500);
        } else {
          const correct = s.pickedSlot === s.capSlots[s.ballUnder];
          if (correct) {
            const ns = s.streak + 1;
            bestRef.current = Math.max(bestRef.current, ns); saveBest(bestRef.current);
            setTimeout(() => startRound(s.round + 1, ns), 600);
          } else {
            bestRef.current = Math.max(bestRef.current, s.streak); saveBest(bestRef.current);
            s.phase = 'gameover';
          }
        }
      }

      drawGrass(ctx);
      const positions = [];
      for (let i = 0; i < s.numCaps; i++) {
        let slot = s.capSlots[i]; let px = slotX(slot, s.numCaps); let arcY = 0;
        if (s.phase === 'shuffling' && s.swapIndex < s.swaps.length) {
          const [a, b] = s.swaps[s.swapIndex];
          if (slot === a || slot === b) {
            const target = slot === a ? b : a;
            const from = slotX(slot, s.numCaps), to = slotX(target, s.numCaps);
            const t = easeInOut(s.swapProgress); px = from + (to - from) * t;
            const arcH = 35 + Math.abs(to - from) * 0.15;
            arcY = slot === a ? -arcH * Math.sin(t * Math.PI) : arcH * 0.2 * Math.sin(t * Math.PI);
          }
        }
        positions.push({ x: px, y: CY + arcY, capIdx: i, liftY: s.liftAmounts[i] });
      }
      positions.sort((a, b) => (a.y + a.liftY) - (b.y + b.liftY));
      if (s.ballVisible) {
        const bc = positions.find(p => p.capIdx === s.ballUnder);
        if (bc) drawBall(ctx, bc.x, bc.y + 30, BALL_R);
      }
      for (const p of positions) {
        if (s.phase === 'picking') {
          ctx.save(); ctx.beginPath();
          ctx.ellipse(p.x, p.y + p.liftY, CAP_W * 0.5, CAP_W * 0.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,215,0,0.08)'; ctx.fill(); ctx.restore();
        }
        drawBucket(ctx, p.x, p.y, CAP_W, p.liftY);
      }

      if (s.phase === 'gameover' && !gameoverShown) {
        gameoverShown = true;
        const overlay = document.createElement('div');
        overlay.className = 'shell-gameover-overlay';
        const isNew = s.streak > 0 && s.streak >= bestRef.current;
        overlay.innerHTML = `
          <div class="shell-go-title">${s.streak === 0 ? 'Not this time!' : s.streak + ' in a row!'}</div>
          ${s.streak > 0 ? `<div class="shell-go-best ${isNew ? 'new-record' : ''}">${isNew ? 'NEW RECORD!' : 'Best: ' + bestRef.current}</div>` : ''}
          <button class="shell-go-btn">Back to Practice</button>`;
        canvas.parentElement.appendChild(overlay);
        overlay.querySelector('button').addEventListener('click', onComplete);
      }
    }

    function onCanvasClick(e) {
      const s = stateRef.current;
      if (!s || s.phase !== 'picking') return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      for (let slot = 0; slot < s.numCaps; slot++) {
        const sx = slotX(slot, s.numCaps);
        if (Math.abs(cx - sx) < CAP_W * 0.6) { handlePick(slot); break; }
      }
    }
    canvas.addEventListener('click', onCanvasClick);
    animRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', onCanvasClick);
      cancelAnimationFrame(animRef.current);
    };
  }, [DPR, CAP_W, BALL_R, startRound, handlePick, drawGrass, drawBall, drawBucket, slotX, onComplete]);

  return (
    <div className="shell-game-wrapper">
      <canvas ref={canvasRef} />
      <div className="shell-ui-overlay">
        <div className="shell-ui-header">
          <div className="shell-ui-streak" />
          <div className="shell-ui-best">Best: {bestRef.current}</div>
        </div>
      </div>
    </div>
  );
}
