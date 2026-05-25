import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowUpRight, Lock } from 'lucide-react';

export default function Projects() {
  const { t, lang, localePath } = useLanguage();
  const pp = t('projectsPage');

  return (
    <div className="overflow-x-hidden">
      <section className="py-28 sm:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-sm text-primary font-medium tracking-widest uppercase mb-4">{t('nav.projects')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight">{pp.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-6 sm:mt-8 max-w-3xl leading-relaxed">{pp.desc}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xs text-muted-foreground mt-6 max-w-2xl border-l-2 border-primary/30 pl-4 italic">{pp.note}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-5 sm:gap-6">
          {projects.map((p, i) => (
            <AnimatedSection key={p.slug} delay={i * 0.07}>
              <Link to={localePath(`/projects/${p.slug}`)} className="group block bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">{p[lang].category}</p>
                    <h2 className="font-display text-xl font-semibold mt-2 group-hover:text-primary transition-colors">{p[lang].name}</h2>
                  </div>
                  {p.confidential ? <Lock className="w-4 h-4 text-muted-foreground" /> : <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{p[lang].overview}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {p.tech.map(tech => <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{tech}</span>)}
                </div>
                <p className="text-xs text-muted-foreground mt-4"><span className="font-medium text-foreground">{t('focus')}:</span> {p[lang].focus}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}