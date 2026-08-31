import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayIcon, RotateCcwIcon, SparklesIcon, StarIcon, UsersIcon } from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { MovieCard } from '../components/MovieCard';
import { WatchlistButton } from '../components/WatchlistButton';
import { Magnetic } from '../components/Magnetic';
import { useMovies } from '../contexts/MovieContext';
import * as api from '../utils/api';
import { toEmbedUrl } from '../utils/trailer';
import type { Movie, QuizAnswers } from '../types/movie';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Recommendation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movies } = useMovies();
  const answers = (location.state as {answers?: QuizAnswers;} | null)?.answers;

  const [result, setResult] = useState<{recommended: Movie;alternatives: Movie[];} | null>(null);
  const [loading, setLoading] = useState(Boolean(answers));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (!answers) return;
    let cancelled = false;
    setLoading(true);
    api.
    getRecommendation(answers, movies).
    then((data) => {
      if (!cancelled) setResult(data);
    }).
    finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies.length]);

  if (!answers) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 pb-10 pt-32 text-center sm:px-8 sm:pt-40">
        <div
          aria-hidden="true"
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/20 bg-cherry-900/40">
          
          <SparklesIcon className="h-6 w-6 text-rose-300" />
        </div>
        <h1 className="mt-6 font-display text-4xl leading-none tracking-wide text-white text-glow-cherry sm:text-5xl">
          Tonight's picks start with eight questions
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Tell us your mood, the pace you like and the ending you want, and we'll pull the one film
          from the collection that fits.
        </p>
        <Link
          to="/quiz"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-cherry-700 px-7 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
          
          <SparklesIcon className="h-4 w-4" />
          Take the quiz
        </Link>
      </main>);

  }

  if (loading || !result) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-40 text-center sm:px-8">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="font-display text-3xl tracking-wide text-rose-200">
          
          Reading your taste in Tamil cinema…
        </motion.div>
        <div className="mx-auto mt-6 h-1 w-56 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full w-1/3 rounded-full bg-cherry-700"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
          
        </div>
      </main>);

  }

  const movie = result.recommended;
  const trailer = toEmbedUrl(movie.trailer);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
          Your perfect match
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-wide text-white text-glow-cherry sm:text-6xl">
          Tonight's Picks For You
        </h1>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative mt-10 overflow-hidden rounded-3xl border border-rose-400/20 bg-[linear-gradient(120deg,rgba(59,7,21,0.85),rgba(13,7,10,0.9))] p-6 shadow-cherry sm:p-9">
        
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,92,138,0.22),transparent_62%)] blur-3xl" />
        
        <div className="relative grid gap-8 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-10">
          <div className="mx-auto w-40 overflow-hidden rounded-2xl border border-rose-400/20 shadow-poster sm:mx-0 sm:w-full">
            <PosterImage
              src={movie.poster}
              alt={`${movie.title} poster`}
              title={movie.title}
              eager
              className="aspect-[2/3] w-full" />
            
          </div>

          <div>
            <h2 className="font-display text-4xl leading-none tracking-wide text-white sm:text-5xl">
              {movie.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 text-rose-200">
                <StarIcon className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
                {movie.rating}/10
              </span>
              <span>{movie.year}</span>
              <span aria-hidden="true" className="text-cherry-700">
                ·
              </span>
              <span>Dir. {movie.director}</span>
            </div>
            <p className="mt-4 flex flex-wrap gap-2">
              {(movie.genre || []).map((genre) =>
              <span
                key={genre}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/75">
                
                  {genre}
                </span>
              )}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">{movie.description}</p>
            {(movie.cast || []).length > 0 &&
            <p className="mt-4 text-xs text-muted">Cast: {movie.cast.join(' · ')}</p>
            }

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  to={`/watch/${movie.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-cherry-700 px-6 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
                  
                  <PlayIcon className="h-4 w-4 fill-current transition-transform duration-200 ease-cine group-hover:scale-110" />
                  Watch Now
                </Link>
              </Magnetic>
              <WatchlistButton movieId={movie.id} title={movie.title} variant="labelled" />
              <Link
                to={`/watch-together?movie=${movie.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200 active:scale-[0.97]">
                
                <UsersIcon className="h-4 w-4" />
                Watch Together
              </Link>
              <button
                type="button"
                onClick={() => navigate('/quiz')}
                className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-muted transition-colors duration-200 ease-cine hover:text-rose-300">
                
                <RotateCcwIcon className="h-4 w-4" />
                Retake quiz
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {trailer &&
      <section className="mt-14" aria-labelledby="rec-trailer">
          <h2
          id="rec-trailer"
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

      {result.alternatives.length > 0 &&
      <section className="mt-14" aria-labelledby="rec-alts">
          <h2
          id="rec-alts"
          className="mb-4 font-display text-2xl tracking-wide text-white text-glow-cherry sm:text-3xl">
          
            You Might Also Like
          </h2>
          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {result.alternatives.map((alt, index) =>
          <motion.li
            key={alt.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + index * 0.06, ease: EASE }}>
            
                <MovieCard movie={alt} />
              </motion.li>
          )}
          </ul>
        </section>
      }
    </main>);

}