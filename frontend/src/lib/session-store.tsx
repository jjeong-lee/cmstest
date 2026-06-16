"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { mockSession } from "./mock-data";
import { Role, SessionUser } from "./types";

type SessionContextValue = {
  session: SessionUser;
  setRole: (role: Role) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser>(mockSession);

  return (
    <SessionContext.Provider
      value={{
        session,
        setRole: (role) => setSession((current) => ({ ...current, role })),
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
