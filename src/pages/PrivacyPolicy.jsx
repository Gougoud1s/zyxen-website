import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import AnimatedSection from '@/components/AnimatedSection';

const content = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 2024',
    sections: [
      { h: '1. Who We Are', p: 'ZYXEN is a software engineering studio based in Greece. We provide Umbraco platform engineering, Flutter applications, commerce systems, and AI integration services. Contact: hello@zyxen.gr' },
      { h: '2. Data We Collect', p: 'We collect information you voluntarily submit via our contact form: your name, email address, and project details. We do not collect sensitive personal data, financial information, or data from minors.' },
      { h: '3. How We Use Your Data', p: 'We use submitted information solely to: (a) respond to your project inquiry, (b) send a confirmation email, and (c) follow up regarding your project scope. We do not use your data for marketing without explicit consent.' },
      { h: '4. Data Storage & Retention', p: 'Form submissions are processed via our secure systems. We retain inquiry data for up to 24 months after the last meaningful contact, after which it is permanently deleted. You may request deletion at any time.' },
      { h: '5. Data Sharing', p: 'We do not sell, trade, or share your personal data with third parties for commercial purposes. Data may be processed by our email service providers under data processing agreements.' },
      { h: '6. Your GDPR Rights', p: 'Under GDPR, you have the right to: access your data, correct inaccurate data, request deletion, restrict processing, and object to processing. To exercise these rights, contact: hello@zyxen.gr' },
      { h: '7. Cookies', p: 'We use cookies as described in our Cookie Policy. Non-essential cookies are only set with your consent. See our Cookie Policy for details.' },
      { h: '8. Security', p: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure.' },
      { h: '9. Changes to This Policy', p: 'We may update this policy periodically. Material changes will be communicated via our website. Continued use constitutes acceptance of the updated policy.' },
      { h: '10. Contact', p: 'For any privacy-related queries: hello@zyxen.gr | ZYXEN, Greece' },
    ],
  },
  el: {
    title: 'Πολιτική Απορρήτου',
    updated: 'Τελευταία ενημέρωση: Μάιος 2024',
    sections: [
      { h: '1. Ποιοι Είμαστε', p: 'Η ZYXEN είναι ένα software engineering studio με έδρα την Ελλάδα. Παρέχουμε υπηρεσίες Umbraco, Flutter, commerce systems και AI integration. Επικοινωνία: hello@zyxen.gr' },
      { h: '2. Δεδομένα που Συλλέγουμε', p: 'Συλλέγουμε πληροφορίες που υποβάλλετε εθελοντικά μέσω της φόρμας επικοινωνίας: όνομα, email και λεπτομέρειες έργου. Δεν συλλέγουμε ευαίσθητα προσωπικά δεδομένα.' },
      { h: '3. Χρήση Δεδομένων', p: 'Χρησιμοποιούμε τα δεδομένα αποκλειστικά για: (α) απάντηση στο αίτημά σας, (β) αποστολή επιβεβαίωσης, (γ) follow up για το scope του έργου. Δεν χρησιμοποιούμε δεδομένα για marketing χωρίς ρητή συγκατάθεση.' },
      { h: '4. Αποθήκευση & Διατήρηση', p: 'Διατηρούμε δεδομένα αιτημάτων για έως 24 μήνες μετά την τελευταία επικοινωνία, μετά την οποία διαγράφονται μόνιμα. Μπορείτε να ζητήσετε διαγραφή ανά πάσα στιγμή.' },
      { h: '5. Κοινοποίηση Δεδομένων', p: 'Δεν πουλάμε, ανταλλάσσουμε ή μοιραζόμαστε τα προσωπικά σας δεδομένα με τρίτους για εμπορικούς σκοπούς.' },
      { h: '6. Δικαιώματά σας (GDPR)', p: 'Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής, περιορισμού επεξεργασίας και εναντίωσης. Επικοινωνήστε: hello@zyxen.gr' },
      { h: '7. Cookies', p: 'Χρησιμοποιούμε cookies όπως περιγράφεται στην Πολιτική Cookies. Μη απαραίτητα cookies ορίζονται μόνο με τη συγκατάθεσή σας.' },
      { h: '8. Ασφάλεια', p: 'Εφαρμόζουμε κατάλληλα τεχνικά μέτρα για την προστασία των δεδομένων σας από μη εξουσιοδοτημένη πρόσβαση.' },
      { h: '9. Αλλαγές', p: 'Ενδέχεται να ενημερώνουμε περιοδικά αυτή την πολιτική. Σημαντικές αλλαγές θα κοινοποιούνται μέσω του ιστοτόπου.' },
      { h: '10. Επικοινωνία', p: 'Για ερωτήσεις απορρήτου: hello@zyxen.gr | ZYXEN, Ελλάδα' },
    ],
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div>
      <SEOMeta title={c.title} description="ZYXEN Privacy Policy — GDPR compliant data handling and privacy practices." />
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