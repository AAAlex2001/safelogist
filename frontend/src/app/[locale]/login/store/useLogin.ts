"use client";

import { useEffect, useReducer, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Build endpoint from env or relative to frontend host
const LOGIN_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/auth/login`;

type LoginState = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  errorEmail: string | null;
  errorPassword: string | null;
};

type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ERROR_EMAIL"; payload: string | null }
  | { type: "SET_ERROR_PASSWORD"; payload: string | null }
  | { type: "CLEAR_ALL_ERRORS" }
  | { type: "RESET_FORM" };

const initialState: LoginState = {
  email: "",
  password: "",
  loading: false,
  error: null,
  errorEmail: null,
  errorPassword: null,
};

function toErrorMessage(detail: unknown): string {
  if (Array.isArray(detail)) {
    const messages = detail.map((d: any) => d?.msg || String(d));
    return messages.join(", ");
  }
  if (typeof detail === "string") {
    return detail;
  }
  return "Ошибка сервера. Попробуйте позже";
}

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ERROR_EMAIL":
      return { ...state, errorEmail: action.payload };
    case "SET_ERROR_PASSWORD":
      return { ...state, errorPassword: action.payload };
    case "CLEAR_ALL_ERRORS":
      return { ...state, error: null, errorEmail: null, errorPassword: null };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export const useLoginHook = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      dispatch({ type: "SET_EMAIL", payload: savedEmail });
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "CLEAR_ALL_ERRORS" });

    if (!state.email || !state.password) {
      dispatch({
        type: "SET_ERROR",
        payload: "Заполните все поля",
      });
      if (!state.email) {
        dispatch({
          type: "SET_ERROR_EMAIL",
          payload: "Email обязателен",
        });
      }
      if (!state.password) {
        dispatch({
          type: "SET_ERROR_PASSWORD",
          payload: "Пароль обязателен",
        });
      }
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage = toErrorMessage(data.detail);
        dispatch({
          type: "SET_ERROR",
          payload:
            errorMessage === "Неверный email или пароль"
              ? "Неверный email или пароль"
              : errorMessage,
        });
        return;
      }

      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email || state.email);

        if (data.company_name) {
          localStorage.setItem("companyName", data.company_name);
        }

        // Dispatch event for AuthContext to update header immediately
        window.dispatchEvent(new Event("authChange"));

        router.replace("/profile");
      } else {
        dispatch({ type: "SET_ERROR", payload: "Ошибка сервера. Попробуйте позже" });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Ошибка сети. Проверьте соединение" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    email: state.email,
    password: state.password,
    loading: state.loading,
    error: state.error,
    errorEmail: state.errorEmail,
    errorPassword: state.errorPassword,
    setEmail: (value: string) => {
      dispatch({ type: "SET_EMAIL", payload: value });
      if (state.errorEmail) {
        dispatch({ type: "SET_ERROR_EMAIL", payload: null });
      }
      if (state.error === "Заполните все поля") {
        dispatch({ type: "SET_ERROR", payload: null });
      }
    },
    setPassword: (value: string) => {
      dispatch({ type: "SET_PASSWORD", payload: value });
      if (state.errorPassword) {
        dispatch({ type: "SET_ERROR_PASSWORD", payload: null });
      }
      if (state.error === "Заполните все поля") {
        dispatch({ type: "SET_ERROR", payload: null });
      }
    },
    setError: (value: string | null) =>
      dispatch({ type: "SET_ERROR", payload: value }),
    setLoading: (value: boolean) =>
      dispatch({ type: "SET_LOADING", payload: value }),
    handleLogin,
  };
};

