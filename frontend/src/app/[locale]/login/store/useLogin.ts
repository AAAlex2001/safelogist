"use client";

import { useEffect, useReducer, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  login: `${API_URL}/auth/login`,
} as const;

export interface LoginState {
  loading: boolean;
  error: string | null;

  form: {
    email: string;
    password: string;
    showPassword: boolean;
  };

  fieldErrors: {
    email: string | null;
    password: string | null;
  };
}

type LoginAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "TOGGLE_SHOW_PASSWORD" }
  | { type: "SET_FIELD_ERROR"; payload: { field: keyof LoginState["fieldErrors"]; message: string | null } }
  | { type: "CLEAR_FIELD_ERRORS" }
  | { type: "RESET" };

const initialState: LoginState = {
  loading: false,
  error: null,

  form: {
    email: "",
    password: "",
    showPassword: false,
  },

  fieldErrors: {
    email: null,
    password: null,
  },
};

function reducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, error: null };

    case "SET_EMAIL":
      return {
        ...state,
        form: { ...state.form, email: action.payload },
        fieldErrors: { ...state.fieldErrors, email: null },
      };
    case "SET_PASSWORD":
      return {
        ...state,
        form: { ...state.form, password: action.payload },
        fieldErrors: { ...state.fieldErrors, password: null },
      };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, form: { ...state.form, showPassword: !state.form.showPassword } };

    case "SET_FIELD_ERROR":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.payload.field]: action.payload.message },
      };
    case "CLEAR_FIELD_ERRORS":
      return { ...state, fieldErrors: initialState.fieldErrors };

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

export function useLogin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      dispatch({ type: "SET_EMAIL", payload: savedEmail });
    }
  }, []);

  const login = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    const { email, password } = state.form;

    let hasError = false;

    if (!email) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "email", message: "Email обязателен" } });
      hasError = true;
    }

    if (!password) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "password", message: "Пароль обязателен" } });
      hasError = true;
    }

    if (hasError) {
      dispatch({ type: "SET_ERROR", payload: "Заполните все поля" });
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail) });
        return false;
      }

      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email || email);

        if (data.company_name) {
          localStorage.setItem("companyName", data.company_name);
        }

        window.dispatchEvent(new Event("authChange"));
        router.replace("/profile");
        return true;
      }

      dispatch({ type: "SET_ERROR", payload: "Ошибка сервера. Попробуйте позже" });
      return false;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Ошибка сети. Проверьте соединение" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form.email, state.form.password, router]);

  const actions = useMemo(
    () => ({
      setEmail: (v: string) => dispatch({ type: "SET_EMAIL", payload: v }),
      setPassword: (v: string) => dispatch({ type: "SET_PASSWORD", payload: v }),
      toggleShowPassword: () => dispatch({ type: "TOGGLE_SHOW_PASSWORD" }),
      setError: (msg: string | null) => dispatch({ type: "SET_ERROR", payload: msg }),
      clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return {
    state,
    login,
    ...actions,
  };
}

export type LoginStore = ReturnType<typeof useLogin>;
