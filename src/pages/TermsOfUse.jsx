import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import AnimatedSection from '@/components/AnimatedSection';

const content = {
  en: {
    title: 'Terms of Use',
    updated: 'Last updated: May 2024',
    sections: [
      { h: '1. Acceptance', p: 'By accessing and using zyxen.gr, you accept these Terms of Use. If you disagree, please discontinue use of the website.' },
      { h: '2. Intellectual Property', p: 'All content on this website — including text, design, logos, graphics, code, and animations — is the intellectual property of ZYXEN unless otherwise stated. Project references are contribution-based and all referenced brand names remain property of their respective owners.' },
      { h: '3. Use of Website', p: 'You may use this website for lawful purposes only. You may not reproduce, distribute, or create derivative works without written permission from ZYXEN. Automated scraping or systematic data collection is prohibited.' },
      { h: '4. Contact Forms', p: 'Information submitted via our contact form is used solely for responding to your inquiry. Spam, abusive, or malicious submissions are prohibited and will be reported to relevant authorities if necessary.' },
      { h: '5. External Links', p: 'Our website may contain links to third-party sites. ZYXEN is not responsible for the content, privacy practices, or reliability of external websites. Links are provided as references only.' },
      { h: '6. Disclaimer', p: 'This website is provided "as is" without warranties of any kind. ZYXEN makes no guarantees regarding accuracy, completeness, or continuous availability. We reserve the right to modify or discontinue any part of the site at any time.' },
      { h: '7. Limitation of Liability', p: 'To the maximum extent permitted by law, ZYXEN shall not be liable for any indirect, incidental, or consequential damages arising from use of this website.' },
      { h: '8. Governing Law', p: 'These terms are governed by the laws of Greece and the European Union. Any disputes shall be subject to the exclusive jurisdiction of Greek courts.' },
      { h: '9. Changes', p: 'We may update these Terms periodically. Continued use of the website constitutes acceptance of updated terms.' },
      { h: '10. Contact', p: 'Questions about these Terms: hello@zyxen.gr' },
    ],
  },
  el: {
    title: 'Όροι Χρήσης',
    updated: 'Τελευταία ενημέρωση: Μάιος 2024',
    sections: [
      { h: '1. Αποδοχή', p: 'Χρησιμοποιώντας το zyxen.gr αποδέχεστε αυτούς τους Όρους Χρήσης.' },
      { h: '2. Πνευματική Ιδιοκτησία', p: 'Το σύνολο του περιεχομένου — κείμενα, σχέδια, λογότυπα, κώδικας — αποτελεί πνευματική ιδιοκτησία της ZYXEN. Τα αναφερόμενα brand names ανήκουν στους αντίστοιχους κατόχους τους.' },
      { h: '3. Χρήση Ιστοτόπου', p: 'Η χρήση επιτρέπεται μόνο για νόμιμους σκοπούς. Απαγορεύεται η αναπαραγωγή ή δημιουργία παράγωγων έργων χωρίς γραπτή άδεια. Η αυτοματοποιημένη συλλογή δεδομένων απαγορεύεται.' },
      { h: '4. Φόρμα Επικοινωνίας', p: 'Πληροφορίες μέσω φόρμας χρησιμοποιούνται αποκλειστικά για απάντηση στο αίτημά σας. Spam και κακόβουλες υποβολές απαγορεύονται.' },
      { h: '5. Εξωτερικοί Σύνδεσμοι', p: 'Δεν φέρουμε ευθύνη για το περιεχόμενο εξωτερικών ιστοτόπων. Οι σύνδεσμοι παρέχονται μόνο ως αναφορές.' },
      { h: '6. Αποποίηση Ευθύνης', p: 'Ο ιστότοπος παρέχεται "ως έχει". Δεν εγγυόμαστε συνεχή διαθεσιμότητα ή ακρίβεια.' },
      { h: '7. Περιορισμός Ευθύνης', p: 'Η ZYXEN δεν ευθύνεται για έμμεσες ζημίες από τη χρήση του ιστοτόπου.' },
      { h: '8. Εφαρμοστέο Δίκαιο', p: 'Εφαρμόζεται το ελληνικό δίκαιο και το δίκαιο της ΕΕ. Αρμόδια ελληνικά δικαστήρια.' },
      { h: '9. Αλλαγές', p: 'Ενδέχεται να ενημερώνουμε περιοδικά τους Όρους. Συνέχιση χρήσης = αποδοχή.' },
      { h: '10. Επικοινωνία', p: 'Ερωτήσεις: hello@zyxen.gr' },
    ],
  },
};

export default function TermsOfUse() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div>
      <SEOMeta title={c.title} description="ZYXEN Terms of Use — website usage, intellectual property, and liability." />
      <section className="py-28 sm:py-36 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-xs font-medium tracking-[0.22em] uppercase mb-4" style={{ color: '#AF994D' }}>Legal</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">{c.title}</h1>
            <p className="text-sm text-muted-foreground mt-3">{c.updated}</p>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-10">
          {c.sections.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.04}>
              <h2 className="font-display text-lg font-semibold mb-3">{s.h}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.p}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}