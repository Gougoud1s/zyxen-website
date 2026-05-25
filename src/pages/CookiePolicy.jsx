import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import AnimatedSection from '@/components/AnimatedSection';

const content = {
  en: {
    title: 'Cookie Policy',
    updated: 'Last updated: May 2024',
    sections: [
      { h: 'What Are Cookies', p: 'Cookies are small text files stored on your device when you visit a website. They help sites remember your preferences and understand how you use them.' },
      { h: 'Types We Use', p: 'Necessary: Essential for the site to function (session management, security). Analytics: Help us understand visitor behavior anonymously. Functional: Remember your language and preferences. Marketing: Used only with explicit consent for targeted content.' },
      { h: 'Third-Party Cookies', p: 'We may use analytics tools (e.g., privacy-first analytics) under their respective data processing agreements. No social media tracking pixels are active without consent.' },
      { h: 'Your Consent', p: 'When you first visit ZYXEN, a consent banner appears. You can accept all, reject non-essential, or manage individual categories. Your choice is stored locally and respected on all subsequent visits.' },
      { h: 'How to Manage Cookies', p: 'You can update your preferences at any time by clearing the "zyxen_cookie_consent" key from your browser localStorage, or via your browser settings. You can also disable cookies entirely in your browser, though this may affect site functionality.' },
      { h: 'Contact', p: 'Questions about our cookie use: hello@zyxen.gr' },
    ],
  },
  el: {
    title: 'Πολιτική Cookies',
    updated: 'Τελευταία ενημέρωση: Μάιος 2024',
    sections: [
      { h: 'Τι Είναι τα Cookies', p: 'Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας. Βοηθούν τους ιστοτόπους να θυμούνται τις προτιμήσεις σας.' },
      { h: 'Τύποι που Χρησιμοποιούμε', p: 'Απαραίτητα: Βασικά για τη λειτουργία. Αναλυτικά: Ανώνυμη κατανόηση επισκεπτών. Λειτουργικά: Γλώσσα και προτιμήσεις. Marketing: Μόνο με ρητή συγκατάθεση.' },
      { h: 'Cookies Τρίτων', p: 'Ενδέχεται να χρησιμοποιούμε εργαλεία analytics υπό συμφωνίες επεξεργασίας. Δεν υπάρχουν social media tracking pixels χωρίς συγκατάθεση.' },
      { h: 'Η Συγκατάθεσή σας', p: 'Κατά την πρώτη επίσκεψη εμφανίζεται banner συγκατάθεσης. Μπορείτε να αποδεχτείτε όλα, να απορρίψετε μη απαραίτητα ή να διαχειριστείτε ανά κατηγορία.' },
      { h: 'Διαχείριση Cookies', p: 'Μπορείτε να ενημερώσετε τις προτιμήσεις σας διαγράφοντας το "zyxen_cookie_consent" από το localStorage ή μέσω ρυθμίσεων browser.' },
      { h: 'Επικοινωνία', p: 'Ερωτήσεις για cookies: hello@zyxen.gr' },
    ],
  },
};

export default function CookiePolicy() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div>
      <SEOMeta title={c.title} description="ZYXEN Cookie Policy — how we use cookies and how to manage your preferences." />
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
            <AnimatedSection key={i} delay={i * 0.05}>
              <h2 className="font-display text-lg font-semibold mb-3">{s.h}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.p}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}