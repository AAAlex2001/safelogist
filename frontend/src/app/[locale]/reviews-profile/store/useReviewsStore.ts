"use client";

import { useReducer, useCallback, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  companyReviews: `${API_URL}/api/profile/company-reviews`,
  myReviewRequests: `${API_URL}/api/review-request/my`,
} as const;

export type ReviewsTab = "about" | "reviews" | "rejected";

export interface ReviewItem {
  id: number;
  // Для отзывов "обо мне" (about tab)
  subject?: string;
  reviewer?: string | null;
  reviewer_id?: number | null;
  review_date?: string | null;
  source?: string | null;
  // Для моих отзывов (reviews/rejected tabs)
  from_company?: string;
  target_company?: string;
  admin_comment?: string | null;
  created_at?: string;
  // Общие поля
  comment: string | null;
  rating: number | null;
  status: string | null;
}

export interface ReviewsState {
  activeTab: ReviewsTab;
  loading: boolean;
  error: string | null;

  aboutMe: {
    reviews: ReviewItem[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    companyName: string | null;
  };

  myReviews: {
    reviews: ReviewItem[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };

  rejected: {
    reviews: ReviewItem[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

type ReviewsAction =
  | { type: "SET_TAB"; payload: ReviewsTab }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

  | { type: "SET_ABOUT_ME_REVIEWS"; payload: { 
      reviews: ReviewItem[]; 
      total: number; 
      page: number; 
      perPage: number; 
      totalPages: number;
      companyName: string | null;
    } }
  | { type: "SET_ABOUT_ME_PAGE"; payload: number }

  | { type: "SET_MY_REVIEWS"; payload: { 
      reviews: ReviewItem[]; 
      total: number; 
      page: number; 
      perPage: number; 
      totalPages: number;
    } }
  | { type: "SET_MY_REVIEWS_PAGE"; payload: number }

  | { type: "SET_REJECTED_REVIEWS"; payload: { 
      reviews: ReviewItem[]; 
      total: number; 
      page: number; 
      perPage: number; 
      totalPages: number;
    } }
  | { type: "SET_REJECTED_PAGE"; payload: number }

  | { type: "RESET" };

const initialState: ReviewsState = {
  activeTab: "about",
  loading: false,
  error: null,

  aboutMe: {
    reviews: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    companyName: null,
  },

  myReviews: {
    reviews: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  },

  rejected: {
    reviews: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  },
};

function reducer(state: ReviewsState, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_ABOUT_ME_REVIEWS":
      return { 
        ...state, 
        aboutMe: { 
          ...state.aboutMe, 
          reviews: action.payload.reviews,
          total: action.payload.total,
          page: action.payload.page,
          perPage: action.payload.perPage,
          totalPages: action.payload.totalPages,
          companyName: action.payload.companyName,
        } 
      };
    case "SET_ABOUT_ME_PAGE":
      return { ...state, aboutMe: { ...state.aboutMe, page: action.payload } };

    case "SET_MY_REVIEWS":
      return { 
        ...state, 
        myReviews: { 
          ...state.myReviews, 
          reviews: action.payload.reviews,
          total: action.payload.total,
          page: action.payload.page,
          perPage: action.payload.perPage,
          totalPages: action.payload.totalPages,
        } 
      };
    case "SET_MY_REVIEWS_PAGE":
      return { ...state, myReviews: { ...state.myReviews, page: action.payload } };

    case "SET_REJECTED_REVIEWS":
      return { 
        ...state, 
        rejected: { 
          ...state.rejected, 
          reviews: action.payload.reviews,
          total: action.payload.total,
          page: action.payload.page,
          perPage: action.payload.perPage,
          totalPages: action.payload.totalPages,
        } 
      };
    case "SET_REJECTED_PAGE":
      return { ...state, rejected: { ...state.rejected, page: action.payload } };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export interface ReviewsStore {
  state: ReviewsState;
  setTab: (tab: ReviewsTab) => void;
  setError: (error: string | null) => void;
  loadAboutMeReviews: (page?: number) => Promise<void>;
  loadMyReviews: (page?: number) => Promise<void>;
  loadRejectedReviews: (page?: number) => Promise<void>;
}

export function useReviewsStore(): ReviewsStore {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTab = useCallback((tab: ReviewsTab) => {
    dispatch({ type: "SET_TAB", payload: tab });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  }, []);

  const loadAboutMeReviews = useCallback(async (page: number = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetch(
        `${ENDPOINTS.companyReviews}?page=${page}&per_page=${state.aboutMe.perPage}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();

      dispatch({
        type: "SET_ABOUT_ME_REVIEWS",
        payload: {
          reviews: data.reviews || [],
          total: data.total || 0,
          page: data.page || 1,
          perPage: data.per_page || 10,
          totalPages: data.total_pages || 0,
          companyName: data.company_name || null,
        },
      });
    } catch (error) {
      dispatch({ 
        type: "SET_ERROR", 
        payload: error instanceof Error ? error.message : "Unknown error" 
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getAuthHeaders, state.aboutMe.perPage]);

  const loadMyReviews = useCallback(async (page: number = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        throw new Error("Unauthorized");
      }

      const response = await fetch(
        `${ENDPOINTS.myReviewRequests}?page=${page}&per_page=${state.myReviews.perPage}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();
      
      // API возвращает массив напрямую
      // Фильтруем только PENDING и APPROVED для вкладки "Мои отзывы"
      const allReviews = Array.isArray(data) ? data : [];
      const filteredReviews = allReviews.filter(
        (r: ReviewItem) => r.status === "PENDING" || r.status === "APPROVED"
      );

      dispatch({
        type: "SET_MY_REVIEWS",
        payload: {
          reviews: filteredReviews,
          total: filteredReviews.length,
          page: page,
          perPage: state.myReviews.perPage,
          totalPages: Math.ceil(filteredReviews.length / state.myReviews.perPage),
        },
      });
    } catch (error) {
      dispatch({ 
        type: "SET_ERROR", 
        payload: error instanceof Error ? error.message : "Unknown error" 
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getAuthHeaders, state.myReviews.perPage]);

  const loadRejectedReviews = useCallback(async (page: number = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        throw new Error("Unauthorized");
      }

      const response = await fetch(
        `${ENDPOINTS.myReviewRequests}?page=${page}&per_page=${state.rejected.perPage}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();
      
      // API возвращает массив напрямую
      // Фильтруем только REJECTED для вкладки "Отклонённые"
      const allReviews = Array.isArray(data) ? data : [];
      const filteredReviews = allReviews.filter(
        (r: ReviewItem) => r.status === "REJECTED"
      );

      dispatch({
        type: "SET_REJECTED_REVIEWS",
        payload: {
          reviews: filteredReviews,
          total: filteredReviews.length,
          page: page,
          perPage: state.rejected.perPage,
          totalPages: Math.ceil(filteredReviews.length / state.rejected.perPage),
        },
      });
    } catch (error) {
      dispatch({ 
        type: "SET_ERROR", 
        payload: error instanceof Error ? error.message : "Unknown error" 
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [getAuthHeaders, state.rejected.perPage]);

  return useMemo(() => ({
    state,
    setTab,
    setError,
    loadAboutMeReviews,
    loadMyReviews,
    loadRejectedReviews,
  }), [state, setTab, setError, loadAboutMeReviews, loadMyReviews, loadRejectedReviews]);
}
