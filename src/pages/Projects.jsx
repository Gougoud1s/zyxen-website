import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { projects } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import SEOMeta from '@/components/SEOMeta';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Interactive2DCanvas } from '@/components/Interactive2DCanvas';

const categories = ['All', 'E-Commerce', 'Bespoke SaaS', 'Mobile App', 'Enterprise'];

export default function Projects() {
  const { localePath } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');

  const filteredProjects = activeTab === 'All'
    ? projects
    : projects.filter(p => p.en?.category?.toLowerCase().includes(activeTab.toLowerCase()) || p.category?.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-2 overflow-x-hidden">
      <SEOMeta
        title="Featured Work & Case Studies | ZYXEN"
        description="Explore engineering case studies across high-scale e-commerce, custom ERP/SaaS platforms, and cross-platform mobile apps built by ZYXEN."
      />

      {/* HERO SECTION */}
      <section className="relative py-28 sm:py-36 border-b border-gray-200 bg-white">
        <Interactive2DCanvas opacity={0.3} density={30} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <AnimatedSection variant="depth">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                03 / SELECTED WORK
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black max-w-5xl leading-[1.08]">
              Architectural case studies across high-stakes software domains.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl leading-relaxed font-normal">
              A curated look into enterprise e-commerce portals, custom business logic, and mobile applications engineered for long-term scalability.
            </p>

            {/* 21ST.DEV SEGMENTED CATEGORY TABS */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === cat
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="py-24 bg-gray-50/50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid md:grid-cols-2 gap-8">
          {filteredProjects.map((p, i) => {
            const proj = p.en || p;
            return (
              <AnimatedSection key={p.slug} delay={i * 0.08} variant="depth">
                <Link
                  to={localePath(`/projects/${p.slug}`)}
                  className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between relative"
                >
                  {/* REAL PROJECT PHOTO HEADER */}
                  <div className="relative h-64 overflow-hidden bg-gray-900">
                    <img
                      src={p.image}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                      {p.favicon && (
                        <img
                          src={p.favicon}
                          alt=""
                          className="w-4 h-4 object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="text-[10px] font-mono font-bold text-black uppercase tracking-wider">
                        {proj.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      {p.confidential ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 text-white text-[11px] font-semibold backdrop-blur-md">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> NDA
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-md">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="font-display text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {proj.name}
                      </h2>
                    </div>
                  </div>

                  {/* CONTENT BODY */}
                  <div className="p-8 sm:p-10 flex flex-col justify-between flex-grow">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {proj.overview}
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        <strong className="text-black">Architecture Focus:</strong> {proj.focus}
                      </p>
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