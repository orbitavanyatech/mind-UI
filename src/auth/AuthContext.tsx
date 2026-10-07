"use client";

/* Demo-only auth. There is no backend: signing in just records which role
   the visitor picked on the login screen. The role is kept in localStorage
   so a refresh on a deep link (e.g. /library/science-of-attention) stays
   signed in. Replace this with real session handling (cookies + a `proxy.ts`
   redirect) when a backend exists. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { USERS } from "@/data/mockData";
import type { Role, User } from "@/types";

const STORAGE_KEY = "mind-elevate-role";

interface AuthValue {
  role: Role | null;
  /** false until localStorage has been read on the client */
  ready: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

const isRole = (v: string | null): v is Role =>
  v === "employee" || v === "leader" || v === "company_admin" || v === "platform_admin";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isRole(stored)) setRole(stored);
    } catch {
      /* localStorage unavailable — stay signed out */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((next: Role) => {
    setRole(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setRole(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ role, ready, signIn, signOut }), [role, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

/** The signed-in demo user. Falls back to the employee persona while signing out. */
export const useCurrentUser = (): { role: Role; user: User; isLeader: boolean } => {
  const { role } = useAuth();
  const current = role ?? "employee";
  return { role: current, user: USERS[current], isLeader: current === "leader" };
};
