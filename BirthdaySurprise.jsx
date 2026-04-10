import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TRIPS = {
  france: {
    name: "Frankrijk",
    subtitle: "5 dagen \u00B7 Normandi\u00EB & Mont Saint-Michel",
    color: "#1B2A4A",
    accent: "#C9A84C",
    stops: [
      { day: 1, name: "Vertrek", desc: "Richting zuidwest, lunchstop onderweg" },
      { day: 2, name: "Honfleur", desc: "Betoverend havenstadje, impressionistische sfeer" },
      { day: 3, name: "D-Day Stranden", desc: "Omaha Beach, kliffen & herdenkingen" },
      { day: 4, name: "Mont Saint-Michel", desc: "De iconische abdij bij zonsondergang" },
      { day: 5, name: "Chartres & terug", desc: "Kathedraal bezoeken, dan naar huis" },
    ],
    routePath: "M 20,90 C 50,70 80,45 110,52 C 140,60 150,30 180,22 C 195,18 205,35 210,55",
    markers: [
      { x: 20, y: 90 },
      { x: 67, y: 55 },
      { x: 115, y: 50 },
      { x: 168, y: 25 },
      { x: 210, y: 55 },
    ],
  },
  germany: {
    name: "Duitsland",
    subtitle: "5 dagen \u00B7 Zwarte Woud & Sekt Regio",
    color: "#2D3B2D",
    accent: "#D4953A",
    stops: [
      { day: 1, name: "Rheingau", desc: "Aankomst in de Sekt- en wijnregio" },
      { day: 2, name: "Wijnhuizen", desc: "Sekt proeven, wijngaard wandelingen" },
      { day: 3, name: "Heidelberg", desc: "Schilderachtige route naar het zuiden" },
      { day: 4, name: "Zwarte Woud", desc: "Triberg watervallen, koekoeksklokken, Kirschtorte" },
      { day: 5, name: "Freiburg & terug", desc: "Freiburg verkennen, dan naar huis" },
    ],
    routePath: "M 20,35 C 50,45 70,85 100,92 C 130,100 150,72 180,62 C 195,58 205,82 210,102",
    markers: [
      { x: 20, y: 35 },
      { x: 60, y: 60 },
      { x: 100, y: 90 },
      { x: 170, y: 65 },
      { x: 210, y: 100 },
    ],
  },
};

// ─── Colors ──────────────────────────────────────────────────────────────────

const C = {
  bg: '#1A1A2E',
  cream: '#FAF3E0',
  creamDim: 'rgba(232,213,183,0.6)',
  creamFaint: 'rgba(232,213,183,0.4)',
  gold: '#D4A853',
  goldDim: 'rgba(212,168,83,0.2)',
  goldFaint: 'rgba(212,168,83,0.15)',
};

const PARTICLE_COLORS = ['#D4A853', '#F5D48B', '#FAF3E0', '#C9A84C', '#E8B960', '#F0C674', '#FFF9E3', '#A08040'];

// ─── Styles (injected once) ─────────────────────────────────────────────────

const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@700&display=swap');

:root {
  --box-size: min(38vw, 140px);
  --half-size: calc(var(--box-size) / 2);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; }
body { background: ${C.bg}; -webkit-tap-highlight-color: transparent; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

.grain-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.03; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.orb {
  position: absolute; border-radius: 50%; filter: blur(60px);
  opacity: 0; transition: opacity 2s ease; will-change: transform;
}
.orb-1 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%); top: -10%; left: -20%; animation: drift1 25s infinite alternate ease-in-out; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%); bottom: -10%; right: -20%; animation: drift2 30s infinite alternate ease-in-out; }
.orb-3 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%); top: 40%; left: 60%; animation: drift3 20s infinite alternate ease-in-out; }
@keyframes drift1 { to { transform: translate(15vw, 15vh); } }
@keyframes drift2 { to { transform: translate(-20vw, -10vh); } }
@keyframes drift3 { to { transform: translate(-10vw, 20vh); } }

.orb-visible { opacity: 1 !important; }

