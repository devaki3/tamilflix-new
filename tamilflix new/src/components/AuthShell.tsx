import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative isolate mx-auto flex w-full max-w-md flex-col px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(165,18,53,0.32),transparent_65%)] blur-3xl" />
      

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-3xl border border-rose-400/15 bg-ink-800/75 p-7 shadow-cherry backdrop-blur-xl sm:p-9">
        
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.18em] text-white text-glow-cherry transition-colors duration-200 ease-cine hover:text-rose-300">
          
          TAMILFLIX
        </Link>
        <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none tracking-wide text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>

        <div className="mt-7">{children}</div>
      </motion.div>

      <div className="mt-6 text-center text-sm text-muted">{footer}</div>
    </main>);

}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'numeric';
  maxLength?: number;
  required?: boolean;
}

export function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  required = true
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-muted/60 outline-none transition-[border-color,box-shadow] duration-200 ease-cine focus:border-rose-400/60 focus:shadow-glow" />
      
    </label>);

}

export function SubmitButton({
  children,
  busy



}: {children: React.ReactNode;busy?: boolean;}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full rounded-xl bg-cherry-700 px-6 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform,opacity] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.98] disabled:opacity-60">
      
      {busy ? 'Please wait…' : children}
    </button>);

}

export function FormError({ message }: {message: string | null;}) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-rose-400/25 bg-cherry-900/50 px-4 py-3 text-xs leading-relaxed text-rose-200">
      
      {message}
    </p>);

}