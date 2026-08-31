import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-lg px-5 py-40 text-center sm:px-8">
      <p className="font-display text-7xl leading-none text-cherry-700">404</p>
      <h1 className="mt-4 font-display text-4xl leading-none tracking-wide text-white">
        This screen is dark
      </h1>
      <p className="mt-3 text-sm text-muted">
        The page you were looking for isn't showing tonight.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-cherry-700 px-6 py-3 text-sm font-bold text-white shadow-cherry transition-colors duration-200 hover:bg-rose-400 hover:text-ink">
        
        Back to the lobby
      </Link>
    </main>);

}