.btn-glow {
  box-shadow: inset 0 0 20px rgba(212,168,83,0.1);
  transition: all 0.3s ease;
}
.btn-glow:active { box-shadow: inset 0 0 30px rgba(212,168,83,0.3); border-color: #F5D48B; }

@keyframes btnPulse {
  0%, 100% { box-shadow: inset 0 0 20px rgba(212,168,83,0.1), 0 0 0 0 rgba(212,168,83,0.2); }
  50% { box-shadow: inset 0 0 20px rgba(212,168,83,0.1), 0 0 20px 4px rgba(212,168,83,0.15); }
}

.scene {
  perspective: 800px; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center; position: relative;
}

.box-wrapper {
  position: absolute;
  width: var(--box-size); height: var(--box-size);
  transform-style: preserve-3d; cursor: pointer;
  will-change: transform;
  transition: opacity 0.5s ease, filter 0.5s ease;
}

.box-fr { left: calc(50% - var(--box-size) - 10px); top: calc(50% - var(--half-size) - 20px); animation: hoverFloat 4s infinite ease-in-out, idleSpinFr 5.5s infinite ease-in-out; }
.box-de { left: calc(50% + 10px); top: calc(50% - var(--half-size) + 20px); animation: hoverFloat 4.2s infinite ease-in-out 1s, idleSpinDe 6s infinite ease-in-out; }

@keyframes hoverFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes idleSpinFr { 0%, 100% { transform: rotateY(-5deg); } 50% { transform: rotateY(5deg); } }
@keyframes idleSpinDe { 0%, 100% { transform: rotateY(5deg); } 50% { transform: rotateY(-5deg); } }

.box-wrapper.selected { animation: none !important; }
.box-wrapper.dismissed { opacity: 0 !important; filter: blur(4px) !important; transform: scale(0.85) !important; pointer-events: none; }

.face {
  position: absolute;
  width: var(--box-size); height: var(--box-size);
  backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
}

.face-front  { transform: translateZ(var(--half-size)); }
.face-back   { transform: rotateY(180deg) translateZ(var(--half-size)); }
.face-left   { transform: rotateY(-90deg) translateZ(var(--half-size)); }
.face-right  { transform: rotateY(90deg) translateZ(var(--half-size)); }
.face-bottom { transform: rotateX(-90deg) translateZ(var(--half-size)); }

.lid-group {
  position: absolute;
  width: var(--box-size); height: var(--box-size);
  transform-style: preserve-3d;
  transform-origin: center top;
  transform: translateZ(var(--half-size));
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lid-group.opened { transform: translateZ(var(--half-size)) rotateX(-120deg); }

.face-top {
  transform: rotateX(90deg) translateZ(0) translateY(calc(var(--half-size) * -1));
  transform-origin: top center;
}

.bow-svg {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) translateZ(2px);
  width: 40px; height: 40px; z-index: 10;
}

.fr-front  { background: #1B2A4A; }
.fr-right  { background: #162240; }
.fr-left   { background: #111B36; }
.fr-back   { background: #0E162C; }
.fr-top    { background: #203360; }
.fr-bottom { background: #0E162C; }

.de-front  { background: #2D3B2D; }
.de-right  { background: #253225; }
.de-left   { background: #1F2B1F; }
.de-back   { background: #1A241A; }
.de-top    { background: #354835; }
.de-bottom { background: #1A241A; }

.ribbon-h, .ribbon-v {
  position: absolute; opacity: 0.85;
}
.ribbon-v { width: 3px; height: 100%; left: 50%; transform: translateX(-50%); }
.ribbon-h { height: 3px; width: 100%; top: 50%; transform: translateY(-50%); }

.box-shadow-el {
  position: absolute; width: var(--box-size); height: var(--box-size);
  background: transparent;
  transform: translateZ(calc(var(--half-size) * -1)) rotateX(90deg) translateY(calc(var(--half-size) * 1.5));
  filter: blur(10px);
}

@keyframes bowBreathe {
  0%, 100% { transform: translate(-50%, -50%) translateZ(2px) scaleX(1); }
  50% { transform: translate(-50%, -50%) translateZ(2px) scaleX(1.03); }
}

.cursor-blink { animation: blink 1s step-end infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.route-draw {
  transition: stroke-dashoffset 2.5s ease-in-out;
}

.scroll-container::-webkit-scrollbar { width: 0; }

.final-line {
  width: 64px; height: 1px; background: ${C.goldDim};
  transform-origin: center; transform: scaleX(0);
  transition: transform 1.5s ease;
}
.final-line.visible { transform: scaleX(1); }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ─── Audio Hook ──────────────────────────────────────────────────────────────

function useAudio() {
  const ctxRef = useRef(null);

  const init = useCallback(() => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    } catch (e) { /* silent */ }
  }, []);

  const playChime = useCallback((freq1 = 523.25, freq2 = 783.99, decay = 1.5, gain0 = 0.06) => {
    try {
      const ac = ctxRef.current; if (!ac) return;
      const t = ac.currentTime;
      const master = ac.createGain();
      master.gain.setValueAtTime(gain0, t);
      master.gain.exponentialRampToValueAtTime(0.001, t + decay);

      // Reverb via delay taps
      const delays = [0.1, 0.2, 0.35];
      const delayGains = [0.03, 0.015, 0.007];
      const dryGain = ac.createGain();
      dryGain.gain.value = 1;
      master.connect(dryGain);
      dryGain.connect(ac.destination);

      delays.forEach((d, i) => {
        const delay = ac.createDelay();
        delay.delayTime.value = d;
        const g = ac.createGain();
        g.gain.value = delayGains[i];
        master.connect(delay);
        delay.connect(g);
        g.connect(ac.destination);
      });

      [freq1, freq2].forEach(f => {
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(master);
        osc.start(t);
        osc.stop(t + decay);
      });
    } catch (e) { /* silent */ }
  }, []);

  const playTick = useCallback(() => {
    try {
      const ac = ctxRef.current; if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'triangle'; osc.frequency.value = 1200;
      g.gain.setValueAtTime(0.03, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(g); g.connect(ac.destination);
      osc.start(t); osc.stop(t + 0.04);
    } catch (e) { /* silent */ }
  }, []);

  const playBoxTap = useCallback(() => {
    try {
      const ac = ctxRef.current; if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'triangle'; osc.frequency.value = 800;
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(g); g.connect(ac.destination);
      osc.start(t); osc.stop(t + 0.04);
    } catch (e) { /* silent */ }
  }, []);

  const playUnwrap = useCallback(() => {
    try {
      const ac = ctxRef.current; if (!ac) return;
      const t = ac.currentTime;
      // White noise burst
      const bufLen = Math.floor(ac.sampleRate * 0.08);
      const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ac.createBufferSource();
      noise.buffer = buf;
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 1.5;
      const ng = ac.createGain();
      ng.gain.setValueAtTime(0.07, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      noise.connect(bp); bp.connect(ng); ng.connect(ac.destination);
      noise.start(t);
      // Sine sweep
      const osc = ac.createOscillator();
      const sg = ac.createGain();
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
      sg.gain.setValueAtTime(0.07, t);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(sg); sg.connect(ac.destination);
      osc.start(t); osc.stop(t + 0.2);
    } catch (e) { /* silent */ }
  }, []);

  const playFinalChime = useCallback(() => {
    playChime(261.63, 392.00, 3, 0.05);
  }, [playChime]);

  return { init, playChime, playTick, playBoxTap, playUnwrap, playFinalChime };
}

// ─── Particle System ─────────────────────────────────────────────────────────

function useParticles(canvasRef) {
  const particles = useRef([]);
  const frameId = useRef(null);
  const continuousTimers = useRef([]);
  const isLowEnd = useMemo(() => (navigator.hardwareConcurrency || 4) < 4, []);
  const maxParticles = isLowEnd ? 60 : 120;

  const drawStar = useCallback((ctx, x, y, points, outerR, innerR) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }, []);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const now = performance.now();
    const arr = particles.current;

    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.999;
      p.rotation += p.rotationSpeed;
      p.age++;

      const lifeRatio = p.age / p.maxLife;
      if (lifeRatio >= 1 || p.y > h + 20 || p.x < -20 || p.x > w + 20) {
        arr.splice(i, 1);
        continue;
      }

      // Twinkle
      const twinkle = 0.5 + 0.5 * Math.sin(now * 0.005 * p.twinkleSpeed + p.twinklePhase);
      // Light catch
      const lightCatch = Math.abs(Math.cos(p.rotation));
      const baseAlpha = 1 - lifeRatio;
      const alpha = baseAlpha * twinkle * (0.5 + 0.5 * lightCatch);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'star4') {
        drawStar(ctx, 0, 0, 4, p.size, p.size * 0.4);
        ctx.fill();
      } else if (p.shape === 'star6') {
        drawStar(ctx, 0, 0, 6, p.size, p.size * 0.5);
        ctx.fill();
      } else {
        // ribbon — small rectangle
        ctx.fillRect(-p.size, -p.size * 0.3, p.size * 2, p.size * 0.6);
      }

      // Trail (skip on low-end)
      if (p.trail && !isLowEnd && p.history.length > 1) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let j = 0; j < p.history.length; j++) {
          const h = p.history[j];
          j === 0 ? ctx.moveTo(h.x - p.x, h.y - p.y) : ctx.lineTo(h.x - p.x, h.y - p.y);
        }
        ctx.stroke();
      }

      ctx.restore();

      // Update history for trail
      if (p.trail) {
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 5) p.history.shift();
      }
    }

    frameId.current = requestAnimationFrame(loop);
  }, [canvasRef, isLowEnd, drawStar]);

  const ensureLoop = useCallback(() => {
    if (!frameId.current) frameId.current = requestAnimationFrame(loop);
  }, [loop]);

  const createParticle = useCallback((x, y, opts = {}) => {
    if (particles.current.length >= maxParticles) return;
    const shapeRoll = Math.random();
    let shape;
    if (shapeRoll < 0.4) shape = 'star4';
    else if (shapeRoll < 0.65) shape = 'star6';
    else if (shapeRoll < 0.85) shape = 'circle';
    else shape = 'ribbon';

    particles.current.push({
      x, y,
      vx: opts.vx ?? (Math.random() - 0.5) * 2,
      vy: opts.vy ?? -1 - Math.random() * 2,
      gravity: opts.gravity ?? 0.03,
      size: opts.size ?? 2 + Math.random() * 6,
      shape: opts.shape ?? shape,
      color: opts.color ?? PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      age: 0,
      maxLife: opts.maxLife ?? 60 + Math.random() * 80,
      twinkleSpeed: 1 + Math.random() * 3,
      twinklePhase: Math.random() * Math.PI * 2,
      trail: !isLowEnd && Math.random() < 0.3,
      history: [],
    });
  }, [maxParticles, isLowEnd]);

  const burst = useCallback((x, y, count, opts = {}) => {
    if (prefersReducedMotion()) return;
    const actual = isLowEnd ? Math.floor(count / 2) : count;
    for (let i = 0; i < actual; i++) {
      createParticle(x, y, {
        vx: (Math.random() - 0.5) * (opts.spread ?? 8),
        vy: opts.vy ?? -(2 + Math.random() * 4),
        gravity: opts.gravity ?? 0.08,
        maxLife: opts.maxLife ?? 50 + Math.random() * 60,
        ...opts,
      });
    }
    ensureLoop();
  }, [createParticle, ensureLoop, isLowEnd]);

  const shower = useCallback((count, opts = {}) => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const actual = isLowEnd ? Math.floor(count / 2) : count;
    for (let i = 0; i < actual; i++) {
      createParticle(Math.random() * canvas.width, -10, {
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 1.5,
        gravity: 0.01,
        maxLife: 120 + Math.random() * 80,
        ...opts,
      });
    }
    ensureLoop();
  }, [canvasRef, createParticle, ensureLoop, isLowEnd]);

  const continuous = useCallback((rate, opts = {}) => {
    if (prefersReducedMotion()) return () => {};
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const interval = 1000 / rate;
    const id = setInterval(() => {
      const x = opts.x ?? Math.random() * canvas.width;
      const y = opts.y ?? -10;
      createParticle(x, y, {
        vx: (Math.random() - 0.5) * 0.5,
        vy: opts.vy ?? 0.3 + Math.random() * 0.8,
        gravity: 0.005,
        maxLife: 100 + Math.random() * 80,
        size: 2 + Math.random() * 3,
        ...opts,
      });
      ensureLoop();
    }, interval);
    continuousTimers.current.push(id);
    return () => clearInterval(id);
  }, [canvasRef, createParticle, ensureLoop]);

  const clear = useCallback(() => {
    particles.current = [];
    continuousTimers.current.forEach(clearInterval);
    continuousTimers.current = [];
  }, []);

  // Start loop on mount
  useEffect(() => {
    ensureLoop();
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      frameId.current = null;
      continuousTimers.current.forEach(clearInterval);
    };
  }, [ensureLoop]);

  return { burst, shower, continuous, clear };
}

// ─── Bow SVG ─────────────────────────────────────────────────────────────────

const BowSvg = ({ color }) => (
  <svg className="bow-svg" viewBox="0 0 100 100" fill="none" style={{ animation: 'bowBreathe 2s ease-in-out infinite' }}>
    {/* Left loop */}
    <path d="M50 50C35 30 10 35 18 55C26 75 45 60 50 50Z" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.15" />
    {/* Right loop */}
    <path d="M50 50C65 30 90 35 82 55C74 75 55 60 50 50Z" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.15" />
    {/* Tails */}
    <path d="M46 52L32 82" stroke={color} strokeWidth="3" strokeLinecap="round" style={{ animation: 'none', transformOrigin: '46px 52px' }} />
    <path d="M54 52L68 82" stroke={color} strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: '54px 52px' }} />
    {/* Center knot */}
    <circle cx="50" cy="50" r="6" fill={color} />
  </svg>
);

// ─── Gift Box Component ──────────────────────────────────────────────────────

const GiftBox = React.forwardRef(({ tripKey, className, label, ribbonColor, materialPrefix, onSelect, dismissed, selected, lidOpen, ariaLabel }, ref) => {
  const boxRef = useRef(null);
  React.useImperativeHandle(ref, () => boxRef.current);

  const ribbon = (
    <>
      <div className="ribbon-v" style={{ background: ribbonColor }} />
      <div className="ribbon-h" style={{ background: ribbonColor }} />
    </>
  );

  return (
    <button
      ref={boxRef}
      className={`box-wrapper ${className} ${dismissed ? 'dismissed' : ''} ${selected ? 'selected' : ''}`}
      onClick={() => !dismissed && onSelect(tripKey, boxRef)}
      aria-label={ariaLabel}
      style={{
        border: 'none', background: 'none', outline: 'none', padding: 0,
        touchAction: 'manipulation',
        filter: dismissed ? undefined : `drop-shadow(0 12px 24px ${tripKey === 'france' ? 'rgba(27,42,74,0.4)' : 'rgba(45,59,45,0.4)'})`,
        ...(selected ? {
          left: 'calc(50% - var(--half-size))',
          top: 'calc(50% - var(--half-size))',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } : {}),
      }}
    >
      <div className="box-shadow-el" style={{ boxShadow: `0 30px 40px ${tripKey === 'france' ? 'rgba(27,42,74,0.5)' : 'rgba(45,59,45,0.5)'}` }} />
      <div className={`face face-back ${materialPrefix}-back`}>{ribbon}</div>
      <div className={`face face-left ${materialPrefix}-left`}>{ribbon}</div>
      <div className={`face face-right ${materialPrefix}-right`}>{ribbon}</div>
      <div className={`face face-bottom ${materialPrefix}-bottom`} />
      <div className={`face face-front ${materialPrefix}-front`}>{ribbon}</div>
      <div className={`lid-group ${lidOpen ? 'opened' : ''}`}>
        <div className={`face face-top ${materialPrefix}-top`}>
          {ribbon}
          <BowSvg color={ribbonColor} />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: '-28px', left: 0, right: 0, textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.12em',
          textTransform: 'lowercase', color: C.creamFaint,
        }}>{label}</span>
      </div>
    </button>
  );
});

