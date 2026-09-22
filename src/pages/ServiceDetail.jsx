import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { services, projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import SEOMeta from '@/components/SEOMeta';
import { serviceSchema } from '@/lib/structuredData';
import { ArrowLeft, ArrowRight, CheckCircle, Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket } from 'lucide-react';
import { Interactive2DCanvas } from '@/components/Interactive2DCanvas';

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket };

export default function ServiceDetail() {
  const { slug } = useParams();
  const { localePath } = useLanguage();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-[#121212]">
        <SEOMeta noindex title="Service | ZYXEN" />
        <div className="text-center">
          <p className="text-gray-500">Service capability not found.</p>
          <Link to={localePath('/services')} className="text-black font-semibold text-sm mt-4 inline-block underline">
            Back to Capabilities
          </Link>
        </div>
      </div>
    );
  }

  const s = service.en || service;
  const Icon = iconMap[service.icon] || Layers;
  const related = projects.filter((p) => p.tech.some((t) => service.tech.includes(t))).slice(0, 3);

  const metaTitle = `${s.name} | ZYXEN Engineering`;
  const metaDesc = s.description ? s.description.slice(0, 157) + '…' : '';

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-2 overflow-x-hidden">
      <SEOMeta title={metaTitle} description={metaDesc} jsonLd={serviceSchema(service, 'en')} />

      {/* HERO SECTION */}
      <section className="relative py-24 sm:py-32 border-b border-gray-200 bg-white">
        <Interactive2DCanvas opacity={0.3} density={25} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <Link
            to={localePath('/services')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Capabilities
          </Link>

          <AnimatedSection variant="depth">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-md">
              <Icon className="w-8 h-8" />
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-black max-w-4xl leading-tight">
              {s.name}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-6 max-w-3xl leading-relaxed font-normal">
              {s.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SUB SERVICES & USE CASES */}
      <section className="py-24 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid lg:grid-cols-2 gap-16">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-8">
              Core Deliverables
            </h2>
            <div className="grid gap-4">
              {s.subServices?.map((sub, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-[#AF994D] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base font-medium text-black">{sub}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection delay={0.1} variant="depth">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-8">
                Enterprise Use Cases
              </h2>
              <div className="flex flex-col gap-4">
                {s.useCases?.map((uc, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{uc}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {s.benefits && (
              <AnimatedSection delay={0.2} className="mt-12" variant="depth">
                <h2 className="font-display text-2xl font-bold text-black mb-6">Key Business Impact</h2>
                <div className="grid gap-3">
                  {s.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#AF994D]" />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#AF994D] mb-4 block">
            TECHNOLOGY STACK
          </span>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {service.tech.map((t) => (
              <span key={t} className="px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-black">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
            <AnimatedSection variant="depth">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-10">
                Case Studies Utilizing This Stack
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <AnimatedSection key={p.slug} delay={i * 0.1} variant="depth">
                  <Link
                    to={localePath(`/projects/${p.slug}`)}
                    className="group block bg-white border border-gray-200 rounded-2xl p-7 hover:border-black hover:shadow-xl transition-all"
                  >
                    <span className="text-xs text-[#AF994D] font-mono uppercase tracking-wider font-bold">
                      {p.en?.category || p.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-black mt-2 group-hover:text-[#AF994D] transition-colors">
                      {p.en?.name || p.name}
                    </h3>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 bg-white border-t border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-black max-w-2xl mx-auto">
              Discuss your project specification.
            </h2>
            <div className="mt-8">
              <Link
                to={localePath('/contact')}
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg"
              >
                Schedule Technical Discovery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
