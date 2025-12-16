"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useProfileStore, type ProfileStore } from "./useProfileStore";

// ============================================================
// Context
// ============================================================
const ProfileContext = createContext<ProfileStore | null>(null);

// ============================================================
// Provider
// ============================================================
interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const store = useProfileStore();

  // Auto-load profile on mount
  useEffect(() => {
    store.loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileContext.Provider value={store}>
      {children}
    </ProfileContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useProfile(): ProfileStore {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}

