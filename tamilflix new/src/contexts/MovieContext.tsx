import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../utils/api';
import type { Movie } from '../types/movie';

interface MovieContextValue {
  movies: Movie[];
  loading: boolean;
  offline: boolean;
  error: string | null;
  getById: (id: number) => Movie | undefined;
  reload: () => void;
}

const MovieContext = createContext<MovieContextValue | null>(null);

export function MovieProvider({ children }: {children: React.ReactNode;}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.
    getMovies().
    then((result) => {
      if (cancelled) return;
      setMovies(result.movies);
      setOffline(result.offline);
      setError(null);
    }).
    catch(() => {
      if (!cancelled) setError('Could not load the movie library.');
    }).
    finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const value = useMemo<MovieContextValue>(
    () => ({
      movies,
      loading,
      offline,
      error,
      getById: (id: number) => movies.find((m) => m.id === id),
      reload: () => setNonce((n) => n + 1)
    }),
    [movies, loading, offline, error]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies(): MovieContextValue {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used within MovieProvider');
  return ctx;
}