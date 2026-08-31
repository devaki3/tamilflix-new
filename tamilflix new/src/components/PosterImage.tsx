import React, { useState } from 'react';

interface PosterImageProps {
  src?: string;
  alt: string;
  title: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/**
 * Poster renderer with blur-to-focus reveal and a designed fallback panel so a
 * missing Cloudinary asset never shows a broken image icon.
 */
export function PosterImage({
  src,
  alt,
  title,
  className = '',
  imgClassName = '',
  eager = false
}: PosterImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-cherry-900/60 px-3 text-center ${className}`}
        role="img"
        aria-label={alt}>
        
        <span className="font-display text-2xl leading-none text-rose-200/70">{title}</span>
      </div>);

  }

  return (
    <div className={`overflow-hidden bg-ink-700 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-[opacity,filter,transform] duration-500 ease-cine ${
        loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'} ${
        imgClassName}`} />
      
    </div>);

}