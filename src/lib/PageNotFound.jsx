import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const { pathname } = useLocation();
  const lang = pathname.startsWith('/el') ? 'el' : 'en';
  const home = `/${lang}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background text-foreground">
      <p className="text-xs font-medium tracking-[0.26em] uppercase mb-6" style={{ color: '#AF994D' }}>
        404
      </p>
      <h1 className="font-display text-5xl sm:text-7xl font-bold leading-none tracking-tight mb-4">
        {lang === 'el' ? 'Σελίδα δεν βρέθηκε' : 'Page not found'}
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mt-4 mb-10 max-w-md text-center leading-relaxed">
        {lang === 'el'
          ? 'Η σελίδα που ψάχνετε δεν υπάρχει ή μετακινήθηκε.'
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link
        to={home}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {lang === 'el' ? '← Αρχική' : '← Back home'}
      </Link>
    </div>
  );
}
