import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects, services } from '@/lib/data';
import MagneticButton from '@/components/MagneticButton';
import SEOMeta from '@/components/SEOMeta';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Layers, Globe, Smartphone, ShoppingCart, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

const HeroCanvas = lazy(() => import('@/components/HeroCanvas'));

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Sparkles };

const MARQUEE_ITEMS = [
  'Umbraco CMS', '.NET / C#', 'Flutter Apps', 'PostgreSQL', 'Azure Cloud',
  'OpenAI Integrations', 'nopCommerce', 'Tailwind CSS', 'Docker', 'Kubernetes',
];

/**
 * 21st.dev Interactive Spotlight Card Effect
 * Tracks mouse cursor position and renders a smooth radial gradient overlay
 */
export function SpotlightCard({ children, className = '', href, ...props }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const CardTag = href ? Link : 'div';

  return (
    <CardTag
      ref={cardRef}
      to={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl bg-white border border-gray-200/90 transition-all duration-300 hover:border-black shadow-sm hover:shadow-md ${className}`}
      {...props}
    >
      {/* 21st.dev Spotlight Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.04), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-20">{children}</div>
    </CardTag>
  );
}

/**
 * 21st.dev Staggered Word Reveal
 */
function TextWordReveal({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <motion.span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Scene({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { localePath } = useLanguage();
  const heroRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '12%']);

  const featured = projects.filter(p => !p.confidential).slice(0, 4);

  const metaTitle = 'ZYXEN — Humanizing Software Engineering';
  const metaDesc = 'Bespoke software engineering studio based in Athens, Greece. Engineering enterprise web platforms, AI systems, mobile applications, and custom digital experiences.';

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-12">
      <SEOMeta title={metaTitle} description={metaDesc} />

      {/* HERO SECTION — PURE WHITE EDITORIAL ASYMMETRICAL SPLIT */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center pt-28 pb-20 border-b border-gray-200 overflow-hidden bg-white">
        <Suspense fallback={null}>
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[50%] h-full flex items-center justify-center pointer-events-none z-0">
            <HeroCanvas />
          </div>
        </Suspense>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10">
          <motion.div style={{ y: heroY }}>
            {/* STUDIO BADGE */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#AF994D] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                01 / SOFTWARE STUDIO — ATHENS, GR
              </span>
            </div>

            {/* EDITORIAL HEADLINE WITH 21ST DEV STAGGERED REVEAL */}
            <div className="max-w-3xl">
              <h1 className="text-[clamp(2.75rem,7.5vw,5.75rem)] font-extrabold tracking-tight leading-[0.98] text-black">
                <span className="block">
                  <TextWordReveal text="humanizing" />
                </span>
                <span className="block text-gray-900 font-serif-editorial font-normal italic">
                  <TextWordReveal text="software engineering." />
                </span>
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl font-normal leading-relaxed">
                We blend software architecture, bespoke UI/UX design, and strategic AI automation to engineer digital products that perform, scale, and inspire.
              </p>

              {/* ACTION BUTTONS (Solid Black Pills) */}
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <MagneticButton>
                  <Link
                    to={localePath('/projects')}
                    className="inline-flex items-center gap-3 bg-black text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md"
                  >
                    <span>Explore Featured Work</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>

                <MagneticButton>
                  <Link
                    to={localePath('/contact')}
                    className="inline-flex items-center gap-3 border border-gray-300 text-black font-semibold text-sm px-8 py-4 rounded-full hover:border-black hover:bg-gray-50 transition-all duration-300"
                  >
                    <span>Start a Project</span>
                  </Link>
                </MagneticButton>
              </div>

              {/* CAPABILITY BADGES */}
              <div className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono tracking-wider">
                <span>[ UMBRACO CMS ]</span>
                <span>[ .NET 8 / C# ]</span>
                <span>[ FLUTTER APPS ]</span>
                <span>[ AI AUTOMATION ]</span>
                <span>[ ENTERPRISE E-COMMERCE ]</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECH & PARTNERS MARQUEE */}
      <div className="py-5 border-b border-gray-200 bg-gray-50/80 overflow-hidden">
        <div className="flex gap-12 items-center whitespace-nowrap animate-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-gray-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF994D]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED WORK SHOWCASE WITH 21ST DEV SPOTLIGHT CARDS */}
      <section className="py-28 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-gray-200">
        <Scene>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-gray-200">
            <div>
              <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase block mb-3 font-semibold">
                02 / FEATURED WORK
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black">
                Selected Case Studies
              </h2>
            </div>
            <Link
              to={localePath('/projects')}
              className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-gray-600 transition-colors group"
            >
              <span>View all projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </Scene>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featured.map((p, idx) => (
            <Scene key={p.slug} delay={idx * 0.1}>
              <SpotlightCard
                href={localePath(`/projects/${p.slug}`)}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-black hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  {/* REAL PROJECT PHOTO HEADER */}
                  <div className="relative h-48 overflow-hidden bg-gray-900 mb-6 rounded-t-xl">
                    <img
                      src={p.image}
                      alt={p.en.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                      {p.favicon && (
                        <img
                          src={p.favicon}
                          alt=""
                          className="w-3.5 h-3.5 object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="text-[10px] font-mono font-bold text-black uppercase tracking-wider">
                        {p.en.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-md">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {p.en.name}
                      </h3>
                    </div>
                  </div>

                  <div className="px-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                      {p.en.overview}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 p-6 pt-4 border-t border-gray-100">
                  {p.tech.map((tech) => (
                    <span key={tech} className="text-xs font-mono px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </Scene>
          ))}
        </div>
      </section>

      {/* CAPABILITIES MATRIX */}
      <section className="py-28 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-gray-200">
        <Scene>
          <div className="mb-16">
            <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase block mb-3 font-semibold">
              03 / CAPABILITIES & SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black max-w-2xl">
              Bespoke Engineering Capabilities
            </h2>
          </div>
        </Scene>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {services.map((s, idx) => {
            const Icon = iconMap[s.icon] || Layers;
            return (
              <Scene key={s.slug} delay={idx * 0.08}>
                <Link
                  to={localePath(`/services/${s.slug}`)}
                  className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/80 px-6 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-6 md:w-1/2">
                    <span className="text-xs font-mono text-gray-400 mt-1 font-bold">0{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-black" />
                        <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors">
                          {s.en.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed font-normal">
                        {s.en.short}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/2">
                    <span className="text-xs font-mono text-gray-500 group-hover:text-black font-semibold">
                      Read details
                    </span>
                    <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </Scene>
            );
          })}
        </div>
      </section>

      {/* STUDIO PHILOSOPHY */}
      <section className="py-28 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-gray-200 bg-gray-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Scene>
              <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase block mb-3 font-semibold">
                04 / OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
                Human craftsmanship meets high-performance engineering.
              </h2>
            </Scene>
          </div>

          <div className="lg:col-span-7 space-y-6 text-gray-700 font-normal leading-relaxed text-base">
            <Scene delay={0.1}>
              <p>
                We strictly reject generic AI templates and bloated pre-made themes. Every digital platform engineered at ZYXEN is built from scratch with custom typography, clean architecture (.NET / Flutter / Umbraco), and strict speed optimization.
              </p>
            </Scene>
            <Scene delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span className="text-sm font-semibold text-black">Core Web Vitals 95+</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span className="text-sm font-semibold text-black">Enterprise .NET Security</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span className="text-sm font-semibold text-black">Editorial Typography</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span className="text-sm font-semibold text-black">Umbraco & Azure Cloud</span>
                </div>
              </div>
            </Scene>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-6 sm:px-10 lg:px-12 max-w-5xl mx-auto text-center">
        <Scene>
          <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase block mb-4 font-semibold">
            05 / LET'S TALK
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-tight">
            Ready to build your next digital product?
          </h2>
          <p className="mt-6 text-gray-600 max-w-xl mx-auto text-lg font-normal leading-relaxed">
            Contact our engineering team in Athens to discuss your project requirements and receive a tailored proposal.
          </p>
          <div className="mt-10">
            <MagneticButton>
              <Link
                to={localePath('/contact')}
                className="inline-flex items-center gap-3 bg-black text-white font-bold text-base px-10 py-5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl"
              >
                <span>Start a Conversation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </MagneticButton>
          </div>
        </Scene>
      </section>
    </div>
  );
}
