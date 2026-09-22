import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRight, Code2, Smartphone, Layout, ShoppingBag, Cpu, Cloud } from 'lucide-react';
import { Interactive2DCanvas } from '@/components/Interactive2DCanvas';
import { SpotlightCard } from '@/pages/Home';

const techSections = [
  {
    icon: Code2,
    heading: 'Enterprise .NET & C# Development',
    category: 'BACKEND & HIGH-THROUGHPUT APIS',
    body: `Microsoft's .NET ecosystem forms the backbone of our enterprise backend work. We architect scalable APIs, background services, and data pipelines using ASP.NET Core, Entity Framework, and modern C# patterns including minimal APIs, records, and domain-driven design.`,
    tags: ['.NET 8', 'ASP.NET Core', 'C# 12', 'Entity Framework', 'gRPC', 'SignalR'],
  },
  {
    icon: Smartphone,
    heading: 'Cross-Platform Mobile with Flutter',
    category: 'MOBILE PLATFORMS',
    body: `Flutter allows us to ship beautiful, performant mobile applications for iOS and Android from a single, well-structured codebase. We follow clean architecture principles to produce apps that are easy to extend, test, and scale.`,
    tags: ['Flutter 3', 'Dart', 'Bloc/Riverpod', 'Native Modules', 'Push Services'],
  },
  {
    icon: Layout,
    heading: 'CMS Solutions: Umbraco',
    category: 'ENTERPRISE CMS & CONTENT PLATFORMS',
    body: `Umbraco is our CMS of choice for content-rich enterprise websites. Built on .NET, it gives editorial teams a flexible, intuitive backoffice while giving developers full control over markup and content delivery APIs.`,
    tags: ['Umbraco 13', 'Headless Delivery', 'Custom Backoffice', 'WCAG 2.1 AA'],
  },
  {
    icon: ShoppingBag,
    heading: 'E-Commerce with nopCommerce',
    category: 'HIGH-SCALE DIGITAL COMMERCE',
    body: `For digital commerce, we build on nopCommerce — an open-source, feature-rich .NET platform covering product catalogs, multi-store/multi-currency setups, payment gateways, and deep ERP/WMS integrations.`,
    tags: ['nopCommerce 4.7', 'Custom Plugins', 'Multi-Store', 'ERP Integration'],
  },
  {
    icon: Cpu,
    heading: 'AI, Machine Learning & Automation',
    category: 'INTELLIGENT SYSTEMS',
    body: `We integrate machine learning capabilities into products where they create measurable business value — recommendation engines, NLP pipelines, document processing, and predictive analytics dashboards.`,
    tags: ['OpenAI APIs', 'Azure AI', 'Hugging Face', 'Vector Search', 'RAG Pipelines'],
  },
  {
    icon: Cloud,
    heading: 'DevOps, Cloud & Infrastructure',
    category: 'CLOUD NATIVE & CI/CD',
    body: `Reliable software requires reliable infrastructure. Our DevOps practice covers Docker/Kubernetes containerization, Terraform infrastructure-as-code, automated GitHub Actions pipelines, and Grafana observability.`,
    tags: ['Azure Cloud', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
];

export default function Technologies() {
  const { localePath } = useLanguage();

  return (
    <div className="bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-2 overflow-x-hidden">
      <SEOMeta
        title="Technology Architecture & Stack — ZYXEN"
        description="Explore ZYXEN's technology stack: .NET 8, Flutter, Umbraco, nopCommerce, AI integration, and Cloud DevOps."
      />

      {/* HERO */}
      <section className="relative py-28 sm:py-36 border-b border-gray-200 bg-white">
        <Interactive2DCanvas opacity={0.3} density={30} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <AnimatedSection variant="depth">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#AF994D] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                05 / STACK ARCHITECTURE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black max-w-5xl leading-[1.08]">
              Engineered toolchains for mission-critical software.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl leading-relaxed font-normal">
              Every platform and framework we adopt is evaluated against real-world scalability, security, and long-term maintainability.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* TECH MATRIX */}
      <section className="py-24 bg-gray-50/50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid md:grid-cols-2 gap-8">
          {techSections.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.1} variant="depth">
              <SpotlightCard className="h-full p-8 sm:p-10 bg-white border border-gray-200 rounded-3xl shadow-sm hover:border-black transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-black text-[#AF994D] flex items-center justify-center mb-6 shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#AF994D] uppercase tracking-widest block mb-2">
                    {s.category}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-black mb-4">
                    {s.heading}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                    {s.body}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                  {s.tags.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-md bg-gray-100 text-xs font-semibold font-mono text-gray-800">
                      {t}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection variant="depth">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#AF994D] block mb-4">
              ZYXEN SOFTWARE STUDIO
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-black mb-8">
              Need architectural advice on your technology stack?
            </h2>
            <Link
              to={localePath('/contact')}
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:bg-gray-800 transition-all shadow-xl"
            >
              Start a Discovery Session <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
