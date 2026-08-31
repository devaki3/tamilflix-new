import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { SectionHeading } from './SectionHeading';
import type { Movie } from '../types/movie';

interface MovieRowProps {
  title: string;
  emoji?: string;
  blurb?: string;
  movies: Movie[];
  numbered?: boolean;
  action?: React.ReactNode;
}

/**
 * Horizontal cinematic carousel. Native scroll (so touch swipe and keyboard
 * both work for free) with arrow controls and gradient edge masks.
 */
export function MovieRow({ title, emoji, blurb, movies, numbered, action }: MovieRowProps) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [edges, setEdges] = useState({ start: false, end: true });

  const syncEdges = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setEdges({
      start: node.scrollLeft > 8,
      end: node.scrollLeft < maxScroll - 8
    });
  }, []);

  useEffect(() => {
    syncEdges();
    const node = trackRef.current;
    if (!node) return;
    node.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      node.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges, movies.length]);

  const scrollBy = (direction: 1 | -1) => {
    const node = trackRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(node.clientWidth * 0.8, 240), behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section className="relative" aria-labelledby={`row-${title.replace(/\W+/g, '-')}`}>
      <SectionHeading
        id={`row-${title.replace(/\W+/g, '-')}`}
        emoji={emoji}
        title={title}
        blurb={blurb}
        action={
        <div className="hidden items-center gap-2 md:flex">
            {action}
            <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!edges.start}
            aria-label={`Scroll ${title} left`}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-800/70 text-white/80 backdrop-blur-md transition-[colors,transform,opacity] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-300 active:scale-95 disabled:opacity-30">
            
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!edges.end}
            aria-label={`Scroll ${title} right`}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-800/70 text-white/80 backdrop-blur-md transition-[colors,transform,opacity] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-300 active:scale-95 disabled:opacity-30">
            
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        } />
      

      <div className="relative">
        <ul
          ref={trackRef}
          className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-6 pt-1 sm:gap-4">
          
          {movies.map((movie, index) =>
          <li
            key={`${movie.id}-${index}`}
            className="w-[38vw] min-w-[132px] max-w-[190px] shrink-0 snap-start sm:w-[22vw] lg:w-[15vw]">
            
              <MovieCard movie={movie} rank={numbered ? index + 1 : undefined} />
            </li>
          )}
        </ul>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-[linear-gradient(90deg,#080608,transparent)] transition-opacity duration-200 ${
          edges.start ? 'opacity-100' : 'opacity-0'}`
          } />
        
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-[linear-gradient(270deg,#080608,transparent)] transition-opacity duration-200 ${
          edges.end ? 'opacity-100' : 'opacity-0'}`
          } />
        
      </div>
    </section>);

}