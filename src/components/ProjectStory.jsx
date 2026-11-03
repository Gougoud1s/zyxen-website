import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '@/project-stories.css';

export default function ProjectStory({ story, name }) {
  return <section className="project-story" aria-label={`${name} case study`}>
    <div className="story-wrap">
      <div className="story-heading"><p className="story-label">Behind the project</p><h2>{story.headline}</h2></div>
      <div className="story-chapter"><h2><span>01</span>The business</h2><p>{story.context}</p></div>
      <div className="story-chapter"><h2><span>02</span>The need</h2><p>{story.need}</p></div>
      <div className="story-chapter"><h2><span>03</span>Our contribution</h2><div>{story.work.map(item => <article className="story-work" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div>
      <div className="story-chapter"><h2><span>04</span>The outcome</h2><p>{story.outcome}</p></div>
      <div className="story-next"><div><p className="story-label">Your next project</p><h2>Working on a similar challenge?</h2><p>Explore the scope of our services, then tell us what your business needs.</p></div><Link className="story-button" to="/services">Explore service proposals<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