// ─── Splash Phase ────────────────────────────────────────────────────────────

function SplashPhase({ onOpen, sparkles, audio }) {
  const [orbsVisible, setOrbsVisible] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [happyVisible, setHappyVisible] = useState(false);
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);

  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOrbsVisible(true); setLineVisible(true); setHappyVisible(true);
      setBirthdayVisible(true); setSubtitleVisible(true); setBtnVisible(true);
      return;
    }
    let cancelled = false;
    (async () => {
      await sleep(300); if (cancelled) return;
      setOrbsVisible(true);
      sparkles.shower(15);
      await sleep(500); if (cancelled) return;
      setLineVisible(true);
      audio.playChime(523.25, 783.99, 1.5, 0.06);
      await sleep(400); if (cancelled) return;
      setHappyVisible(true);
      await sleep(300); if (cancelled) return;
      setBirthdayVisible(true);
      await sleep(300); if (cancelled) return;
      sparkles.burst(window.innerWidth / 2, window.innerHeight * 0.35, 40);
      await sleep(400); if (cancelled) return;
      setSubtitleVisible(true);
      await sleep(1000); if (cancelled) return;
      setBtnVisible(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const splashLineStyle = {
    position: 'absolute', width: '100%', height: '1px',
    background: `${C.gold}99`, transformOrigin: 'center',
    transform: lineVisible ? 'scaleX(1)' : 'scaleX(0)',
    transition: 'transform 0.8s ease-out',
    top: '50%',
  };

  return (
    <section style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className={`orb orb-1 ${orbsVisible ? 'orb-visible' : ''}`} />
        <div className={`orb orb-2 ${orbsVisible ? 'orb-visible' : ''}`} />
        <div className={`orb orb-3 ${orbsVisible ? 'orb-visible' : ''}`} />
      </div>

      <div style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', width: '100%',
        padding: '0 24px', maxWidth: '384px',
      }}>
        <div style={splashLineStyle} />

        {/* "Happy" */}
        <div style={{ overflow: 'hidden', position: 'relative', height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
            fontSize: 'clamp(42px, 14vw, 80px)', color: C.cream, lineHeight: 1,
            letterSpacing: happyVisible ? '-0.02em' : '0.3em',
            opacity: happyVisible ? 1 : 0,
            transform: happyVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'all 1s ease-out',
          }}>Happy</h2>
        </div>

        {/* "Birthday" */}
        <div style={{ overflow: 'hidden', position: 'relative', height: '80px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
            fontSize: 'clamp(42px, 14vw, 80px)', color: C.cream, lineHeight: 1,
            letterSpacing: birthdayVisible ? '-0.02em' : '0.3em',
            opacity: birthdayVisible ? 1 : 0,
            transform: birthdayVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'all 1s ease-out',
          }}>Birthday</h2>
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '16px', textTransform: 'lowercase',
          color: C.creamDim, marginTop: '32px',
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.8s ease',
        }}>ik heb iets voor je</p>

        {/* CTA */}
        <button
          onClick={(e) => {
            audio.init();
            if (navigator.vibrate) navigator.vibrate(10);
            const rect = e.currentTarget.getBoundingClientRect();
            sparkles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
            onOpen();
          }}
          className="btn-glow"
          style={{
            marginTop: '48px', padding: '10px 32px', borderRadius: '9999px',
            border: `1px solid ${C.gold}`, background: 'transparent',
            fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500,
            color: '#E8D5B7', letterSpacing: '0.15em', textTransform: 'lowercase',
            cursor: 'pointer', touchAction: 'manipulation', minHeight: '44px',
            opacity: btnVisible ? 1 : 0,
            transform: btnVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            animation: btnVisible ? 'btnPulse 2.5s ease-in-out infinite' : 'none',
          }}
        >open</button>
      </div>
    </section>
  );
}

