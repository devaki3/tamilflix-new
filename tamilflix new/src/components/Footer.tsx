import React from 'react';
import { Link } from 'react-router-dom';

const LINKS: Array<{label: string;to: string;}> = [
{ label: 'Home', to: '/' },
{ label: 'Movies', to: '/movies' },
{ label: 'Recommendations', to: '/recommendations' },
{ label: 'Quiz', to: '/quiz' },
{ label: 'My List', to: '/my-list' },
{ label: 'Watch Together', to: '/watch-together' }];


/**
 * The single reusable footer. Rendered once in App below the routed outlet, so
 * the exact same disclaimer appears on every page, present and future.
 */
export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-rose-400/10 bg-ink-800/80">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 text-center sm:px-8">
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.16em] text-white text-glow-cherry transition-colors duration-200 ease-cine hover:text-rose-300">
          
          TAMILFLIX
        </Link>
        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.42em] text-cherry-700">
          Padampaapoma
        </p>

        <nav aria-label="Footer" className="mt-7">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {LINKS.map((link) =>
            <li key={link.to}>
                <Link
                to={link.to}
                className="transition-colors duration-200 ease-cine hover:text-rose-300">
                
                  {link.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="mx-auto mt-8 h-px w-full max-w-2xl bg-[linear-gradient(90deg,transparent,rgba(255,92,138,0.28),transparent)]" />

        <div className="mx-auto mt-7 max-w-2xl space-y-3 text-[0.72rem] leading-relaxed text-muted/80">
          <p>
            Disclaimer: This website is created solely as an educational/student project and is not
            affiliated with, endorsed by, or officially connected to any movie, production company,
            streaming platform, or other organization mentioned on this website.
          </p>
          <p>
            This is a group project created for educational purposes only. The creators of this
            website have no official association with the content, brands, or organizations
            referenced on the platform.
          </p>
        </div>

        <p className="mt-7 text-[0.68rem] uppercase tracking-[0.28em] text-muted/50">
          © {new Date().getFullYear()} Tamilflix · Student Project
        </p>
      </div>
    </footer>);

}