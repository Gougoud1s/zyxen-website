import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const isTouchDevice = () =>
  typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

/* ─── Three.js scene ─── */
function CrystalCanvas({ chapter }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 4.8;

    const geos = [
      new THREE.IcosahedronGeometry(1.08, 2),
      new THREE.TorusKnotGeometry(0.70, 0.25, 180, 20),
      new THREE.OctahedronGeometry(1.18, 3),
    ];
    const chapterColors = [0xAF994D, 0xff6b2c, 0x7788ee];

    const makeMat = (col, op = 0) => new THREE.MeshPhysicalMaterial({
      color: col, metalness: 0.97, roughness: 0.06,
      transparent: true, opacity: op, reflectivity: 1,
      clearcoat: 0.4, clearcoatRoughness: 0.1,
    });

    const meshes = geos.map((g, i) => {
      const m = new THREE.Mesh(g, makeMat(chapterColors[i]));
      const w = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0 }));
      scene.add(m, w);
      return { mesh: m, wire: w };
    });

    const ringGroup = new THREE.Group();
    [
      { r: 1.78, t: 0.008, col: 0xAF994D, op: 0.38, rx: Math.PI / 2.6, spd: 0.20 },
      { r: 2.22, t: 0.005, col: 0xff6b2c, op: 0.22, rx: Math.PI / 1.55, spd: -0.13 },
      { r: 2.65, t: 0.003, col: 0x8899ff, op: 0.14, rx: Math.PI / 3.5, spd: 0.09 },
      { r: 3.1,  t: 0.002, col: 0xAF994D, op: 0.07, rx: Math.PI / 4.5, spd: -0.06 },
    ].forEach(({ r, t, col, op, rx, spd }) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 12, 140),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op })
      );
      m.rotation.x = rx;
      m.userData.spd = spd;
      ringGroup.add(m);
    });
    scene.add(ringGroup);

    const pCount = isTouchDevice() ? 90 : 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 12;
      pPos[i*3+1] = (Math.random() - 0.5) * 12;
      pPos[i*3+2] = (Math.random() - 0.5) * 7;
      pVel[i*3]   = (Math.random() - 0.5) * 0.002;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.002;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xAF994D, size: 0.016, transparent: true, opacity: 0.5, sizeAttenuation: true
    }));
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pt1 = new THREE.PointLight(0xff6b2c, 4.5, 14); pt1.position.set(3.5, 3, 3);
    const pt2 = new THREE.PointLight(0xAF994D, 3.5, 14); pt2.position.set(-3, -2.5, 2);
    const pt3 = new THREE.PointLight(0x8899ff, 2, 12);   pt3.position.set(0, -3.5, -1);
    const ptRim = new THREE.PointLight(0xffffff, 1.8, 8); ptRim.position.set(0, 4, -2);
    scene.add(pt1, pt2, pt3, ptRim);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    animate(0, 1, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: v => {
      meshes[0].mesh.material.opacity = v * 0.94;
      meshes[0].wire.material.opacity = v * 0.07;
    }});

    stateRef.current = { meshes, rings: ringGroup.children, particles, pt1, pt2, ptRim, mouse, frame: null };

    const FRAME_MS = 1000 / 30;
    let lastFrame = 0, t = 0;

    const loop = (ts) => {
      stateRef.current.frame = requestAnimationFrame(loop);
      if (ts - lastFrame < FRAME_MS) return;
      lastFrame = ts;
      t += 0.0055;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 0.5;
      camera.position.y = -mouse.y * 0.3;
      camera.lookAt(0, 0, 0);

      meshes.forEach(({ mesh, wire }, i) => {
        mesh.rotation.y = t * (0.9 + i * 0.08);
        mesh.rotation.x = Math.sin(t * 0.35 + i * 1.2) * 0.25;
        wire.rotation.copy(mesh.rotation);
        const p = 1 + Math.sin(t * 1.65 + i) * 0.016;
        mesh.scale.setScalar(p);
        wire.scale.setScalar(p);
      });

      ringGroup.children.forEach(r => { r.rotation.z += r.userData.spd * 0.011; });
      ringGroup.rotation.y = Math.sin(t * 0.12) * 0.08;

      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < pCount; i++) {
        pos.array[i*3]   += pVel[i*3];
        pos.array[i*3+1] += pVel[i*3+1];
        if (Math.abs(pos.array[i*3]) > 6)   pVel[i*3]   *= -1;
        if (Math.abs(pos.array[i*3+1]) > 6) pVel[i*3+1] *= -1;
      }
      pos.needsUpdate = true;
      particles.rotation.y = t * 0.025;

      pt1.intensity = 4.5 + Math.sin(t * 2.0) * 0.9;
      pt2.intensity = 3.5 + Math.sin(t * 1.5 + 1.2) * 0.7;
      ptRim.position.x = Math.sin(t * 0.4) * 2;

      renderer.render(scene, camera);
    };
    requestAnimationFrame(loop);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(stateRef.current?.frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    const chapterColors = [0xAF994D, 0xff6b2c, 0x7788ee];
    s.meshes.forEach(({ mesh, wire }, i) => {
      if (i === chapter) {
        mesh.material.color.set(chapterColors[chapter]);
        animate(mesh.material.opacity, 0.94, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: v => { mesh.material.opacity = v; wire.material.opacity = v * 0.07; } });
      } else {
        animate(mesh.material.opacity, 0, { duration: 0.55, ease: 'easeOut', onUpdate: v => { mesh.material.opacity = v; wire.material.opacity = v * 0.07; } });
      }
    });
  }, [chapter]);

  return <div ref={mountRef} className="w-full h-full" />;
}

