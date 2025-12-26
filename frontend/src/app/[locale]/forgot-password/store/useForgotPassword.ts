"use client";

import { FormEvent, useReducer } from "react";
import { useRouter } from "next/navigation";

const REQUEST_ENDPOINT = `${
  process.env.NEXT_PUBLIC_API_URL ?? ""
}/forgot-password/request`;

const VERIFY_ENDPOINT = `${
  process.env.NEXT_PUBLIC_API_URL ?? ""
}/forgot-password/verify`;

const RESET_ENDPOINT = `${
  process.env.NEXT_PUBLIC_API_URL ?? ""
}/forgot-password/reset`;

type Step = "email" | "code" | "reset";

type ForgotPasswordState = {
  step: Step;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  errorEmail: string | null;
  errorCode: string | null;
  errorPassword: string | null;
  errorConfirm: string | null;
  userId: number | null;
};

type ForgotPasswordAction =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "SET_ERROR_EMAIL"; payload: string | null }
  | { type: "SET_ERROR_CODE"; payload: string | null }
  | { type: "SET_ERROR_PASSWORD"; payload: string | null }
  | { type: "SET_ERROR_CONFIRM"; payload: string | null }
  | { type: "SET_USER_ID"; payload: number | null }
  | { type: "CLEAR_FEEDBACK" }
  | { type: "RESET" };

const initialState: ForgotPasswordState = {
  step: "email",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
  loading: false,
  error: null,
  success: null,
  errorEmail: null,
  errorCode: null,
  errorPassword: null,
  errorConfirm: null,
  userId: null,
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
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM":
      return { ...state, confirmPassword: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "SET_ERROR_EMAIL":
      return { ...state, errorEmail: action.payload };
    case "SET_ERROR_CODE":
      return { ...state, errorCode: action.payload };
    case "SET_ERROR_PASSWORD":
      return { ...state, errorPassword: action.payload };
    case "SET_ERROR_CONFIRM":
      return { ...state, errorConfirm: action.payload };
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "CLEAR_FEEDBACK":
      return {
        ...state,
        error: null,
        success: null,
        errorEmail: null,
        errorCode: null,
        errorPassword: null,
        errorConfirm: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const useForgotPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

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
      dispatch({ type: "SET_STEP", payload: "code" });
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Не удалось отправить письмо. Проверьте соединение.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleVerifyCode = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "CLEAR_FEEDBACK" });

    const trimmedCode = state.code.trim().replace(/\s/g, "");

    if (!trimmedCode || trimmedCode.length !== 6) {
      dispatch({
        type: "SET_ERROR",
        payload: "Введите код из 6 цифр",
      });
      dispatch({
        type: "SET_ERROR_CODE",
        payload: "Код должен состоять из 6 цифр",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(VERIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode }),
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

      const userId = (data as { user_id?: number }).user_id;
      if (userId) {
        dispatch({ type: "SET_USER_ID", payload: userId });
        dispatch({
          type: "SET_SUCCESS",
          payload: "Код подтверждён",
        });
        dispatch({ type: "SET_STEP", payload: "reset" });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "Ошибка при проверке кода",
        });
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Не удалось проверить код. Проверьте соединение.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "CLEAR_FEEDBACK" });

    if (!state.userId) {
      dispatch({ type: "SET_ERROR", payload: "Сессия истекла, запросите код заново" });
      dispatch({ type: "SET_STEP", payload: "email" });
      return;
    }

    if (!state.password) {
      dispatch({ type: "SET_ERROR_PASSWORD", payload: "Введите новый пароль" });
    }
    if (!state.confirmPassword) {
      dispatch({
        type: "SET_ERROR_CONFIRM",
        payload: "Повторите пароль",
      });
    }
    if (!state.password || !state.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Заполните оба поля" });
      return;
    }
    if (state.password.length < 8) {
      dispatch({
        type: "SET_ERROR_PASSWORD",
        payload: "Пароль должен быть не менее 8 символов",
      });
      dispatch({ type: "SET_ERROR", payload: "Пароль должен быть не менее 8 символов" });
      return;
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Пароли не совпадают" });
      dispatch({
        type: "SET_ERROR_CONFIRM",
        payload: "Пароли не совпадают",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(RESET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: state.userId,
          new_password: state.password,
        }),
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
        payload: "Пароль успешно обновлён",
      });
      router.replace("/login");
    } catch {
      dispatch({
        type: "SET_ERROR",
        payload: "Не удалось обновить пароль. Проверьте соединение.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    step: state.step,
    email: state.email,
    code: state.code,
    password: state.password,
    confirmPassword: state.confirmPassword,
    loading: state.loading,
    error: state.error,
    success: state.success,
    errorEmail: state.errorEmail,
    errorCode: state.errorCode,
    errorPassword: state.errorPassword,
    errorConfirm: state.errorConfirm,
    userId: state.userId,
    setEmail: (value: string) => {
      dispatch({ type: "SET_EMAIL", payload: value });
      if (state.errorEmail) {
        dispatch({ type: "SET_ERROR_EMAIL", payload: null });
      }
    },
    setCode: (value: string) => {
      // Разрешаем только цифры, максимум 6 символов
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      dispatch({ type: "SET_CODE", payload: digitsOnly });
      if (state.errorCode) {
        dispatch({ type: "SET_ERROR_CODE", payload: null });
      }
    },
    setPassword: (value: string) => {
      dispatch({ type: "SET_PASSWORD", payload: value });
      if (state.errorPassword) {
        dispatch({ type: "SET_ERROR_PASSWORD", payload: null });
      }
      if (state.error === "Пароль должен быть не менее 8 символов") {
        dispatch({ type: "SET_ERROR", payload: null });
      }
    },
    setConfirmPassword: (value: string) => {
      dispatch({ type: "SET_CONFIRM", payload: value });
      if (state.errorConfirm) {
        dispatch({ type: "SET_ERROR_CONFIRM", payload: null });
      }
      if (state.error === "Пароли не совпадают") {
        dispatch({ type: "SET_ERROR", payload: null });
      }
    },
    goBackToEmail: () => {
      dispatch({ type: "SET_STEP", payload: "email" });
      dispatch({ type: "SET_CODE", payload: "" });
      dispatch({ type: "CLEAR_FEEDBACK" });
    },
    setError: (value: string | null) =>
      dispatch({ type: "SET_ERROR", payload: value }),
    setSuccess: (value: string | null) =>
      dispatch({ type: "SET_SUCCESS", payload: value }),
    handleSubmit,
    handleVerifyCode,
    handleReset,
  };
};

