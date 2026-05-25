import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { services, projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowLeft, ArrowRight, CheckCircle, Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket } from 'lucide-react';

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket };

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, lang, localePath } = useLanguage();
  const service = services.find(s => s.slug === slug);

  if (!service) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Service not found</p>
        <Link to={localePath('/services')} className="text-primary text-sm mt-2 inline-block">{t('back')}</Link>
      </div>
    </div>
  );

  const s = service[lang];
  const Icon = iconMap[service.icon] || Layers;
  const related = projects.filter(p => p.tech.some(t => service.tech.includes(t))).slice(0, 3);

  return (
    <div>
      <section className="py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Link to={localePath('/services')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </Link>
          <AnimatedSection>
            <Icon className="w-12 h-12 text-primary mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold">{s.name}</h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-3xl leading-relaxed">{s.description}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sub-services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-bold mb-8">{lang === 'el' ? 'Υπηρεσίες' : 'Services'}</h2>
            <div className="grid gap-4">
              {s.subServices.map((sub, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{sub}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <div>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-2xl font-bold mb-8">Use Cases</h2>
              <div className="flex flex-col gap-4">
                {s.useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{uc}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="mt-12">
              <h2 className="font-display text-2xl font-bold mb-6">{lang === 'el' ? 'Οφέλη' : 'Benefits'}</h2>
              <div className="flex flex-col gap-3">
                {s.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="flex flex-wrap gap-4 justify-center">
            {service.tech.map(t => (
              <span key={t} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium">{t}</span>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold mb-10">{t('relatedProjects')}</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <AnimatedSection key={p.slug} delay={i * 0.1}>
                  <Link to={localePath(`/projects/${p.slug}`)} className="group block bg-card border border-border rounded-2xl p-7 hover:border-primary/30 transition-all">
                    <p className="text-xs text-primary uppercase tracking-wider">{p[lang].category}</p>
                    <h3 className="font-display font-semibold mt-2 group-hover:text-primary transition-colors">{p[lang].name}</h3>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold">{t('ctaTitle')}</h2>
            <Link to={localePath('/contact')} className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity">
              {t('ctaBtn')} <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}