/* ─── Chapters ─── */
const CHAPTERS_EN = [
  { tag: 'ZYXEN · Software Engineering', headline: ['Systems,'], sub: 'Premium software engineering studio.', color: '#AF994D', accentBg: 'rgba(175,153,77,0.08)' },
  { tag: 'Precision · Scale · Impact',   headline: ['Engineered.'], sub: 'Enterprise platforms. Mobile apps. Commerce.', color: 'hsl(20 100% 55%)', accentBg: 'rgba(255,107,44,0.08)' },
  { tag: 'Systems, Engineered.',          headline: ["We build", "what others can't."], sub: 'Keep scrolling to enter.', color: '#8899ff', accentBg: 'rgba(136,153,255,0.08)' },
];
const CHAPTERS_EL = [
  { tag: 'ZYXEN · Software Engineering',       headline: ['Συστήματα,'], sub: 'Premium studio λογισμικού.', color: '#AF994D', accentBg: 'rgba(175,153,77,0.08)' },
  { tag: 'Ακρίβεια · Κλιμάκωση · Αποτέλεσμα', headline: ['Σχεδιασμένα.'], sub: 'Enterprise πλατφόρμες. Mobile εφαρμογές.', color: 'hsl(20 100% 55%)', accentBg: 'rgba(255,107,44,0.08)' },
  { tag: 'Συστήματα, Σχεδιασμένα.',             headline: ['Χτίζουμε ό,τι', 'άλλοι δεν μπορούν.'], sub: 'Συνεχίστε για να μπείτε.', color: '#8899ff', accentBg: 'rgba(136,153,255,0.08)' },
];

