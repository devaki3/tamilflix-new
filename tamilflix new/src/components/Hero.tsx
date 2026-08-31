import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { InfoIcon, PlayIcon, StarIcon, UsersIcon } from 'lucide-react';
import { PosterImage } from './PosterImage';
import { WatchlistButton } from './WatchlistButton';
import { Magnetic } from './Magnetic';
import type { Movie } from '../types/movie';

interface HeroProps {
  movies: Movie[];
}

const EASE = [0.23, 1, 0.32, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE }
});

export function Hero({ movies }: HeroProps) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const featured = movies[index];

  useEffect(() => {
    if (movies.length < 2 || reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % movies.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [movies.length, reduced]);

  if (!featured) return null;

  return (
    <section
      aria-label="Featured tonight"
      className="relative isolate min-h-[86svh] w-full overflow-hidden pb-16 pt-28 sm:min-h-[92svh] sm:pt-32">
      
      {/* Backdrop: the poster itself, blown out and blended into the room */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={featured.id}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: EASE }, scale: { duration: 9, ease: 'linear' } }}>
          
          {featured.poster &&
          <img
            src={featured.poster}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-top opacity-40 blur-[2px]" />

          }
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_18%_25%,rgba(8,6,8,0.35),rgba(8,6,8,0.92)_62%,#080608_100%)]" />
      
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-[linear-gradient(180deg,transparent,#080608)]" />
      
      <div
        aria-hidden="true"
        className="absolute -left-20 top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(165,18,53,0.4),transparent_62%)] blur-3xl" />
      

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <AnimatePresence mode="wait">
          <div key={featured.id}>
            <motion.p
              {...rise(0.05)}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
              
              Featured tonight
            </motion.p>

            <motion.h1
              {...rise(0.12)}
              className="mt-3 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] tracking-wide text-white text-glow-cherry">
              
              {featured.title}
            </motion.h1>

            <motion.div
              {...rise(0.2)}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 font-semibold text-rose-200">
                <StarIcon className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
                {featured.rating}
              </span>
              <span>{featured.year}</span>
              <span aria-hidden="true" className="text-cherry-700">
                ·
              </span>
              <span>{(featured.genre || []).join(' · ')}</span>
              <span aria-hidden="true" className="text-cherry-700">
                ·
              </span>
              <span>Dir. {featured.director}</span>
            </motion.div>

            <motion.p
              {...rise(0.28)}
              className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              
              {featured.description}
            </motion.p>

            <motion.div {...rise(0.38)} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  to={`/watch/${featured.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-cherry-700 px-7 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform,box-shadow] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
                  
                  <PlayIcon className="h-4 w-4 fill-current transition-transform duration-200 ease-cine group-hover:scale-110" />
                  Watch Now
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to={`/movie/${featured.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200 active:scale-[0.97]">
                  
                  <InfoIcon className="h-4 w-4" />
                  More Info
                </Link>
              </Magnetic>
              <WatchlistButton movieId={featured.id} title={featured.title} variant="labelled" />
              <Link
                to={`/watch-together?movie=${featured.id}`}
                className="inline-flex items-center gap-2 rounded-full px-3 py-3.5 text-sm font-semibold text-muted transition-colors duration-200 ease-cine hover:text-rose-300">
                
                <UsersIcon className="h-4 w-4" />
                Watch Together
              </Link>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Poster plate */}
        <div className="relative hidden justify-self-center lg:block">
          <div
            aria-hidden="true"
            className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(255,92,138,0.18),transparent_65%)] blur-2xl" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative w-[19rem] overflow-hidden rounded-3xl border border-rose-400/20 shadow-poster xl:w-[21rem]">
              
              <PosterImage
                src={featured.poster}
                alt={`${featured.title} poster`}
                title={featured.title}
                eager
                className="aspect-[2/3] w-full" />
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Featured switcher */}
      {movies.length > 1 &&
      <div className="mx-auto mt-10 flex w-full max-w-7xl items-center gap-2 px-5 sm:px-8">
          {movies.map((movie, i) =>
        <button
          key={movie.id}
          type="button"
          onClick={() => setIndex(i)}
          aria-label={`Feature ${movie.title}`}
          aria-current={i === index}
          className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-cine ${
          i === index ? 'w-10 bg-rose-400' : 'w-5 bg-white/20 hover:bg-white/40'}`
          } />

        )}
        </div>
      }
    </section>);

}