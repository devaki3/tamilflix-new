export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: () => void;
    onStateChange?: (event: {data: number;}) => void;
  };
}

export interface YTNamespace {
  Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {UNSTARTED: number;ENDED: number;PLAYING: number;PAUSED: number;BUFFERING: number;};
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let loader: Promise<YTNamespace> | null = null;

/** Loads the YouTube IFrame Player API once and resolves with the YT namespace. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (loader) return loader;

  loader = new Promise<YTNamespace>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-yt-api]');
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);else
      reject(new Error('YouTube API failed to initialise'));
    };
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.dataset.ytApi = 'true';
    script.onerror = () => reject(new Error('YouTube API failed to load'));
    document.head.appendChild(script);
  });

  return loader;
}