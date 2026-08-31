import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import type { QuizAnswers } from '../types/movie';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [pending, setPending] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[step];
  const total = QUIZ_QUESTIONS.length;
  const progress = Math.round(step / total * 100);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [step]);

  const select = (value: string) => {
    if (pending) return;
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    setPending(value);
    // Preserves the original 500ms auto-advance behaviour.
    window.setTimeout(() => {
      setPending(null);
      if (step < total - 1) {
        setStep(step + 1);
      } else {
        navigate('/recommendations', { state: { answers: next } });
      }
    }, 500);
  };

  return (
    <main className="relative isolate mx-auto w-full max-w-3xl px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(165,18,53,0.3),transparent_65%)] blur-3xl" />
      

      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
          Recommendation quiz
        </p>
        <h1 className="mt-3 font-display text-4xl leading-none tracking-wide text-white text-glow-cherry sm:text-5xl">
          What are you in the mood to watch tonight?
        </h1>
      </header>

      <div className="mt-9">
        <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.24em] text-muted">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{progress}% complete</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full rounded-full bg-cherry-700"
            animate={{ width: `${Math.max(progress, 4)}%` }}
            transition={{ duration: 0.3, ease: EASE }} />
          
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={question.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="mt-10"
          aria-live="polite">
          
          <h2 className="text-center font-display text-3xl tracking-wide text-white sm:text-4xl">
            {question.question}
          </h2>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const selected = answers[question.key] === option.value;
              return (
                <motion.li
                  key={option.value}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, delay: Math.min(index * 0.045, 0.27), ease: EASE }}>
                  
                  <button
                    type="button"
                    onClick={() => select(option.value)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[colors,transform,box-shadow] duration-200 ease-cine active:scale-[0.98] ${
                    selected ?
                    'border-rose-400/70 bg-cherry-900/70 shadow-cherry' :
                    'border-white/[0.08] bg-white/[0.03] hover:border-rose-400/40 hover:bg-cherry-900/40'}`
                    }>
                    
                    <span aria-hidden="true" className="text-2xl leading-none">
                      {option.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">{option.text}</span>
                      <span className="mt-0.5 block text-xs text-muted">{option.desc}</span>
                    </span>
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-[colors,transform] duration-200 ease-cine ${
                      selected ?
                      'scale-100 border-rose-400 bg-rose-400 text-ink' :
                      'scale-90 border-white/15 text-transparent'}`
                      }>
                      
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </motion.li>);

            })}
          </ul>
        </motion.section>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted transition-colors duration-200 ease-cine hover:text-rose-300 disabled:pointer-events-none disabled:opacity-0">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Previous
        </button>
        <p className="text-xs text-muted/70">Pick an answer and we move on automatically.</p>
      </div>
    </main>);

}