/* ─── Main ─── */
export default function ScrollIntro({ onComplete }) {
  const isGreek = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('el');
  const CHAPTERS = isGreek ? CHAPTERS_EL : CHAPTERS_EN;
  const isTouch = isTouchDevice();

  const [chapter, setChapter] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  /* GSAP animation refs */
  const tagRef    = useRef(null);
  const headRef   = useRef(null);
  const subRef    = useRef(null);
  const barRef    = useRef(null);
  const logoRef   = useRef(null);

  const locked      = useRef(false);
  const chapterRef  = useRef(0);
  const animating   = useRef(false);

  /* Skip hint appears after 2.2 s */
  useEffect(() => {
    const id = setTimeout(() => setShowSkip(true), 2200);
    return () => clearTimeout(id);
  }, []);

  /* Keep chapterRef in sync */
  useEffect(() => { chapterRef.current = chapter; }, [chapter]);

  /* Intro-in: animate first chapter on mount */
  useEffect(() => {
    if (!tagRef.current) return;
    gsap.set([tagRef.current, headRef.current, subRef.current, logoRef.current], { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(logoRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.3)
      .fromTo(tagRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.5)
      .fromTo(headRef.current,
        { opacity: 0, y: 60, rotationX: -18 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: 'power3.out' }, 0.65)
      .fromTo(subRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.0);
  }, []); // run once

  /* Chapter change: animate out → setState → animate in */
  const changeChapter = useCallback((next, dir) => {
    if (animating.current) return;
    animating.current = true;

    const yOut = dir > 0 ? -36 : 36;
    const tl = gsap.timeline({
      onComplete: () => {
        setChapter(next);
      },
    });
    tl.to([subRef.current, headRef.current, tagRef.current], {
      opacity: 0, y: yOut * 0.6, filter: 'blur(8px)',
      duration: 0.32, stagger: 0.04, ease: 'power2.in',
    })
    .to(logoRef.current, { opacity: 0, scale: 0.88, duration: 0.28, ease: 'power2.in' }, '<');
  }, []);

  /* After chapter state changes → animate in new content */
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!tagRef.current) return;

    const c = CHAPTERS[chapter];
    /* Update progress bar colour */
    if (barRef.current) barRef.current.style.background = `linear-gradient(90deg, rgba(175,153,77,0.4), ${c.color})`;

    gsap.set([tagRef.current, headRef.current, subRef.current], { y: 36, filter: 'blur(8px)' });
    gsap.set(logoRef.current, { scale: 1.06 });

    const tl = gsap.timeline({
      onComplete: () => { animating.current = false; },
    });
    tl.to(tagRef.current,  { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }, 0)
      .to(headRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7,  ease: 'power3.out' }, 0.08)
      .to(subRef.current,  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }, 0.22)
      .to(logoRef.current, { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }, 0.05);
  }, [chapter, CHAPTERS]);

  /* Complete / exit */
  const completeIntro = useCallback(() => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    setTimeout(() => {
      document.body.style.overflow = '';
      onComplete?.();
    }, 1000);
  }, [onComplete]);

  /* Advance chapter */
  const advanceChapter = useCallback((dir) => {
    if (locked.current || animating.current) return;
    const cur = chapterRef.current;
    if (dir > 0) {
      if (cur < CHAPTERS.length - 1) changeChapter(cur + 1, 1);
      else completeIntro();
    } else {
      if (cur > 0) changeChapter(cur - 1, -1);
    }
  }, [CHAPTERS.length, changeChapter, completeIntro]);

  /* ── GSAP ScrollTrigger.observe — replaces all manual wheel/touch listeners ── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    /* Wheel + touch swipe handled by ScrollTrigger.observe */
    const observer = ScrollTrigger.observe({
      type: 'wheel,touch',
      onDown: () => advanceChapter(1),
      onUp: () => advanceChapter(-1),
      preventDefault: true,
      tolerance: 30,
      debounce: false,
    });

    /* Tap to advance on touch devices (distinct from swipe) */
    let tapY = 0;
    const onTouchStart = (e) => { tapY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (Math.abs(tapY - e.changedTouches[0].clientY) < 12) advanceChapter(1);
    };
    if (isTouch) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return () => {
      document.body.style.overflow = '';
      observer.kill();
      if (isTouch) {
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [advanceChapter, isTouch]);

  const c = CHAPTERS[chapter];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.06 : 1,
        filter: exiting ? 'blur(8px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-background overflow-hidden"
    >
      {/* Animated per-chapter glow */}
      <AnimatePresence>
        <motion.div
          key={`glow-${chapter}`}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(ellipse 65% 65% at 65% 42%, ${c.accentBg}, transparent 70%)` }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.72) 100%)' }} />

      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <CrystalCanvas chapter={chapter} />
      </div>

      {/* OG / brand image — right-side atmospheric accent */}
      <div
        ref={logoRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <img
          src="/og-image.png"
          alt=""
          className="w-[380px] lg:w-[460px] xl:w-[520px] object-cover select-none"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 80% at 60% 50%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 60% 50%, black 30%, transparent 75%)',
            filter: 'saturate(1.15) brightness(0.75)',
            mixBlendMode: 'luminosity',
            opacity: 0.32,
          }}
          draggable={false}
        />
      </div>

      {/* GSAP progress bar */}
      <motion.div
        ref={barRef}
        className="absolute top-0 left-0 h-[2px] z-10 transition-none"
        animate={{ width: `${((chapter + 1) / CHAPTERS.length) * 100}%` }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `linear-gradient(90deg, rgba(175,153,77,0.4), ${c.color})` }}
      />

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && !exiting && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={completeIntro}
            className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer select-none hover:bg-white/5 transition-colors duration-200"
            style={{ borderColor: `${c.color}44`, color: c.color, backdropFilter: 'blur(8px)' }}
            aria-label={isGreek ? 'Παράλειψη intro' : 'Skip intro'}
          >
            {isGreek ? 'Παράλειψη' : 'Skip'} ›
          </motion.button>
        )}
      </AnimatePresence>

      {/* Text content — GSAP-animated via refs */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-24 pointer-events-none">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div ref={tagRef} className="flex items-center gap-3 mb-5 sm:mb-7" style={{ opacity: 0 }}>
            <div className="h-px w-7 flex-shrink-0 transition-colors duration-700" style={{ background: c.color }} />
            <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase leading-none" style={{ color: c.color }}>
              {c.tag}
            </p>
          </div>

          {/* Headline */}
          <h2
            ref={headRef}
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem, 10.5vw, 8rem)',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              opacity: 0,
              color: 'hsl(var(--foreground))',
            }}
          >
            {c.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-sm sm:text-[0.95rem] text-muted-foreground mt-5 sm:mt-8 max-w-sm leading-relaxed"
            style={{ opacity: 0 }}
          >
            {c.sub}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-6 sm:px-14 lg:px-24 z-10">
        {/* Chapter counter */}
        <AnimatePresence mode="wait">
          <motion.p
            key={chapter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.35, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38 }}
            className="text-[11px] font-mono tracking-[0.22em] text-muted-foreground tabular-nums"
          >
            0{chapter + 1} — 0{CHAPTERS.length}
          </motion.p>
        </AnimatePresence>

        {/* Right: chapter indicators + scroll hint */}
        <div className="flex flex-col items-center gap-3">
          {/* Dots */}
          <div className="flex flex-col gap-2.5 items-center">
            {CHAPTERS.map((ch, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  height: i === chapter ? 22 : 5,
                  width: 2,
                  opacity: i === chapter ? 1 : i < chapter ? 0.5 : 0.2,
                  backgroundColor: i === chapter ? ch.color : i < chapter ? ch.color : 'hsl(var(--muted-foreground))',
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>

          {/* Scroll/tap hint */}
          <AnimatePresence>
            {!exiting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: chapter === 0 ? 1.6 : 0 }}
                className="flex flex-col items-center gap-1.5"
              >
                <motion.div
                  animate={{ scaleY: [1, 1.9, 1], opacity: [0.3, 0.75, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="w-px h-7"
                  style={{ background: `linear-gradient(to bottom, transparent, ${c.color}, transparent)` }}
                />
                <p className="text-[9px] tracking-[0.3em] uppercase font-medium" style={{ color: c.color, opacity: 0.55 }}>
                  {isTouch
                    ? (isGreek ? 'πατήστε' : 'tap')
                    : chapter === CHAPTERS.length - 1
                      ? (isGreek ? 'είσοδος' : 'enter')
                      : (isGreek ? 'κύλιση' : 'scroll')
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
