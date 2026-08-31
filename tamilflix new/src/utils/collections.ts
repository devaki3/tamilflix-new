import type { Movie } from '../types/movie';

export interface Collection {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  movies: Movie[];
}

const has = (movie: Movie, tag: string) => (movie.tags || []).includes(tag);
const inGenre = (movie: Movie, genre: string) => (movie.genre || []).includes(genre);

const byRating = (a: Movie, b: Movie) => (b.rating || 0) - (a.rating || 0);
const byYear = (a: Movie, b: Movie) => (b.year || 0) - (a.year || 0);

/** Every genre actually present in the catalogue, ordered by frequency. */
export function allGenres(movies: Movie[]): string[] {
  const counts = new Map<string, number>();
  movies.forEach((movie) =>
  (movie.genre || []).forEach((g) => counts.set(g, (counts.get(g) || 0) + 1))
  );
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([genre]) => genre);
}

/** Trending: newest high-scoring films — a blend of recency and rating. */
export function trending(movies: Movie[]): Movie[] {
  return [...movies].
  sort((a, b) => (b.year || 0) * 0.6 + (b.rating || 0) * 6 - ((a.year || 0) * 0.6 + (a.rating || 0) * 6)).
  slice(0, 12);
}

export function buildCollections(movies: Movie[]): Collection[] {
  const defs: Array<Omit<Collection, 'movies'> & {pick: (m: Movie) => boolean;sort?: (a: Movie, b: Movie) => number;}> = [
  {
    id: 'top-rated',
    label: 'Top Rated',
    emoji: '⭐',
    blurb: 'The highest-scored films in the collection',
    pick: (m) => (m.rating || 0) >= 7.8,
    sort: byRating
  },
  {
    id: 'fan-favourites',
    label: 'Fan Favourites',
    emoji: '❤️',
    blurb: 'Mass moments, whistles guaranteed',
    pick: (m) => has(m, 'mass') || has(m, 'iconic'),
    sort: byRating
  },
  {
    id: 'new-releases',
    label: 'New Releases',
    emoji: '🎬',
    blurb: 'Fresh from the marquee',
    pick: (m) => (m.year || 0) >= 2020,
    sort: byYear
  },
  {
    id: 'action',
    label: 'Action',
    emoji: '⚡',
    blurb: 'Full volume, full impact',
    pick: (m) => inGenre(m, 'Action'),
    sort: byRating
  },
  {
    id: 'romance',
    label: 'Romance',
    emoji: '💔',
    blurb: 'Love, longing and everything after',
    pick: (m) => inGenre(m, 'Romance'),
    sort: byRating
  },
  {
    id: 'comedy',
    label: 'Comedy',
    emoji: '😂',
    blurb: 'Guaranteed laugh riots',
    pick: (m) => inGenre(m, 'Comedy'),
    sort: byRating
  },
  {
    id: 'thriller',
    label: 'Thriller & Horror',
    emoji: '👻',
    blurb: 'Watch with the lights off',
    pick: (m) => inGenre(m, 'Thriller') || inGenre(m, 'Horror'),
    sort: byRating
  },
  {
    id: 'feel-good',
    label: 'Feel Good',
    emoji: '🌙',
    blurb: 'Soft landings for a long day',
    pick: (m) => has(m, 'feel-good') || has(m, 'heartwarming') || has(m, 'inspiring'),
    sort: byRating
  },
  {
    id: 'cult-classics',
    label: 'Cult Classics',
    emoji: '🖤',
    blurb: 'The films that built Tamil cinema',
    pick: (m) => has(m, 'classic') || has(m, 'masterpiece'),
    sort: byRating
  }];


  return defs.
  map((def) => ({
    id: def.id,
    label: def.label,
    emoji: def.emoji,
    blurb: def.blurb,
    movies: movies.filter(def.pick).sort(def.sort ?? byRating)
  })).
  filter((collection) => collection.movies.length >= 3);
}