// ─── Choose Phase ────────────────────────────────────────────────────────────

function ChoosePhase({ onSelect, sparkles, audio }) {
  const [titleVisible, setTitleVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [boxesVisible, setBoxesVisible] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [dismissedBox, setDismissedBox] = useState(null);
  const frBoxRef = useRef(null);
  const deBoxRef = useRef(null);
  const sparkleStoppers = useRef([]);

  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setTitleVisible(true); setHintVisible(true); setBoxesVisible(true);
      return;
    }
    let cancelled = false;
    (async () => {
      await sleep(100); if (cancelled) return; setTitleVisible(true);
      await sleep(300); if (cancelled) return; setHintVisible(true);
      await sleep(200); if (cancelled) return; setBoxesVisible(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Continuous sparkles from boxes
  useEffect(() => {
    if (reduced || !boxesVisible) return;
    const startSparklesForBox = (boxRef, tripColor) => {
      return setInterval(() => {
        const el = boxRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width * (0.3 + Math.random() * 0.4);
        const y = rect.top + rect.height * 0.2;
        sparkles.burst(x, y, 1, {
          vy: -(0.5 + Math.random()),
          spread: 1,
          gravity: -0.01,
          maxLife: 40 + Math.random() * 30,
          size: 2 + Math.random() * 2,
        });
      }, 400);
    };
    const id1 = startSparklesForBox(frBoxRef, TRIPS.france.color);
    const id2 = startSparklesForBox(deBoxRef, TRIPS.germany.color);
    sparkleStoppers.current = [id1, id2];
    return () => { sparkleStoppers.current.forEach(clearInterval); };
  }, [boxesVisible, reduced, sparkles]);

  const handleSelect = useCallback(async (tripKey) => {
    if (selectedBox) return;
    if (navigator.vibrate) navigator.vibrate(15);
    audio.playBoxTap();
    sparkleStoppers.current.forEach(clearInterval);

    const other = tripKey === 'france' ? 'germany' : 'france';
    setDismissedBox(other);
    setSelectedBox(tripKey);
    setTitleVisible(false);
    setHintVisible(false);

    // Burst from dismissed box
    const dismissedRef = tripKey === 'france' ? deBoxRef : frBoxRef;
    if (dismissedRef.current) {
      const rect = dismissedRef.current.getBoundingClientRect();
      sparkles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, { spread: 6 });
    }

    await sleep(600);
    onSelect(tripKey);
  }, [selectedBox, audio, sparkles, onSelect]);

  return (
    <section style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start', paddingTop: '64px', padding: '64px 24px 48px',
      zIndex: 10,
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
        fontSize: 'clamp(22px, 6vw, 28px)', color: C.cream, textTransform: 'lowercase',
        width: '100%', maxWidth: '384px', textAlign: 'left',
        opacity: titleVisible ? 1 : 0,
        transform: titleVisible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'all 0.7s ease',
      }}>je mag er één kiezen</h2>

      <div className="scene" style={{ flex: 1, position: 'relative', width: '100%', maxWidth: '384px' }}>
        <GiftBox
          ref={frBoxRef}
          tripKey="france"
          className="box-fr"
          label="frankrijk"
          ribbonColor="#C9A84C"
          materialPrefix="fr"
          onSelect={handleSelect}
          dismissed={dismissedBox === 'france'}
          selected={selectedBox === 'france'}
          lidOpen={false}
          ariaLabel="Cadeau 1 — Frankrijk"
        />
        <GiftBox
          ref={deBoxRef}
          tripKey="germany"
          className="box-de"
          label="duitsland"
          ribbonColor="#D4953A"
          materialPrefix="de"
          onSelect={handleSelect}
          dismissed={dismissedBox === 'germany'}
          selected={selectedBox === 'germany'}
          lidOpen={false}
          ariaLabel="Cadeau 2 — Duitsland"
        />
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '14px', textTransform: 'lowercase',
        color: C.creamFaint, paddingBottom: '12px',
        opacity: hintVisible ? 1 : 0,
        transition: 'opacity 0.7s ease',
      }}>tik op je keuze</p>
    </section>
  );
}

