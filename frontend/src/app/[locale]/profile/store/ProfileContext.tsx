"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useProfileStore, type ProfileStore } from "./useProfileStore";

const ProfileContext = createContext<ProfileStore | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const store = useProfileStore();
  useEffect(() => {
    store.loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={store}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileStore {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}

