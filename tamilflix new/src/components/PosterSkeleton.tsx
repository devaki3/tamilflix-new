import React from 'react';

interface PosterSkeletonProps {
  count?: number;
  className?: string;
}

export function PosterSkeleton({ count = 6, className = '' }: PosterSkeletonProps) {
  return (
    <ul className={`flex gap-3 overflow-hidden sm:gap-4 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) =>
      <li
        key={index}
        className="w-[38vw] min-w-[132px] max-w-[190px] shrink-0 sm:w-[22vw] lg:w-[15vw]">
        
          <div className="aspect-[2/3] w-full animate-pulse rounded-2xl border border-white/[0.05] bg-[linear-gradient(100deg,#120A10,#1A0F16,#120A10)] bg-[length:200%_100%]" />
        </li>
      )}
    </ul>);

}