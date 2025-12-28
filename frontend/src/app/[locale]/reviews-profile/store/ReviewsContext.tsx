"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useReviewsStore, type ReviewsStore } from "./useReviewsStore";

const ReviewsContext = createContext<ReviewsStore | null>(null);

interface ReviewsProviderProps {
  children: ReactNode;
}

export function ReviewsProvider({ children }: ReviewsProviderProps) {
  const store = useReviewsStore();

  useEffect(() => {
    store.loadAboutMeReviews();
  }, []);

  return (
    <ReviewsContext.Provider value={store}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews(): ReviewsStore {
  const context = useContext(ReviewsContext);

  if (!context) {
    throw new Error("useReviews must be used within ReviewsProvider");
  }

  return context;
}
