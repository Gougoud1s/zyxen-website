import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects, services } from '@/lib/data';
import TiltCard from '@/components/TiltCard';
import TextReveal from '@/components/TextReveal';
import MagneticButton from '@/components/MagneticButton';
import CursorGlow from '@/components/CursorGlow';
import SEOMeta from '@/components/SEOMeta';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket } from 'lucide-react';

/* Lazy-load heavy Three.js components — keeps initial bundle lean */
const HeroCanvas = lazy(() => import('@/components/HeroCanvas'));
const ScrollIntro = lazy(() => import('@/components/ScrollIntro'));

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket };

/* Scene wrapper — enters like a camera cut */
function Scene({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ tag, title }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8" style={{ background: '#AF994D' }} />
        <p className="text-xs font-medium tracking-[0.22em] uppercase" style={{ color: '#AF994D' }}>{tag}</p>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight">
        <TextReveal text={title} />
      </h2>
    </>
  );
}

export default function Home() {
  const { t, lang, localePath } = useLanguage();
  const [introDone, setIntroDone] = useState(() => {
    const ts = sessionStorage.getItem('zyxen_intro_ts');
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < 10 * 60 * 1000;
  });
  const heroRef = useRef(null);
  const heroControls = useAnimation();

  useEffect(() => {
    if (introDone) {
      // Use rAF to ensure Framer Motion has registered all animated elements before starting
      const id = requestAnimationFrame(() => heroControls.start('show'));
      return () => cancelAnimationFrame(id);
    }
  }, [introDone, heroControls]);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '22%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.95]);

  const featured = projects.filter(p => !p.confidential).slice(0, 4);
  const heroWords1 = t('hero.title1').split(' ');
  const heroWords2 = t('hero.title2').split(' ');

  const metaTitle = lang === 'el' ? 'ZYXEN — Συστήματα, Σχεδιασμένα.' : 'ZYXEN — Systems, Engineered.';
  const metaDesc = lang === 'el'
    ? 'Premium studio λογισμικού με έμφαση σε Umbraco, Flutter, AI integrations και commerce systems. Βασισμένοι στην Ελλάδα, παραδίδουμε enterprise-grade ψηφιακά προϊόντα.'
    : 'Premium software engineering studio specializing in Umbraco, Flutter, AI integrations and commerce systems. Based in Greece, delivering enterprise-grade digital products.';

  return (
    <div className="overflow-x-hidden">
      <SEOMeta title={metaTitle} description={metaDesc} />
      <CursorGlow />

      {!introDone && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-background" />}>
          <ScrollIntro onComplete={() => {
            sessionStorage.setItem('zyxen_intro_ts', Date.now().toString());
            setIntroDone(true);
          }} />
        </Suspense>
      )}

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[55%] h-[65%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,107,44,0.09), transparent 65%)', filter: 'blur(40px)' }} />
          <div className="absolute top-[35%] left-[8%] w-[40%] h-[40%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(175,153,77,0.06), transparent 65%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-[30%]"
            style={{ background: 'linear-gradient(to top, hsl(var(--background)), transparent)' }} />
        </div>

        <div className="absolute inset-0 opacity-[0.032] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-28 sm:py-36 w-full"
        >
          {/* Eyebrow */}
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8" style={{ background: '#AF994D' }} />
            <span className="text-xs font-medium tracking-[0.26em] uppercase" style={{ color: '#AF994D' }}>
              {t('hero.tag')}
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-[clamp(2.6rem,8vw,6.5rem)] font-display font-bold leading-[0.96] tracking-tight max-w-5xl">
            <span className="block overflow-hidden">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em]"
                  initial="hidden"
                  animate={heroControls}
                  variants={{
                    hidden: { opacity: 0, y: 72, rotateX: -20 },
                    show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden mt-1 sm:mt-2">
              {heroWords2.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em]"
                  style={{ color: 'hsl(var(--primary))', transformStyle: 'preserve-3d' }}
                  initial="hidden"
                  animate={heroControls}
                  variants={{
                    hidden: { opacity: 0, y: 72, rotateX: -20 },
                    show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay: 0.22 + (heroWords1.length + i) * 0.1, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate={heroControls}
            variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-8 sm:mt-10 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            {t('hero.desc')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] } } }}
            className="mt-10 sm:mt-12 flex flex-wrap gap-3 sm:gap-4"
          >
            <MagneticButton>
              <Link to={localePath('/projects')}
                className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity min-h-[48px] shadow-lg shadow-primary/20">
                {t('hero.cta1')} <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to={localePath('/services')}
                className="inline-flex items-center gap-2.5 border border-border/70 text-foreground/80 px-8 py-3.5 rounded-full font-medium text-sm hover:border-primary/60 hover:text-foreground transition-all min-h-[48px] backdrop-blur-sm bg-background/20">
                {t('hero.cta2')}
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Tech stack chips — horizontal scroll on mobile, wrap on desktop */}
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 1.4 } } }}
            className="mt-12 sm:mt-20 flex gap-2 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0 scrollbar-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {['Umbraco', '.NET / C#', 'Flutter', 'nopCommerce', 'AI / ML', 'CI/CD'].map((tech, i) => (
              <motion.span
                key={tech}
                initial="hidden"
                animate={heroControls}
                variants={{ hidden: { opacity: 0, scale: 0.8, y: 8 }, show: { opacity: 1, scale: 1, y: 0, transition: { delay: 1.5 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                className="text-xs px-4 py-2 rounded-full border border-border/40 text-muted-foreground bg-card/40 backdrop-blur-md hover:border-primary/40 hover:text-foreground transition-all cursor-default select-none whitespace-nowrap flex-shrink-0 sm:flex-shrink"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial="hidden"
          animate={heroControls}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 2 } } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
            <div className="w-1 h-1 rounded-full" style={{ background: '#AF994D' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ STATS ══ */}
      <section className="relative border-y border-border/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,107,44,0.03), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
            {[
              { num: '7+', label: t('stats.projects'), desc: t('stats.projectsDesc') },
              { num: t('stats.tech'), label: 'Unified Stack', desc: t('stats.techDesc') },
              { num: t('stats.scope'), label: 'Full Range', desc: t('stats.scopeDesc') },
            ].map((s, i) => (
              <Scene key={i} delay={i * 0.1} className="sm:px-12 first:pl-0 last:pr-0 py-8 sm:py-0">
                <div className="text-[clamp(2rem,5vw,3rem)] font-display font-bold leading-none" style={{ color: 'hsl(var(--primary))' }}>
                  {s.num}
                </div>
                <p className="text-sm font-semibold mt-2 tracking-wide">{s.label}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              </Scene>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section className="py-24 sm:py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[60%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 90% 10%, rgba(175,153,77,0.05), transparent 65%)', filter: 'blur(80px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <Scene>
            <SectionLabel tag={t('featuredTitle')} title={t('featuredSub')} />
          </Scene>
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 gap-4 sm:gap-6">
            {featured.map((p, i) => (
              <Scene key={p.slug} delay={i * 0.09}>
                <TiltCard className="h-full" intensity={7}>
                  <Link
                    to={localePath(`/projects/${p.slug}`)}
                    className="group block bg-card border border-border/60 rounded-2xl p-6 sm:p-8 hover:border-primary/40 transition-all duration-500 h-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,44,0.07), transparent 65%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to top, rgba(255,107,44,0.04), transparent)' }} />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#AF994D' }}>{p[lang].category}</p>
                          <h3 className="font-display text-lg sm:text-xl font-semibold mt-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                            {p[lang].name}
                          </h3>
                        </div>
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 rounded-full border border-border/60 flex items-center justify-center mt-0.5 group-hover:border-primary/60 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-3">{p[lang].overview}</p>
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {p.tech.map(tech => (
                          <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground border border-border/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </Scene>
            ))}
          </div>
          <Scene className="mt-12 text-center" delay={0.2}>
            <MagneticButton>
              <Link to={localePath('/projects')}
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-primary border border-primary/30 px-6 py-3 rounded-full hover:bg-primary/5 hover:border-primary/60 transition-all">
                {t('viewProject')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </MagneticButton>
          </Scene>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="py-24 sm:py-36 bg-card border-y border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 10% 90%, rgba(255,107,44,0.05), transparent 60%)', filter: 'blur(80px)' }} />
          <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 90% 10%, rgba(175,153,77,0.04), transparent 60%)', filter: 'blur(80px)' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <Scene>
            <SectionLabel tag={t('servicesTitle')} title={t('servicesSub')} />
          </Scene>
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || Layers;
              return (
                <Scene key={s.slug} delay={i * 0.06}>
                  <TiltCard className="h-full" intensity={5} scale={1.015}>
                    <Link to={localePath(`/services/${s.slug}`)}
                      className="group block bg-background/80 border border-border/60 rounded-2xl p-6 sm:p-7 hover:border-primary/40 transition-all duration-400 h-full relative overflow-hidden cursor-pointer backdrop-blur-sm">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,107,44,0.06), transparent 60%)' }} />
                      <div className="relative">
                        <motion.div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                          style={{ background: 'rgba(175,153,77,0.1)', border: '1px solid rgba(175,153,77,0.2)' }}
                          whileHover={{ scale: 1.12, rotate: 4 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        >
                          <Icon className="w-[18px] h-[18px]" style={{ color: '#AF994D' }} />
                        </motion.div>
                        <h3 className="font-display text-base sm:text-[1.05rem] font-semibold group-hover:text-primary transition-colors leading-snug">{s[lang].name}</h3>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s[lang].short}</p>
                        <div className="flex items-center gap-1.5 text-xs text-primary mt-5 font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                          {t('learnMore')} <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </Scene>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-36 sm:py-48 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,107,44,0.07), transparent 70%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
        </div>
        {[700, 520, 340].map((size, i) => (
          <motion.div
            key={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary pointer-events-none"
            style={{ width: size, height: size, opacity: 0.04 + i * 0.02 }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
          <Scene>
            <p className="text-xs font-medium tracking-[0.28em] uppercase mb-6" style={{ color: '#AF994D' }}>
              Systems, Engineered.
            </p>
            <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-display font-bold leading-tight">
              <TextReveal text={t('ctaTitle')} />
            </h2>
            <p className="text-muted-foreground mt-6 sm:mt-8 max-w-xl mx-auto leading-relaxed text-base sm:text-lg">{t('ctaSub')}</p>
            <div className="mt-10 sm:mt-12">
              <MagneticButton>
                <Link to={localePath('/contact')}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full font-medium text-sm sm:text-base hover:opacity-90 transition-opacity shadow-2xl shadow-primary/25 min-h-[52px]">
                  {t('ctaBtn')} <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
            </div>
          </Scene>
        </div>
      </section>
    </div>
  );
}