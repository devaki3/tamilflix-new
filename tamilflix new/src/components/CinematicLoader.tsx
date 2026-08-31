import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CinematicLoaderProps {
  onDone: () => void;
}

/**
 * Short opening title card: black screen → wordmark → cherry light sweep → fade.
 * Total ~1.9s, and instant when reduced motion is requested.
 */
export function CinematicLoader({ onDone }: CinematicLoaderProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduced ? 200 : 1900);
    return () => window.clearTimeout(timer);
  }, [onDone, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      aria-hidden="true">
      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_50%,rgba(114,13,37,0.28),transparent_70%)]" />

      <div className="relative overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 0, y: 14, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.18em' }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-4xl text-white text-glow-cherry sm:text-6xl">
          
          TAMILFLIX
        </motion.div>

        {!reduced &&
        <motion.div
          className="absolute inset-y-0 w-24 bg-[linear-gradient(90deg,transparent,rgba(255,209,220,0.55),rgba(255,92,138,0.35),transparent)] blur-[2px]"
          initial={{ x: '-140%' }}
          animate={{ x: '520%' }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.23, 1, 0.32, 1] }} />

        }
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.8 }}
        className="absolute bottom-16 text-[0.65rem] uppercase tracking-[0.5em] text-muted">
        
        Padampaapoma
      </motion.p>
    </motion.div>);

}