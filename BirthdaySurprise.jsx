import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TRIPS = {
  france: {
    name: "Frankrijk",
    subtitle: "5 dagen \u00B7 Normandi\u00EB & Mont Saint-Michel",
    color: "#4A90E2",
    accent: "#D4AF37",
    stops: [
      {
        day: 1, name: "Vertrek", desc: "Richting zuidwest, lunchstop onderweg",
        detail: "We vertrekken 's ochtends vroeg en rijden richting het zuiden van Frankrijk. Onderweg stoppen we voor een ontspannen lunch in een typisch Frans dorpje. De roadtrip zelf is al een avontuur \u2014 groene heuvels, pittoreske stadjes, en dat langzame gevoel dat vakantie officieel begonnen is.",
        images: [
          { url: "https://images.unsplash.com/photo-1539600937385-bd902dd379cc?w=800&q=80", alt: "Frans platteland met groene heuvels" },
          { url: "https://images.unsplash.com/photo-1723395439174-4a5c26eec556?w=800&q=80", alt: "Bloeiende velden langs een landweg" },
        ],
      },
      {
        day: 2, name: "Honfleur", desc: "Betoverend havenstadje, impressionistische sfeer",
        detail: "Honfleur is een van de mooiste havenstadjes van Frankrijk. De kleurrijke gevels langs de Vieux Bassin zijn het decor geweest van ontelbare impressionistische schilderijen. We slenteren door smalle straatjes, proeven verse cr\u00EApes, en genieten van het uitzicht over de haven bij zonsondergang.",
        images: [
          { url: "https://images.unsplash.com/photo-1749429338454-fa1a649c0208?w=800&q=80", alt: "Honfleur haven met kleurrijke gevels" },
          { url: "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=800&q=80", alt: "Bootjes in de haven van Honfleur" },
        ],
      },
      {
        day: 3, name: "D-Day Stranden", desc: "Omaha Beach, kliffen & herdenkingen",
        detail: "Een dag vol indrukwekkende geschiedenis. We bezoeken Omaha Beach, waar de kliffen en bunkers je direct terugbrengen naar 6 juni 1944. De stranden zijn weids en prachtig, en de herdenkingsmonumenten zijn diep aangrijpend. Een ervaring die je nooit vergeet.",
        images: [
          { url: "https://images.unsplash.com/photo-1516414490660-1a7954e26981?w=800&q=80", alt: "\u00C9tretat kliffen aan de Normandische kust" },
          { url: "https://images.unsplash.com/photo-1757874905959-9fc34f5abdaa?w=800&q=80", alt: "Kliffen boven de zee in Normandi\u00EB" },
        ],
      },
      {
        day: 4, name: "Mont Saint-Michel", desc: "De iconische abdij bij zonsondergang",
        detail: "Het hoogtepunt van de reis: Mont Saint-Michel. Deze middeleeuwse abdij rijst op uit het water als een sprookjeskasteel. We wandelen door de smalle straatjes omhoog naar de top, waar het uitzicht adembenemend is. Bij zonsondergang kleurt alles goud \u2014 puur magisch.",
        images: [
          { url: "https://images.unsplash.com/photo-1667812823347-b5f948dcd658?w=800&q=80", alt: "Mont Saint-Michel" },
          { url: "https://images.unsplash.com/photo-1578671873592-a7012b752a3a?w=800&q=80", alt: "Mont Saint-Michel bij zonsondergang" },
        ],
      },
      {
        day: 5, name: "Chartres & terug", desc: "Kathedraal bezoeken, dan naar huis",
        detail: "Op de terugweg stoppen we in Chartres om de beroemde kathedraal te bewonderen \u2014 een UNESCO-werelderfgoed met de mooiste glas-in-loodramen van Europa. Het blauwe licht dat door de ramen valt is betoverend. Een perfecte afsluiter voordat we huiswaarts keren, vol met mooie herinneringen.",
        images: [
          { url: "https://images.unsplash.com/photo-1635473170208-d0334e64d77a?w=800&q=80", alt: "Kathedraal van Chartres" },
          { url: "https://images.unsplash.com/photo-1635473171860-2cb787258994?w=800&q=80", alt: "Chartres kathedraal interieur" },
        ],
      },
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
    color: "#B22222",
    accent: "#D4AF37",
    stops: [
      {
        day: 1, name: "Rheingau", desc: "Aankomst in de Sekt- en wijnregio",
        detail: "We rijden naar de Rheingau \u2014 een van de mooiste wijnregio's van Duitsland. Langs de oevers van de Rijn liggen wijngaarden zo ver het oog reikt. We checken in en proeven onze eerste Sekt (Duitse mousserende wijn) met uitzicht over de rivier. Het perfecte begin.",
        images: [
          { url: "https://images.unsplash.com/photo-1662486717047-ea680aa453e6?w=800&q=80", alt: "Rivierdal langs de Moezel" },
          { url: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=800&q=80", alt: "Groene wijngaarden in de heuvels" },
        ],
      },
      {
        day: 2, name: "Wijnhuizen", desc: "Sekt proeven, wijngaard wandelingen",
        detail: "Vandaag draait alles om wijn. We bezoeken traditionele wijnhuizen waar Sekt en Riesling al eeuwenlang worden gemaakt. Wandelen tussen de wijnranken, proeverijen in oude kelders, en genieten van lokale kaasjes en broodjes. Puur genieten in de buitenlucht.",
        images: [
          { url: "https://images.unsplash.com/photo-1730058518963-55bc7a9eb791?w=800&q=80", alt: "Wijngaard wandeling in het voorjaar" },
          { url: "https://images.unsplash.com/photo-1673353348607-ab796515c64c?w=800&q=80", alt: "Bootjes in een kleurrijke haven" },
        ],
      },
      {
        day: 3, name: "Heidelberg", desc: "Schilderachtige route naar het zuiden",
        detail: "Via een prachtige route rijden we naar Heidelberg, een van de meest romantische steden van Duitsland. Het kasteel boven de stad biedt een spectaculair uitzicht over de Neckar. We dwalen door de Altstadt, bezoeken de oudste universiteit van Duitsland, en sluiten af met een diner aan de rivier.",
        images: [
          { url: "https://images.unsplash.com/photo-1658337071443-ba341f051284?w=800&q=80", alt: "Heidelberg kasteel op de heuvel" },
          { url: "https://images.unsplash.com/photo-1723816221944-da98c9a8f5ae?w=800&q=80", alt: "Heidelberg plein en oude stad" },
        ],
      },
      {
        day: 4, name: "Zwarte Woud", desc: "Triberg watervallen, koekoeksklokken, Kirschtorte",
        detail: "Het Zwarte Woud is pure magie. We bezoeken de beroemde watervallen van Triberg \u2014 de hoogste van Duitsland \u2014 wandelen door dicht, donker bos, en bewonderen handgemaakte koekoeksklokken. Uiteraard proeven we de authentieke Schwarzw\u00E4lder Kirschtorte. Een dag uit een sprookjesboek.",
        images: [
          { url: "https://images.unsplash.com/photo-1541500233866-71164d920e0b?w=800&q=80", alt: "Triberg in het Zwarte Woud" },
          { url: "https://images.unsplash.com/photo-1623173811948-a53b4056e5b2?w=800&q=80", alt: "Waterval in het Zwarte Woud" },
        ],
      },
      {
        day: 5, name: "Freiburg & terug", desc: "Freiburg verkennen, dan naar huis",
        detail: "Onze laatste dag brengen we door in Freiburg, de zonnigste stad van Duitsland. De beroemde B\u00E4chle \u2014 kleine waterkanalen door de straten \u2014 geven de stad een unieke charme. We bezoeken de M\u00FCnster, dwalen over de markt, en genieten van onze laatste koffie voordat we vol mooie herinneringen naar huis rijden.",
        images: [
          { url: "https://images.unsplash.com/photo-1562247692-b2c83aac9cf8?w=800&q=80", alt: "Freiburg van bovenaf" },
          { url: "https://images.unsplash.com/photo-1634412116682-a692f58c8e35?w=800&q=80", alt: "Freiburg marktplein" },
        ],
      },
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

.fr-front  { background: #4A90E2; }
.fr-right  { background: #3D7BCB; }
.fr-left   { background: #3268B0; }
.fr-back   { background: #2A5898; }
.fr-top    { background: #5EA0F0; }
.fr-bottom { background: #2A5898; }

.de-front  { background: #B22222; }
.de-right  { background: #9A1D1D; }
.de-left   { background: #821818; }
.de-back   { background: #6E1414; }
.de-top    { background: #CC2E2E; }
.de-bottom { background: #6E1414; }

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

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
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

const GiftBox = React.forwardRef(({ tripKey, className, label, ribbonColor, materialPrefix, onSelect, dismissed, selected, lidOpen, ariaLabel, dropShadowColor }, ref) => {
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
        filter: dismissed ? undefined : `drop-shadow(0 12px 24px ${tripKey === 'france' ? 'rgba(74,144,226,0.4)' : 'rgba(178,34,34,0.4)'})`,
        ...(selected ? {
          left: 'calc(50% - var(--half-size))',
          top: 'calc(50% - var(--half-size))',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } : {}),
      }}
    >
      <div className="box-shadow-el" style={{ boxShadow: `0 30px 40px ${tripKey === 'france' ? 'rgba(74,144,226,0.4)' : 'rgba(178,34,34,0.4)'}` }} />
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
      {label && (
        <div style={{
          position: 'absolute', bottom: '-28px', left: 0, right: 0, textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '12px', letterSpacing: '0.12em',
            textTransform: 'lowercase', color: C.creamFaint,
          }}>{label}</span>
        </div>
      )}
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
          ribbonColor="#D4AF37"
          materialPrefix="fr"
          onSelect={handleSelect}
          dismissed={dismissedBox === 'france'}
          selected={selectedBox === 'france'}
          lidOpen={false}
          ariaLabel="Cadeau 1"
        />
        <GiftBox
          ref={deBoxRef}
          tripKey="germany"
          className="box-de"
          ribbonColor="#D4AF37"
          materialPrefix="de"
          onSelect={handleSelect}
          dismissed={dismissedBox === 'germany'}
          selected={selectedBox === 'germany'}
          lidOpen={false}
          ariaLabel="Cadeau 2"
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

// ─── Stop Card (Accordion) ───────────────────────────────────────────────────

function StopCard({ stop, index, total, visible, audio }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    audio.playTick();
    setExpanded(prev => !prev);
  };

  const handleImageLoad = (i) => {
    setImagesLoaded(prev => ({ ...prev, [i]: true }));
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: 'all 0.5s ease',
    }}>
      {/* Clickable header */}
      <button
        onClick={handleToggle}
        aria-expanded={expanded}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '20px 0', textAlign: 'left', outline: 'none',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
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
        </div>
        {/* Chevron */}
        <div style={{
          marginTop: '28px', flexShrink: 0, width: '24px', height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div style={{
        overflow: 'hidden',
        maxHeight: expanded ? `${contentHeight}px` : '0px',
        transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div ref={contentRef} style={{ paddingBottom: '20px' }}>
          {/* Detail text */}
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '14px',
            color: C.creamDim, lineHeight: 1.7, marginBottom: '20px',
          }}>{stop.detail}</p>

          {/* Image gallery */}
          {stop.images && stop.images.length > 0 && (
            <div style={{
              display: 'flex', gap: '10px', overflowX: 'auto',
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', margin: '0 -4px', padding: '0 4px',
            }}>
              {stop.images.map((img, i) => (
                <div key={i} style={{
                  flexShrink: 0, scrollSnapAlign: 'start',
                  width: stop.images.length === 1 ? '100%' : 'calc(85% - 5px)',
                  borderRadius: '6px', overflow: 'hidden', position: 'relative',
                  background: '#1E1E30',
                  aspectRatio: '16 / 10',
                }}>
                  {/* Shimmer placeholder */}
                  {!imagesLoaded[i] && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(110deg, #1E1E30 30%, #2a2a44 50%, #1E1E30 70%)`,
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                    }} />
                  )}
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    onLoad={() => handleImageLoad(i)}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      opacity: imagesLoaded[i] ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                    }}
                  />
                  {/* Subtle vignette overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(to top, rgba(26,26,46,0.4) 0%, transparent 40%)',
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      {index < total - 1 && (
        <div style={{ width: '100%', height: '1px', background: C.goldFaint }} />
      )}
    </div>
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

        {/* Stop cards (accordion) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {trip.stops.map((stop, i) => {
            const visible = visibleCards.includes(i);
            return (
              <StopCard key={i} stop={stop} index={i} total={trip.stops.length}
                visible={visible} audio={audio} />
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
            fontSize: 'clamp(20px, 6vw, 32px)',
            color: C.cream, textAlign: 'center',
            lineHeight: 1.6, marginBottom: '8px',
          }}>Een hele fijne verjaardag.</p>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(20px, 6vw, 32px)',
            color: C.gold,
            lineHeight: 1.6, marginBottom: '8px',
          }}>Ik hou van jou!</p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '14px',
            color: C.creamDim, marginTop: '16px',
            letterSpacing: '0.1em',
          }}>Kusjes van Tom.</p>
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
