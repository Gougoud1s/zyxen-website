import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { inputClass } from './FormField';

/**
 * Fully custom select dropdown — no native browser appearance.
 * Premium dropdown with animations and brand styling.
 */
export default function CustomSelect({
  value, onChange, options, placeholder = 'Select…',
  touched, error,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const displayLabel = selected ? (selected.label ?? selected) : null;

  const triggerClass = inputClass(touched, error, true);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${triggerClass} flex items-center justify-between text-left cursor-pointer select-none min-h-[46px]`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={displayLabel ? 'text-foreground' : 'text-muted-foreground/40'}>
          {displayLabel || placeholder}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-xl"
            role="listbox"
          >
            {options.map((opt) => {
              const val = opt.value ?? opt;
              const label = opt.label ?? opt;
              const isSelected = val === value;
              return (
                <button
                  key={val}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { onChange(val); setOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors
                    ${isSelected
                      ? 'text-foreground bg-primary/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                >
                  {label}
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}