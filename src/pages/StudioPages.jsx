import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, services } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';

export function StudioServices() {
  const { t, localePath } = useLanguage();
  return <div className="studio-section"><SEOMeta title="Engineering Services — Umbraco, .NET, Mobile & AI | ZYXEN" description={t('servicesPage.desc')} /><span className="studio-label">02 / How we do it</span><h1 className="studio-page-title">Design meets<br />engineering.</h1><p className="studio-page-intro">{t('servicesPage.desc')}</p><div className="studio-service-list">{services.map((service, index) => <Link className="studio-service" key={service.slug} to={localePath(`/services/${service.slug}`)}><span className="studio-label">0{index + 1}</span><div><h2>{service.en.name}</h2><p>{service.en.description}</p><div className="studio-tech">{service.tech.join(' / ')}</div></div><span aria-hidden="true">↗</span></Link>)}</div><Link to={localePath('/contact')} className="studio-button studio-page-cta">Discuss your project ↗</Link></div>;
}
export function StudioProjects() {
  const { t, localePath } = useLanguage();
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(projects.map(project => project.en.category))];
  const visible = category === 'All' ? projects : projects.filter(project => project.en.category === category);
  return <div className="studio-section"><SEOMeta title="Featured Work & Case Studies | ZYXEN" description={t('projectsPage.desc')} /><span className="studio-label">03 / Our work</span><h1 className="studio-page-title">Built for<br />the real world.</h1><p className="studio-page-intro">{t('projectsPage.note')}</p><div className="studio-filters" role="group" aria-label="Filter projects by sector">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="studio-project-list">{visible.map(project => <article className="studio-project-stage" key={project.slug}><Link className="studio-project-image" to={localePath(`/projects/${project.slug}`)}><img src={project.image} alt={`${project.en.name} website preview`} loading="lazy" /></Link><div className="studio-project-description"><span className="studio-label">{project.en.category}</span><h2>{project.en.name}</h2><p>{project.en.overview}</p><div className="studio-tech">{project.tech.join(' / ')}</div><Link className="studio-button" to={localePath(`/projects/${project.slug}`)}>Explore project ↗</Link></div></article>)}</div></div>;
}
export function StudioAbout() {
  const { t, localePath } = useLanguage();
  return <div className="studio-section"><SEOMeta title="About ZYXEN — Software Engineering Studio" description={t('aboutPage.desc')} /><span className="studio-label">01 / Who we are</span><h1 className="studio-page-title">A studio built<br />around delivery.</h1><p className="studio-page-intro">{t('aboutPage.desc')}</p><section className="studio-about-columns"><div><h2>{t('aboutPage.howTitle')}</h2>{t('aboutPage.how').map(item => <p key={item}>{item}</p>)}</div><div><h2>{t('aboutPage.whatTitle')}</h2>{t('aboutPage.what').map(item => <p key={item}>{item}</p>)}</div></section><section className="studio-process"><h2>{t('aboutPage.processTitle')}</h2>{t('aboutPage.steps').map(step => <article className="studio-service" key={step.num}><span className="studio-label">{step.num}</span><div><h3>{step.title}</h3><p>{step.desc}</p></div></article>)}</section><p>{t('aboutPage.collabDesc')}</p><Link className="studio-button studio-page-cta" to={localePath('/contact')}>Start a project ↗</Link></div>;
}
