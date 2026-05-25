import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { lang, localePath, t } = useLanguage();

  const segments = pathname.replace(`/${lang}`, '').split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const labelMap = {
    about: t('nav.about'),
    services: t('nav.services'),
    projects: t('nav.projects'),
    contact: t('nav.contact'),
    'privacy-policy': lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy',
    'cookie-policy': lang === 'el' ? 'Πολιτική Cookies' : 'Cookie Policy',
    terms: lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use',
  };

  const crumbs = [
    { label: lang === 'el' ? 'Αρχική' : 'Home', to: localePath('/') },
    ...segments.map((seg, i) => ({
      label: labelMap[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      to: localePath('/' + segments.slice(0, i + 1).join('/')),
      isLast: i === segments.length - 1,
    })),
  ];

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />}
          {c.isLast ? (
            <span className="text-xs text-foreground font-medium capitalize">{c.label}</span>
          ) : (
            <Link to={c.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize">{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}