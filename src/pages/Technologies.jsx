import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import AnimatedSection from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const content = {
  en: {
    title: 'Our Technology Stack & Engineering Expertise',
    subtitle: 'The tools and methodologies that power every ZYXEN solution.',
    meta: 'Explore ZYXEN\'s technology stack: .NET, Flutter, Umbraco, nopCommerce, AI/ML, and DevOps. Premium software engineering for enterprise platforms and mobile apps.',
    intro: `At ZYXEN, technology selection is never arbitrary. Every platform, framework, and toolchain we adopt is evaluated against real-world scalability requirements, long-term maintainability, and the specific business goals of each client. Our engineering team has deep, production-proven expertise across a curated set of technologies that work together to deliver robust, high-performance digital systems.`,
    sections: [
      {
        heading: 'Enterprise .NET & C# Development',
        body: `Microsoft's .NET ecosystem forms the backbone of our enterprise backend work. We architect scalable APIs, background services, and data pipelines using ASP.NET Core, Entity Framework, and modern C# patterns including minimal APIs, records, and nullable reference types. Our .NET solutions are built for cloud-native deployment on Azure and AWS, with CI/CD pipelines that ensure rapid, reliable delivery. Whether the requirement is a high-throughput REST API, a real-time SignalR hub, or a complex domain-driven microservices architecture, our team delivers production-grade systems with thorough test coverage and clear documentation.`,
      },
      {
        heading: 'Cross-Platform Mobile with Flutter',
        body: `Flutter allows us to ship beautiful, performant mobile applications for iOS and Android from a single, well-structured codebase. We follow clean architecture principles — separating data, domain, and presentation layers — to produce apps that are easy to extend and test. Our Flutter projects integrate seamlessly with REST and GraphQL APIs, push notification services, local storage, and platform-specific native modules. The result is a native-quality user experience delivered at a fraction of the cost of maintaining two separate codebases.`,
      },
      {
        heading: 'CMS Solutions: Umbraco',
        body: `Umbraco is our CMS of choice for content-rich enterprise websites. Built on .NET, it gives editorial teams a flexible, intuitive backoffice while giving developers full control over markup and data structures. We implement Umbraco with custom content types, headless delivery via the Content Delivery API, and tight integration with third-party marketing and analytics platforms. Every Umbraco project we deliver is performance-optimized, WCAG-accessible, and structured for long-term editorial scalability.`,
      },
      {
        heading: 'E-Commerce with nopCommerce',
        body: `For digital commerce, we build on nopCommerce — an open-source, feature-rich platform that covers the full e-commerce lifecycle: product catalog management, multi-store and multi-currency support, payment gateway integration, order management, and marketing automation. We extend nopCommerce with custom plugins, bespoke theme development, and deep ERP/WMS integrations, giving merchants a unified commerce stack that scales from startup to enterprise volume.`,
      },
      {
        heading: 'AI, Machine Learning & Intelligent Automation',
        body: `We integrate machine learning capabilities into products where they create measurable business value. Our AI work spans recommendation engines, natural language processing pipelines, intelligent document processing, and predictive analytics dashboards. We leverage OpenAI APIs, Azure AI Services, and open-source models via Hugging Face, always with a pragmatic focus on data quality, explainability, and ROI. AI features are shipped as first-class product capabilities, not bolted-on prototypes.`,
      },
      {
        heading: 'DevOps, Cloud & Infrastructure',
        body: `Reliable software requires reliable infrastructure. Our DevOps practice covers containerisation with Docker and Kubernetes, infrastructure-as-code with Terraform and Bicep, automated testing pipelines in GitHub Actions and Azure DevOps, and observability with Application Insights and Grafana. We design for high availability, disaster recovery, and security compliance from day one, so that the systems we build can be trusted in production from the moment they launch.`,
      },
    ],
    cta: 'Start a Project',
  },
  el: {
    title: 'Τεχνολογικό Stack & Μηχανική Τεχνογνωσία',
    subtitle: 'Τα εργαλεία και οι μεθοδολογίες που τροφοδοτούν κάθε λύση ZYXEN.',
    meta: 'Ανακαλύψτε το τεχνολογικό stack της ZYXEN: .NET, Flutter, Umbraco, nopCommerce, AI/ML και DevOps. Premium software engineering για enterprise πλατφόρμες και mobile εφαρμογές.',
    intro: `Στη ZYXEN, η επιλογή τεχνολογίας δεν είναι ποτέ τυχαία. Κάθε πλατφόρμα, framework και toolchain που υιοθετούμε αξιολογείται με βάση πραγματικές απαιτήσεις κλιμάκωσης, μακροπρόθεσμη συντηρησιμότητα και τους συγκεκριμένους επιχειρηματικούς στόχους κάθε πελάτη.`,
    sections: [
      {
        heading: 'Enterprise .NET & C# Development',
        body: `Το οικοσύστημα .NET της Microsoft αποτελεί τη ραχοκοκαλιά των enterprise backend εργασιών μας. Σχεδιάζουμε κλιμακώσιμα APIs, υπηρεσίες παρασκηνίου και pipelines δεδομένων χρησιμοποιώντας ASP.NET Core, Entity Framework και σύγχρονα C# patterns. Οι λύσεις μας .NET είναι χτισμένες για cloud-native deployment σε Azure και AWS, με CI/CD pipelines που εξασφαλίζουν γρήγορη και αξιόπιστη παράδοση.`,
      },
      {
        heading: 'Cross-Platform Mobile με Flutter',
        body: `Το Flutter μας επιτρέπει να παραδίδουμε όμορφες, υψηλής απόδοσης mobile εφαρμογές για iOS και Android από ένα ενιαίο codebase. Ακολουθούμε αρχές clean architecture — διαχωρισμός data, domain και presentation layers — για εφαρμογές που είναι εύκολο να επεκταθούν και να δοκιμαστούν.`,
      },
      {
        heading: 'CMS Λύσεις: Umbraco',
        body: `Το Umbraco είναι το CMS επιλογής μας για πλούσια σε περιεχόμενο enterprise websites. Χτισμένο σε .NET, δίνει στις συντακτικές ομάδες ένα ευέλικτο backoffice ενώ δίνει στους developers πλήρη έλεγχο. Κάθε project Umbraco που παραδίδουμε είναι βελτιστοποιημένο για απόδοση και WCAG-accessible.`,
      },
      {
        heading: 'E-Commerce με nopCommerce',
        body: `Για ψηφιακό εμπόριο, κτίζουμε σε nopCommerce — μια open-source πλατφόρμα που καλύπτει τον πλήρη κύκλο ζωής e-commerce. Επεκτείνουμε το nopCommerce με custom plugins, bespoke theme development και βαθείες ERP/WMS ενσωματώσεις.`,
      },
      {
        heading: 'AI, Machine Learning & Ευφυής Αυτοματισμός',
        body: `Ενσωματώνουμε δυνατότητες machine learning σε προϊόντα όπου δημιουργούν μετρήσιμη επιχειρηματική αξία. Η AI εργασία μας охватывает μηχανές συστάσεων, pipelines επεξεργασίας φυσικής γλώσσας και dashboards προγνωστικής ανάλυσης. Χρησιμοποιούμε OpenAI APIs, Azure AI Services και open-source μοντέλα.`,
      },
      {
        heading: 'DevOps, Cloud & Υποδομή',
        body: `Αξιόπιστο λογισμικό απαιτεί αξιόπιστη υποδομή. Η DevOps πρακτική μας καλύπτει containerisation με Docker και Kubernetes, infrastructure-as-code, αυτοματοποιημένα pipelines δοκιμών και observability. Σχεδιάζουμε για υψηλή διαθεσιμότητα και συμμόρφωση ασφαλείας από την πρώτη μέρα.`,
      },
    ],
    cta: 'Ξεκινήστε ένα Project',
  },
};

