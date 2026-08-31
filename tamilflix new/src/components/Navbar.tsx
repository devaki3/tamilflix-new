import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDownIcon,
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  XIcon } from
'lucide-react';
import { SearchOverlay } from './SearchOverlay';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import { allGenres } from '../utils/collections';

const EASE = [0.23, 1, 0.32, 1] as const;

const NAV_LINKS = [
{ label: 'Home', to: '/' },
{ label: 'Movies', to: '/movies' },
{ label: 'Recommendations', to: '/quiz' },
{ label: 'My List', to: '/my-list' },
{ label: 'Watch Together', to: '/watch-together' }];


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { movies } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();

  const genres = useMemo(() => allGenres(movies), [movies]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setGenresOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) setGenresOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const linkClass = ({ isActive }: {isActive: boolean;}) =>
  `relative text-sm font-medium transition-colors duration-200 ease-cine after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-rose-400 after:transition-[width] after:duration-200 after:ease-cine ${
  isActive ?
  'text-white after:w-full' :
  'text-white/65 after:w-0 hover:text-rose-200 hover:after:w-full'}`;


  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-cine ${
        scrolled ?
        'border-b border-rose-400/15 bg-ink/90 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl' :
        'border-b border-white/5 bg-ink/35 backdrop-blur-md'}`
        }>
        
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-5 sm:h-[4.5rem] sm:px-8">
          <Link
            to="/"
            className="shrink-0 font-display text-xl leading-none tracking-[0.18em] text-white text-glow-cherry transition-colors duration-200 ease-cine hover:text-rose-300 sm:text-2xl">
            
            TAMILFLIX
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden items-center gap-7 lg:flex">
            {NAV_LINKS.slice(0, 2).map((link) =>
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            )}

            <div ref={genreRef} className="relative">
              <button
                type="button"
                onClick={() => setGenresOpen((open) => !open)}
                aria-expanded={genresOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm font-medium text-white/65 transition-colors duration-200 ease-cine hover:text-rose-200">
                
                Genres
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 transition-transform duration-200 ease-cine ${
                  genresOpen ? 'rotate-180' : ''}`
                  } />
                
              </button>
              <AnimatePresence>
                {genresOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="absolute left-0 top-8 grid w-64 grid-cols-2 gap-1 rounded-2xl border border-rose-400/15 bg-ink-800/95 p-2 shadow-cherry backdrop-blur-xl">
                  
                    {genres.map((genre) =>
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      setGenresOpen(false);
                      navigate(`/movies?genre=${encodeURIComponent(genre)}`);
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm text-white/75 transition-colors duration-200 ease-cine hover:bg-cherry-900/60 hover:text-rose-200">
                    
                        {genre}
                      </button>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {NAV_LINKS.slice(2).map((link) =>
            <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search movies"
              className="group grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-[colors,transform,box-shadow] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-300 hover:shadow-glow active:scale-95">
              
              <SearchIcon className="h-4 w-4 transition-transform duration-200 ease-cine group-hover:scale-110" />
            </button>

            <Link
              to="/my-list"
              aria-label="My List"
              className="hidden h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-300 active:scale-95 sm:grid">
              
              <HeartIcon className="h-4 w-4" />
            </Link>

            {isAuthenticated ?
            <div ref={profileRef} className="relative">
                <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full border border-rose-400/25 bg-cherry-900/50 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white transition-colors duration-200 ease-cine hover:border-rose-400/60">
                
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-cherry-700 text-xs uppercase">
                    {(user?.name || 'G').charAt(0)}
                  </span>
                  <span className="hidden max-w-[7rem] truncate sm:block">{user?.name}</span>
                </button>
                <AnimatePresence>
                  {profileOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-rose-400/15 bg-ink-800/95 p-2 shadow-cherry backdrop-blur-xl">
                  
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                        <p className="truncate text-xs text-muted">{user?.email}</p>
                      </div>
                      <div className="my-1 h-px bg-white/[0.08]" />
                      <Link
                    to="/my-list"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-cherry-900/60 hover:text-rose-200">
                    
                        <HeartIcon className="h-4 w-4" /> My List
                      </Link>
                      <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-cherry-900/60 hover:text-rose-200">
                    
                        <LogOutIcon className="h-4 w-4" /> Sign out
                      </button>
                    </motion.div>
                }
                </AnimatePresence>
              </div> :

            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full bg-cherry-700 px-4 py-2.5 text-sm font-bold text-white shadow-cherry transition-[background-color,transform] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-[0.97] sm:inline-flex">
              
                <UserIcon className="h-4 w-4" />
                Sign in
              </Link>
            }

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden">
              
              {mobileOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen &&
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="overflow-hidden border-t border-rose-400/10 bg-ink/95 backdrop-blur-xl lg:hidden">
            
              <ul className="mx-auto max-w-7xl px-5 py-3 sm:px-8">
                {NAV_LINKS.map((link) =>
              <li key={link.to}>
                    <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                  `block rounded-xl px-3 py-3 text-base font-medium transition-colors duration-200 ${
                  isActive ? 'bg-cherry-900/60 text-rose-200' : 'text-white/80'}`

                  }>
                  
                      {link.label}
                    </NavLink>
                  </li>
              )}
                {!isAuthenticated &&
              <li className="pb-2 pt-2">
                    <Link
                  to="/login"
                  className="block rounded-xl bg-cherry-700 px-3 py-3 text-center text-base font-bold text-white">
                  
                      Sign in
                    </Link>
                  </li>
              }
              </ul>
            </motion.nav>
          }
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>);

}