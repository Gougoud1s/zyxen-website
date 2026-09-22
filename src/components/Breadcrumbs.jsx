import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { lang, localePath, t } = useLanguage();

  const segments = pathname.replace(`/${lang}`, '').split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const labelMap = {
    about: lang === 'el' ? 'Σχετικά' : 'About',
    services: lang === 'el' ? 'Υπηρεσίες' : 'Services',
    projects: lang === 'el' ? 'Έργα' : 'Projects',
    contact: lang === 'el' ? 'Επικοινωνία' : 'Contact',
    technologies: lang === 'el' ? 'Τεχνολογίες' : 'Technologies',
    audit: lang === 'el' ? 'Δωρεάν SEO Audit' : 'Free SEO Audit',
    'privacy-policy': lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy',
    'cookie-policy': lang === 'el' ? 'Πολιτική Cookies' : 'Cookie Policy',
    terms: lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use',
  };

  const crumbs = [
    { label: lang === 'el' ? 'Αρχική' : 'Home', to: localePath('/'), isHome: true },
    ...segments.map((seg, i) => ({
      label: labelMap[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      to: localePath('/' + segments.slice(0, i + 1).join('/')),
      isLast: i === segments.length - 1,
    })),
  ];

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm font-sans" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />}
          {c.isHome ? (
            <Link
              to={c.to}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium transition-colors group flex-shrink-0"
              title={c.label}
            >
              <Home className="w-3.5 h-3.5 text-gray-500 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-xs">{c.label}</span>
            </Link>
          ) : c.isLast ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white font-semibold truncate max-w-[180px] sm:max-w-xs border border-black/5 dark:border-white/10">
              {c.label}
            </span>
          ) : (
            <Link
              to={c.to}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors font-medium truncate max-w-[140px] sm:max-w-xs hover:underline decoration-black/20 underline-offset-4"
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}