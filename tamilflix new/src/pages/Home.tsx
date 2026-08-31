import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, WifiOffIcon } from 'lucide-react';
import { Hero } from '../components/Hero';
import { MovieRow } from '../components/MovieRow';
import { PosterSkeleton } from '../components/PosterSkeleton';
import { useMovies } from '../contexts/MovieContext';
import { buildCollections, trending } from '../utils/collections';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Home() {
  const { movies, loading, offline } = useMovies();

  const hot = useMemo(() => trending(movies), [movies]);
  const featured = useMemo(() => hot.slice(0, 5), [hot]);
  const collections = useMemo(() => buildCollections(movies), [movies]);

  if (loading) {
    return (
      <div className="px-5 pb-24 pt-40 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-8 w-52 animate-pulse rounded-full bg-ink-600" />
          <div className="mt-4 h-20 w-full max-w-xl animate-pulse rounded-2xl bg-ink-600" />
          <div className="mt-14 space-y-10">
            <PosterSkeleton />
            <PosterSkeleton />
          </div>
        </div>
      </div>);

  }

  return (
    <div>
      <Hero movies={featured} />

      <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 sm:px-8">
        {offline &&
        <p className="flex items-center gap-2 rounded-2xl border border-rose-400/15 bg-cherry-900/30 px-4 py-3 text-xs text-rose-200/80">
            <WifiOffIcon className="h-4 w-4 shrink-0" />
            Showing the offline catalogue — the live server is waking up. Everything still works.
          </p>
        }

        <MovieRow
          title="Trending Now"
          emoji="🔥"
          blurb="What everyone is watching tonight"
          movies={hot}
          numbered />
        

        {/* Quiz invitation — the single strongest secondary action on the page */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-[linear-gradient(120deg,rgba(59,7,21,0.9),rgba(13,7,10,0.85))] px-6 py-10 sm:px-10 sm:py-14">
          
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,92,138,0.24),transparent_62%)] blur-2xl" />
          
          <div className="relative max-w-2xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-300">
              Not sure what to watch?
            </p>
            <h2 className="mt-3 font-display text-4xl leading-none tracking-wide text-white sm:text-5xl">
              Let the theatre pick for you
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Eight quick questions about your mood, pace and the kind of ending you want — and
              we'll pull the one film from the collection that fits tonight.
            </p>
            <Link
              to="/quiz"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-cherry-700 px-7 py-3.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
              
              <SparklesIcon className="h-4 w-4" />
              Take the quiz
            </Link>
          </div>
        </motion.section>

        {collections.map((collection) =>
        <MovieRow
          key={collection.id}
          title={collection.label}
          emoji={collection.emoji}
          blurb={collection.blurb}
          movies={collection.movies}
          action={
          <Link
            to={`/movies?genre=${encodeURIComponent(collection.label)}`}
            className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted transition-colors duration-200 ease-cine hover:text-rose-300">
            
                See all
              </Link>
          } />

        )}
      </div>
    </div>);

}