import ServiceOffers from '@/components/ServiceOffers';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { projects, services, partners } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import '@/marketing.css';

const featuredSlugs = ['creta-maris', 'led7', 'artistishop', 'ips'];
const featured = featuredSlugs.map(slug => projects.find(project => project.slug === slug));

export default function MarketingHome() {
  const { localePath, t } = useLanguage();
  const heroProject = featured[0];
  return <div className="marketing">
    <SEOMeta language="en" title="Websites, E-commerce & Custom Software | ZYXEN Greece" description="ZYXEN is a software studio in Greece building business websites, e-commerce, mobile apps and automation. Explore our services and real project contributions." jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'ZYXEN', url: 'https://www.zyxen.gr', email: 'hello@zyxen.gr' }} />
    <section className="m-hero m-wrap" aria-labelledby="home-title">
      <div className="m-hero-copy">
        <p className="m-label">Software studio / Athens, Greece</p>
        <h1 id="home-title">Better websites.<br /><em>Useful software.</em></h1>
        <p className="m-lead">We help businesses serve customers, sell online and reduce manual work through websites, apps and connected systems.</p>
        <div className="m-actions"><Link className="m-button" to={localePath('/contact')}>Start a project <ArrowUpRight size={18} /></Link><a className="m-text-link" href="#selected-work">View our work <ArrowRight size={18} /></a></div>
        <p className="m-hero-foot">Design, engineering and delivery.<br />From Athens, working with teams internationally.</p>
      </div>
      <figure className="m-hero-project">
        <Link to={localePath(`/projects/${heroProject.slug}`)} aria-label="Explore our Creta Maris contribution"><img src={heroProject.image} srcSet={`${heroProject.image.replace(".webp", "-640.webp")} 640w, ${heroProject.image} ${heroProject.imageWidth}w`} sizes="(max-width: 640px) 100vw, 50vw" alt="Creta Maris hospitality website" fetchPriority="high" width={heroProject.imageWidth} height={heroProject.imageHeight} /></Link>
        <figcaption><div><span className="m-label">Selected contribution / Hospitality</span><strong>Creta Maris</strong><span>{heroProject.en.focus}</span><span>Lead agency: {heroProject.leadAgency.name}</span></div><Link className="m-icon-link" to={localePath(`/projects/${heroProject.slug}`)} aria-label="View Creta Maris case study"><ArrowUpRight /></Link></figcaption>
      </figure>
    </section>


    <section className="m-section m-wrap" id="selected-work" aria-labelledby="work-heading">
      <div className="m-section-head"><div><p className="m-label">01 / Selected work</p><h2 id="work-heading">Experience you<br />can explore.</h2></div><div><p>From hospitality and industry to public information and premium brands.</p><Link className="m-text-link" to={localePath('/projects')}>View all projects <ArrowUpRight size={18} /></Link></div></div>
      <p className="m-attribution">{t('projectsPage.note')}</p>
      <div className="m-work-grid">{featured.map((project, index) => <article className="m-work-item" key={project.slug}>
        <Link className="m-work-image" to={localePath(`/projects/${project.slug}`)}><img src={project.image} srcSet={`${project.image.replace(".webp", "-640.webp")} 640w, ${project.image} ${project.imageWidth}w`} sizes="(max-width: 640px) 100vw, 50vw" alt={`${project.en.name} website preview`} loading="lazy" width={project.imageWidth} height={project.imageHeight} /><span className="m-image-link"><ArrowUpRight size={22} /></span></Link>
        <div className="m-work-caption"><span className="m-label">0{index + 1} / {project.en.category}</span><h3><Link to={localePath(`/projects/${project.slug}`)}>{project.en.name}</Link></h3><p>{project.en.focus}</p>{project.leadAgency && <p className="m-project-credit">Lead agency: <a href={project.leadAgency.url} target="_blank" rel="noopener noreferrer">{project.leadAgency.name}</a></p>}</div>
      </article>)}</div>
    </section>

    <ServiceOffers />

    <section className="m-wrap m-section" aria-labelledby="services-heading"><div className="m-section-head"><div><p className="m-label">03 / Our capabilities</p><h2 id="services-heading">Built around your business.</h2></div><p>Practical design and engineering, from the first brief to ongoing improvements.</p></div>
      <div className="m-services">{services.map((service, index) => <Link key={service.slug} to={localePath(`/services/${service.slug}`)}><span className="m-label">0{index + 1}</span><h3>{service.en.name}</h3><p>{service.en.short}</p><ArrowUpRight size={22} /></Link>)}</div>
    </section>

    <section className="m-process m-wrap m-section" aria-labelledby="process-heading"><div><p className="m-label">04 / Working together</p><h2 id="process-heading">Clear scope.<br />Visible progress.</h2><p>We work with your team in agreed milestones, with a clear handover at launch.</p><Link className="m-text-link" to={localePath('/about')}>About the studio <ArrowUpRight size={18} /></Link></div><ol>{t('aboutPage.steps').map(step => <li key={step.num}><span className="m-label">{step.num}</span><div><h3>{step.title}</h3><p>{step.desc}</p></div></li>)}</ol></section>

    <section className="m-wrap m-section" aria-labelledby="partners-heading"><p className="m-label">05 / Specialist collaboration</p><h2 id="partners-heading">The right expertise, together.</h2>{partners.map(partner => <article className="m-partner" key={partner.name}><div><h3>{partner.name}</h3><p>{partner.en.by}</p></div><p>We collaborate with {partner.name} to connect document processing and AI workflows with .NET business software.</p><a className="m-text-link" href={partner.website} target="_blank" rel="noopener noreferrer">Meet our partner <ArrowUpRight size={18} /></a></article>)}</section>

    <section className="m-contact" aria-labelledby="contact-heading">
      <div className="m-wrap m-contact-layout">
        <div><p className="m-label">Your next project</p><h2 id="contact-heading">What needs<br /><em>to work better?</em></h2></div>
        <div className="m-contact-copy">
          <p>Tell us what you want to build or improve.<br />We’ll discuss the scope and the next steps.</p>
          <Link className="m-button" to={localePath('/contact')}>Start a project <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <a className="m-contact-email" href="mailto:hello@zyxen.gr">hello@zyxen.gr</a>
        </div>
      </div>
    </section>
  </div>;
}
