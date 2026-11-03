import { serviceQuestions } from '@/lib/serviceQuestions';
import { Link } from 'react-router-dom';

export default function ServiceQuestions() {
  return <section className="project-story" aria-labelledby="service-questions-title"><div className="story-wrap">
    <div className="story-heading"><h2 id="service-questions-title">Before we start.</h2><p>Practical answers about our services, proposals and project experience.</p></div>
    {serviceQuestions.map(item => <div className="story-chapter" key={item.q}><h3 className="text-xl font-semibold">{item.q}</h3><p>{item.a}</p></div>)}
    <Link className="story-link" to="/projects">Explore our project contributions</Link>
  </div></section>;
}