export default function Technologies() {
  const { lang, localePath } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title={`${c.title} — ZYXEN`}
        description={c.meta}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 60% 20%, rgba(175,153,77,0.07), transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: '#AF994D' }} />
              <p className="text-xs font-medium tracking-[0.22em] uppercase" style={{ color: '#AF994D' }}>
                {lang === 'el' ? 'Τεχνολογία & Τεχνογνωσία' : 'Technology & Expertise'}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight max-w-4xl">
              {c.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{c.subtitle}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <AnimatedSection delay={0.1}>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed border-l-2 pl-6" style={{ borderColor: '#AF994D' }}>
            {c.intro}
          </p>
        </AnimatedSection>
      </section>

      {/* Technology sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid gap-10 sm:gap-14">
          {c.sections.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.07}>
              <article className="group border border-border/50 rounded-2xl p-7 sm:p-9 bg-card hover:border-primary/30 transition-colors duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #AF994D, transparent)' }} />
                <h2 className="text-xl sm:text-2xl font-display font-semibold mb-4">{s.heading}</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{s.body}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-20 text-center">
        <AnimatedSection>
          <p className="text-xs font-medium tracking-[0.22em] uppercase mb-4" style={{ color: '#AF994D' }}>
            ZYXEN
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
            {lang === 'el' ? 'Έτοιμοι να χτίσουμε μαζί;' : 'Ready to build together?'}
          </h2>
          <Link to={localePath('/contact')}
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            {c.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}