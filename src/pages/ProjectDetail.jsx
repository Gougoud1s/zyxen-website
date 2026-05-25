import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, lang, localePath } = useLanguage();
  const project = projects.find(p => p.slug === slug);

  if (!project) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Project not found</p>
        <Link to={localePath('/projects')} className="text-primary text-sm mt-2 inline-block">{t('back')}</Link>
      </div>
    </div>
  );

  const p = project[lang];
  const related = projects.filter(r => r.slug !== slug).slice(0, 3);

  return (
    <div>
      <section className="py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Link to={localePath('/projects')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </Link>
          <AnimatedSection>
            <p className="text-sm text-primary font-medium uppercase tracking-wider">{p.category}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">{p.name}</h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-3xl leading-relaxed">{p.overview}</p>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary mt-6 hover:underline font-medium">
                {t('visitSite')} <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-16">
          {[
            { label: t('problem'), content: p.challenge },
            { label: t('solution'), content: p.solution },
            { label: t('results'), content: p.results },
          ].map((section, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-display font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">{section.label}</h2>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-xl font-bold mb-6 text-center">{t('tech')}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {project.tech.map(t => (
                <span key={t} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium">{t}</span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-bold mb-10">{t('relatedProjects')}</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r, i) => (
              <AnimatedSection key={r.slug} delay={i * 0.1}>
                <Link to={localePath(`/projects/${r.slug}`)} className="group block bg-card border border-border rounded-2xl p-7 hover:border-primary/30 transition-all">
                  <p className="text-xs text-primary uppercase tracking-wider">{r[lang].category}</p>
                  <h3 className="font-display font-semibold mt-2 group-hover:text-primary transition-colors">{r[lang].name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r[lang].overview}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}