import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Premium form input field with custom validation states.
 * No browser default validation — all states are custom designed.
 */
export default function FormField({ label, error, touched, valid, children, className = '' }) {
  const showError = touched && error;
  const showValid = touched && !error && valid;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium transition-colors ${showError ? 'text-amber-400' : 'text-foreground/80'}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {children}

        {/* Validation icon */}
        <AnimatePresence>
          {(showError || showValid) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              {showError
                ? <AlertCircle className="w-4 h-4 text-amber-400" />
                : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inline error message */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs text-amber-400/90 leading-snug pl-0.5"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Shared input class builder */
export function inputClass(touched, error, extraRight = false) {
  const base = 'w-full bg-background/60 border rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none appearance-none placeholder:text-muted-foreground/40 backdrop-blur-sm';
  const right = extraRight ? 'pr-10' : '';
  if (touched && error) return `${base} ${right} border-amber-400/50 focus:border-amber-400/80 bg-amber-400/[0.03]`;
  if (touched && !error) return `${base} ${right} border-emerald-500/40 focus:border-emerald-500/60`;
  return `${base} ${right} border-border/50 hover:border-border focus:border-primary/70 focus:bg-background/80`;
}