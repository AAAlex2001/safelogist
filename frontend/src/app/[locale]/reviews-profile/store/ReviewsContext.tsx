"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useReviewsStore, type ReviewsStore } from "./useReviewsStore";

// ============================================================
// Context
// ============================================================
const ReviewsContext = createContext<ReviewsStore | null>(null);

// ============================================================
// Provider
// ============================================================
interface ReviewsProviderProps {
  children: ReactNode;
}

export function ReviewsProvider({ children }: ReviewsProviderProps) {
  const store = useReviewsStore();

  // Auto-load reviews on mount
  useEffect(() => {
    store.loadAboutMeReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReviewsContext.Provider value={store}>
      {children}
    </ReviewsContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useReviews(): ReviewsStore {
  const context = useContext(ReviewsContext);

  if (!context) {
    throw new Error("useReviews must be used within ReviewsProvider");
  }

  return context;
}
