import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '@/website-offer.css';

export default function WebsiteOffer() {
  return <section className="website-offer offer-teaser" aria-labelledby="website-offer-title">
    <div className="offer-wrap offer-teaser-grid">
      <div><p className="offer-label">For small businesses / Για μικρές επιχειρήσεις</p>
        <h2 id="website-offer-title">Your business.<br />A proper website.</h2>
        <p>Up to 5 pages. Mobile-ready. A clear scope, with optional care after launch.</p>
      </div>
      <div><p className="offer-price">€1,200 <span>+ VAT / one-off</span></p>
        <p>Optional website care: €45/month + VAT.</p>
        <Link className="offer-button" to="/websites">Δείτε την προσφορά <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <Link className="offer-language" to="/en/websites">Read in English</Link>
      </div>
    </div>
  </section>;
}
