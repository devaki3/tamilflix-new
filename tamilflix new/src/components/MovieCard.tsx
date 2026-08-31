import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, StarIcon } from 'lucide-react';
import { PosterImage } from './PosterImage';
import { WatchlistButton } from './WatchlistButton';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  eager?: boolean;
  className?: string;
}

/**
 * Poster-first card. Resting state is just artwork; hover/focus lifts the card,
 * pushes the poster in slightly and reveals title, rating, genre and play.
 */
export function MovieCard({ movie, rank, eager = false, className = '' }: MovieCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || event.pointerType !== 'mouse') return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={`group relative transition-transform duration-[220ms] ease-cine will-change-transform ${className}`}>
      
      <Link
        to={`/movie/${movie.id}`}
        className="block overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-700 shadow-poster outline-none transition-[transform,border-color,box-shadow] duration-[220ms] ease-cine group-hover:-translate-y-1.5 group-hover:scale-[1.03] group-hover:border-rose-400/40 group-hover:shadow-cherry group-focus-visible:-translate-y-1.5 group-focus-visible:border-rose-400/50">
        
        <div className="relative aspect-[2/3]">
          <PosterImage
            src={movie.poster}
            alt={`${movie.title} poster`}
            title={movie.title}
            eager={eager}
            className="absolute inset-0 h-full w-full"
            imgClassName="group-hover:scale-[1.07] duration-[600ms]" />
          

          {typeof rank === 'number' &&
          <span className="absolute left-2 top-2 z-10 rounded-lg border border-rose-400/20 bg-ink/70 px-2 py-0.5 font-display text-lg leading-none text-rose-200 backdrop-blur-md">
              {rank}
            </span>
          }

          {/* Reveal layer */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-[linear-gradient(180deg,transparent_35%,rgba(8,6,8,0.55)_62%,rgba(8,6,8,0.96))] p-3 opacity-0 transition-opacity duration-[220ms] ease-cine group-hover:opacity-100 group-focus-visible:opacity-100">
            <div className="translate-y-2 transition-transform duration-[260ms] ease-cine group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">
                {movie.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-[0.68rem] text-muted">
                <span className="inline-flex items-center gap-1 text-rose-300">
                  <StarIcon className="h-3 w-3 fill-rose-300" />
                  {movie.rating}
                </span>
                <span aria-hidden="true">·</span>
                <span>{movie.year}</span>
              </div>
              <p className="mt-1 truncate text-[0.68rem] text-muted/80">
                {(movie.genre || []).slice(0, 2).join(' · ')}
              </p>
            </div>
          </div>

          <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 scale-90 place-items-center rounded-full bg-cherry-700 text-white opacity-0 shadow-glow transition-[opacity,transform] duration-[220ms] ease-cine group-hover:scale-100 group-hover:opacity-100">
            <PlayIcon className="h-4 w-4 translate-x-[1px] fill-white" />
          </span>
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-20 opacity-0 transition-opacity duration-[220ms] ease-cine focus-within:opacity-100 group-hover:opacity-100">
        <WatchlistButton movieId={movie.id} title={movie.title} />
      </div>
    </div>);

}