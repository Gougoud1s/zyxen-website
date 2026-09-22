import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import AnimatedSection from '@/components/AnimatedSection';
import TextReveal from '@/components/TextReveal';
import SEOMeta from '@/components/SEOMeta';
import { CheckCircle, ArrowRight, ShieldCheck, Zap, Layers, Cpu } from 'lucide-react';
import { Interactive2DCanvas, AnimatedSVGObject } from '@/components/Interactive2DCanvas';

export default function About() {
  const { t, localePath } = useLanguage();

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-12 overflow-x-hidden">
      <SEOMeta
        title="About ZYXEN — Software Engineering Studio"
        description="ZYXEN is an elite software engineering studio crafting high-performance digital platforms, enterprise .NET architectures, and bespoke e-commerce systems."
      />

      {/* HERO SECTION — EDITORIAL MANIFESTO WITH INTERACTIVE 2D CANVAS */}
      <section className="relative py-28 lg:py-36 border-b border-gray-200 overflow-hidden bg-white">
        <Interactive2DCanvas opacity={0.4} density={30} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <AnimatedSection variant="depth">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#AF994D] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                01 / ABOUT THE STUDIO
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black max-w-5xl leading-[1.08]">
              Humanizing software engineering through architectural precision.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl leading-relaxed font-normal">
              We build mission-critical digital systems for ambitious brands. From Umbraco enterprise portals and high-scale .NET microservices to custom Next.js e-commerce storefronts, our work balances raw performance with human-centered aesthetics.
            </p>
          </AnimatedSection>
        </div>

        {/* Floating 2D Vector Object Accent */}
        <div className="absolute right-12 bottom-8 hidden lg:block opacity-40 pointer-events-none">
          <AnimatedSVGObject type="ring" className="w-32 h-32" />
        </div>
      </section>

      {/* PHILOSOPHY & PILLARS — HIGH CONTRAST BENTO GRID */}
      <section className="py-24 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <AnimatedSection variant="depth">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#AF994D]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#AF994D]">
                STUDIO PILLARS
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black max-w-2xl">
              Engineering standards that scale.
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                num: "01",
                title: "Zero Defect Security",
                desc: "Strict OWASP & GDPR compliant architectures with enterprise-grade data isolation and zero plain-text secrets."
              },
              {
                icon: Zap,
                num: "02",
                title: "Core Vitals Speed",
                desc: "Sub-second LCP and 98+ PageSpeed scores achieved through server-side edge caching and asset optimization."
              },
              {
                icon: Layers,
                num: "03",
                title: "Clean Architecture",
                desc: "Decoupled domain models, strict TypeScript safety, and CQRS patterns built to survive decades of iteration."
              },
              {
                icon: Cpu,
                num: "04",
                title: "Human Craftsmanship",
                desc: "No cookie-cutter AI output — bespoke editorial typography, kinetic physics, and tailored UX micro-interactions."
              }
            ].map((pillar, i) => (
              <AnimatedSection key={i} delay={i * 0.1} variant="depth">
                <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 h-full transition-all duration-300 hover:border-black hover:shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-sm font-mono font-semibold text-[#AF994D] tracking-wider">{pillar.num}</span>
                    <pillar.icon className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-black mb-3">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS STORYTELLING — TIMELINE ACCORDION */}
      <section className="py-24 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <AnimatedSection variant="depth">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#AF994D]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#AF994D]">
                OUR METHODOLOGY
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black">
              How we take projects from concept to production.
            </h2>
          </AnimatedSection>

          <div className="mt-16 space-y-6">
            {[
              {
                step: "01",
                name: "Discovery & System Architecture",
                desc: "We perform deep domain modeling, map database relationships, analyze edge cases, and define clear contract specifications before writing a single line of code."
              },
              {
                step: "02",
                name: "Kinetic UI/UX & Art Direction",
                desc: "High-contrast editorial typography, custom SVG iconography, and Lenis scroll physics are prototyped directly in code to eliminate design handoff drag."
              },
              {
                step: "03",
                name: "Enterprise Core Engineering",
                desc: "Fullstack development on Next.js, .NET 8, and Umbraco with 100% strict TypeScript types, automated CI/CD pipelines, and rigorous security scans."
              },
              {
                step: "04",
                name: "QA, Performance Benchmarking & Launch",
                desc: "Comprehensive load testing, SEO audit, accessibility validation, and smooth zero-downtime production deployment on Azure / Cloudflare."
              }
            ].map((st, i) => (
              <AnimatedSection key={i} delay={i * 0.1} variant="depth">
                <div className="border border-gray-200 rounded-2xl p-8 hover:border-black transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-mono font-bold text-gray-300 group-hover:text-[#AF994D] transition-colors">{st.step}</span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-black">{st.name}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">{st.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-28 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-black max-w-3xl mx-auto leading-tight">
              Ready to engineer your next digital breakthrough?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
              Let&apos;s build something exceptional together. Tell us about your project goals.
            </p>
            <div className="mt-10">
              <Link
                to={localePath('/contact')}
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg"
              >
                Start a Conversation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
