import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tamilflix_watchlist';

interface WatchlistContextValue {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => boolean;
  clear: () => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function read(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }: {children: React.ReactNode;}) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(read());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {

      /* noop */}
  }, [ids]);

  const toggle = useCallback((id: number) => {
    let added = false;
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((n) => n !== id);
      added = true;
      return [id, ...prev];
    });
    return added;
  }, []);

  const value = useMemo<WatchlistContextValue>(
    () => ({
      ids,
      has: (id: number) => ids.includes(id),
      toggle,
      clear: () => setIds([])
    }),
    [ids, toggle]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}