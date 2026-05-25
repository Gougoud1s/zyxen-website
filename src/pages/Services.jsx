import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { services } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRight, Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket } from 'lucide-react';

const iconMap = { Layers, Globe, Smartphone, ShoppingCart, Brain, Rocket };

export default function Services() {
  const { t, lang, localePath } = useLanguage();
  const sp = t('servicesPage');

  return (
    <div className="overflow-x-hidden">
      <section className="py-28 sm:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-sm text-primary font-medium tracking-widest uppercase mb-4">{t('nav.services')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight">{sp.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-6 sm:mt-8 max-w-3xl leading-relaxed">{sp.desc}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Layers;
            return (
              <AnimatedSection key={s.slug} delay={i * 0.05}>
                <Link to={localePath(`/services/${s.slug}`)} className="group block bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">{s[lang].name}</h2>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                      </div>
                      <p className="text-muted-foreground mt-3 leading-relaxed">{s[lang].description}</p>
                      <div className="flex flex-wrap gap-2 mt-5">
                        {s.tech.map(tech => <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{tech}</span>)}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </div>
  );
}