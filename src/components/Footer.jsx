import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import ZyxenLogo from '@/components/ZyxenLogo';

export default function Footer() {
  const { localePath } = useLanguage();

  const navLinks = [
    { to: localePath('/'), label: 'Home' },
    { to: localePath('/projects'), label: 'Work' },
    { to: localePath('/services'), label: 'Services' },
    { to: localePath('/about'), label: 'Culture' },
    { to: localePath('/contact'), label: 'Contact' },
  ];

  const legalLinks = [
    { to: localePath('/privacy-policy'), label: 'Privacy Policy' },
    { to: localePath('/cookie-policy'), label: 'Cookie Policy' },
    { to: localePath('/terms'), label: 'Terms of Use' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-black text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={localePath('/')} className="inline-block mb-4">
              <ZyxenLogo size={36} />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mt-3 font-normal">
              Bespoke software engineering studio combining high-performance architecture, custom design, and strategic AI automation.
            </p>
            <a href="mailto:hello@zyxen.gr" className="text-sm text-gray-300 hover:text-white transition-colors mt-4 block font-mono">
              hello@zyxen.gr
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">
              Navigation
            </h4>
            <nav aria-label="Footer navigation">
              <div className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors w-fit">
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-300 font-normal">
              <a href="mailto:hello@zyxen.gr" className="hover:text-white transition-colors w-fit font-mono">
                hello@zyxen.gr
              </a>
              <span>Athens, Greece · Remote-first</span>
              <Link to={localePath('/contact')} className="hover:text-white transition-colors w-fit mt-1 text-[#AF994D] font-semibold">
                Start a Project →
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">
              Legal
            </h4>
            <div className="flex flex-col gap-3">
              {legalLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors w-fit">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} ZYXEN. All rights reserved.</p>
          <p className="text-xs tracking-[0.2em] font-semibold font-mono text-[#AF994D]">SYSTEMS, ENGINEERED.</p>
        </div>
      </div>
    </footer>
  );
}
