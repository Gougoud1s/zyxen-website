import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ZyxenMark } from '@/components/ZyxenLogo';
import { ArrowLeft, Home, Mail } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-lg relative"
      >
        <Link to="/" className="inline-flex items-center justify-center mb-10">
          <ZyxenMark size={44} />
        </Link>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[120px] sm:text-[160px] font-display font-bold leading-none text-primary/10 select-none"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl sm:text-3xl font-display font-bold -mt-4"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base"
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 border border-border text-sm px-5 py-2.5 rounded-full hover:border-primary/50 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
          <Link to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity min-h-[44px]">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/el/contact"
            className="inline-flex items-center gap-2 border border-border text-sm px-5 py-2.5 rounded-full hover:border-primary/50 transition-colors min-h-[44px]">
            <Mail className="w-4 h-4" /> Contact
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground"
        >
          {[['/', 'Home'], ['/el/services', 'Services'], ['/el/projects', 'Projects'], ['/el/about', 'About']].map(([to, label]) => (
            <Link key={to} to={to} className="hover:text-foreground transition-colors">{label}</Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}