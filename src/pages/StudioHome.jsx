import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { projects, services, partners } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
const StudioCube = lazy(() => import('@/components/StudioCube'));

export default function StudioHome() {
  const { localePath, t } = useLanguage();
  const [active, setActive] = useState(0);
  const project = projects[active];
  return <>
    <SEOMeta title="ZYXEN — Software Engineering & Digital Experiences" description={t('hero.desc')} jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Zyxen', url: 'https://www.zyxen.gr' }} />
    <section className="studio-hero" aria-labelledby="studio-title">
      <div className="studio-hero-copy"><h1 id="studio-title">We build platforms<br />that scale businesses.</h1><p>Software engineering, digital experiences<br />& intelligent automation.</p></div>
      <Suspense fallback={<div className="studio-cube" aria-label="Loading the interactive scene" />}><StudioCube /></Suspense>
      <a className="studio-button studio-explore" href="#work">Explore <span aria-hidden="true">↓</span></a>
      <span className="studio-hero-note">Greece · Working internationally</span>
    </section>
    <section className="studio-section studio-work" id="work" aria-labelledby="work-title">
      <div className="studio-section-heading"><span className="studio-label">01 / Our work</span><h2 id="work-title">Built for the real world.</h2><p>{t('projectsPage.note')}</p></div>
      <div className="studio-project-stage" key={project.slug}>
        <Link to={localePath(`/projects/${project.slug}`)} className="studio-project-image"><img src={project.image} alt={`${project.en.name} website preview`} loading="lazy" /></Link>
        <div className="studio-project-description"><span className="studio-label">{project.en.category}</span><h3>{project.en.name}</h3><p>{project.en.overview}</p><Link className="studio-button" to={localePath(`/projects/${project.slug}`)}>Explore project ↗</Link></div>
      </div>
      <div className="studio-project-controls"><span className="studio-label">{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><div role="group" aria-label="Select project">{projects.map((item, index) => <button key={item.slug} onClick={() => setActive(index)} aria-label={`Show ${item.en.name}`} aria-pressed={active === index}>{String(index + 1).padStart(2, '0')}</button>)}</div><button className="studio-next" onClick={() => setActive((active + 1) % projects.length)}>Next work →</button></div>
    </section>
    <section className="studio-section" id="services" aria-labelledby="services-title"><div className="studio-section-heading"><span className="studio-label">02 / How we do it</span><h2 id="services-title">Design meets engineering.</h2><p>{t('servicesPage.desc')}</p></div><div className="studio-service-list">{services.map((service, index) => <Link className="studio-service" key={service.slug} to={localePath(`/services/${service.slug}`)}><span className="studio-label">0{index + 1}</span><div><h3>{service.en.name}</h3><p>{service.en.short}</p></div><span aria-hidden="true">↗</span></Link>)}</div></section>
    <section className="studio-section studio-about" id="about" aria-labelledby="about-title"><span className="studio-label">03 / Who we are</span><h2 id="about-title">A studio built<br />around delivery.</h2><p>{t('aboutPage.desc')}</p><Link className="studio-button" to={localePath('/about')}>Meet Zyxen ↗</Link></section>
    <section className="studio-section" aria-labelledby="partner-title"><div className="studio-section-heading"><span className="studio-label">04 / Our partnerships</span><h2 id="partner-title">Connected expertise.</h2></div>{partners.map(partner => <article className="studio-partner" key={partner.name}><div><span className="studio-label">{partner.en.tag}</span><h3>{partner.name}</h3><span className="studio-label">{partner.en.by}</span></div><div><p>{partner.en.description}</p><a className="studio-button" href={partner.website} target="_blank" rel="noopener noreferrer">Explore partnership ↗</a></div></article>)}</section>
    <section className="studio-section studio-contact" id="contact" aria-labelledby="contact-title"><span className="studio-label">05 / Start a conversation</span><h2 id="contact-title">What are you<br />building next?</h2><p>{t('ctaSub')}</p><Link className="studio-button" to={localePath('/contact')}>Start a project ↗</Link></section>
  </>;
}
