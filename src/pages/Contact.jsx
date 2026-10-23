import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@/website-offer.css';
import AnimatedSection from '@/components/AnimatedSection';
import SEOMeta from '@/components/SEOMeta';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Clock, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

const websiteService = 'Business website';
const servicesList = [
  websiteService,
  'Website care',
  'Monthly development partnership',
  'Enterprise Web & CMS (Umbraco)',
  'High-Scale E-Commerce',
  'Custom SaaS & Mobile (Flutter)',
  'AI Integration & Automation',
  'Architectural Consulting',
];

const budgetRanges = [
  'Discuss the website package',
  '€1.5k — €5k',
  '€5k — €10k',
  '€10k — €25k',
  '€25k — €50k',
  '€50k — €100k',
  '€100k+',
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-semibold text-base text-black pr-2">{item.q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 pt-2 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact({ embedded = false }) {
  const [searchParams] = useSearchParams();
  const websiteOffer = searchParams.get('offer') === 'website';
  const greekOffer = websiteOffer && searchParams.get('language') === 'el';
  const label = (en, el) => greekOffer ? el : en;
  const [form, setForm] = useState({ name: '', email: '', service: websiteOffer ? websiteService : '', budget: websiteOffer ? 'Discuss the website package' : '', details: websiteOffer ? `${label('I am interested in the business website package.', 'Ενδιαφέρομαι για το πακέτο ιστοσελίδας έως 5 σελίδες.')}${searchParams.get('care') === 'yes' ? label(' With optional website care.', ' Με προαιρετική φροντίδα ιστοσελίδας.') : ''}\n\n${label('My business: ', 'Η επιχείρησή μου: ')}` : '', _hp: '' });
  const [touched, setTouched] = useState({ name: false, email: false, service: false, budget: false, details: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [athensTime, setAthensTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const timeStr = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Athens',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAthensTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isValid = form.name.trim() && form.email.includes('@') && form.service && form.details.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, service: true, budget: true, details: true });
    if (!isValid || form._hp) return;
    setSending(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || 'Not specified' }),
      });
      const result = await res.json();
      if (!res.ok || result.success !== true) throw new Error('Enquiry not accepted');
      setSent(true);
    } catch {
      setSubmitError('We couldn’t send your enquiry. Your details are still here. Please try again or email hello@zyxen.gr.');
    } finally {
      setSending(false);
    }
  };

  const faqItems = [
    { q: 'What is Zyxen’s typical engagement model?', a: 'We agree on the scope and milestones before starting. Ongoing work can be arranged through a monthly retainer.' },
    { q: 'When can we get started?', a: 'Discovery typically starts within 3–5 business days after we agree on the initial scope and any confidentiality requirements.' },
    { q: 'Can you support the project after launch?', a: 'Yes. Maintenance, security updates and performance support are agreed around your project’s needs.' },
  ];

  return (
    <div lang={greekOffer ? "el" : "en"} style={websiteOffer ? { fontFamily: "'Zyxen Inter', sans-serif" } : undefined} className={embedded ? "experience-embedded-contact" : "bg-white text-[#121212] min-h-screen selection:bg-black selection:text-white font-sans pt-2 overflow-x-hidden"}>
      {!embedded && <SEOMeta
        title={label("Start a Project | ZYXEN", "Η ιστοσελίδα της επιχείρησής σας | ZYXEN")}
        description="Tell ZYXEN what you want to build or improve. Websites, commerce, mobile apps and automation, from Athens to your team."
      />}

      {/* HERO SECTION */}
      {!embedded && <section className="relative py-16 sm:py-20 border-b border-gray-200 bg-white">

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <AnimatedSection variant="depth">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 shadow-sm">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-800">
                {label('START A PROJECT', 'Η ΙΣΤΟΣΕΛΙΔΑ ΣΑΣ')}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black max-w-5xl leading-[1.08]">
              {label('Tell us about your project.', 'Ας γνωρίσουμε την επιχείρησή σας.')}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl leading-relaxed font-normal">
              {label('What would you like to build or improve? Share your goals and timeline. We’ll respond within one business day.', 'Πείτε μας τι κάνετε και τι χρειάζεστε. Θα σας απαντήσουμε μέσα σε μία εργάσιμη ημέρα.')}
            </p>
          </AnimatedSection>
        </div>
      </section>}

      {websiteOffer && <aside className="website-offer offer-wrap" aria-label="Η προσφορά σας"><div className="offer-note"><strong>{label("Business website with up to 5 pages", "Ιστοσελίδα επιχείρησης έως 5 σελίδες")}</strong><p>{label("Tell us about your business and available content. Scope, schedule and cost are agreed before starting. An enquiry is not an order.", "Πείτε μας τι κάνει η επιχείρησή σας και τι υλικό διαθέτετε. Θα συμφωνήσουμε αντικείμενο, χρόνο και κόστος πριν ξεκινήσουμε. Η αποστολή αιτήματος δεν αποτελεί παραγγελία.")}</p></div></aside>}

      {/* CONTACT FORM & INFO SECTION */}
      <section className="py-24 bg-gray-50/50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid lg:grid-cols-5 gap-12 lg:gap-20">
          {/* LEFT INFO SIDEBAR */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <AnimatedSection variant="depth">
              <h2 className="font-display text-2xl font-bold text-black mb-8">
                {label('Speak with ZYXEN', 'Μιλήστε με τη ZYXEN')}
              </h2>

              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#AF994D]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">DIRECT EMAIL</span>
                    <a href="mailto:hello@zyxen.gr" className="text-lg font-bold text-black hover:text-[#AF994D] transition-colors">
                      hello@zyxen.gr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#AF994D]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">LOCATION</span>
                    <p className="text-base font-bold text-black">Athens, Greece (EEST / UTC+3)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#AF994D]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">LOCAL ATHENS TIME</span>
                    <p className="text-base font-mono font-bold text-black">{athensTime || '03:00 PM EEST'}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-12 p-6 bg-white border border-gray-200 rounded-2xl">
              <span className="text-xs font-mono font-bold text-[#AF994D] uppercase tracking-wider block mb-2">SLA PROMISE</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                An engineer will review your enquiry and discuss scope options and next steps within one business day.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-3">
            <AnimatedSection delay={0.1} variant="depth">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-3xl p-10 sm:p-14 text-center shadow-xl"
                  >
                    <div className="w-20 h-20 rounded-full bg-black text-[#AF994D] mx-auto mb-6 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-black mb-3">
                      Enquiry received
                    </h3>
                    <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Zyxen. Our team will review your project and get back to you within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col gap-6"
                  >
                    <input
                      type="text"
                      tabIndex={-1}
                      value={form._hp}
                      onChange={(e) => setForm({ ...form, _hp: e.target.value })}
                      className="hidden"
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {label('Your Name', 'Ονοματεπώνυμο')}
                        </label>
                        <input id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            if (touched.name) setTouched({ ...touched, name: false });
                          }}
                          placeholder={label('Your full name', 'Το όνομά σας')}
                          className={`w-full px-4 py-3.5 rounded-xl border text-black text-sm focus:outline-none transition-colors ${
                            touched.name && !form.name.trim()
                              ? 'border-red-500 bg-red-50/20'
                              : 'border-gray-200 bg-gray-50 focus:border-black'
                          }`}
                        />
                        {touched.name && !form.name.trim() && (
                          <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Please provide your name
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {label('Email Address', 'Email')}
                        </label>
                        <input id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (touched.email) setTouched({ ...touched, email: false });
                          }}
                          placeholder="you@company.com"
                          className={`w-full px-4 py-3.5 rounded-xl border text-black text-sm focus:outline-none transition-colors ${
                            touched.email && (!form.email.trim() || !form.email.includes('@'))
                              ? 'border-red-500 bg-red-50/20'
                              : 'border-gray-200 bg-gray-50 focus:border-black'
                          }`}
                        />
                        {touched.email && (!form.email.trim() || !form.email.includes('@')) && (
                          <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Please provide a valid email address
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {label('What do you need help with?', 'Τι χρειάζεστε;')}
                      </label>
                      <select id="contact-service"
                        value={form.service}
                        onChange={(e) => {
                          setForm({ ...form, service: e.target.value });
                          if (touched.service) setTouched({ ...touched, service: false });
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-black text-sm focus:outline-none transition-colors ${
                          touched.service && !form.service
                            ? 'border-red-500 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50 focus:border-black'
                        }`}
                      >
                        <option value="">Choose a service</option>
                        {servicesList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {touched.service && !form.service && (
                        <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Please select a primary service
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {label('Budget range (optional)', 'Προϋπολογισμός (προαιρετικό)')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {budgetRanges.map((b) => (
                          <button
                            key={b}
                            type="button"
                            aria-pressed={form.budget === b}
                            onClick={() => setForm({ ...form, budget: b })}
                            className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all ${
                              form.budget === b
                                ? 'bg-black text-white border-black shadow-md'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-details" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {label('What would you like to achieve?', 'Πείτε μας λίγα λόγια για την επιχείρησή σας')}
                      </label>
                      <textarea id="contact-details"
                        rows={5}
                        value={form.details}
                        onChange={(e) => {
                          setForm({ ...form, details: e.target.value });
                          if (touched.details) setTouched({ ...touched, details: false });
                        }}
                        placeholder={label('Tell us about your business, what needs to change, and when you would like to launch.', 'Υπηρεσίες, διαθέσιμο υλικό και πότε θα θέλατε να ξεκινήσουμε.')}
                        className={`w-full px-4 py-3.5 rounded-xl border text-black text-sm focus:outline-none transition-colors resize-none ${
                          touched.details && !form.details.trim()
                            ? 'border-red-500 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50 focus:border-black'
                        }`}
                      />
                      {touched.details && !form.details.trim() && (
                        <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Please provide project details
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p role="alert" className="text-sm text-red-700 font-semibold">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:bg-gray-800 disabled:opacity-60 disabled:cursor-wait transition-colors shadow-lg mt-2"
                    >
                      {sending ? label('Sending...', 'Αποστολή...') : label('Send enquiry', 'Αποστολή αιτήματος')}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {!embedded && <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12">
          <AnimatedSection variant="depth">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#AF994D] block mb-3">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-black mb-10">
              Before you get in touch
            </h2>

            <div className="flex flex-col gap-4">
              {faqItems.map((item, i) => (
                <FaqItem key={i} item={item} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>}
    </div>
  );
}
