import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { ZyxenMark } from '@/components/ZyxenLogo';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, lang, switchLang, localePath } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: localePath('/'), label: t('nav.home') },
    { to: localePath('/about'), label: t('nav.about') },
    { to: localePath('/services'), label: t('nav.services') },
    { to: localePath('/projects'), label: t('nav.projects') },
    { to: localePath('/contact'), label: t('nav.contact') },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/85 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={localePath('/')} className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="Zyxen Home">
          <ZyxenMark size={34} />
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-sm tracking-[0.18em] uppercase leading-none">ZYXEN</span>
            <span className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase leading-none mt-0.5" style={{ color: '#AF994D' }}>
              Systems, Engineered.
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm transition-colors relative group ${active ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {l.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={switchLang}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-full border border-border hover:border-primary/50"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'el' ? 'EN' : 'EL'}
          </button>
          <Link
            to={localePath('/contact')}
            className="hidden md:inline-flex text-sm bg-primary text-primary-foreground px-5 py-2 rounded-full hover:opacity-90 transition-opacity font-medium"
          >
            {t('nav.cta')}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm py-3 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={localePath('/contact')}
                className="text-sm bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-medium mt-3 min-h-[44px] flex items-center justify-center"
              >
                {t('nav.cta')}
              </Link>
              <p className="text-center text-[10px] tracking-[0.15em] mt-4 mb-1" style={{ color: '#AF994D' }}>
                SYSTEMS, ENGINEERED.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}