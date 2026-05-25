import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

const STORAGE_KEY = 'zyxen_cookie_consent';

const text = {
  en: {
    title: 'We value your privacy',
    desc: 'We use cookies to improve your experience and analyze site performance. No tracking without your consent.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject Non-Essential',
    manage: 'Manage Preferences',
    save: 'Save Preferences',
    necessary: 'Necessary', necessaryDesc: 'Required for core site functionality.',
    analytics: 'Analytics', analyticsDesc: 'Help us understand how visitors use the site.',
    marketing: 'Marketing', marketingDesc: 'Used for targeted content and promotions.',
    functional: 'Functional', functionalDesc: 'Remember your preferences and settings.',
    policy: 'Cookie Policy',
  },
  el: {
    title: 'Εκτιμούμε το απόρρητό σας',
    desc: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας. Χωρίς tracking χωρίς τη συγκατάθεσή σας.',
    acceptAll: 'Αποδοχή Όλων',
    rejectAll: 'Απόρριψη Μη Απαραίτητων',
    manage: 'Διαχείριση Προτιμήσεων',
    save: 'Αποθήκευση',
    necessary: 'Απαραίτητα', necessaryDesc: 'Απαιτούνται για τη βασική λειτουργία.',
    analytics: 'Αναλυτικά', analyticsDesc: 'Μας βοηθούν να κατανοήσουμε τους επισκέπτες.',
    marketing: 'Marketing', marketingDesc: 'Για στοχευμένο περιεχόμενο.',
    functional: 'Λειτουργικά', functionalDesc: 'Αποθηκεύουν τις προτιμήσεις σας.',
    policy: 'Πολιτική Cookies',
  },
};

export function getCookieConsent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function CookieBanner() {
  const { lang, localePath } = useLanguage();
  const c = text[lang] || text.en;
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false, functional: true });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, necessary: true, timestamp: Date.now() }));
    setVisible(false);
  };

  const acceptAll = () => save({ analytics: true, marketing: true, functional: true });
  const rejectAll = () => save({ analytics: false, marketing: false, functional: false });
  const savePrefs = () => save(prefs);

  const categories = [
    { key: 'analytics', label: c.analytics, desc: c.analyticsDesc, editable: true },
    { key: 'marketing', label: c.marketing, desc: c.marketingDesc, editable: true },
    { key: 'functional', label: c.functional, desc: c.functionalDesc, editable: true },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] z-[200] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-label="Cookie consent"
          aria-modal="true"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(175,153,77,0.12)' }}>
                  <Shield className="w-4 h-4" style={{ color: '#AF994D' }} />
                </div>
                <h3 className="font-display font-semibold text-sm">{c.title}</h3>
              </div>
              <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground p-1 rounded" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{c.desc}</p>

            {/* Expanded preferences */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="border border-border rounded-xl divide-y divide-border">
                    {/* Necessary — always on */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-xs font-medium">{c.necessary}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.necessaryDesc}</p>
                      </div>
                      <div className="w-8 h-4 rounded-full bg-primary/80 relative flex-shrink-0">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>
                    {categories.map(cat => (
                      <div key={cat.key} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-xs font-medium">{cat.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                        </div>
                        <button
                          onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key] }))}
                          className={`w-8 h-4 rounded-full relative flex-shrink-0 transition-colors ${prefs[cat.key] ? 'bg-primary' : 'bg-secondary'}`}
                          role="switch"
                          aria-checked={prefs[cat.key]}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${prefs[cat.key] ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button onClick={acceptAll}
                className="w-full bg-primary text-primary-foreground text-xs font-medium py-2.5 rounded-full hover:opacity-90 transition-opacity min-h-[36px]">
                {c.acceptAll}
              </button>
              <div className="flex gap-2">
                <button onClick={rejectAll}
                  className="flex-1 border border-border text-xs py-2.5 rounded-full hover:border-primary/40 transition-colors min-h-[36px]">
                  {c.rejectAll}
                </button>
                {expanded ? (
                  <button onClick={savePrefs}
                    className="flex-1 border border-primary/50 text-primary text-xs py-2.5 rounded-full hover:bg-primary/5 transition-colors min-h-[36px]">
                    {c.save}
                  </button>
                ) : (
                  <button onClick={() => setExpanded(true)}
                    className="flex-1 border border-border text-xs py-2.5 rounded-full hover:border-primary/40 transition-colors min-h-[36px] flex items-center justify-center gap-1">
                    {c.manage} <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              <Link to={localePath('/cookie-policy')} className="hover:text-foreground transition-colors underline underline-offset-2">
                {c.policy}
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}