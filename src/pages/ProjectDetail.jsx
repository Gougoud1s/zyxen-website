import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import SEOMeta from '@/components/SEOMeta';
import { breadcrumbSchema } from '@/lib/structuredData';
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, BarChart2, CheckCircle, Monitor } from 'lucide-react';
import { Interactive2DCanvas } from '@/components/Interactive2DCanvas';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { localePath } = useLanguage();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-[#121212]">
        <SEOMeta noindex title="Case Study | ZYXEN" />
        <div className="text-center">
          <p className="text-gray-500">Project case study not found.</p>
          <Link to={localePath('/projects')} className="text-black font-semibold text-sm mt-4 inline-block underline">
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const p = project.en || project;
  const related = projects.filter((r) => r.slug !== slug).slice(0, 3);

  const metaTitle = `${p.name} — Case Study | ZYXEN`;
  const metaDesc = p.overview;
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: `/en` },
    { name: 'Projects', path: `/en/projects` },
    { name: p.name, path: `/en/projects/${slug}` },
  ]);

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-12 overflow-x-hidden">
      <SEOMeta title={metaTitle} description={metaDesc} jsonLd={breadcrumbs} />

      {/* HERO SECTION */}
      <section className="relative py-20 sm:py-28 border-b border-gray-200 bg-white">
        <Interactive2DCanvas opacity={0.35} density={25} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <Link
            to={localePath('/projects')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>

          <AnimatedSection variant="depth">
            <div className="flex items-center gap-3 mb-4">
              {project.favicon && (
                <img
                  src={project.favicon}
                  alt={p.name}
                  className="w-6 h-6 object-contain rounded-md border border-gray-200 bg-white p-0.5"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
                {p.category} — ARCHITECTURAL CASE STUDY
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-black max-w-4xl leading-tight">
              {p.name}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-6 max-w-3xl leading-relaxed font-normal">
              {p.overview}
            </p>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all mt-8 shadow-md"
              >
                Visit Live Platform <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* METRICS & KEY IMPACT BANNER */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="py-12 bg-black text-white border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="pt-4 md:pt-0">
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-[#D4AF37] block mb-1">
                    {m.val}
                  </span>
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INTERACTIVE BROWSER SCREENSHOT STORYTELLING MOCKUP */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12">
          <AnimatedSection variant="depth">
            <div className="text-center mb-10">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
                INTERFACE & VISUAL SCREENSHOT
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-black">
                Visual Showcase & Platform Design
              </h2>
            </div>

            {/* Browser Window Frame with Real Screenshot */}
            <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
              {/* Browser Header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                </div>
                <div className="bg-white border border-gray-300 rounded-md px-4 py-1 text-xs font-mono text-gray-600 flex items-center gap-2 w-full max-w-md mx-auto justify-center shadow-inner">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>{project.url || `https://${project.slug}.zyxen.io`}</span>
                </div>
                <div className="w-12 text-right">
                  <Monitor className="w-4 h-4 text-gray-400 inline-block" />
                </div>
              </div>

              {/* Real Project Photo / Visual Viewport */}
              <div className="relative group overflow-hidden max-h-[550px]">
                <img
                  src={project.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    {project.favicon && (
                      <img
                        src={project.favicon}
                        alt=""
                        className="w-5 h-5 object-contain bg-white rounded p-0.5"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <p className="text-sm text-gray-200 max-w-xl mt-1">{p.focus}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CASE STUDY DEEP DIVE */}
      <section className="py-24 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col gap-16">
          {[
            { label: '01 / ARCHITECTURAL CHALLENGE', content: p.challenge },
            { label: '02 / ENGINEERING SOLUTION', content: p.solution },
            { label: '03 / MEASURABLE RESULTS & IMPACT', content: p.results },
          ].map((section, i) => (
            <AnimatedSection key={i} delay={i * 0.1} variant="depth">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm hover:border-black transition-colors">
                <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-widest block mb-4">
                  {section.label}
                </span>
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed">{section.content}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">
            TECHNOLOGY STACK & TOOLS
          </span>
          <div className="flex flex-wrap gap-3 justify-center">
            {project.tech.map((t) => (
              <span key={t} className="px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-black shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED CASE STUDIES */}
      {related.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
            <AnimatedSection variant="depth">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-10">
                More Case Studies
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <AnimatedSection key={r.slug} delay={i * 0.1} variant="depth">
                  <Link
                    to={localePath(`/projects/${r.slug}`)}
                    className="group block bg-gray-50 border border-gray-200 rounded-2xl p-7 hover:border-black hover:bg-white hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="h-40 rounded-xl overflow-hidden mb-4 bg-gray-200 relative">
                      <img
                        src={r.image}
                        alt={r.en?.name || r.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-xs text-[#D4AF37] font-mono uppercase font-bold">
                      {r.en?.category || r.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-black mt-2 group-hover:text-[#D4AF37] transition-colors">
                      {r.en?.name || r.name}
                    </h3>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}