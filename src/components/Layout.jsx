import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ScrollProgress from './ScrollProgress';
import BackToTop from './BackToTop';
import CookieBanner from './CookieBanner';
import Breadcrumbs from './Breadcrumbs';

function BreadcrumbsWrapper() {
  const { pathname } = useLocation();
  const isHome = /^\/[a-z]{2}\/?$/.test(pathname) || pathname === '/';
  const isCrm = pathname.includes('/crm');
  if (isHome || isCrm) return null;
  return (
    <div className="border-b border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-md relative z-30 transition-all duration-300 shadow-xs mb-2">
      <Breadcrumbs />
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="pt-28 sm:pt-32 lg:pt-36"
          id="main-content"
          role="main"
        >
          {/* Breadcrumbs on non-home pages — only show when path has segments beyond lang */}
          <BreadcrumbsWrapper />
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
      <BackToTop />
      <CookieBanner />
    </div>
  );
}