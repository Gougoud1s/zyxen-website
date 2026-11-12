/**
 * Search-facing copy for each service page, keyed by slug.
 *
 * `title` is the page heading in the words buyers search with ("mobile app development"), while the
 * service's own name in data.js ("Flutter Web/Mobile") stays as the label above it. The FAQs answer the
 * questions people ask search engines and AI assistants; they only state what the studio actually offers
 * (no prices, no outcome figures that the owner has not supplied).
 */
export const serviceSeo = {
  'umbraco-platform-engineering': {
    title: 'Umbraco development for content-rich websites',
    metaTitle: 'Umbraco Development Agency in Greece | ZYXEN',
    metaDescription:
      'Umbraco CMS and .NET development from Athens: content modelling, multi-language sites, upgrades and migrations, for teams in Greece and abroad.',
    faq: [
      {
        q: 'Can you upgrade or migrate an older Umbraco website?',
        a: 'Yes. We review the existing site, its document types and custom code, then set out the upgrade or migration path, including content moves and testing, in a written proposal before work begins.',
      },
      {
        q: 'Will our team be able to edit the website without a developer?',
        a: 'That is the point of the build. We model content around how your team works, group fields into clear tabs and build reusable page components, so editors can publish and update pages on their own.',
      },
      {
        q: 'Do you work with agencies as an Umbraco development partner?',
        a: 'Yes. Several projects in our portfolio were delivered inside another agency’s team, including Redirect and Threenitas. Each case study names the lead agency and explains our specific contribution.',
      },
    ],
  },
  'web-experiences-seo': {
    title: 'Website development and technical SEO',
    metaTitle: 'Website Development & Technical SEO in Greece | ZYXEN',
    metaDescription:
      'Fast, search-ready websites from Athens: technical SEO audits, Core Web Vitals, structured data and analytics, for businesses in Greece and abroad.',
    faq: [
      {
        q: 'Can you guarantee first place on Google?',
        a: 'No one can honestly guarantee rankings. We fix what is in your control (crawlability, page speed, structured data, titles and content structure) and report on how search visibility changes afterwards.',
      },
      {
        q: 'Can you improve the website we already have?',
        a: 'Yes. We start with a technical SEO and performance audit of the existing site, then implement the fixes in order of impact, whether or not we built the original website.',
      },
      {
        q: 'Do you also manage Google Ads?',
        a: 'Yes. We manage and review Google Ads accounts alongside technical SEO work, as in our ongoing collaborations with the LED7 and Artisti Shop online stores.',
      },
    ],
  },
  'flutter-web-mobile': {
    title: 'Mobile app development for iOS, Android and web',
    metaTitle: 'Mobile App Development in Greece — iOS, Android & Web | ZYXEN',
    metaDescription:
      'Mobile apps for iPhone, Android and the web from one Flutter codebase, connected to your APIs and business systems. Based in Athens, working worldwide.',
    faq: [
      {
        q: 'Why build with Flutter instead of separate native apps?',
        a: 'Flutter produces the iPhone, Android and web versions from one codebase. You get one team, one set of features and consistent behaviour on every platform, instead of maintaining two or three separate apps.',
      },
      {
        q: 'Do you publish the app to the App Store and Google Play?',
        a: 'Yes. We set up the release pipeline, prepare the store submissions and handle publication to the App Store and Google Play, then support updates after launch.',
      },
      {
        q: 'Can the app connect to our existing systems?',
        a: 'Yes. Apps connect to your APIs, e-commerce platform or business software. For the inArtio marketplace, for example, Flutter tools for vendors work alongside a nopCommerce web store.',
      },
    ],
  },
  'commerce-nopcommerce': {
    title: 'E-commerce development on nopCommerce',
    metaTitle: 'E-commerce & nopCommerce Development in Greece | ZYXEN',
    metaDescription:
      'Online stores and B2B ordering portals on nopCommerce and .NET: catalogue, payments, shipping, multi-vendor marketplaces and support for existing stores.',
    faq: [
      {
        q: 'Can you take over support for an existing online store?',
        a: 'Yes. We provide ongoing technical support, technical SEO review and Google Ads management for existing stores, as we do for LED7 and Artisti Shop.',
      },
      {
        q: 'Do you build B2B ordering portals?',
        a: 'Yes. We build account-based ordering with customer-specific catalogues and secure sign-in, and contributed to the AstraZeneca B2B ordering portal in Greece.',
      },
      {
        q: 'Why nopCommerce?',
        a: 'nopCommerce is an open-source e-commerce platform built on .NET. It handles large catalogues, multiple stores and multiple vendors, and can be extended with custom workflows without per-sale platform fees.',
      },
    ],
  },
  'ai-integrations': {
    title: 'AI integration and business automation',
    metaTitle: 'AI Integration & Business Automation Services | ZYXEN',
    metaDescription:
      'AI assistants, document processing and automated workflows connected to your website, apps and .NET systems, to take repetitive work off your team.',
    faq: [
      {
        q: 'What kind of work can be automated?',
        a: 'Repetitive, rule-based work is the best place to start: extracting data from invoices and PDFs, routing enquiries, qualifying leads and drafting replies for a person to approve.',
      },
      {
        q: 'Where do we start?',
        a: 'With process mapping. We look at how the work is done today, pick the steps where automation saves the most time, and agree a first scope you can measure before expanding.',
      },
      {
        q: 'How is our data handled?',
        a: 'We agree where data is processed and stored before work begins, and design each integration to use only the data the workflow needs.',
      },
    ],
  },
  'delivery-devops': {
    title: 'CI/CD and DevOps for .NET teams',
    metaTitle: 'CI/CD & DevOps Services for .NET Teams | ZYXEN',
    metaDescription:
      'Automated build, test and deployment pipelines on Jenkins and Bitbucket Pipelines, with environment management, monitoring and a clear rollback plan.',
    faq: [
      {
        q: 'Which CI/CD tools do you work with?',
        a: 'Mainly Jenkins and Bitbucket Pipelines for .NET projects, including automated tests, environment-specific configuration and deployment to staging and production.',
      },
      {
        q: 'Can you work with our existing setup?',
        a: 'Yes. We usually start from the pipeline and servers you already have, fix the riskiest manual steps first and automate the rest gradually.',
      },
      {
        q: 'What do we get at handover?',
        a: 'Documented pipelines, a release and rollback procedure, and a walkthrough for your team, so releases do not depend on us.',
      },
    ],
  },
};
