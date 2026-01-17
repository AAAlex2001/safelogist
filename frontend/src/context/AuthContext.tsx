"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface UserData {
  name: string;
  email: string;
  photo: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const loadUserData = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({
          name: data.name || "User",
          email: data.email || "",
          photo: data.photo ? `${API_URL}/static/user_photos/${data.photo}` : null,
        });
      } else {
        logout();
      }
    } catch {
      setUserData(null);
    }
  }, []);

  const checkAuth = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      setIsLoggedIn(true);
      loadUserData(token);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [loadUserData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [checkAuth]);

  const login = useCallback((token: string) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    loadUserData(token);
    window.dispatchEvent(new Event("authChange"));
  }, [loadUserData]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
    setIsLoggedIn(false);
    setUserData(null);
    window.dispatchEvent(new Event("authChange"));
  }, []);

  const refreshUser = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
