import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilmIcon } from 'lucide-react';
import { MovieGrid } from '../components/MovieGrid';
import { PosterSkeleton } from '../components/PosterSkeleton';
import { useMovies } from '../contexts/MovieContext';
import { allGenres } from '../utils/collections';

type SortKey = 'rating' | 'year' | 'title';

export function Movies() {
  const { movies, loading } = useMovies();
  const [params, setParams] = useSearchParams();

  const genre = params.get('genre');
  const sort = params.get('sort') as SortKey || 'rating';

  const genres = useMemo(() => allGenres(movies), [movies]);

  const visible = useMemo(() => {
    let list = genre ? movies.filter((m) => (m.genre || []).includes(genre)) : [...movies];
    if (sort === 'rating') list = list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'year') list = list.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sort === 'title') list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [movies, genre, sort]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);else
    next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
          The full collection
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-wide text-white text-glow-cherry sm:text-6xl">
          {genre ? genre : 'All Movies'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {visible.length} film{visible.length === 1 ? '' : 's'}
          {genre ? ` in ${genre}` : ' across every genre'}
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 border-b border-white/5 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          <button
            type="button"
            onClick={() => setParam('genre', null)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-cine ${
            !genre ?
            'border-rose-400/60 bg-rose-400/15 text-rose-200' :
            'border-white/10 text-muted hover:border-rose-400/40 hover:text-rose-200'}`
            }>
            
            All
          </button>
          {genres.map((item) =>
          <button
            key={item}
            type="button"
            onClick={() => setParam('genre', item === genre ? null : item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-cine ${
            genre === item ?
            'border-rose-400/60 bg-rose-400/15 text-rose-200' :
            'border-white/10 text-muted hover:border-rose-400/40 hover:text-rose-200'}`
            }>
            
              {item}
            </button>
          )}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest text-muted">
          Sort
          <select
            value={sort}
            onChange={(event) => setParam('sort', event.target.value)}
            className="rounded-xl border border-white/10 bg-ink-800 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none transition-colors duration-200 focus:border-rose-400/60">
            
            <option value="rating">Top rated</option>
            <option value="year">Newest first</option>
            <option value="title">A – Z</option>
          </select>
        </label>
      </div>

      <section className="mt-8">
        {loading ?
        <div className="space-y-4">
            <PosterSkeleton count={6} />
            <PosterSkeleton count={6} />
          </div> :
        visible.length ?
        <MovieGrid movies={visible} /> :

        <div className="mx-auto max-w-md py-20 text-center">
            <div
            aria-hidden="true"
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/20 bg-cherry-900/40">
            
              <FilmIcon className="h-6 w-6 text-rose-300" />
            </div>
            <h2 className="mt-5 font-display text-3xl text-white">No films in this genre yet</h2>
            <p className="mt-2 text-sm text-muted">
              Try another genre — the collection has {movies.length} Tamil films in total.
            </p>
          </div>
        }
      </section>
    </main>);

}