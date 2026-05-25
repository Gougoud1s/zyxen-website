import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { ZyxenMark } from '@/components/ZyxenLogo';

export default function Footer() {
  const { t, lang, localePath } = useLanguage();

  const navLinks = [
    { to: localePath('/'), label: t('nav.home') },
    { to: localePath('/about'), label: t('nav.about') },
    { to: localePath('/services'), label: t('nav.services') },
    { to: localePath('/projects'), label: t('nav.projects') },
    { to: localePath('/contact'), label: t('nav.contact') },
  ];

  const legalLinks = [
    { to: localePath('/privacy-policy'), label: lang === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy' },
    { to: localePath('/cookie-policy'), label: lang === 'el' ? 'Πολιτική Cookies' : 'Cookie Policy' },
    { to: localePath('/terms'), label: lang === 'el' ? 'Όροι Χρήσης' : 'Terms of Use' },
  ];

  return (
    <footer className="border-t border-border bg-card" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <ZyxenMark size={34} />
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-[0.18em] uppercase leading-none">ZYXEN</span>
                <span className="text-[9px] tracking-[0.12em] uppercase leading-none mt-0.5" style={{ color: '#AF994D' }}>
                  Systems, Engineered.
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mt-5">{t('footer.tagline')}</p>
            <a href="mailto:hello@zyxen.gr" className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 block">
              hello@zyxen.gr
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5">{t('footer.nav')}</h4>
            <nav aria-label="Footer navigation">
              <div className="flex flex-col gap-3">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5">{t('footer.connect')}</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="mailto:hello@zyxen.gr" className="hover:text-foreground transition-colors w-fit">hello@zyxen.gr</a>
              <span>Greece · Remote-first</span>
              <Link to={localePath('/contact')} className="hover:text-foreground transition-colors w-fit mt-1 text-primary">
                {t('nav.cta')} →
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5">Legal</h4>
            <div className="flex flex-col gap-3">
              {legalLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ZYXEN. {t('footer.rights')}</p>
          <p className="text-xs tracking-[0.15em] font-medium" style={{ color: '#AF994D' }}>SYSTEMS, ENGINEERED.</p>
        </div>
      </div>
    </footer>
  );
}