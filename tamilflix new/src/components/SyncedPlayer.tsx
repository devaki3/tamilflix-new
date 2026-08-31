import React, { useEffect, useRef, useState } from 'react';
import { loadYouTubeApi, type YTPlayer } from '../utils/youtube';
import type { SyncSignal, VideoAction } from '../hooks/useWatchParty';

interface SyncedPlayerProps {
  videoId: string;
  isHost: boolean;
  lastSync: SyncSignal | null;
  onControl: (action: VideoAction, currentTime: number) => void;
}

/**
 * YouTube IFrame player wired to the room's sync channel.
 * Host state changes are broadcast; incoming sync is applied without echoing
 * back (suppress flag) — the same guard the original watch-together.js used.
 *
 * The player element is created imperatively inside an empty container so the
 * YouTube API can replace it without fighting React's DOM ownership.
 */
export function SyncedPlayer({ videoId, isHost, lastSync, onControl }: SyncedPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const suppress = useRef(false);
  const lastTime = useRef(0);
  const appliedNonce = useRef(0);
  const hostRef = useRef(isHost);
  const controlRef = useRef(onControl);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    hostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    controlRef.current = onControl;
  }, [onControl]);

  useEffect(() => {
    let destroyed = false;
    const container = containerRef.current;
    if (!container) return;

    const mount = document.createElement('div');
    mount.style.width = '100%';
    mount.style.height = '100%';
    container.appendChild(mount);

    loadYouTubeApi().
    then((YT) => {
      if (destroyed) return;
      playerRef.current = new YT.Player(mount, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 1 },
        events: {
          onReady: () => {
            if (!destroyed) setReady(true);
          },
          onStateChange: (event) => {
            const player = playerRef.current;
            if (!player) return;
            const time = player.getCurrentTime();

            if (suppress.current) {
              suppress.current = false;
              lastTime.current = time;
              return;
            }
            if (!hostRef.current) return;

            if (event.data === YT.PlayerState.PLAYING) {
              const jumped = Math.abs(time - lastTime.current) > 2;
              controlRef.current(jumped ? 'seek' : 'play', time);
            } else if (event.data === YT.PlayerState.PAUSED) {
              controlRef.current('pause', time);
            }
            lastTime.current = time;
          }
        }
      });
    }).
    catch(() => {
      if (!destroyed) setFailed(true);
    });

    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy();
      } catch {

        /* player already gone */}
      playerRef.current = null;
      container.innerHTML = '';
    };
  }, [videoId]);

  // Host seek detection — the API fires no dedicated seek event.
  useEffect(() => {
    if (!ready || !isHost) return;
    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      const time = player.getCurrentTime();
      if (Math.abs(time - lastTime.current) > 2.5) {
        controlRef.current('seek', time);
      }
      lastTime.current = time;
    }, 1000);
    return () => window.clearInterval(interval);
  }, [ready, isHost]);

  // Apply incoming sync from the host.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready || !lastSync) return;
    if (lastSync.nonce === appliedNonce.current) return;
    appliedNonce.current = lastSync.nonce;

    suppress.current = true;
    if (Math.abs(player.getCurrentTime() - lastSync.currentTime) > 1.2) {
      player.seekTo(lastSync.currentTime, true);
    }
    if (lastSync.action === 'pause') {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    lastTime.current = lastSync.currentTime;
  }, [lastSync, ready]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-black shadow-cherry">
      <div className="aspect-video w-full">
        {failed ?
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
            The player could not load. Check your connection and refresh the room.
          </div> :

        <div ref={containerRef} className="h-full w-full" />
        }
      </div>
      {!ready && !failed &&
      <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/70">
          <span className="font-display text-xl tracking-widest text-rose-200">Loading reel…</span>
        </div>
      }
    </div>);

}