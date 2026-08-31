export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  mood: string[];
  pace: string;
  hero_type: string;
  ending: string;
  description: string;
  poster: string;
  trailer: string;
  rating: number;
  director: string;
  cast: string[];
  tags: string[];
}

export interface ScoredMovie extends Movie {
  score: number;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
}

export interface QuizAnswers {
  mood?: string;
  storyType?: string;
  preference?: string;
  pace?: string;
  ending?: string;
  heroType?: string;
  tone?: string;
  watchTime?: string;
}

export interface QuizOption {
  value: string;
  emoji: string;
  text: string;
  desc: string;
}

export interface QuizQuestion {
  key: keyof QuizAnswers;
  question: string;
  options: QuizOption[];
}

export interface ChatMessage {
  type: 'system' | 'user';
  username?: string;
  message: string;
  timestamp?: string | number;
}

export interface RoomJoinResult {
  roomCode: string;
  roomId?: number;
  movie?: Movie | null;
  members?: string[];
  isHost?: boolean;
  local?: boolean;
}