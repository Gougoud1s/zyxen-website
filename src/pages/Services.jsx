import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { services } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import SEOMeta from '@/components/SEOMeta';
import { ArrowRight, Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket } from 'lucide-react';
import { Interactive2DCanvas, AnimatedSVGObject } from '@/components/Interactive2DCanvas';

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket };

export default function Services() {
  const { localePath } = useLanguage();

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-2 overflow-x-hidden">
      <SEOMeta
        title="Engineering Services — Umbraco, .NET, Mobile & AI | ZYXEN"
        description="Comprehensive software engineering capabilities: enterprise CMS portals, high-scale e-commerce, native mobile applications, and AI integrations."
      />

      {/* HERO SECTION */}
      <section className="relative py-28 lg:py-36 border-b border-gray-200 overflow-hidden bg-white">
        <Interactive2DCanvas opacity={0.35} density={30} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <AnimatedSection variant="depth">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#AF994D] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                02 / CAPABILITIES & SERVICES
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black max-w-5xl leading-[1.08]">
              Fullstack software solutions engineered for high performance.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl leading-relaxed font-normal">
              We engineer scalable digital infrastructure for modern enterprises. Explore our core engineering competencies below.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute right-12 top-16 hidden lg:block opacity-30 pointer-events-none">
          <AnimatedSVGObject type="grid-nodes" className="w-40 h-40" />
        </div>
      </section>

      {/* SERVICES LIST — 21ST.DEV SPOTLIGHT CARDS */}
      <section className="py-24 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col gap-8">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Layers;
            return (
              <AnimatedSection key={s.slug} delay={i * 0.08} variant="depth">
                <Link
                  to={localePath(`/services/${s.slug}`)}
                  className="group block bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:border-black hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                        <Icon className="w-8 h-8 text-black group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-[#AF994D] tracking-widest uppercase">
                          0{i + 1} / CAPABILITY
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mt-2 group-hover:text-[#AF994D] transition-colors">
                          {s.en?.name || s.name}
                        </h2>
                        <p className="text-gray-600 mt-4 leading-relaxed max-w-3xl text-base">
                          {s.en?.description || s.description}
                        </p>
                        <div className="flex flex-wrap gap-2.5 mt-6">
                          {s.tech.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium border border-gray-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-start flex-shrink-0 text-sm font-semibold text-black group-hover:text-[#AF994D] transition-colors">
                      <span>Explore Capability</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-28 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-black max-w-3xl mx-auto leading-tight">
              Have a custom engineering requirement?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
              Our architects design tailormade technical specifications for complex domain problems.
            </p>
            <div className="mt-10">
              <Link
                to={localePath('/contact')}
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg"
              >
                Request Architectural Consult <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
