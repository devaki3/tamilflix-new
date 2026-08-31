import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useToast } from '../contexts/ToastContext';

interface WatchlistButtonProps {
  movieId: number;
  title: string;
  variant?: 'icon' | 'labelled';
  className?: string;
}

const SPARKS = [
{ x: -14, y: -12 },
{ x: 13, y: -14 },
{ x: -12, y: 13 },
{ x: 15, y: 10 }];


export function WatchlistButton({
  movieId,
  title,
  variant = 'icon',
  className = ''
}: WatchlistButtonProps) {
  const { has, toggle } = useWatchlist();
  const { toast } = useToast();
  const [burst, setBurst] = useState(0);
  const saved = has(movieId);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const added = toggle(movieId);
    if (added) setBurst((n) => n + 1);
    toast(added ? `${title} added to My List` : `${title} removed from My List`, 'success');
  };

  const label = saved ? `Remove ${title} from My List` : `Add ${title} to My List`;

  if (variant === 'labelled') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={`group relative inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-[colors,transform,box-shadow] duration-200 ease-cine active:scale-[0.97] ${
        saved ?
        'border-rose-400/60 bg-rose-400/10 text-rose-200 shadow-glow' :
        'border-white/15 bg-white/5 text-white hover:border-rose-400/50 hover:text-rose-200'} ${
        className}`}>
        
        <HeartIcon
          className={`h-4 w-4 transition-transform duration-200 ease-cine group-active:scale-125 ${
          saved ? 'fill-rose-400 text-rose-400' : ''}`
          } />
        
        {saved ? 'In My List' : 'Add to List'}
      </button>);

  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={saved}
      className={`relative grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-[colors,transform,box-shadow] duration-200 ease-cine active:scale-90 ${
      saved ?
      'border-rose-400/60 bg-rose-400/15 text-rose-300 shadow-glow' :
      'border-white/15 bg-ink/60 text-white/80 hover:border-rose-400/50 hover:text-rose-300'} ${
      className}`}>
      
      <HeartIcon className={`h-4 w-4 ${saved ? 'fill-rose-400 text-rose-400' : ''}`} />
      <AnimatePresence>
        {burst > 0 &&
        <motion.span
          key={burst}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
          
            {SPARKS.map((spark, index) =>
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-rose-200"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: spark.x, y: spark.y, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }} />

          )}
          </motion.span>
        }
      </AnimatePresence>
    </button>);

}