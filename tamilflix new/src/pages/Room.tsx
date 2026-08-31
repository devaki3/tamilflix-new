import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, CopyIcon, CrownIcon, LogOutIcon, UsersIcon } from 'lucide-react';
import { SyncedPlayer } from '../components/SyncedPlayer';
import { RoomChat } from '../components/RoomChat';
import { useWatchParty } from '../hooks/useWatchParty';
import { useMovies } from '../contexts/MovieContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getYouTubeId } from '../utils/trailer';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Room() {
  const { code } = useParams<{code: string;}>();
  const [params] = useSearchParams();
  const { getById } = useMovies();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const username = user?.name || 'Guest';
  const movie = getById(Number(params.get('movie')));
  const videoId = getYouTubeId(movie?.trailer);
  const [copied, setCopied] = useState(false);

  const party = useWatchParty(code, username);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast('Room code copied', 'success');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast('Copy failed — select the code manually', 'error');
    }
  };

  if (party.closedReason) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-40 text-center sm:px-8">
        <h1 className="font-display text-4xl leading-none text-white">The room has closed</h1>
        <p className="mt-3 text-sm text-muted">{party.closedReason}</p>
        <Link
          to="/watch-together"
          className="mt-8 inline-flex rounded-full bg-cherry-700 px-6 py-3 text-sm font-bold text-white shadow-cherry transition-colors duration-200 hover:bg-rose-400 hover:text-ink">
          
          Back to Watch Together
        </Link>
      </main>);

  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-8 sm:pt-28">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-rose-300">
            Private screening
          </p>
          <h1 className="mt-2 font-display text-4xl leading-none tracking-wide text-white text-glow-cherry sm:text-5xl">
            {movie ? movie.title : 'Watch Together'}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span
              className={`inline-flex items-center gap-1.5 ${
              party.connected ? 'text-rose-200' : 'text-muted'}`
              }>
              
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                party.connected ? 'bg-rose-400' : 'bg-muted/60'}`
                } />
              
              {party.connected ? 'Synced' : 'Connecting…'}
            </span>
            {party.isHost &&
            <span className="inline-flex items-center gap-1 text-rose-200">
                <CrownIcon className="h-3.5 w-3.5" /> You are the host
              </span>
            }
            {!party.isHost && party.hostUsername && <span>Host: {party.hostUsername}</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-cherry-900/50 px-4 py-2.5 font-display text-lg tracking-[0.2em] text-rose-100 transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/60 active:scale-[0.98]">
            
            {code}
            {copied ?
            <CheckIcon className="h-4 w-4 text-rose-300" /> :

            <CopyIcon className="h-4 w-4 text-rose-300" />
            }
          </button>
          {party.isHost ?
          <button
            type="button"
            onClick={() => {
              party.closeRoom();
              navigate('/watch-together');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-white/80 transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200 active:scale-[0.98]">
            
              <LogOutIcon className="h-4 w-4" />
              End room
            </button> :

          <Link
            to="/watch-together"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-white/80 transition-[colors,transform] duration-200 ease-cine hover:border-rose-400/50 hover:text-rose-200">
            
              <LogOutIcon className="h-4 w-4" />
              Leave
            </Link>
          }
        </div>
      </header>

      {party.error &&
      <p className="mt-5 rounded-2xl border border-rose-400/20 bg-cherry-900/40 px-4 py-3 text-xs text-rose-100">
          {party.error}
        </p>
      }

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.42, ease: EASE }}>
          
          {videoId ?
          <SyncedPlayer
            videoId={videoId}
            isHost={party.isHost}
            lastSync={party.lastSync}
            onControl={party.control} /> :


          <div className="grid aspect-video place-items-center rounded-3xl border border-rose-400/15 bg-black px-6 text-center text-sm text-muted">
              No playable source for this room yet. Pick a film from Watch Together to start a
              screening.
            </div>
          }

          {movie &&
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/70">
              {movie.description}
            </p>
          }
          {!party.isHost &&
          <p className="mt-3 text-xs text-muted">
              The host controls playback — play, pause and seek stay in sync for everyone.
            </p>
          }
        </motion.div>

        <aside className="flex flex-col gap-5">
          <section
            aria-label="Members"
            className="rounded-3xl border border-rose-400/10 bg-ink-800/70 p-5 backdrop-blur-xl">
            
            <h2 className="flex items-center justify-between font-display text-xl tracking-wide text-white">
              <span className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-rose-300" />
                In the room
              </span>
              <span className="text-sm text-muted">
                {Math.max(party.members.length, 1)}/8
              </span>
            </h2>
            <ul className="mt-4 space-y-2">
              {(party.members.length ? party.members : [username]).map((member) =>
              <li
                key={member}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/85">
                
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-cherry-800 text-xs uppercase">
                    {member.charAt(0)}
                  </span>
                  <span className="truncate">{member}</span>
                  {member === party.hostUsername &&
                <CrownIcon className="ml-auto h-3.5 w-3.5 shrink-0 text-rose-300" />
                }
                </li>
              )}
            </ul>
          </section>

          <RoomChat messages={party.messages} username={username} onSend={party.sendMessage} />
        </aside>
      </div>
    </main>);

}