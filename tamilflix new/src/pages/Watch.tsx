import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, StarIcon, UsersIcon } from 'lucide-react';
import { WatchlistButton } from '../components/WatchlistButton';
import { useMovies } from '../contexts/MovieContext';
import { toEmbedUrl } from '../utils/trailer';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Watch() {
  const { id } = useParams<{id: string;}>();
  const { getById, loading } = useMovies();
  const movie = getById(Number(id));
  const source = toEmbedUrl(movie?.trailer, { autoplay: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6">
        <div className="aspect-video w-full animate-pulse rounded-3xl bg-ink-600" />
      </main>);

  }

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-40 text-center sm:px-8">
        <h1 className="font-display text-4xl text-white">Nothing to play</h1>
        <p className="mt-3 text-sm text-muted">This film isn't in the collection.</p>
        <Link
          to="/movies"
          className="mt-7 inline-flex rounded-full bg-cherry-700 px-6 py-3 text-sm font-bold text-white shadow-cherry transition-colors duration-200 hover:bg-rose-400 hover:text-ink">
          
          Back to all movies
        </Link>
      </main>);

  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
      <Link
        to={`/movie/${movie.id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted transition-colors duration-200 ease-cine hover:text-rose-300">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to details
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative mt-6">
        
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(165,18,53,0.28),transparent_65%)] blur-3xl" />
        
        <div className="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-black shadow-cherry">
          <div className="aspect-video w-full">
            {source ?
            <iframe
              src={source}
              title={`${movie.title} player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0" /> :


            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted">
                No playable source is available for this title yet.
              </div>
            }
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
        className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        
        <div>
          <h1 className="font-display text-4xl leading-none tracking-wide text-white sm:text-5xl">
            {movie.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5 text-rose-200">
              <StarIcon className="h-3.5 w-3.5 fill-rose-300 text-rose-300" />
              {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-cherry-700">
              ·
            </span>
            <span>{(movie.genre || []).join(' · ')}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <WatchlistButton movieId={movie.id} title={movie.title} variant="labelled" />
          <Link
            to={`/watch-together?movie=${movie.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200 active:scale-[0.97]">
            
            <UsersIcon className="h-4 w-4" />
            Watch with friends
          </Link>
        </div>
      </motion.div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70">{movie.description}</p>
    </main>);

}