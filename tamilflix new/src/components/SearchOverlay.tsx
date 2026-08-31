import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { useMovies } from '../contexts/MovieContext';
import * as api from '../utils/api';
import { allGenres } from '../utils/collections';
import type { Movie } from '../types/movie';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { movies } = useMovies();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const genres = useMemo(() => allGenres(movies).slice(0, 8), [movies]);

  const suggestions = useMemo(
    () => [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6),
    [movies]
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // Debounced search against GET /api/movies?search= (with offline fallback).
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(() => {
      api.
      getMovies({ search: term }).
      then((result) => setResults(result.movies)).
      catch(() => setResults([])).
      finally(() => setSearching(false));
    }, 260);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const visible = useMemo(() => {
    const base = query.trim() ? results : [];
    return genre ? base.filter((m) => (m.genre || []).includes(genre)) : base;
  }, [results, genre, query]);

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-[80] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        role="dialog"
        aria-modal="true"
        aria-label="Search movies">
        
          <button
          type="button"
          aria-label="Close search"
          onClick={onClose}
          className="absolute inset-0 cursor-default bg-ink/95 backdrop-blur-xl" />
        

          <motion.div
          className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-5 pt-24 sm:px-8"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: EASE }}>
          
            <div className="flex items-center gap-3 rounded-2xl border border-rose-400/25 bg-ink-800/80 px-4 py-3 shadow-cherry backdrop-blur-xl">
              <SearchIcon
              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
              searching ? 'animate-pulse text-rose-400' : 'text-rose-300'}`
              } />
            
              <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Tamil movies by title…"
              aria-label="Search movies by title"
              className="w-full bg-transparent text-base text-white placeholder:text-muted/70 focus:outline-none" />
            
              {query &&
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-200 ease-cine hover:bg-white/10 hover:text-white">
              
                  <XIcon className="h-4 w-4" />
                </button>
            }
              <button
              type="button"
              onClick={onClose}
              className="hidden rounded-lg border border-white/10 px-2 py-1 text-[0.65rem] uppercase tracking-widest text-muted transition-colors duration-200 hover:text-white sm:block">
              
                Esc
              </button>
            </div>

            {genres.length > 0 &&
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
                <button
              type="button"
              onClick={() => setGenre(null)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ease-cine ${
              genre === null ?
              'border-rose-400/60 bg-rose-400/15 text-rose-200' :
              'border-white/10 text-muted hover:border-rose-400/40 hover:text-rose-200'}`
              }>
              
                  All genres
                </button>
                {genres.map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setGenre(genre === item ? null : item)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ease-cine ${
              genre === item ?
              'border-rose-400/60 bg-rose-400/15 text-rose-200' :
              'border-white/10 text-muted hover:border-rose-400/40 hover:text-rose-200'}`
              }>
              
                    {item}
                  </button>
            )}
              </div>
          }

            <div className="no-scrollbar mt-6 flex-1 overflow-y-auto pb-16">
              {!query.trim() &&
            <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
                    Top picks to start with
                  </p>
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {suggestions.map((movie, index) =>
                <motion.li
                  key={movie.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: Math.min(index * 0.04, 0.24), ease: EASE }}>
                  
                        <div onClick={onClose}>
                          <MovieCard movie={movie} />
                        </div>
                      </motion.li>
                )}
                  </ul>
                </div>
            }

              {query.trim() && visible.length > 0 &&
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {visible.map((movie, index) =>
              <motion.li
                key={movie.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.28), ease: EASE }}>
                
                      <div onClick={onClose}>
                        <MovieCard movie={movie} />
                      </div>
                    </motion.li>
              )}
                </ul>
            }

              {query.trim() && !searching && visible.length === 0 &&
            <div className="mx-auto max-w-md py-16 text-center">
                  <div
                aria-hidden="true"
                className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/20 bg-cherry-900/40">
                
                    <SearchIcon className="h-6 w-6 text-rose-300" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-white">Nothing playing here</h3>
                  <p className="mt-2 text-sm text-muted">
                    No film matches “{query.trim()}”
                    {genre ? ` in ${genre}` : ''}. Try another title, or clear the genre filter.
                  </p>
                </div>
            }
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}