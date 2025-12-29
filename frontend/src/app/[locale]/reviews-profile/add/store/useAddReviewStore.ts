"use client";

import { useReducer, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  createReview: `${API_URL}/api/review-request`,
  searchCompanies: `${API_URL}/api/reviews/search`,
} as const;

export interface CompanySearchResult {
  name: string;
  id: number;
}

export interface AddReviewState {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;

  form: {
    targetCompany: string;
    rating: number;
    comment: string;
    attachment: File | null;
  };

  fieldErrors: {
    targetCompany: string | null;
    rating: string | null;
    comment: string | null;
  };

  search: {
    query: string;
    results: CompanySearchResult[];
    loading: boolean;
    showDropdown: boolean;
  };
}

type AddReviewAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_TARGET_COMPANY"; payload: string }
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SET_ATTACHMENT"; payload: File | null }
  | { type: "SET_FIELD_ERROR"; payload: { field: keyof AddReviewState["fieldErrors"]; message: string | null } }
  | { type: "CLEAR_FIELD_ERRORS" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_RESULTS"; payload: CompanySearchResult[] }
  | { type: "SET_SEARCH_LOADING"; payload: boolean }
  | { type: "SET_SHOW_DROPDOWN"; payload: boolean }
  | { type: "RESET" };

const initialState: AddReviewState = {
  loading: false,
  submitting: false,
  error: null,
  success: null,

  form: {
    targetCompany: "",
    rating: 0,
    comment: "",
    attachment: null,
  },

  fieldErrors: {
    targetCompany: null,
    rating: null,
    comment: null,
  },

  search: {
    query: "",
    results: [],
    loading: false,
    showDropdown: false,
  },
};

function reducer(state: AddReviewState, action: AddReviewAction): AddReviewState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, error: null, success: null };

    case "SET_TARGET_COMPANY":
      return {
        ...state,
        form: { ...state.form, targetCompany: action.payload },
        fieldErrors: { ...state.fieldErrors, targetCompany: null },
      };
    case "SET_RATING":
      return {
        ...state,
        form: { ...state.form, rating: action.payload },
        fieldErrors: { ...state.fieldErrors, rating: null },
      };
    case "SET_COMMENT":
      return {
        ...state,
        form: { ...state.form, comment: action.payload },
        fieldErrors: { ...state.fieldErrors, comment: null },
      };
    case "SET_ATTACHMENT":
      return { ...state, form: { ...state.form, attachment: action.payload } };

    case "SET_FIELD_ERROR":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.payload.field]: action.payload.message },
      };
    case "CLEAR_FIELD_ERRORS":
      return { ...state, fieldErrors: initialState.fieldErrors };

    case "SET_SEARCH_QUERY":
      return { ...state, search: { ...state.search, query: action.payload } };
    case "SET_SEARCH_RESULTS":
      return { ...state, search: { ...state.search, results: action.payload } };
    case "SET_SEARCH_LOADING":
      return { ...state, search: { ...state.search, loading: action.payload } };
    case "SET_SHOW_DROPDOWN":
      return { ...state, search: { ...state.search, showDropdown: action.payload } };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function parseErrorMessage(detail: unknown): string {
  if (Array.isArray(detail)) {
    return detail.map((d: Record<string, unknown>) => d?.msg || String(d)).join(", ");
  }
  if (typeof detail === "string") {
    return detail;
  }
  return "Ошибка сервера. Попробуйте позже";
}

export interface AddReviewStore {
  state: AddReviewState;
  setTargetCompany: (value: string) => void;
  setRating: (value: number) => void;
  setComment: (value: string) => void;
  setAttachment: (file: File | null) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  searchCompanies: (query: string) => Promise<void>;
  selectCompany: (company: CompanySearchResult) => void;
  hideDropdown: () => void;
  showDropdown: () => void;
  submitReview: () => Promise<boolean>;
  reset: () => void;
}

export function useAddReviewStore(): AddReviewStore {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  }, []);

  const setTargetCompany = useCallback((value: string) => {
    dispatch({ type: "SET_TARGET_COMPANY", payload: value });
    dispatch({ type: "SET_SEARCH_QUERY", payload: value });
  }, []);

  const setRating = useCallback((value: number) => {
    dispatch({ type: "SET_RATING", payload: value });
  }, []);

  const setComment = useCallback((value: string) => {
    dispatch({ type: "SET_COMMENT", payload: value });
  }, []);

  const setAttachment = useCallback((file: File | null) => {
    dispatch({ type: "SET_ATTACHMENT", payload: file });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    dispatch({ type: "SET_SUCCESS", payload: success });
  }, []);

  const hideDropdown = useCallback(() => {
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
  }, []);

  const showDropdown = useCallback(() => {
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: true });
  }, []);

  const searchCompanies = useCallback(async (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      dispatch({ type: "SET_SEARCH_LOADING", payload: true });

      try {
        const response = await fetch(`${ENDPOINTS.searchCompanies}?q=${encodeURIComponent(query)}`);

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_SEARCH_RESULTS", payload: data.companies || [] });
          dispatch({ type: "SET_SHOW_DROPDOWN", payload: true });
        }
      } catch {
        dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      } finally {
        dispatch({ type: "SET_SEARCH_LOADING", payload: false });
      }
    }, 300);
  }, []);

  const selectCompany = useCallback((company: CompanySearchResult) => {
    dispatch({ type: "SET_TARGET_COMPANY", payload: company.name });
    dispatch({ type: "SET_SEARCH_QUERY", payload: company.name });
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
  }, []);

  const submitReview = useCallback(async (): Promise<boolean> => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    const { targetCompany, rating, comment } = state.form;
    let hasError = false;

    if (!targetCompany.trim()) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "targetCompany", message: "Укажите компанию" } });
      hasError = true;
    }

    if (rating === 0) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "rating", message: "Поставьте оценку" } });
      hasError = true;
    }

    if (!comment.trim() || comment.length < 10) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "comment", message: "Минимум 10 символов" } });
      hasError = true;
    }

    if (hasError) {
      dispatch({ type: "SET_ERROR", payload: "Заполните все обязательные поля" });
      return false;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      const formData = new FormData();
      formData.append("target_company", targetCompany);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      if (state.form.attachment) {
        formData.append("attachment", state.form.attachment);
      }

      const response = await fetch(ENDPOINTS.createReview, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: "SET_ERROR", payload: "Необходимо авторизоваться" });
          return false;
        }
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail) });
        return false;
      }

      dispatch({ type: "SET_SUCCESS", payload: "Отзыв отправлен на модерацию" });
      // Очищаем форму, но сохраняем success сообщение
      dispatch({ type: "SET_TARGET_COMPANY", payload: "" });
      dispatch({ type: "SET_RATING", payload: 0 });
      dispatch({ type: "SET_COMMENT", payload: "" });
      dispatch({ type: "SET_ATTACHMENT", payload: null });
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Ошибка сети. Попробуйте позже" });
      return false;
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, [state.form, getAuthHeaders]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return useMemo(
    () => ({
      state,
      setTargetCompany,
      setRating,
      setComment,
      setAttachment,
      setError,
      setSuccess,
      searchCompanies,
      selectCompany,
      hideDropdown,
      showDropdown,
      submitReview,
      reset,
    }),
    [
      state,
      setTargetCompany,
      setRating,
      setComment,
      setAttachment,
      setError,
      setSuccess,
      searchCompanies,
      selectCompany,
      hideDropdown,
      showDropdown,
      submitReview,
      reset,
    ]
  );
}
