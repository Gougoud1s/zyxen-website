import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [['Home', '/'], ['Who we are', '/about'], ['How we do it', '/services'], ['Our work', '/projects'], ['Contact', '/contact']];
export function StudioHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const trigger = useRef(null);
  const menu = useRef(null);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const items = menu.current.querySelectorAll('a, button');
    items[0].focus();
    const key = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current.focus(); }
      if (event.key === 'Tab') {
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', key); };
  }, [open]);
  return <header className="studio-header"><Link to="/" className="studio-brand" aria-label="Zyxen home"><svg width="32" height="36" viewBox="0 0 32 36" fill="none" aria-hidden="true"><path d="M16 2 30 10v16l-14 8L2 26V10L16 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 11h14L9 25h14M9 11v5m14 4v5" stroke="currentColor" strokeWidth="2" /></svg><span>ZYXEN <small>SOFTWARE STUDIO</small></span></Link><button ref={trigger} className="studio-menu-trigger" aria-label="Open navigation" aria-expanded={open} aria-controls="studio-navigation" onClick={() => setOpen(true)}><span /><span /><span /></button>{open && <div className="studio-menu-backdrop" onClick={() => setOpen(false)}><div ref={menu} className="studio-menu" role="dialog" aria-modal="true" aria-label="Navigation" id="studio-navigation" onClick={event => event.stopPropagation()}><button className="studio-menu-close" aria-label="Close navigation" onClick={() => { setOpen(false); trigger.current.focus(); }}>×</button><nav>{links.map(([label, path], index) => <Link key={path} to={path} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>)}</nav><a className="studio-menu-email" href="mailto:hello@zyxen.gr">hello@zyxen.gr ↗</a></div></div>}</header>;
}
export function StudioFooter() {
  return <footer className="studio-footer"><Link className="studio-footer-brand" to="/">ZYXEN</Link><nav aria-label="Footer navigation">{links.slice(1).map(([label, path]) => <Link to={path} key={path}>{label}</Link>)}</nav><div className="studio-footer-bottom"><span>© {new Date().getFullYear()} Zyxen</span><Link to="/privacy-policy">Privacy policy</Link><Link to="/cookie-policy">Cookie policy</Link><Link to="/terms">Terms of use</Link></div></footer>;
}
