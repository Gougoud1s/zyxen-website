import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import AnimatedSection from '@/components/AnimatedSection';
import TextReveal from '@/components/TextReveal';
import TiltCard from '@/components/TiltCard';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function About() {
  const { t, localePath } = useLanguage();
  const a = t('aboutPage');

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="py-28 sm:py-36 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(175,153,77,0.05), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection variant="depth">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ background: '#AF994D' }} />
              <p className="text-xs font-medium tracking-[0.22em] uppercase" style={{ color: '#AF994D' }}>{t('nav.about')}</p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold max-w-4xl leading-tight">
              <TextReveal text={a.title} />
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-8 max-w-3xl leading-relaxed">{a.desc}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* How + What */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 sm:gap-16">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">{a.howTitle}</h2>
            <div className="mt-8 flex flex-col gap-4">
              {a.how.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#AF994D' }} />
                  <span className="text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15} variant="depth">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">{a.whatTitle}</h2>
            <div className="mt-8 flex flex-col gap-5">
              {a.what.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(175,153,77,0.12)' }}>
                    <span className="text-xs font-bold" style={{ color: '#AF994D' }}>{i + 1}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-28 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 100% 50%, rgba(255,107,44,0.04), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection variant="depth">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: '#AF994D' }} />
              <p className="text-xs font-medium tracking-[0.22em] uppercase" style={{ color: '#AF994D' }}>{a.processTitle}</p>
            </div>
          </AnimatedSection>
          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {a.steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.1} variant="depth">
                <TiltCard intensity={4} className="h-full">
                  <div className="bg-background border border-border rounded-2xl p-6 sm:p-7 h-full">
                    <span className="text-3xl font-display font-bold" style={{ color: 'rgba(175,153,77,0.35)' }}>{step.num}</span>
                    <h3 className="font-display text-lg font-semibold mt-4">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{step.desc}</p>
                  </div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 sm:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection variant="depth">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto">
              <TextReveal text={a.collab} />
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{a.collabDesc}</p>
            <Link to={localePath('/contact')}
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity min-h-[44px]">
              {t('ctaBtn')} <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}