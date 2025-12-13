"use client";

import { useReducer, useCallback } from "react";

const CHANGE_PASSWORD_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/profile/change-password`;
const DELETE_ACCOUNT_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/profile/delete`;

type SecurityState = {
  loading: boolean;
  error: string | null;
  success: string | null;

  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
  showNew: boolean;
  showRepeat: boolean;

  errorCurrent: string | null;
  errorNew: string | null;
  errorRepeat: string | null;
};

type SecurityAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "SET_CURRENT_PASSWORD"; payload: string }
  | { type: "SET_NEW_PASSWORD"; payload: string }
  | { type: "SET_REPEAT_PASSWORD"; payload: string }
  | { type: "TOGGLE_SHOW_NEW" }
  | { type: "TOGGLE_SHOW_REPEAT" }
  | { type: "SET_ERROR_CURRENT"; payload: string | null }
  | { type: "SET_ERROR_NEW"; payload: string | null }
  | { type: "SET_ERROR_REPEAT"; payload: string | null }
  | { type: "CLEAR_ERRORS" }
  | { type: "RESET" };

const initialState: SecurityState = {
  loading: false,
  error: null,
  success: null,

  currentPassword: "",
  newPassword: "",
  repeatPassword: "",
  showNew: false,
  showRepeat: false,

  errorCurrent: null,
  errorNew: null,
  errorRepeat: null,
};

function reducer(state: SecurityState, action: SecurityAction): SecurityState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "SET_CURRENT_PASSWORD":
      return { ...state, currentPassword: action.payload };
    case "SET_NEW_PASSWORD":
      return { ...state, newPassword: action.payload };
    case "SET_REPEAT_PASSWORD":
      return { ...state, repeatPassword: action.payload };
    case "TOGGLE_SHOW_NEW":
      return { ...state, showNew: !state.showNew };
    case "TOGGLE_SHOW_REPEAT":
      return { ...state, showRepeat: !state.showRepeat };
    case "SET_ERROR_CURRENT":
      return { ...state, errorCurrent: action.payload };
    case "SET_ERROR_NEW":
      return { ...state, errorNew: action.payload };
    case "SET_ERROR_REPEAT":
      return { ...state, errorRepeat: action.payload };
    case "CLEAR_ERRORS":
      return { ...state, error: null, errorCurrent: null, errorNew: null, errorRepeat: null };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const useSecurityStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changePassword = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    dispatch({ type: "CLEAR_ERRORS" });
    dispatch({ type: "SET_SUCCESS", payload: null });

    // Validation
    let hasError = false;

    if (!state.currentPassword) {
      dispatch({ type: "SET_ERROR_CURRENT", payload: "Введите текущий пароль" });
      hasError = true;
    }

    if (!state.newPassword) {
      dispatch({ type: "SET_ERROR_NEW", payload: "Введите новый пароль" });
      hasError = true;
    } else if (state.newPassword.length < 8) {
      dispatch({ type: "SET_ERROR_NEW", payload: "Минимум 8 символов" });
      hasError = true;
    }

    if (!state.repeatPassword) {
      dispatch({ type: "SET_ERROR_REPEAT", payload: "Повторите пароль" });
      hasError = true;
    } else if (state.newPassword !== state.repeatPassword) {
      dispatch({ type: "SET_ERROR_REPEAT", payload: "Пароли не совпадают" });
      hasError = true;
    }

    if (hasError) {
      dispatch({ type: "SET_ERROR", payload: "Проверьте введённые данные" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(CHANGE_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: state.currentPassword,
          new_password: state.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Не удалось изменить пароль");
      }

      dispatch({ type: "SET_SUCCESS", payload: "Пароль успешно изменён" });
      dispatch({ type: "RESET" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка изменения пароля",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.currentPassword, state.newPassword, state.repeatPassword]);

  const deleteAccount = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    if (!confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(DELETE_ACCOUNT_ENDPOINT, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить аккаунт");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка удаления аккаунта",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    changePassword,
    deleteAccount,
    resetForm,
    setCurrentPassword: (value: string) => {
      dispatch({ type: "SET_CURRENT_PASSWORD", payload: value });
      if (state.errorCurrent) dispatch({ type: "SET_ERROR_CURRENT", payload: null });
    },
    setNewPassword: (value: string) => {
      dispatch({ type: "SET_NEW_PASSWORD", payload: value });
      if (state.errorNew) dispatch({ type: "SET_ERROR_NEW", payload: null });
    },
    setRepeatPassword: (value: string) => {
      dispatch({ type: "SET_REPEAT_PASSWORD", payload: value });
      if (state.errorRepeat) dispatch({ type: "SET_ERROR_REPEAT", payload: null });
    },
    toggleShowNew: () => dispatch({ type: "TOGGLE_SHOW_NEW" }),
    toggleShowRepeat: () => dispatch({ type: "TOGGLE_SHOW_REPEAT" }),
    setError: (value: string | null) => dispatch({ type: "SET_ERROR", payload: value }),
    setSuccess: (value: string | null) => dispatch({ type: "SET_SUCCESS", payload: value }),
  };
};

