import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import AnimatedSection from '@/components/AnimatedSection';
import FormField, { inputClass } from '@/components/FormField';
import CustomSelect from '@/components/CustomSelect';
import MagneticButton from '@/components/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle, ChevronDown } from 'lucide-react';

const getValidators = (lang) => ({
  name: v => !v.trim() ? (lang === 'el' ? 'Υποχρεωτικό πεδίο' : 'Required') : v.trim().length < 2 ? (lang === 'el' ? 'Πολύ σύντομο' : 'Too short') : '',
  email: v => !v.trim() ? (lang === 'el' ? 'Υποχρεωτικό πεδίο' : 'Required') : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? (lang === 'el' ? 'Μη έγκυρη διεύθυνση email' : 'Invalid email address') : '',
  service: v => !v ? (lang === 'el' ? 'Παρακαλώ επιλέξτε υπηρεσία' : 'Please select a service') : '',
  budget: v => !v ? (lang === 'el' ? 'Παρακαλώ επιλέξτε εύρος budget' : 'Please select a budget range') : '',
  details: v => !v.trim() ? (lang === 'el' ? 'Υποχρεωτικό πεδίο' : 'Required') : v.trim().length < 10 ? (lang === 'el' ? 'Παρακαλώ δώστε περισσότερες λεπτομέρειες' : 'Please provide more detail') : '',
});

const EMPTY = { name: '', email: '', service: '', budget: '', details: '', _hp: '' };

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-card/60 transition-colors duration-200 cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-medium text-sm sm:text-base pr-2">{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="flex-shrink-0">
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const c = t('contactPage');

  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validators = getValidators(lang);
  const errors = {
    name: validators.name(form.name),
    email: validators.email(form.email),
    service: validators.service(form.service),
    budget: validators.budget(form.budget),
    details: validators.details(form.details),
  };
  const isValid = Object.values(errors).every(e => !e);

  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));
  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: typeof e === 'string' ? e : e.target.value }));

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
        body: JSON.stringify({ name: form.name, email: form.email, service: form.service, budget: form.budget, details: form.details, lang }),
      });
      if (!res.ok) throw new Error('Server error');
      setSent(true);
    } catch {
      setSubmitError(c.form.error);
    } finally {
      setSending(false);
    }
  };

  const faqItems = t('faq');

  return (
    <div>
      <section className="py-32 sm:py-40 border-b border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(255,107,44,0.05), transparent 65%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-xs font-medium tracking-[0.22em] uppercase mb-5" style={{ color: '#AF994D' }}>{t('nav.contact')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold max-w-3xl leading-tight">{c.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">{c.desc}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-5 gap-8 lg:gap-20">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="flex flex-col gap-6">
                {[
                  { icon: Mail, label: c.info.email, value: 'hello@zyxen.gr', href: 'mailto:hello@zyxen.gr' },
                  { icon: MapPin, label: c.info.location, value: c.info.locationVal },
                  { icon: Clock, label: c.info.response, value: c.info.responseVal },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(175,153,77,0.1)', border: '1px solid rgba(175,153,77,0.2)' }}>
                      <item.icon className="w-4 h-4" style={{ color: '#AF994D' }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-sm font-medium hover:text-primary transition-colors">{item.value}</a>
                        : <p className="text-sm font-medium">{item.value}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-3">
            <AnimatedSection delay={0.15}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-card border border-border/60 rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(175,153,77,0.06), transparent 70%)' }} />
                    <div className="absolute top-0 left-8 right-8 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(175,153,77,0.4), transparent)' }} />
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200, damping: 16 }}
                      className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{ background: 'rgba(175,153,77,0.12)', border: '1px solid rgba(175,153,77,0.3)' }}>
                      <CheckCircle2 className="w-7 h-7" style={{ color: '#AF994D' }} />
                    </motion.div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">{c.form.success}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      {lang === 'el' ? 'Θα επικοινωνήσουμε εντός μίας εργάσιμης ημέρας.' : "We'll be in touch within one business day."}
                    </p>
                    <p className="text-xs tracking-[0.22em] uppercase mt-8" style={{ color: '#AF994D' }}>Systems, Engineered.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={handleSubmit}
                    className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-5 relative overflow-hidden">
                    <div className="absolute top-0 left-8 right-8 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(175,153,77,0.25), transparent)' }} />
                    <input type="text" tabIndex={-1} aria-hidden="true" value={form._hp}
                      onChange={e => setForm(f => ({ ...f, _hp: e.target.value }))}
                      className="opacity-0 absolute pointer-events-none h-0 w-0 overflow-hidden" autoComplete="off" />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label={c.form.name} error={errors.name} touched={touched.name}>
                        <input type="text" value={form.name} onChange={setField('name')} onBlur={() => touch('name')}
                          placeholder="John Doe" className={inputClass(touched.name, errors.name, touched.name)} autoComplete="name" />
                      </FormField>
                      <FormField label={c.form.email} error={errors.email} touched={touched.email}>
                        <input type="email" value={form.email} onChange={setField('email')} onBlur={() => touch('email')}
                          placeholder="you@company.com" className={inputClass(touched.email, errors.email, touched.email)} autoComplete="email" />
                      </FormField>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label={c.form.service} error={errors.service} touched={touched.service}>
                        <CustomSelect value={form.service} onChange={v => { setField('service')(v); touch('service'); }}
                          options={c.services} placeholder={c.form.servicePh} touched={touched.service} error={errors.service} />
                      </FormField>
                      <FormField label={c.form.budget} error={errors.budget} touched={touched.budget}>
                        <CustomSelect value={form.budget} onChange={v => { setField('budget')(v); touch('budget'); }}
                          options={c.budgets} placeholder={c.form.budgetPh} touched={touched.budget} error={errors.budget} />
                      </FormField>
                    </div>
                    <FormField label={c.form.details} error={errors.details} touched={touched.details}>
                      <textarea rows={5} value={form.details} onChange={setField('details')} onBlur={() => touch('details')}
                        placeholder={lang === 'el' ? 'Περιγράψτε το project σας...' : 'Describe your project...'}
                        className={`${inputClass(touched.details, errors.details, false)} resize-none`} />
                    </FormField>
                    <AnimatePresence>
                      {submitError && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2.5 text-sm text-amber-400/90 bg-amber-400/[0.07] border border-amber-400/20 rounded-xl px-4 py-3" role="alert">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />{submitError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <MagneticButton className="sm:self-start" strength={0.25}>
                      <button type="submit" disabled={sending}
                        className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50 min-h-[48px] shadow-lg shadow-primary/20 w-full sm:w-auto justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-busy={sending}>
                        <AnimatePresence mode="wait">
                          {sending ? (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" /> {c.form.sending}
                            </motion.span>
                          ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <Send className="w-4 h-4" /> {c.form.submit}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </MagneticButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {Array.isArray(faqItems) && faqItems.length > 0 && (
        <section className="py-20 sm:py-28 border-t border-border/60 bg-card/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: '#AF994D' }} />
                <p className="text-xs font-medium tracking-[0.22em] uppercase" style={{ color: '#AF994D' }}>{t('faqTitle')}</p>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{t('faqSub')}</h2>
            </AnimatedSection>
            <div className="mt-10 flex flex-col gap-3">
              {faqItems.map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.06}>
                  <FaqItem item={item} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
