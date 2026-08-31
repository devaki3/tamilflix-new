import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../utils/api';
import type { User } from '../types/movie';

interface LoginResult {
  ok: boolean;
  needsVerification?: boolean;
  email?: string;
  error?: string;
  demo?: boolean;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, password: string) => Promise<LoginResult>;
  verifyOtp: (email: string, otp: string) => Promise<LoginResult>;
  resendOtp: (email: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Decodes the JWT payload to check expiry — same check as the existing auth.js */
function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length < 2) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(api.USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  } catch {
    return null;
  }
}

function persist(token: string, user: User) {
  try {
    localStorage.setItem(api.TOKEN_KEY, token);
    localStorage.setItem(api.USER_KEY, JSON.stringify(user));
  } catch {

    /* storage unavailable — session stays in memory only */}
}

function makeDemoToken(email: string, name: string): string {
  const payload = {
    userId: 'demo',
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  };
  return `demo.${btoa(JSON.stringify(payload))}.local`;
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    if (isTokenValid(token)) {
      setUser(readStoredUser());
    } else {
      try {
        localStorage.removeItem(api.TOKEN_KEY);
        localStorage.removeItem(api.USER_KEY);
      } catch {

        /* noop */}
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const data = await api.login({ email, password });
      if (data.token && data.user) {
        persist(data.token, data.user);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Could not sign in.' };
    } catch (err) {
      const payload = (err as {payload?: {needsVerification?: boolean;email?: string;};}).payload;
      if (payload?.needsVerification) {
        return { ok: false, needsVerification: true, email: payload.email || email };
      }
      const status = (err as {status?: number;}).status;
      if (!status) {
        // Backend unreachable (Render cold start / offline preview) — demo session,
        // mirroring the existing project's offline fallback.
        const demoUser: User = { id: 'demo', name: email.split('@')[0] || 'Guest', email };
        persist(makeDemoToken(email, demoUser.name), demoUser);
        setUser(demoUser);
        return { ok: true, demo: true };
      }
      return { ok: false, error: (err as Error).message };
    }
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<LoginResult> => {
      try {
        const data = await api.signup({ name, email, password });
        return { ok: true, needsVerification: true, email: data.email || email };
      } catch (err) {
        const status = (err as {status?: number;}).status;
        if (!status) {
          const demoUser: User = { id: 'demo', name, email };
          persist(makeDemoToken(email, name), demoUser);
          setUser(demoUser);
          return { ok: true, demo: true };
        }
        return { ok: false, error: (err as Error).message };
      }
    },
    []
  );

  const verifyOtp = useCallback(async (email: string, otp: string): Promise<LoginResult> => {
    try {
      const data = await api.verifyOtp({ email, otp });
      if (data.token && data.user) {
        persist(data.token, data.user);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Invalid code.' };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }, []);

  const resendOtp = useCallback(async (email: string): Promise<LoginResult> => {
    try {
      await api.resendOtp(email);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(api.TOKEN_KEY);
      localStorage.removeItem(api.USER_KEY);
    } catch {

      /* noop */}
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      ready,
      login,
      signup,
      verifyOtp,
      resendOtp,
      logout
    }),
    [user, ready, login, signup, verifyOtp, resendOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}