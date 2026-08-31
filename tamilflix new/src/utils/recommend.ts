import type { Movie, QuizAnswers, ScoredMovie } from '../types/movie';

/**
 * Client-side recommendation scoring — a verbatim port of the existing
 * project's `getRecommendation()` in `static-data.js`, which mirrors the
 * server logic in `movies.js`. Do not change the weights.
 */
export function scoreMovies(
answers: QuizAnswers,
movies: Movie[])
: {recommended: ScoredMovie;alternatives: ScoredMovie[];} {
  const scored: ScoredMovie[] = movies.map((movie) => {
    let score = 0;
    const tags = movie.tags || [];
    const genre = movie.genre || [];
    const mood = movie.mood || [];

    if (answers.mood === 'excited' && (tags.includes('action') || tags.includes('fast'))) score += 3;
    if (answers.mood === 'romantic' && (tags.includes('romance') || tags.includes('romantic'))) score += 3;
    if (answers.mood === 'funny' && (tags.includes('comedy') || tags.includes('fun'))) score += 3;
    if (answers.mood === 'sad' && (tags.includes('emotional') || tags.includes('tearjerker'))) score += 3;
    if (answers.mood === 'scared' && (tags.includes('horror') || tags.includes('scary'))) score += 3;
    if (answers.mood === 'inspired' && (tags.includes('inspiring') || tags.includes('feel-good'))) score += 3;

    if (answers.storyType === 'love' && (genre.includes('Romance') || tags.includes('romance'))) score += 2;
    if (answers.storyType === 'action' && (genre.includes('Action') || tags.includes('action'))) score += 2;
    if (answers.storyType === 'social' && (tags.includes('social') || tags.includes('powerful'))) score += 2;
    if (answers.storyType === 'comedy' && (genre.includes('Comedy') || tags.includes('comedy'))) score += 2;
    if (answers.storyType === 'horror' && (genre.includes('Horror') || tags.includes('horror'))) score += 2;
    if (answers.storyType === 'classic' && (tags.includes('classic') || tags.includes('iconic'))) score += 2;

    if (answers.preference === 'action' && (tags.includes('action') || tags.includes('mass'))) score += 2;
    if (answers.preference === 'emotional' && (tags.includes('emotional') || mood.includes('Emotional'))) score += 2;

    if (answers.pace === 'fast' && movie.pace === 'Fast') score += 2;
    if (answers.pace === 'medium' && movie.pace === 'Medium') score += 2;
    if (answers.pace === 'slow' && movie.pace === 'Slow') score += 2;

    if (answers.ending === 'happy' && movie.ending === 'Happy') score += 2;
    if (answers.ending === 'triumphant' && movie.ending === 'Triumphant') score += 2;
    if (answers.ending === 'bittersweet' && movie.ending === 'Bittersweet') score += 2;
    if (answers.ending === 'twist' && (movie.ending === 'Twist' || movie.ending === 'Shocking')) score += 2;

    if (answers.heroType === 'mass' && movie.hero_type === 'Mass Hero') score += 2;
    if (answers.heroType === 'common' && movie.hero_type === 'Common Man') score += 2;
    if (answers.heroType === 'sensitive' && movie.hero_type === 'Sensitive Man') score += 2;

    if (answers.tone === 'comedy' && (tags.includes('comedy') || tags.includes('fun'))) score += 2;
    if (answers.tone === 'drama' && (tags.includes('powerful') || tags.includes('intense'))) score += 2;

    if (answers.watchTime === 'night' && (tags.includes('horror') || tags.includes('thriller'))) score += 1;
    if (answers.watchTime === 'family' && (tags.includes('family') || tags.includes('feel-good'))) score += 1;
    if (answers.watchTime === 'alone' && (tags.includes('emotional') || tags.includes('romantic'))) score += 1;
    if (answers.watchTime === 'friends' && (tags.includes('comedy') || tags.includes('action'))) score += 1;

    score += (movie.rating || 0) * 0.3;
    return { ...movie, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return { recommended: scored[0], alternatives: scored.slice(1, 4) };
}