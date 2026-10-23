import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import SEOMeta from '@/components/SEOMeta';
import '@/website-offer.css';

export default function BusinessWebsite() {
  const english = !useLocation().pathname.startsWith('/el/');
  const [care, setCare] = useState(false);
  const copy = (el, en) => english ? en : el;
  const contact = `/contact?offer=website${english ? '&language=en' : '&language=el'}${care ? '&care=yes' : ''}`;
  const inclusions = copy([
    ['Έως 5 σελίδες', 'Αρχική, η επιχείρηση, υπηρεσίες, έργα και επικοινωνία — προσαρμοσμένες στη δουλειά σας.'],
    ['Σωστή εμφάνιση σε κινητό', 'Ευανάγνωστο περιεχόμενο, καθαρή πλοήγηση και εύκολη πρόσβαση στο τηλέφωνό σας.'],
    ['Εύκολη επικοινωνία', 'Φόρμα αιτήματος, κουμπί κλήσης και σύνδεσμος προς τον χάρτη σας.'],
    ['Βασική τεχνική SEO προετοιμασία', 'Τίτλοι, περιγραφές, sitemap και δομημένο περιεχόμενο. Δεν υποσχόμαστε κατάταξη στη Google.'],
    ['Δύο γύροι διορθώσεων', 'Συγκεντρώνουμε τα σχόλιά σας και ολοκληρώνουμε τις συμφωνημένες αλλαγές πριν από την παράδοση.'],
    ['Παράδοση στον δικό σας έλεγχο', 'Το domain παραμένει δικό σας. Παραδίδουμε πρόσβαση και αρχεία μετά την εξόφληση.'],
  ], [
    ['Up to 5 pages', 'Home, about, services, work and contact — adapted to your business.'],
    ['Designed for mobile', 'Readable content, clear navigation and a phone number that is easy to reach.'],
    ['Easy enquiries', 'An enquiry form, click-to-call and a link to your location on the map.'],
    ['Technical SEO essentials', 'Page titles, descriptions, sitemap and structured content. Search rankings are not guaranteed.'],
    ['Two revision rounds', 'Consolidated feedback and agreed changes before handover.'],
    ['A website you control', 'Your domain stays yours. Access and files are handed over after final payment.'],
  ]);

  return <div className="website-offer" lang={english ? 'en' : 'el'}>
    <SEOMeta language={english ? 'en' : 'el'} title={copy('Ιστοσελίδα επιχείρησης με 1.200 € + ΦΠΑ | ZYXEN', 'Business website for €1,200 + VAT | ZYXEN')}
      description={copy('Επαγγελματική ιστοσελίδα έως 5 σελίδες με 1.200 € + ΦΠΑ. Προαιρετική τεχνική φροντίδα 45 €/μήνα. Σαφές αντικείμενο, δύο γύροι διορθώσεων και παράδοση.', 'A professional website with up to 5 pages for €1,200 + VAT. Optional €45/month website care. Clear scope, two revision rounds and handover.')}
      jsonLd={{ '@context': 'https://schema.org', '@type': 'Service', name: 'ZYXEN Business Website', serviceType: 'Website development', provider: { '@type': 'Organization', name: 'ZYXEN', url: 'https://www.zyxen.gr' }, areaServed: 'GR', offers: { '@type': 'Offer', price: '1200', priceCurrency: 'EUR', priceSpecification: { '@type': 'PriceSpecification', price: '1200', priceCurrency: 'EUR', valueAddedTaxIncluded: false } } }} />
    <section className="offer-wrap offer-hero">
      <div>
        <p className="offer-label">{copy('ZYXEN / Για μικρές επιχειρήσεις', 'ZYXEN / For small businesses')}</p>
        <h1>{copy('Η δουλειά σας αξίζει μια σωστή ιστοσελίδα.', 'Your business deserves a proper website.')}</h1>
        <p className="offer-lead">{copy('Δείξτε τι κάνετε, παρουσιάστε τα έργα σας και δώστε στους πελάτες έναν εύκολο τρόπο να σας βρουν και να επικοινωνήσουν.', 'Show what you do, share your work and give customers an easy way to find and contact you.')}</p>
        <Link className="offer-button" to={contact}>{copy('Ας μιλήσουμε για το site σας', 'Let’s discuss your website')} <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <Link className="offer-language" to={english ? '/el/websites' : '/websites'}>{english ? 'Ελληνικά' : 'English'}</Link>
      </div>
      <aside className="offer-summary" aria-label={copy('Κόστος ιστοσελίδας', 'Website pricing')}>
        <p className="offer-label">{copy('Συγκεκριμένο αντικείμενο. Καθαρή τιμή.', 'Defined scope. Clear price.')}</p>
        <p className="offer-price">{copy("1.200 €", "€1,200")}</p><p>{copy('+ ΦΠΑ · εφάπαξ κατασκευή', '+ VAT · one-off build')}</p>
        <ul>{[copy('Έως 5 σελίδες, σε μία γλώσσα', 'Up to 5 pages, in one language'), copy('Προσαρμογή στην ταυτότητά σας', 'Adapted to your brand'), copy('Δύο γύροι διορθώσεων', 'Two revision rounds')].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul>
        <label className="offer-care-toggle"><input type="checkbox" checked={care} onChange={event => setCare(event.target.checked)} /><span>{copy('Με προαιρετική φροντίδα', 'Add optional care')}<small>45 € / {copy('μήνα + ΦΠΑ', 'month + VAT')}</small></span></label>
        <div className="offer-total" aria-live="polite" aria-atomic="true"><span>{copy('Πρώτοι 12 μήνες', 'First 12 months')}</span><strong>{care ? copy('1.740 €', '€1,740') : copy('1.200 €', '€1,200')} + {copy('ΦΠΑ', 'VAT')}</strong></div>
        <p className="offer-small">{care ? copy('Κατασκευή + 12 μήνες φροντίδας. Η φροντίδα χρεώνεται μηνιαία, δεν απαιτείται ετήσια προπληρωμή.', 'Build + 12 months of care. Care is billed monthly, with no annual prepayment required.') : copy('Η φιλοξενία συμφωνείται χωριστά εάν δεν επιλέξετε φροντίδα. Domain και εταιρικό email δεν περιλαμβάνονται.', 'Hosting is arranged separately without care. Domain registration and business email are not included.')}</p>
      </aside>
    </section>
    <section className="offer-wrap offer-section" aria-labelledby="offer-scope">
      <p className="offer-label">01 / {copy('Τι περιλαμβάνεται', 'What is included')}</p><h2 id="offer-scope">{copy('Όσα χρειάζεστε για ένα σωστό ξεκίνημα.', 'Everything for a considered start.')}</h2>
      <div className="offer-scope">{inclusions.map(([title, detail], index) => <article key={title}><span className="offer-label">0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
      <p className="offer-note">{copy('Η τιμή αφορά εταιρικό site παρουσίασης με έτοιμο υλικό από εσάς και προσαρμογή σε δοκιμασμένη σχεδιαστική βάση. E-shop, σύστημα κρατήσεων, δεύτερη γλώσσα, νέο λογότυπο, φωτογράφιση και συγγραφή κειμένων έχουν ξεχωριστή προσφορά. Τυχόν απαραίτητα νομικά κείμενα παρέχονται από εσάς.', 'This is a business presentation website using your supplied content and a proven design foundation. E-commerce, booking systems, a second language, a new logo, photography and copywriting are quoted separately. You supply any necessary legal text.')}</p>
    </section>
    <section className="offer-care-section"><div className="offer-wrap offer-care-grid">
      <div><p className="offer-label">02 / {copy('Μετά την παράδοση', 'After launch')}</p><h2>{copy('Φροντίδα, εφόσον τη χρειάζεστε.', 'Care, if you need it.')}</h2><p className="offer-price">45 € <span>/ {copy('μήνα + ΦΠΑ', 'month + VAT')}</span></p></div>
      <div><p>{copy('Για τις ιστοσελίδες αυτού του πακέτου: φιλοξενία, SSL, αντίγραφα ασφαλείας, μηνιαίος τεχνικός έλεγχος και οι απαραίτητες ενημερώσεις του συμφωνημένου συστήματος.', 'For websites built under this package: hosting, SSL, backups, a monthly technical check and necessary updates to the agreed system.')}</p><p>{copy('Αλλαγές περιεχομένου, νέες σελίδες, εταιρικό email και υποστήριξη εκτός ωραρίου κοστολογούνται χωριστά. Η φροντίδα είναι προαιρετική και η διακοπή της δεν αφαιρεί την κυριότητα του site σας.', 'Content changes, new pages, business email and out-of-hours support are quoted separately. Care is optional, and cancelling it does not affect your ownership of the website.')}</p><p className="offer-small">{copy('Πριν ξεκινήσουμε, συμφωνούμε γραπτώς φιλοξενία, πρόσβαση, διαδικασία υποστήριξης και όρους διακοπής.', 'Before starting, we agree hosting, access, support procedures and cancellation terms in writing.')}</p></div>
    </div></section>
    <section className="offer-wrap offer-section"><p className="offer-label">03 / {copy('Πώς ξεκινάμε', 'How we start')}</p><h2>{copy('Μια σύντομη συζήτηση. Ένα σαφές πλάνο.', 'A short conversation. A clear plan.')}</h2>
      <ol className="offer-steps">{copy([
        ['Μας λέτε τι κάνετε', 'Βλέπουμε τις υπηρεσίες, το υπάρχον υλικό και τον στόχο του site.'],
        ['Συμφωνούμε πριν ξεκινήσουμε', 'Σελίδες, υλικό, ημερομηνίες και πληρωμές καταγράφονται στην προσφορά.'],
        ['Σχεδιάζουμε και παραδίδουμε', 'Βλέπετε την προεπισκόπηση, δίνετε συγκεντρωμένα σχόλια και εγκρίνετε τη δημοσίευση.'],
      ], [
        ['Tell us about your business', 'We review your services, available content and the purpose of your website.'],
        ['Agree the plan', 'Pages, content, dates and payments are set out in your written proposal.'],
        ['Review and launch', 'Review the preview, send consolidated feedback and approve publication.'],
      ]).map(([title, detail]) => <li key={title}><h3>{title}</h3><p>{detail}</p></li>)}</ol>
      <div className="offer-bottom"><p>{copy('Χρειάζεστε κάτι πιο σύνθετο; Συνεχίζουμε να αναλαμβάνουμε εφαρμογές, e-commerce και διασυνδέσεις.', 'Need something more complex? We also build applications, commerce platforms and integrations.')}</p><Link to="/services">{copy('Όλες οι υπηρεσίες', 'All services')} →</Link></div>
      <Link className="offer-button" to={contact}>{copy('Ζητήστε την προσφορά των 1.200 €', 'Ask about the €1,200 website')} <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </section>
  </div>;
}
