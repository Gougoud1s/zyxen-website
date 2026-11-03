export const serviceOffers = [
  {
    id: 'website', name: 'Business website', title: 'Give customers a clear route to your business.',
    audience: 'For businesses that need to explain their services, show their work and receive enquiries.',
    deliverables: ['Page structure and content plan', 'Responsive design and website development', 'Enquiry form and technical SEO setup', 'Launch checks and a content handover'],
    inputs: 'Your services, brand assets, available copy and images, and the action you want visitors to take.',
    scope: 'Page count, languages and content preparation are agreed in the proposal. E-commerce, custom integrations and ongoing care are scoped separately.',
    next: 'Start with the existing package for up to 5 pages, or discuss a larger website.',
    href: '/websites', cta: 'Explore the website package', project: 'ips', proof: 'See our IPS contribution',
  },
  {
    id: 'commerce', name: 'E-commerce', title: 'Build a store around the way you sell.',
    audience: 'For retailers launching a store or improving an existing catalogue and shopping journey.',
    deliverables: ['Catalogue and customer journey planning', 'Storefront and product-page implementation', 'Agreed payment and delivery setup', 'Order-flow testing and management handover'],
    inputs: 'Product data, variations, payment and shipping requirements, plus any existing store or business systems.',
    scope: 'Catalogue size, migration, ERP connections and product feeds are defined separately. Advertising management, ad spend and ongoing support are separate services.',
    next: 'Tell us whether you need a new store or support for an existing one. We will outline the relevant scope before pricing.',
    href: '/contact?offer=commerce', cta: 'Discuss your store', project: 'artistishop', proof: 'See our Artisti Shop support work',
  },
  {
    id: 'custom', name: 'Custom software & automation', title: 'Make a specific workflow work better.',
    audience: 'For teams working across disconnected tools or repeating the same manual process.',
    deliverables: ['Workflow map and agreed requirements', 'Custom interface or automation implementation', 'Agreed system connections', 'Scenario testing and technical handover'],
    inputs: 'The current process, who uses it, example inputs and outputs, and the systems involved.',
    scope: 'Start with a defined workflow. Additional systems, data migration, third-party subscriptions and ongoing support are scoped separately.',
    next: 'Describe one process you want to improve. We will work through the requirements and propose a bounded first delivery.',
    href: '/contact?offer=custom', cta: 'Discuss your workflow',
  },
];
