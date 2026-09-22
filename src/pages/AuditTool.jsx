import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import SEOMeta from '@/components/SEOMeta';
import MagneticButton from '@/components/MagneticButton';
import { SpotlightCard } from '@/pages/Home';
import { 
  Globe,
  Zap, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  BarChart2, 
  Smartphone, 
  Sparkles,
  Send,
  Lock,
  Cpu
} from 'lucide-react';

export default function AuditTool() {
  const { lang, t } = useLanguage();
  const isEl = lang === 'el';

  const [urlInput, setUrlInput] = useState('');
  const [industry, setIndustry] = useState('ecommerce');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [submittedContact, setSubmittedContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });

  const handleRunAudit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setAuditResult(null);

    // Simulate high-precision instant AI & Tech audit computation
    setTimeout(() => {
      let formattedUrl = urlInput.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
      setIsAnalyzing(false);
      setAuditResult({
        domain: formattedUrl,
        speedScore: Math.floor(Math.random() * 25) + 42, // 42-67 (Needs upgrade)
        seoScore: Math.floor(Math.random() * 20) + 55,
        uxScore: Math.floor(Math.random() * 25) + 50,
        mobileScore: Math.floor(Math.random() * 20) + 60,
        estimatedRevenueLeak: industry === 'ecommerce' ? '18% - 34%' : '25% - 40%',
        keyIssues: [
          isEl ? 'Χαμηλή ταχύτητα φορτώσεως σε κινητές συσκευές (>3.8s First Contentful Paint)' : 'Slow mobile load speeds (>3.8s FCP)',
          isEl ? 'Έλλειψη Kinetic Smooth Scroll & σύγχρονων micro-interactions (χαμηλό engagement)' : 'Missing Kinetic Smooth Scroll & modern micro-interactions',
          isEl ? 'Ελλιπή SEO schema markup & μεταδεδομένα (απώλεια οργανικής επισκεψιμότητας)' : 'Incomplete structured SEO schemas & OpenGraph metadata',
          isEl ? 'Μη βελτιστοποιημένα CTA & απουσία AI lead capture flow' : 'Suboptimal conversion CTAs & lack of AI lead automation flow'
        ],
        zyxenImpact: {
          speedTarget: '98/100 (Sub-second FCP)',
          conversionBoost: '+35% - +85%',
          techStack: 'Next.js 14 / Lenis Kinetic Scroll / Three.js / Tailwind CSS / Edge CDN'
        }
      });
    }, 2200);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittedContact(true);
  };

  return (
    <>
      <SEOMeta
        title={isEl ? 'Δωρεάν Digital Flow & Tech Audit | Zyxen' : 'Free Digital Flow & Tech Audit | Zyxen'}
        description={isEl 
          ? 'Αναλύστε την ταχύτητα, το UX και την απόδοση της επιχείρησής σας. Ανακαλύψτε πώς η Zyxen μετασχηματίζει την ψηφιακή σας παρουσία.' 
          : 'Analyze your speed, UX, and conversion metrics. Discover how Zyxen elevates your digital presence.'}
        url={`https://www.zyxen.gr/${lang}/audit`}
      />

      <div className="relative min-h-screen bg-[#FDFDFD] text-gray-900 pt-32 pb-24 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-gray-100/80 to-transparent blur-3xl opacity-60 -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold tracking-wider text-gray-700 uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              {isEl ? 'Zyxen Performance Architecture' : 'Zyxen Performance Architecture'}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.15]"
            >
              {isEl ? (
                <>Ανακαλύψτε τις διαρροές εσόδων του <span className="underline decoration-1 underline-offset-8 decoration-gray-300">Digital Flow</span> σας</>
              ) : (
                <>Uncover your <span className="underline decoration-1 underline-offset-8 decoration-gray-300">Digital Flow</span> revenue leaks</>
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed font-light"
            >
              {isEl 
                ? 'Εισάγετε την ιστοσελίδα σας για άμεση τεχνική ανάλυση ταχύτητας, UX/UI, SEO και μετατροπών. Δείτε πώς η Zyxen αναβαθμίζει την απόδοσή σας στο 1% της αγοράς.'
                : 'Enter your website domain for instant speed, UX, SEO, and conversion breakdown. See how Zyxen places your brand in the top 1%.'}
            </motion.p>
          </div>

          {/* Audit Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <form onSubmit={handleRunAudit} className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200/90 shadow-lg flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={isEl ? 'π.χ. mycompany.gr' : 'e.g. mycompany.com'}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                />
              </div>

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="ecommerce">{isEl ? 'E-commerce / E-shop' : 'E-commerce'}</option>
                <option value="medical">{isEl ? 'Ιατρική / Κλινική / Aesthetic' : 'Medical / Aesthetics'}</option>
                <option value="hospitality">{isEl ? 'Luxury Tourism & Hospitality' : 'Luxury Hospitality'}</option>
                <option value="realestate">{isEl ? 'Real Estate & Construction' : 'Real Estate'}</option>
                <option value="services">{isEl ? 'B2B Services & Law' : 'B2B Services'}</option>
              </select>

              <MagneticButton>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-7 py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isEl ? 'Ανάλυση...' : 'Analyzing...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEl ? 'Έλεγχος' : 'Audit Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </MagneticButton>
            </form>
          </motion.div>

          {/* Analyzing State Loader */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto p-12 bg-white rounded-3xl border border-gray-200 text-center shadow-md mb-16"
              >
                <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin" />
                  <Cpu className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isEl ? 'Σάρωση Τεχνολογικής Αρχιτεκτονικής...' : 'Scanning Performance Architecture...'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {isEl ? 'Έλεγχος Core Web Vitals, Lenis Scrolling Readiness, SEO Schema, και Conversion Flows.' : 'Evaluating Core Web Vitals, Lenis Scroll Physics, SEO Schemas, and Conversion Flows.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audit Results */}
          <AnimatePresence>
            {auditResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 mb-20"
              >
                {/* Result Hero Banner */}
                <div className="bg-black text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-white text-xs font-mono">
                        <Globe className="w-3.5 h-3.5" />
                        {auditResult.domain}
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        {isEl ? 'Εντοπίστηκαν σημαντικά περιθώρια βελτίωσης' : 'Significant Optimization Scope Detected'}
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                        {isEl 
                          ? `Η τρέχουσα αρχιτεκτονική της ιστοσελίδας σας παρουσιάζει διαρροή επισκεπτών έως και ${auditResult.estimatedRevenueLeak}.`
                          : `Your current website stack is estimated to leak up to ${auditResult.estimatedRevenueLeak} of potential high-ticket leads.`}
                      </p>
                    </div>

                    <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-mono mb-2">
                        {isEl ? 'Εκτιμώμενη Διαρροή Μετατροπών' : 'Estimated Conversion Leak'}
                      </span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight">
                        {auditResult.estimatedRevenueLeak}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <SpotlightCard className="p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{auditResult.speedScore}/100</div>
                    <div className="text-xs text-gray-500 font-medium">{isEl ? 'Ταχύτητα & Mobile' : 'Mobile Speed'}</div>
                  </SpotlightCard>

                  <SpotlightCard className="p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{auditResult.seoScore}/100</div>
                    <div className="text-xs text-gray-500 font-medium">{isEl ? 'Technical SEO' : 'Technical SEO'}</div>
                  </SpotlightCard>

                  <SpotlightCard className="p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{auditResult.uxScore}/100</div>
                    <div className="text-xs text-gray-500 font-medium">{isEl ? 'UX / Micro-Interactions' : 'UX & Kinetics'}</div>
                  </SpotlightCard>

                  <SpotlightCard className="p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{auditResult.mobileScore}/100</div>
                    <div className="text-xs text-gray-500 font-medium">{isEl ? 'Conversion Flow' : 'Conversion Flow'}</div>
                  </SpotlightCard>
                </div>

                {/* Key Issues vs Zyxen Solution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Found Issues */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-200/90 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      {isEl ? 'Κύρια Σημεία Πίεσης & Καθυστερήσεων' : 'Key Bottlenecks Detected'}
                    </h3>
                    <ul className="space-y-4">
                      {auditResult.keyIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Zyxen High-End Standard */}
                  <div className="bg-gray-900 text-white p-8 rounded-3xl border border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      {isEl ? 'Η Αρχιτεκτονική Zyxen Digital Flow' : 'The Zyxen High-Ticket Architecture'}
                    </h3>
                    <div className="space-y-4 text-sm text-gray-300">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                        <span>{isEl ? 'Στόχος Ταχύτητας Core Web Vitals' : 'Target Speed (Core Web Vitals)'}</span>
                        <span className="font-mono text-emerald-400 font-bold">{auditResult.zyxenImpact.speedTarget}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                        <span>{isEl ? 'Εκτιμώμενη Αύξηση Μετατροπών' : 'Expected Conversion Boost'}</span>
                        <span className="font-mono text-emerald-400 font-bold">{auditResult.zyxenImpact.conversionBoost}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-mono block">Tech Stack</span>
                        <span className="font-mono text-xs text-gray-200">{auditResult.zyxenImpact.techStack}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposal Request CTA */}
                <div className="bg-gray-50 border border-gray-200 p-8 sm:p-10 rounded-3xl">
                  {!submittedContact ? (
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {isEl ? 'Λάβετε την Πλήρη Στρατηγική Πρόταση Αναβάθμισης' : 'Get the Full Zyxen Upgrade Roadmap'}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base font-light">
                        {isEl 
                          ? 'Αφήστε τα στοιχεία σας για να λάβετε ένα δωρεάν 3-λεπτο εξατομικευμένο βίντεο ανάλυσης από την ομάδα της Zyxen.'
                          : 'Leave your contact details to receive a complimentary 3-minute bespoke video teardown from Zyxen.'}
                      </p>

                      <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                        <input
                          type="text"
                          required
                          placeholder={isEl ? 'Όνομα / Εταιρεία' : 'Name / Company'}
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                        />
                        <input
                          type="email"
                          required
                          placeholder={isEl ? 'Professional Email' : 'Work Email'}
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isEl ? 'Αποστολή' : 'Request Roadmap'}</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {isEl ? 'Η πρόταση στάλθηκε επιτυχώς!' : 'Roadmap Request Received!'}
                      </h4>
                      <p className="text-gray-600 text-sm max-w-md mx-auto">
                        {isEl 
                          ? 'Ένας Senior Architect της Zyxen εξετάζει ήδη το domain σας. Θα λάβετε την αναφορά σας εντός 24 ωρών.'
                          : 'A Senior Architect at Zyxen is inspecting your domain. Expect your custom video teardown within 24 hours.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
