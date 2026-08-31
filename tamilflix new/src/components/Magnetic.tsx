import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Gives an interactive element a slight pull toward the cursor. Mouse only,
 * transform only, and disabled under reduced motion — it never intercepts
 * clicks or focus.
 */
export function Magnetic({ children, strength = 6, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength * 2;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`inline-block transition-transform duration-200 ease-cine will-change-transform ${className}`}>
      
      {children}
    </span>);

}