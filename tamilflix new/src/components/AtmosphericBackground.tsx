import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Fixed, non-interactive room lighting: two slow cherry/rose blooms, a soft
 * light ray and a vignette. Purely CSS-animated so it costs nothing per frame
 * in JS, and static under prefers-reduced-motion.
 */
export function AtmosphericBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      <div
        className={`absolute -left-40 -top-52 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(114,13,37,0.5),transparent_65%)] blur-3xl ${
        reduced ? '' : 'animate-drift'}`
        } />
      
      <div
        className={`absolute -bottom-64 -right-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(165,18,53,0.36),transparent_65%)] blur-3xl ${
        reduced ? '' : 'animate-drift-alt'}`
        } />
      
      <div className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,92,138,0.12),transparent_60%)] blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(59,7,21,0.55),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_35%,rgba(8,6,8,0.85)_100%)]" />
    </div>);

}