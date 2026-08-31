import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import { MovieGrid } from '../components/MovieGrid';
import { useMovies } from '../contexts/MovieContext';
import { useWatchlist } from '../contexts/WatchlistContext';

export function MyList() {
  const { movies } = useMovies();
  const { ids, clear } = useWatchlist();

  const saved = useMemo(
    () => ids.map((id) => movies.find((m) => m.id === id)).filter(Boolean) as typeof movies,
    [ids, movies]
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
            Saved for later
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none tracking-wide text-white text-glow-cherry sm:text-6xl">
            My List
          </h1>
          <p className="mt-2 text-sm text-muted">
            {saved.length} film{saved.length === 1 ? '' : 's'} waiting for you
          </p>
        </div>
        {saved.length > 0 &&
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted transition-colors duration-200 ease-cine hover:border-rose-400/40 hover:text-rose-200">
          
            Clear list
          </button>
        }
      </header>

      <section className="mt-10">
        {saved.length ?
        <MovieGrid movies={saved} /> :

        <div className="mx-auto max-w-md py-20 text-center">
            <div
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/20 bg-cherry-900/40">
            
              <HeartIcon className="h-6 w-6 text-rose-300" />
            </div>
            <h2 className="mt-5 font-display text-3xl text-white">Your list is empty</h2>
            <p className="mt-2 text-sm text-muted">
              Tap the heart on any poster and it will wait here for the right night.
            </p>
            <Link
            to="/movies"
            className="mt-6 inline-flex rounded-full bg-cherry-700 px-6 py-3 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97]">
            
              Browse the collection
            </Link>
          </div>
        }
      </section>
    </main>);

}