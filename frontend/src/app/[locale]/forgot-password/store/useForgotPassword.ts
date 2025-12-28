"use client";

import { useReducer, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  request: `${API_URL}/forgot-password/request`,
  verify: `${API_URL}/forgot-password/verify`,
  reset: `${API_URL}/forgot-password/reset`,
} as const;

export type Step = "email" | "code" | "reset";

export interface ForgotPasswordState {
  step: Step;
  loading: boolean;
  error: string | null;
  success: string | null;

  form: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirm: boolean;
  };

  fieldErrors: {
    email: string | null;
    code: string | null;
    password: string | null;
    confirm: string | null;
  };

  userId: number | null;
}

type ForgotPasswordAction =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "TOGGLE_SHOW_PASSWORD" }
  | { type: "TOGGLE_SHOW_CONFIRM" }
  | { type: "SET_FIELD_ERROR"; payload: { field: keyof ForgotPasswordState["fieldErrors"]; message: string | null } }
  | { type: "CLEAR_FIELD_ERRORS" }
  | { type: "SET_USER_ID"; payload: number | null }
  | { type: "RESET" };

const initialState: ForgotPasswordState = {
  step: "email",
  loading: false,
  error: null,
  success: null,

  form: {
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirm: false,
  },

  fieldErrors: {
    email: null,
    code: null,
    password: null,
    confirm: null,
  },

  userId: null,
};

function reducer(state: ForgotPasswordState, action: ForgotPasswordAction): ForgotPasswordState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, error: null, success: null };

    case "SET_EMAIL":
      return {
        ...state,
        form: { ...state.form, email: action.payload },
        fieldErrors: { ...state.fieldErrors, email: null },
      };
    case "SET_CODE":
      return {
        ...state,
        form: { ...state.form, code: action.payload },
        fieldErrors: { ...state.fieldErrors, code: null },
      };
    case "SET_PASSWORD":
      return {
        ...state,
        form: { ...state.form, password: action.payload },
        fieldErrors: { ...state.fieldErrors, password: null },
      };
    case "SET_CONFIRM_PASSWORD":
      return {
        ...state,
        form: { ...state.form, confirmPassword: action.payload },
        fieldErrors: { ...state.fieldErrors, confirm: null },
      };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, form: { ...state.form, showPassword: !state.form.showPassword } };
    case "TOGGLE_SHOW_CONFIRM":
      return { ...state, form: { ...state.form, showConfirm: !state.form.showConfirm } };

    case "SET_FIELD_ERROR":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.payload.field]: action.payload.message },
      };
    case "CLEAR_FIELD_ERRORS":
      return { ...state, fieldErrors: initialState.fieldErrors };

    case "SET_USER_ID":
      return { ...state, userId: action.payload };

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
  if (detail && typeof detail === "object" && "message" in detail) {
    return String((detail as { message: unknown }).message);
  }
  return "Произошла ошибка. Попробуйте ещё раз.";
}

export function useForgotPassword() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const requestCode = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    const trimmedEmail = state.form.email.trim();

    if (!trimmedEmail) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "email", message: "Поле email обязательно" } });
      dispatch({ type: "SET_ERROR", payload: "Укажите email, чтобы отправить инструкции." });
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      localStorage.setItem("userEmail", trimmedEmail);
      dispatch({ type: "SET_SUCCESS", payload: data.message ?? "Инструкция отправлена на вашу почту." });
      dispatch({ type: "SET_STEP", payload: "code" });
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось отправить письмо. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form.email]);

  const verifyCode = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    const trimmedCode = state.form.code.trim().replace(/\s/g, "");

    if (!trimmedCode || trimmedCode.length !== 6) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "code", message: "Код должен состоять из 6 цифр" } });
      dispatch({ type: "SET_ERROR", payload: "Введите код из 6 цифр" });
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      const userId = data.user_id;
      if (userId) {
        dispatch({ type: "SET_USER_ID", payload: userId });
        dispatch({ type: "SET_SUCCESS", payload: "Код подтверждён" });
        dispatch({ type: "SET_STEP", payload: "reset" });
        return true;
      }

      dispatch({ type: "SET_ERROR", payload: "Ошибка при проверке кода" });
      return false;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось проверить код. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form.code]);

  const resetPassword = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    if (!state.userId) {
      dispatch({ type: "SET_ERROR", payload: "Сессия истекла, запросите код заново" });
      dispatch({ type: "SET_STEP", payload: "email" });
      return false;
    }

    let hasError = false;
    const { password, confirmPassword } = state.form;

    if (!password) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "password", message: "Введите новый пароль" } });
      hasError = true;
    } else if (password.length < 8) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "password", message: "Пароль должен быть не менее 8 символов" } });
      hasError = true;
    }

    if (!confirmPassword) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "confirm", message: "Повторите пароль" } });
      hasError = true;
    } else if (password !== confirmPassword) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "confirm", message: "Пароли не совпадают" } });
      hasError = true;
    }

    if (hasError) {
      dispatch({ type: "SET_ERROR", payload: "Проверьте введённые данные" });
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.reset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: state.userId,
          new_password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      dispatch({ type: "SET_SUCCESS", payload: "Пароль успешно обновлён" });
      router.replace("/login");
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось обновить пароль. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.userId, state.form.password, state.form.confirmPassword, router]);

  const goBackToEmail = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: "email" });
    dispatch({ type: "SET_CODE", payload: "" });
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });
  }, []);

  const actions = useMemo(
    () => ({
      setEmail: (v: string) => dispatch({ type: "SET_EMAIL", payload: v }),
      setCode: (v: string) => {
        const digitsOnly = v.replace(/\D/g, "").slice(0, 6);
        dispatch({ type: "SET_CODE", payload: digitsOnly });
      },
      setPassword: (v: string) => dispatch({ type: "SET_PASSWORD", payload: v }),
      setConfirmPassword: (v: string) => dispatch({ type: "SET_CONFIRM_PASSWORD", payload: v }),
      toggleShowPassword: () => dispatch({ type: "TOGGLE_SHOW_PASSWORD" }),
      toggleShowConfirm: () => dispatch({ type: "TOGGLE_SHOW_CONFIRM" }),

      setError: (msg: string | null) => dispatch({ type: "SET_ERROR", payload: msg }),
      setSuccess: (msg: string | null) => dispatch({ type: "SET_SUCCESS", payload: msg }),
      clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),

      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return {
    state,

    requestCode,
    verifyCode,
    resetPassword,

    goBackToEmail,

    ...actions,
  };
}
