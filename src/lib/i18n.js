import { useParams, useNavigate, useLocation } from 'react-router-dom';

const translations = {
  en: {
    nav: { home: 'Home', about: 'About', services: 'Services', projects: 'Projects', contact: 'Contact', cta: 'Start a Project' },
    hero: {
      tag: 'Software Engineering · AI · Automation',
      title1: 'We build platforms',
      title2: 'that scale businesses.',
      desc: 'Umbraco, Flutter, and commerce execution based on real projects. From industrial platforms to hospitality ecosystems and public-sector solutions.',
      cta1: 'View Projects', cta2: 'Our Services'
    },
    stats: { projects: 'Project References', tech: 'Umbraco + Flutter', scope: 'B2B to Public', projectsDesc: 'Platforms in industry, health, hospitality, art and commerce', techDesc: 'Unified CMS and app delivery in the same execution layer', scopeDesc: 'From enterprise portals to citizen-facing platforms' },
    featuredTitle: 'Featured Projects',
    featuredSub: 'Platforms where we have contributed',
    servicesTitle: 'What We Deliver',
    servicesSub: 'Implementation lines from practical experience',
    capTitle: 'Modern Delivery Stack',
    capSub: 'Beyond development',
    ctaTitle: 'Ready to build your next digital product?',
    ctaSub: 'Share your goals, budget range and timeline. We will send you a practical response with scope options and next steps.',
    ctaBtn: 'Start Your Project',
    aboutPage: {
      title: 'Practical delivery profile based on real platforms.',
      desc: 'Our experience covers industrial websites, premium brand storytelling, public-sector platforms, hospitality ecosystems, B2B portals and commerce operations with vendor tools.',
      howTitle: 'How We Work',
      how: ['Contribution clarity', 'Production-first decisions', 'Clean handover mindset'],
      whatTitle: 'What This Means For Your Project',
      what: ['Architecture that fits real editor/workflow needs.', 'Faster implementation through reusable patterns.', 'SEO and performance built into delivery.', 'Transparent scope and realistic commitments.'],
      processTitle: 'Our Process',
      steps: [
        { num: '01', title: 'Discover', desc: 'Stakeholder alignment, constraints, KPIs and written scope.' },
        { num: '02', title: 'Blueprint', desc: 'User flows, component model, CMS/app architecture and implementation plan.' },
        { num: '03', title: 'Build', desc: 'Sprint milestones, demos, QA gates and staging releases.' },
        { num: '04', title: 'Ship & Tune', desc: 'Production rollout, monitoring, performance checks and conversion improvements.' }
      ],
      collab: 'Want implementation with accountability from kickoff to launch?',
      collabDesc: 'We integrate into your team structure and deliver in clear milestones.'
    },
    servicesPage: {
      title: 'Practical product and platform services for modern teams.',
      desc: 'We deliver Umbraco engineering, Flutter experiences and commerce execution with focus on performance, SEO and conversion impact.'
    },
    projectsPage: {
      title: 'Contribution-based projects across multiple sectors.',
      desc: 'Projects with substantial technical contribution, focusing on scalable architecture, premium user experiences and enterprise solutions.',
      note: 'References are presented exclusively for experience and technical contribution. Unless stated otherwise, these are contribution-based projects and do not imply full ownership.'
    },
    contactPage: {
      title: "Let's build your next digital product.",
      desc: 'Share your goals, budget range and timeline. We will send you a practical response with scope options and next steps.',
      info: { email: 'Email', location: 'Location', locationVal: 'Greece (remote-first)', response: 'Response Time', responseVal: 'Within one business day' },
      form: { name: 'Full Name', email: 'Email', service: 'Service', servicePh: 'Select service', budget: 'Budget Range', budgetPh: 'Select budget', details: 'Project Details', submit: 'Send Request', sending: 'Sending...', success: 'Your request has been sent! We will respond within one business day.', error: 'Something went wrong. Please try again.' },
      services: ['Umbraco Platform', 'Flutter App', 'Website', 'AI & Automation', 'Commerce', 'Other'],
      budgets: ['€5k - €10k', '€10k - €25k', '€25k+']
    },
    footer: { tagline: 'Software engineering, AI integration and platform delivery based in Greece.', nav: 'Navigation', connect: 'Connect', rights: 'All rights reserved.' },
    viewProject: 'View Case Study', visitSite: 'Visit Website', learnMore: 'Learn More',
    back: 'Back', overview: 'Overview', problem: 'Challenge', solution: 'Solution', tech: 'Technologies', results: 'Results', relatedProjects: 'Related Projects',
    homeProcess: {
      label: 'How We Work',
      title: 'Four steps, zero ambiguity.',
      steps: [
        { num: '01', title: 'Discover', desc: 'Written scope, stakeholder alignment and KPIs defined before any code is written.' },
        { num: '02', title: 'Blueprint', desc: 'Architecture decisions, user flows and component model agreed with your team.' },
        { num: '03', title: 'Build', desc: 'Sprint milestones, QA gates and staging demos keep you in the loop.' },
        { num: '04', title: 'Ship & Tune', desc: 'Production rollout with monitoring, performance checks and conversion improvements.' },
      ],
    },
    homeMetrics: [
      { to: 7, suffix: '+', label: 'Platforms Shipped' },
      { to: 4, suffix: '', label: 'Sectors' },
      { to: 3, suffix: '+', label: 'Countries' },
      { to: 1, suffix: ' day', label: 'Response SLA' },
    ],
    faqTitle: 'Common Questions',
    faqSub: 'Practical answers before you reach out.',
    faq: [
      { q: 'How do we start?', a: "Fill in the contact form with your goals, budget range and timeline. We review every submission and respond within one business day with clear scope options and next steps." },
      { q: 'What is the minimum project budget?', a: "We typically engage from €5,000. Below that threshold, coordination overhead makes it difficult to deliver quality results. We're happy to discuss what fits your budget." },
      { q: 'Do you work remotely?', a: "Yes — remote-first. We work with clients across Europe using structured async communication and clear milestone reviews. Geography is never a bottleneck." },
      { q: 'What does "contribution-based" mean in your portfolio?', a: "It means we contributed technically as part of a team or as a vendor. These entries demonstrate real-world expertise in specific sectors — not necessarily full ownership of the product." },
      { q: 'Do you offer post-launch support?', a: "Yes. Support and maintenance arrangements are tailored per project — from ad hoc fixes to monthly retainers. We discuss this during scoping." },
    ],
    focus: 'Focus', status: 'Status'
  }
};

export function useLanguage() {
  const currentLang = 'en';
  
  const t = (key) => {
    const keys = key.split('.');
    let val = translations.en;
    for (const k of keys) {
      val = val?.[k];
    }
    return val || key;
  };

  const switchLang = () => {};

  const localePath = (path) => path;

  return { lang: currentLang, t, switchLang, localePath };
}