// ─── Unwrap Phase ────────────────────────────────────────────────────────────

function UnwrapPhase({ tripKey, onComplete, sparkles, audio }) {
  const [lidOpen, setLidOpen] = useState(false);
  const [auraVisible, setAuraVisible] = useState(false);
  const [lightBeam, setLightBeam] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const boxRef = useRef(null);

  const trip = TRIPS[tripKey];
  const materialPrefix = tripKey === 'france' ? 'fr' : 'de';
  const ribbonColor = trip.accent;
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) { onComplete(); return; }
    let cancelled = false;
    (async () => {
      await sleep(300); if (cancelled) return;
      setAuraVisible(true);
      await sleep(200); if (cancelled) return;
      setLidOpen(true);
      audio.playUnwrap();
      // Burst upward from box
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        sparkles.burst(rect.left + rect.width / 2, rect.top, 45, {
          vy: -4, spread: 5, gravity: 0.06, maxLife: 70,
        });
      }
      await sleep(500); if (cancelled) return;
      setLightBeam(true);
      await sleep(800); if (cancelled) return;
      setDissolving(true);
      await sleep(200); if (cancelled) return;
      setLightBeam(false);
      await sleep(400); if (cancelled) return;
      onComplete();
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
      perspective: '800px',
    }}>
      {/* Aura glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 50%, ${trip.color}40 0%, transparent 60%)`,
        opacity: auraVisible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Light beam */}
      {lightBeam && (
        <div style={{
          position: 'absolute', left: '50%', bottom: '50%',
          width: '60px', height: '40vh', transform: 'translateX(-50%)',
          background: `linear-gradient(to top, ${C.gold}50, ${C.gold}20 30%, transparent 100%)`,
          animation: 'none',
          opacity: lightBeam ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }} />
      )}

      {/* Box */}
      <div
        ref={boxRef}
        style={{
          width: 'min(38vw, 140px)', height: 'min(38vw, 140px)',
          transformStyle: 'preserve-3d', position: 'relative',
          opacity: dissolving ? 0 : 1,
          transform: dissolving ? 'translateY(60px) scale(0.8)' : 'none',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className={`face face-back ${materialPrefix}-back`}>
          <div className="ribbon-v" style={{ background: ribbonColor }} />
          <div className="ribbon-h" style={{ background: ribbonColor }} />
        </div>
        <div className={`face face-left ${materialPrefix}-left`}>
          <div className="ribbon-v" style={{ background: ribbonColor }} />
          <div className="ribbon-h" style={{ background: ribbonColor }} />
        </div>
        <div className={`face face-right ${materialPrefix}-right`}>
          <div className="ribbon-v" style={{ background: ribbonColor }} />
          <div className="ribbon-h" style={{ background: ribbonColor }} />
        </div>
        <div className={`face face-bottom ${materialPrefix}-bottom`} />
        <div className={`face face-front ${materialPrefix}-front`}>
          <div className="ribbon-v" style={{ background: ribbonColor }} />
          <div className="ribbon-h" style={{ background: ribbonColor }} />
        </div>
        <div className={`lid-group ${lidOpen ? 'opened' : ''}`}>
          <div className={`face face-top ${materialPrefix}-top`}>
            <div className="ribbon-v" style={{ background: ribbonColor }} />
            <div className="ribbon-h" style={{ background: ribbonColor }} />
            <BowSvg color={ribbonColor} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reveal Phase ────────────────────────────────────────────────────────────

function RevealPhase({ tripKey, sparkles, audio }) {
  const trip = TRIPS[tripKey];
  const [typedTitle, setTypedTitle] = useState('');
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [routeDrawn, setRouteDrawn] = useState(false);
  const [visiblePins, setVisiblePins] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [finalVisible, setFinalVisible] = useState(false);
  const [finalLineVisible, setFinalLineVisible] = useState(false);
  const [routeLength, setRouteLength] = useState(600);

  const routeRef = useRef(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setTypedTitle(trip.name);
      setCursorVisible(false);
      setSubtitleVisible(true);
      setMapVisible(true);
      setRouteDrawn(true);
      setVisiblePins(trip.stops.map((_, i) => i));
      setVisibleCards(trip.stops.map((_, i) => i));
      setFinalVisible(true);
      setFinalLineVisible(true);
      return;
    }

    let cancelled = false;
    (async () => {
      await sleep(300); if (cancelled) return;
      // Particle burst
      sparkles.burst(window.innerWidth / 2, window.innerHeight * 0.3, 35, { spread: 6 });
      audio.playChime(523.25, 783.99, 1.5, 0.06);

      // Typewriter
      setCursorVisible(true);
      const title = trip.name;
      for (let i = 0; i < title.length; i++) {
        if (cancelled) return;
        setTypedTitle(title.slice(0, i + 1));
        if (i % 2 === 0) audio.playTick();
        await sleep(60);
      }
      setCursorBlink(true);

      await sleep(500); if (cancelled) return;
      setSubtitleVisible(true);

      await sleep(500); if (cancelled) return;
      setMapVisible(true);

      // Measure route length
      await sleep(100);
      if (routeRef.current) {
        try { setRouteLength(routeRef.current.getTotalLength()); } catch (e) {}
      }

      await sleep(100); if (cancelled) return;
      setRouteDrawn(true);

      // Staggered pin drops
      for (let i = 0; i < trip.stops.length; i++) {
        await sleep(500); if (cancelled) return;
        setVisiblePins(prev => [...prev, i]);
        audio.playTick();
      }

      // Staggered card reveals
      for (let i = 0; i < trip.stops.length; i++) {
        await sleep(600); if (cancelled) return;
        setVisibleCards(prev => [...prev, i]);
      }

      await sleep(1500); if (cancelled) return;
      setFinalLineVisible(true);

      await sleep(800); if (cancelled) return;
      setFinalVisible(true);
      audio.playFinalChime();
      sparkles.shower(25, { maxLife: 150 });

      // Gentle continuous shower
      sparkles.continuous(0.8, { maxLife: 120 });
    })();
    return () => { cancelled = true; };
  }, [tripKey]);

  return (
    <section style={{
      position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
      zIndex: 10, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }} className="scroll-container">
      {/* Ambient tint */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${trip.color}08 0%, transparent 70%)`,
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '384px',
        margin: '0 auto', padding: '20dvh 24px 120px',
        minHeight: '100dvh',
      }}>
        {/* Title */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
            fontSize: 'clamp(36px, 11vw, 64px)', color: C.cream,
            textTransform: 'lowercase', lineHeight: 1.1,
            display: 'flex', alignItems: 'center',
          }}>
            <span>{typedTitle}</span>
            {cursorVisible && (
              <span
                className={cursorBlink ? 'cursor-blink' : ''}
                style={{
                  display: 'inline-block', width: '4px',
                  height: 'clamp(30px, 9vw, 50px)',
                  background: C.gold, marginLeft: '4px',
                }}
              />
            )}
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '14px',
            color: C.creamDim, marginTop: '16px', textTransform: 'lowercase',
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s ease',
          }}>{trip.subtitle}</p>
        </div>

        {/* Map */}
        <div style={{
          background: '#1E1E30',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,168,83,0.02) 2px, rgba(212,168,83,0.02) 4px)',
          border: `1px solid ${C.goldDim}`, borderRadius: '4px',
          padding: '24px', marginBottom: '48px', position: 'relative', overflow: 'hidden',
          opacity: mapVisible ? 1 : 0,
          transform: mapVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 1s ease',
        }}>
          <svg viewBox="-10 -30 250 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Route path */}
            <path
              ref={routeRef}
              d={trip.routePath}
              fill="none"
              stroke={`${C.gold}59`}
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeDashoffset={routeDrawn ? 0 : routeLength}
              style={{ transition: routeDrawn ? 'stroke-dashoffset 2.5s ease-in-out' : 'none' }}
              strokeLinecap="round"
            />

            {/* Stop markers */}
            {trip.stops.map((stop, i) => {
              const m = trip.markers[i];
              const visible = visiblePins.includes(i);
              return (
                <g key={i} style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? `translate(0, 0)` : `translate(0, -15px)`,
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {/* Pin line */}
                  <line x1={m.x} y1={m.y - 14} x2={m.x} y2={m.y - 8} stroke={`${C.gold}50`} strokeWidth="0.8" />
                  {/* Circle */}
                  <circle cx={m.x} cy={m.y} r="8" fill="#1E1E30" stroke={C.gold} strokeWidth="1" />
                  <text x={m.x} y={m.y + 3.5} textAnchor="middle" fill={C.gold}
                    style={{ fontSize: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    {stop.day}
                  </text>
                  {/* Name above */}
                  <text x={m.x} y={m.y - 18} textAnchor="middle" fill={C.cream}
                    style={{ fontSize: '6px', fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {stop.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Stop cards */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {trip.stops.map((stop, i) => {
            const visible = visibleCards.includes(i);
            return (
              <div key={i} style={{
                paddingTop: '20px', paddingBottom: '20px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.5s ease',
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500,
                  color: C.gold, letterSpacing: '0.12em', textTransform: 'lowercase',
                  marginBottom: '8px',
                }}>dag {stop.day}</p>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px',
                  color: C.cream, textTransform: 'lowercase', marginBottom: '4px', fontWeight: 700,
                }}>{stop.name}</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                  color: C.creamDim, lineHeight: 1.6, textTransform: 'lowercase',
                }}>{stop.desc}</p>
                {i < trip.stops.length - 1 && (
                  <div style={{
                    width: '100%', height: '1px', background: C.goldFaint, marginTop: '20px',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Closing message */}
        <div style={{
          marginTop: '96px', marginBottom: '64px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: finalVisible ? 1 : 0,
          transition: 'opacity 2s ease',
        }}>
          <div className={`final-line ${finalLineVisible ? 'visible' : ''}`} style={{ marginBottom: '32px' }} />
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(22px, 7vw, 36px)',
            color: C.gold, textTransform: 'lowercase',
          }}>ik hou van je</p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BirthdaySurprise() {
  const [phase, setPhase] = useState('splash'); // splash | choose | unwrap | reveal
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [exitingPhase, setExitingPhase] = useState(null);

  const canvasRef = useRef(null);
  const audio = useAudio();
  const sparkles = useParticles(canvasRef);

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    let timer;
    const debouncedResize = () => {
      clearTimeout(timer);
      timer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const handleSplashOpen = useCallback(async () => {
    if (prefersReducedMotion()) { setPhase('choose'); return; }
    setExitingPhase('splash');
    await sleep(600);
    setExitingPhase(null);
    setPhase('choose');
  }, []);

  const handleChooseSelect = useCallback(async (tripKey) => {
    setSelectedTrip(tripKey);
    if (prefersReducedMotion()) { setPhase('reveal'); return; }
    await sleep(800);
    setPhase('unwrap');
  }, []);

  const handleUnwrapComplete = useCallback(() => {
    setPhase('reveal');
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100dvh',
      overflow: 'hidden', background: C.bg, color: C.cream,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Screen-reader heading */}
      <h1 className="sr-only">Verjaardagsverrassing</h1>

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 50,
        }}
      />

      {/* Phases */}
      <main style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}>
        {phase === 'splash' && (
          <div style={{
            position: 'absolute', inset: 0,
            opacity: exitingPhase === 'splash' ? 0 : 1,
            transform: exitingPhase === 'splash' ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.6s ease',
          }}>
            <SplashPhase onOpen={handleSplashOpen} sparkles={sparkles} audio={audio} />
          </div>
        )}

        {phase === 'choose' && (
          <ChoosePhase onSelect={handleChooseSelect} sparkles={sparkles} audio={audio} />
        )}

        {phase === 'unwrap' && selectedTrip && (
          <UnwrapPhase tripKey={selectedTrip} onComplete={handleUnwrapComplete} sparkles={sparkles} audio={audio} />
        )}

        {phase === 'reveal' && selectedTrip && (
          <RevealPhase tripKey={selectedTrip} sparkles={sparkles} audio={audio} />
        )}
      </main>
    </div>
  );
}
