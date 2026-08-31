import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PlayIcon, StarIcon, UsersIcon } from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { WatchlistButton } from '../components/WatchlistButton';
import { MovieRow } from '../components/MovieRow';
import { Magnetic } from '../components/Magnetic';
import { useMovies } from '../contexts/MovieContext';
import * as api from '../utils/api';
import { toEmbedUrl } from '../utils/trailer';
import type { Movie } from '../types/movie';

const EASE = [0.23, 1, 0.32, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay, ease: EASE }
});

export function MovieDetail() {
  const { id } = useParams<{id: string;}>();
  const movieId = Number(id);
  const { movies, getById } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(getById(movieId) ?? null);
  const [loading, setLoading] = useState(!movie);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const cached = getById(movieId);
    if (cached) {
      setMovie(cached);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.getMovie(movieId).then((result) => {
      if (cancelled) return;
      setMovie(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [movieId, getById]);

  const related = useMemo(() => {
    if (!movie) return [];
    return movies.
    filter((m) => m.id !== movie.id && (m.genre || []).some((g) => (movie.genre || []).includes(g))).
    sort((a, b) => (b.rating || 0) - (a.rating || 0)).
    slice(0, 12);
  }, [movie, movies]);

  const trailer = toEmbedUrl(movie?.trailer);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-5 pt-36 sm:px-8">
        <div className="h-6 w-32 animate-pulse rounded-full bg-ink-600" />
        <div className="mt-6 h-16 w-2/3 animate-pulse rounded-2xl bg-ink-600" />
        <div className="mt-4 h-32 w-full max-w-2xl animate-pulse rounded-2xl bg-ink-600" />
      </main>);

  }

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-40 text-center sm:px-8">
        <h1 className="font-display text-4xl text-white">Movie not found</h1>
        <p className="mt-3 text-sm text-muted">
          This film isn't in the collection. It may have been removed from the library.
        </p>
        <Link
          to="/movies"
          className="mt-7 inline-flex rounded-full bg-cherry-700 px-6 py-3 text-sm font-bold text-white shadow-cherry transition-colors duration-200 hover:bg-rose-400 hover:text-ink">
          
          Back to all movies
        </Link>
      </main>);

  }

  return (
    <main>
      {/* Cinematic backdrop that dissolves into the room */}
      <div className="relative isolate">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[38rem] overflow-hidden">
          {movie.poster &&
          <img
            src={movie.poster}
            alt=""
            className="h-full w-full object-cover object-top opacity-30 blur-sm" />

          }
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_25%_20%,rgba(8,6,8,0.45),rgba(8,6,8,0.92)_58%,#080608)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,#080608)]" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <motion.div {...rise(0)}>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted transition-colors duration-200 ease-cine hover:text-rose-300">
              
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              All movies
            </Link>
          </motion.div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto w-44 overflow-hidden rounded-3xl border border-rose-400/20 shadow-poster sm:w-56 lg:mx-0 lg:w-full">
              
              <PosterImage
                src={movie.poster}
                alt={`${movie.title} poster`}
                title={movie.title}
                eager
                className="aspect-[2/3] w-full" />
              
            </motion.div>

            <div>
              <motion.h1
                {...rise(0.08)}
                className="font-display text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.94] tracking-wide text-white text-glow-cherry">
                
                {movie.title}
              </motion.h1>

              <motion.div
                {...rise(0.16)}
                className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
                
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 font-semibold text-rose-200">
                  <StarIcon className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
                  {movie.rating}/10
                </span>
                <span>{movie.year}</span>
                <span aria-hidden="true" className="text-cherry-700">
                  ·
                </span>
                <span>Dir. {movie.director}</span>
                <span aria-hidden="true" className="text-cherry-700">
                  ·
                </span>
                <span>{movie.pace} pace</span>
              </motion.div>

              <motion.ul {...rise(0.22)} className="mt-5 flex flex-wrap gap-2">
                {(movie.genre || []).map((genre) =>
                <li key={genre}>
                    <Link
                    to={`/movies?genre=${encodeURIComponent(genre)}`}
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors duration-200 ease-cine hover:border-rose-400/40 hover:text-rose-200">
                    
                      {genre}
                    </Link>
                  </li>
                )}
              </motion.ul>

              <motion.p
                {...rise(0.28)}
                className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white/75">
                
                {movie.description}
              </motion.p>

              {(movie.cast || []).length > 0 &&
              <motion.div {...rise(0.34)} className="mt-6">
                  <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted">
                    Cast
                  </h2>
                  <p className="mt-2 text-sm text-white/80">{movie.cast.join(' · ')}</p>
                </motion.div>
              }

              {(movie.mood || []).length > 0 &&
              <motion.div {...rise(0.38)} className="mt-5">
                  <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted">
                    Mood
                  </h2>
                  <p className="mt-2 text-sm text-white/80">
                    {movie.mood.join(' · ')} · {movie.ending} ending
                  </p>
                </motion.div>
              }

              <motion.div {...rise(0.44)} className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    to={`/watch/${movie.id}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-cherry-700 px-7 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
                    
                    <PlayIcon className="h-4 w-4 fill-current transition-transform duration-200 ease-cine group-hover:scale-110" />
                    Watch Now
                  </Link>
                </Magnetic>
                <WatchlistButton movieId={movie.id} title={movie.title} variant="labelled" />
                <Link
                  to={`/watch-together?movie=${movie.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200 active:scale-[0.97]">
                  
                  <UsersIcon className="h-4 w-4" />
                  Watch Together
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pt-16 sm:px-8">
        {trailer &&
        <section aria-labelledby="trailer-heading">
            <h2
            id="trailer-heading"
            className="mb-4 font-display text-2xl tracking-wide text-white text-glow-cherry sm:text-3xl">
            
              Official Trailer
            </h2>
            <div className="overflow-hidden rounded-3xl border border-rose-400/15 bg-black shadow-cherry">
              <div className="aspect-video w-full">
                <iframe
                src={trailer}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full border-0" />
              
              </div>
            </div>
          </section>
        }

        {related.length > 0 &&
        <MovieRow title="More Tamil Films" emoji="🎞️" movies={related} />
        }
      </div>
    </main>);

}