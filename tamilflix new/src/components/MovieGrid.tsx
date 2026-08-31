import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from './MovieCard';
import type { Movie } from '../types/movie';

interface MovieGridProps {
  movies: Movie[];
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, index) =>
      <motion.li
        key={movie.id}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.28, delay: Math.min(index % 12 * 0.03, 0.3), ease: EASE }}>
        
          <MovieCard movie={movie} eager={index < 6} />
        </motion.li>
      )}
    </ul>);

}