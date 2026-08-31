import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CinematicLoader } from './components/CinematicLoader';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { CursorGlow } from './components/CursorGlow';
import { AuthProvider } from './contexts/AuthContext';
import { MovieProvider } from './contexts/MovieContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { ToastProvider } from './contexts/ToastContext';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetail } from './pages/MovieDetail';
import { MyList } from './pages/MyList';
import { Quiz } from './pages/Quiz';
import { Recommendation } from './pages/Recommendation';
import { Watch } from './pages/Watch';
import { WatchTogether } from './pages/WatchTogether';
import { Room } from './pages/Room';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { NotFound } from './pages/NotFound';

const EASE = [0.23, 1, 0.32, 1] as const;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function RoutedPages() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: EASE }}>
        
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/recommendations" element={<Recommendation />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/watch-together" element={<WatchTogether />} />
          <Route path="/room/:code" element={<Room />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>);

}

interface AppProps {
  /** Play the cinematic title card before the homepage appears. */
  showIntro?: boolean;
  /** Atmospheric room lighting, film grain and the cursor light. */
  ambientEffects?: boolean;
}

export function App({ showIntro = true, ambientEffects = true }: AppProps) {
  const [introDone, setIntroDone] = useState(!showIntro);

  return (
    <ToastProvider>
      <AuthProvider>
        <MovieProvider>
          <WatchlistProvider>
            <BrowserRouter>
              <div
                className={`relative flex min-h-screen w-full flex-col bg-ink text-white ${
                ambientEffects ? 'film-grain' : ''}`
                }>
                
                {ambientEffects && <AtmosphericBackground />}
                {ambientEffects && <CursorGlow />}

                <AnimatePresence>
                  {!introDone && <CinematicLoader onDone={() => setIntroDone(true)} />}
                </AnimatePresence>

                <ScrollToTop />
                <Navbar />

                <div className="relative z-10 flex-1">
                  <RoutedPages />
                </div>

                <Footer />
              </div>
            </BrowserRouter>
          </WatchlistProvider>
        </MovieProvider>
      </AuthProvider>
    </ToastProvider>);

}