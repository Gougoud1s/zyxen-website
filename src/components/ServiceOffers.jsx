import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { serviceOffers } from '@/lib/serviceOffers';
import '@/project-stories.css';

export default function ServiceOffers() {
  const [selected, setSelected] = useState('website');
  const offer = serviceOffers.find(item => item.id === selected);
  return <section className="engagements" id="service-offers" aria-labelledby="offers-title">
    <div className="story-wrap">
      <div className="story-heading"><div><p className="story-label">Ways to work together</p><h2 id="offers-title">A clear starting point.</h2></div><p>Choose the work you need. Explore the proposed deliverables, what we need from you and where the scope starts and ends.</p></div>
      <div className="offer-selector">
        <div className="offer-choices" role="group" aria-label="Choose a service proposal">{serviceOffers.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === item.id} aria-controls="offer-details" onClick={() => setSelected(item.id)}><span className="story-label">0{index + 1}</span>{item.name}<ArrowRight size={18} aria-hidden="true" /></button>)}</div>
        <div id="offer-details" className="offer-details" aria-live="polite" aria-atomic="true">
          <h3>{offer.title}</h3><p>{offer.audience}</p>
          <h4>Proposed deliverables</h4><ul>{offer.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
          <dl><div><dt>What we need from you</dt><dd>{offer.inputs}</dd></div><div><dt>Scope & options</dt><dd>{offer.scope}</dd></div></dl>
          <p>{offer.next}</p><p className="offer-pricing">Scope, price and schedule are agreed in a written proposal before work begins.</p>
          <Link className="story-button" to={offer.href}>{offer.cta}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          {offer.project && <Link className="story-link" to={`/projects/${offer.project}`}>{offer.proof}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
        </div>
      </div>
    </div>
  </section>;
}
