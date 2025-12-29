"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAddReviewStore, type AddReviewStore } from "./useAddReviewStore";

const AddReviewContext = createContext<AddReviewStore | null>(null);

interface AddReviewProviderProps {
  children: ReactNode;
}

export function AddReviewProvider({ children }: AddReviewProviderProps) {
  const store = useAddReviewStore();

  return (
    <AddReviewContext.Provider value={store}>
      {children}
    </AddReviewContext.Provider>
  );
}

export function useAddReview(): AddReviewStore {
  const context = useContext(AddReviewContext);

  if (!context) {
    throw new Error("useAddReview must be used within AddReviewProvider");
  }

  return context;
}
