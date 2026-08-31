import { FALLBACK_MOVIES } from '../data/movies';
import { scoreMovies } from './recommend';
import type { Movie, QuizAnswers, RoomJoinResult, User } from '../types/movie';

/**
 * Same backend contract as the existing project's `js/api.js`.
 * Endpoints, payloads, storage keys and offline fallbacks are unchanged.
 */
export const BACKEND_URL = 'https://tamilflix1-main.onrender.com';
const BASE = `${BACKEND_URL}/api`;

export const TOKEN_KEY = 'tamilflix_token';
export const USER_KEY = 'tamilflix_user';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined)
    }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
    data && typeof data === 'object' && 'error' in data && (data as {error?: string;}).error ||
    `Request failed (${res.status})`;
    const error = new Error(message) as Error & {payload?: unknown;status?: number;};
    error.payload = data;
    error.status = res.status;
    throw error;
  }
  return data as T;
}

/* ---------------------------------- movies --------------------------------- */

function localFilter(params: {search?: string;genre?: string;}): Movie[] {
  let list = [...FALLBACK_MOVIES];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter((m) => m.title.toLowerCase().includes(q));
  }
  if (params.genre) {
    list = list.filter((m) => m.genre.includes(params.genre as string));
  }
  return list;
}

export interface MoviesResult {
  movies: Movie[];
  offline: boolean;
}

export async function getMovies(
params: {search?: string;genre?: string;} = {})
: Promise<MoviesResult> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.genre) query.set('genre', params.genre);
  const qs = query.toString() ? `?${query.toString()}` : '';
  try {
    const data = await request<Movie[]>(`/movies${qs}`);
    if (!Array.isArray(data) || data.length === 0) {
      return { movies: localFilter(params), offline: true };
    }
    return { movies: data, offline: false };
  } catch {
    return { movies: localFilter(params), offline: true };
  }
}

export async function getMovie(id: number): Promise<Movie | null> {
  try {
    return await request<Movie>(`/movies/${id}`);
  } catch {
    return FALLBACK_MOVIES.find((m) => m.id === id) ?? null;
  }
}

export interface RecommendationResult {
  recommended: Movie;
  alternatives: Movie[];
}

export async function getRecommendation(
answers: QuizAnswers,
catalogue: Movie[] = FALLBACK_MOVIES)
: Promise<RecommendationResult | null> {
  const local = scoreMovies(answers, catalogue.length ? catalogue : FALLBACK_MOVIES);
  try {
    const data = await request<Movie & Partial<RecommendationResult>>('/movies/recommend', {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
    // Server can answer with { recommended, alternatives } or a raw movie object.
    if (data && (data as Partial<RecommendationResult>).recommended) {
      const shaped = data as unknown as RecommendationResult;
      return {
        recommended: shaped.recommended,
        alternatives: shaped.alternatives ?? local.alternatives
      };
    }
    if (data && data.id) {
      return {
        recommended: data as Movie,
        alternatives: local.alternatives.filter((m) => m.id !== data.id).slice(0, 3)
      };
    }
    return local;
  } catch {
    return local;
  }
}

/* ----------------------------------- auth ---------------------------------- */

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: User;
  email?: string;
  error?: string;
  needsVerification?: boolean;
}

export function signup(payload: {name: string;email: string;password: string;}) {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function verifyOtp(payload: {email: string;otp: string;}) {
  return request<AuthResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function login(payload: {email: string;password: string;}) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function resendOtp(email: string) {
  return request<AuthResponse>('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

/* ----------------------------------- rooms --------------------------------- */

function localRoomCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function createRoom(movieId: number): Promise<RoomJoinResult> {
  try {
    const data = await request<{roomCode: string;roomId: number;}>('/rooms/create', {
      method: 'POST',
      body: JSON.stringify({ movieId })
    });
    return { roomCode: data.roomCode, roomId: data.roomId };
  } catch {
    // Offline / demo mode — mirrors the existing LOCAL_ROOMS fallback.
    return { roomCode: localRoomCode(), local: true };
  }
}

export async function joinRoom(roomCode: string): Promise<RoomJoinResult> {
  const data = await request<RoomJoinResult>('/rooms/join', {
    method: 'POST',
    body: JSON.stringify({ roomCode })
  });
  return data;
}

export async function getRoomMessages(roomCode: string) {
  try {
    return await request<
      Array<{id: number;username: string;message: string;created_at: string;}>>(
      `/rooms/${roomCode}/messages`);
  } catch {
    return [];
  }
}