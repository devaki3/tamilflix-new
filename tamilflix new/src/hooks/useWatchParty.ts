import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { BACKEND_URL, getToken } from '../utils/api';
import type { ChatMessage } from '../types/movie';

export type VideoAction = 'play' | 'pause' | 'seek';

export interface SyncSignal {
  action: VideoAction;
  currentTime: number;
  isPlaying?: boolean;
  nonce: number;
}

interface WatchPartyState {
  connected: boolean;
  isHost: boolean;
  members: string[];
  hostUsername: string | null;
  messages: ChatMessage[];
  lastSync: SyncSignal | null;
  closedReason: string | null;
  error: string | null;
}

/**
 * Socket.IO client for Watch Together. Event names and payload shapes are
 * exactly those the existing server implements:
 *   emit   → join-room, send-message, video-control, leave-room, close-room
 *   listen → host-status, room-update, chat-message, video-sync, room-closed, error
 */
export function useWatchParty(roomCode: string | undefined, username: string) {
  const socketRef = useRef<Socket | null>(null);
  const nonce = useRef(0);
  const [state, setState] = useState<WatchPartyState>({
    connected: false,
    isHost: false,
    members: [],
    hostUsername: null,
    messages: [],
    lastSync: null,
    closedReason: null,
    error: null
  });

  useEffect(() => {
    if (!roomCode) return;

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 4,
      timeout: 8000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setState((prev) => ({ ...prev, connected: true, error: null }));
      socket.emit('join-room', { roomCode, username, token: getToken() });
    });

    socket.on('disconnect', () => {
      setState((prev) => ({ ...prev, connected: false }));
    });

    socket.on('connect_error', () => {
      setState((prev) => ({
        ...prev,
        connected: false,
        error: 'Could not reach the room server. The video still plays locally.'
      }));
    });

    socket.on('host-status', (payload: {isHost: boolean;}) => {
      setState((prev) => ({ ...prev, isHost: Boolean(payload?.isHost) }));
    });

    socket.on(
      'room-update',
      (payload: {members?: string[];hostUsername?: string;}) => {
        setState((prev) => ({
          ...prev,
          members: payload?.members ?? prev.members,
          hostUsername: payload?.hostUsername ?? prev.hostUsername
        }));
      }
    );

    socket.on('chat-message', (payload: ChatMessage) => {
      setState((prev) => ({ ...prev, messages: [...prev.messages.slice(-199), payload] }));
    });

    socket.on(
      'video-sync',
      (payload: {action: VideoAction;currentTime: number;isPlaying?: boolean;}) => {
        nonce.current += 1;
        setState((prev) => ({
          ...prev,
          lastSync: {
            action: payload.action,
            currentTime: payload.currentTime ?? 0,
            isPlaying: payload.isPlaying,
            nonce: nonce.current
          }
        }));
      }
    );

    socket.on('room-closed', (payload: {reason?: string;}) => {
      setState((prev) => ({ ...prev, closedReason: payload?.reason || 'The host ended this room.' }));
    });

    socket.on('error', (payload: {message?: string;}) => {
      setState((prev) => ({ ...prev, error: payload?.message || 'Room error' }));
    });

    return () => {
      socket.emit('leave-room', { roomCode });
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, username]);

  const sendMessage = useCallback(
    (message: string) => {
      const trimmed = message.trim();
      if (!trimmed || !roomCode) return;
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit('send-message', { roomCode, message: trimmed });
      } else {
        // Offline: keep the conversation visible locally.
        setState((prev) => ({
          ...prev,
          messages: [
          ...prev.messages,
          { type: 'user', username, message: trimmed, timestamp: Date.now() }]

        }));
      }
    },
    [roomCode, username]
  );

  const control = useCallback(
    (action: VideoAction, currentTime: number) => {
      if (!roomCode) return;
      socketRef.current?.emit('video-control', { roomCode, action, currentTime });
    },
    [roomCode]
  );

  const closeRoom = useCallback(() => {
    if (!roomCode) return;
    socketRef.current?.emit('close-room', { roomCode });
  }, [roomCode]);

  return useMemo(
    () => ({ ...state, sendMessage, control, closeRoom }),
    [state, sendMessage, control, closeRoom]
  );
}