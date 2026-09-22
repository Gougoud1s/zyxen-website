import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import ZyxenLogo from '@/components/ZyxenLogo';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, localePath } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: localePath('/'), label: 'Home' },
    { to: localePath('/projects'), label: 'Work' },
    { to: localePath('/services'), label: 'Services' },
    { to: localePath('/about'), label: 'Culture' },
    { to: localePath('/contact'), label: 'Contact' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <nav
        className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-md py-3 px-6'
            : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 py-4 px-7 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Bespoke Architectural Logo Lockup */}
          <Link to={localePath('/')} className="flex-shrink-0" aria-label="ZYXEN Home">
            <ZyxenLogo size={34} />
          </Link>

          {/* Floating Pill Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm tracking-wide transition-colors relative group font-medium ${
                    active ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Action CTA Pill */}
          <div className="flex items-center gap-3">
            <Link
              to={localePath('/contact')}
              className="hidden md:inline-flex text-xs uppercase tracking-wider font-bold bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow"
            >
              Start a Project
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-black min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 max-w-6xl mx-auto rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-lg overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-base font-semibold py-3 px-3 text-gray-800 hover:text-black hover:bg-gray-50 transition-colors rounded-xl"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={localePath('/contact')}
                className="text-sm uppercase tracking-wider font-bold bg-black text-white px-6 py-3.5 rounded-full text-center mt-4 shadow-md"
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
