"use client";

import { FormEvent, useReducer } from "react";

const REQUEST_ENDPOINT = `${
  process.env.NEXT_PUBLIC_API_URL ?? ""
}/forgot-password/request`;

type ForgotPasswordState = {
  email: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  errorEmail: string | null;
};

type ForgotPasswordAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "SET_ERROR_EMAIL"; payload: string | null }
  | { type: "CLEAR_FEEDBACK" }
  | { type: "RESET" };

const initialState: ForgotPasswordState = {
  email: "",
  loading: false,
  error: null,
  success: null,
  errorEmail: null,
};

function toErrorMessage(detail: unknown): string {
  if (Array.isArray(detail)) {
    const messages = detail.map((d: any) => d?.msg || String(d));
    return messages.join(", ");
  }
  if (typeof detail === "string") {
    return detail;
  }
  if (detail && typeof detail === "object" && "message" in detail) {
    return String((detail as { message: unknown }).message);
  }
  return "Не удалось отправить письмо. Попробуйте ещё раз.";
}

function reducer(
  state: ForgotPasswordState,
  action: ForgotPasswordAction
): ForgotPasswordState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "SET_ERROR_EMAIL":
      return { ...state, errorEmail: action.payload };
    case "CLEAR_FEEDBACK":
      return { ...state, error: null, success: null, errorEmail: null };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const useForgotPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "CLEAR_FEEDBACK" });

    const trimmedEmail = state.email.trim();

    if (!trimmedEmail) {
      dispatch({
        type: "SET_ERROR",
        payload: "Укажите email, чтобы отправить инструкции.",
      });
      dispatch({
        type: "SET_ERROR_EMAIL",
        payload: "Поле email обязательно",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(REQUEST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        dispatch({
          type: "SET_ERROR",
          payload: toErrorMessage(
            (data as { detail?: unknown; message?: unknown }).detail ??
              (data as { message?: unknown }).message
          ),
        });
        return;
      }

      dispatch({
        type: "SET_SUCCESS",
        payload:
          (data as { message?: string }).message ??
          "Инструкция отправлена на вашу почту.",
      });
      localStorage.setItem("userEmail", trimmedEmail);
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Не удалось отправить письмо. Проверьте соединение.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    email: state.email,
    loading: state.loading,
    error: state.error,
    success: state.success,
    errorEmail: state.errorEmail,
    setEmail: (value: string) => {
      dispatch({ type: "SET_EMAIL", payload: value });
      if (state.errorEmail) {
        dispatch({ type: "SET_ERROR_EMAIL", payload: null });
      }
    },
    setError: (value: string | null) =>
      dispatch({ type: "SET_ERROR", payload: value }),
    setSuccess: (value: string | null) =>
      dispatch({ type: "SET_SUCCESS", payload: value }),
    handleSubmit,
  };
};

