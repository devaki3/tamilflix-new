import React from 'react';

interface SectionHeadingProps {
  emoji?: string;
  title: string;
  blurb?: string;
  action?: React.ReactNode;
  id?: string;
}

export function SectionHeading({ emoji, title, blurb, action, id }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2
          id={id}
          className="flex items-center gap-2 font-display text-2xl tracking-wide text-white text-glow-cherry sm:text-3xl">
          
          {emoji &&
          <span aria-hidden="true" className="text-xl sm:text-2xl">
              {emoji}
            </span>
          }
          {title}
        </h2>
        {blurb && <p className="mt-0.5 text-sm text-muted">{blurb}</p>}
      </div>
      {action}
    </div>);

}