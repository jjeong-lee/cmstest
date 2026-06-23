"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { mockSession } from "./mock-data";
import { Role, SessionUser } from "./types";

type SessionContextValue = {
  session: SessionUser;
  setRole: (role: Role) => void;
  setSession: (session: SessionUser) => void;
  clearSession: () => void;
};

const STORAGE_KEY = "cms-auth-session";
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser>(mockSession);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as SessionUser;
      setSession(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setRole: (role) => setSession((current) => ({ ...current, role })),
        setSession,
        clearSession: () => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(STORAGE_KEY);
          }
          setSession(mockSession);
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionStore() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionStore must be used within SessionProvider");
  }
  return context;
}
