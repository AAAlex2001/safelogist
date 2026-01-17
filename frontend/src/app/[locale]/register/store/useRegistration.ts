"use client";

import { useReducer, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  sendCode: `${API_URL}/register/send-code`,
  verifyCode: `${API_URL}/register/verify-code`,
  register: `${API_URL}/register/`,
  searchCompanies: `${API_URL}/api/reviews/search`,
} as const;

export type Step = "form" | "code" | "password";

export type UserRole = "TRANSPORT_COMPANY" | "CARGO_OWNER" | "FORWARDER" | "USER";

export interface CompanySearchResult {
  name: string;
  id: number;
}

export interface RegistrationState {
  step: Step;
  loading: boolean;
  error: string | null;
  success: string | null;

  form: {
    name: string;
    role: UserRole;
    phone: string;
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  };

  fieldErrors: {
    name: string | null;
    role: string | null;
    phone: string | null;
    email: string | null;
    code: string | null;
    password: string | null;
    confirm: string | null;
  };

  search: {
    query: string;
    results: CompanySearchResult[];
    loading: boolean;
    showDropdown: boolean;
  };

  emailVerified: boolean;
}

type RegistrationAction =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_ROLE"; payload: UserRole }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_FIELD_ERROR"; payload: { field: keyof RegistrationState["fieldErrors"]; message: string | null } }
  | { type: "CLEAR_FIELD_ERRORS" }
  | { type: "SET_EMAIL_VERIFIED"; payload: boolean }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_RESULTS"; payload: CompanySearchResult[] }
  | { type: "SET_SEARCH_LOADING"; payload: boolean }
  | { type: "SET_SHOW_DROPDOWN"; payload: boolean }
  | { type: "RESET" };

const initialState: RegistrationState = {
  step: "form",
  loading: false,
  error: null,
  success: null,

  form: {
    name: "",
    role: "TRANSPORT_COMPANY",
    phone: "",
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  },

  fieldErrors: {
    name: null,
    role: null,
    phone: null,
    email: null,
    code: null,
    password: null,
    confirm: null,
  },

  search: {
    query: "",
    results: [],
    loading: false,
    showDropdown: false,
  },

  emailVerified: false,
};

function reducer(state: RegistrationState, action: RegistrationAction): RegistrationState {
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

    case "SET_NAME":
      return {
        ...state,
        form: { ...state.form, name: action.payload },
        fieldErrors: { ...state.fieldErrors, name: null },
      };
    case "SET_ROLE":
      return {
        ...state,
        form: { ...state.form, role: action.payload },
        fieldErrors: { ...state.fieldErrors, role: null },
      };
    case "SET_PHONE":
      return {
        ...state,
        form: { ...state.form, phone: action.payload },
        fieldErrors: { ...state.fieldErrors, phone: null },
      };
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

    case "SET_FIELD_ERROR":
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.payload.field]: action.payload.message },
      };
    case "CLEAR_FIELD_ERRORS":
      return { ...state, fieldErrors: initialState.fieldErrors };

    case "SET_EMAIL_VERIFIED":
      return { ...state, emailVerified: action.payload };

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
  if (detail && typeof detail === "object" && "message" in detail) {
    return String((detail as { message: unknown }).message);
  }
  return "Произошла ошибка. Попробуйте ещё раз.";
}

export function useRegistration() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate first step form
  const validateForm = useCallback(() => {
    let hasError = false;
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    if (!state.form.name.trim()) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "name", message: "Введите название компании" } });
      hasError = true;
    }

    if (!state.form.phone || state.form.phone.length < 10) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "phone", message: "Введите корректный номер телефона" } });
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.form.email.trim() || !emailRegex.test(state.form.email)) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "email", message: "Введите корректный email" } });
      hasError = true;
    }

    return !hasError;
  }, [state.form.name, state.form.phone, state.form.email]);

  // Step 1: Send verification code to email
  const sendCode = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });

    if (!validateForm()) {
      dispatch({ type: "SET_ERROR", payload: "Проверьте введённые данные" });
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.sendCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.form.email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      dispatch({ type: "SET_SUCCESS", payload: "Код отправлен на вашу почту" });
      dispatch({ type: "SET_STEP", payload: "code" });
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось отправить код. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form.email, validateForm]);

  // Step 2: Verify the code
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
      const response = await fetch(ENDPOINTS.verifyCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: state.form.email.trim(),
          code: trimmedCode 
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      dispatch({ type: "SET_EMAIL_VERIFIED", payload: true });
      dispatch({ type: "SET_SUCCESS", payload: "Email подтверждён" });
      dispatch({ type: "SET_STEP", payload: "password" });
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось проверить код. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form.code, state.form.email]);

  // Step 3: Complete registration
  const register = useCallback(async () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });

    let hasError = false;
    const { password, confirmPassword } = state.form;

    if (!password) {
      dispatch({ type: "SET_FIELD_ERROR", payload: { field: "password", message: "Введите пароль" } });
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
      const response = await fetch(ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: state.form.name.trim(),
          role: state.form.role,
          phone: state.form.phone,
          email: state.form.email.trim(),
          password: state.form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        dispatch({ type: "SET_ERROR", payload: parseErrorMessage(data.detail ?? data.message) });
        return false;
      }

      dispatch({ type: "SET_SUCCESS", payload: "Аккаунт успешно создан!" });
      router.replace("/login");
      return true;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Не удалось создать аккаунт. Проверьте соединение." });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.form, router]);

  const goBackToForm = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: "form" });
    dispatch({ type: "SET_CODE", payload: "" });
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    dispatch({ type: "CLEAR_FIELD_ERRORS" });
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
    dispatch({ type: "SET_NAME", payload: company.name });
    dispatch({ type: "SET_SEARCH_QUERY", payload: company.name });
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
  }, []);

  const hideDropdown = useCallback(() => {
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
  }, []);

  const showDropdown = useCallback(() => {
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: true });
  }, []);

  const actions = useMemo(
    () => ({
      setName: (v: string) => dispatch({ type: "SET_NAME", payload: v }),
      setRole: (v: UserRole) => dispatch({ type: "SET_ROLE", payload: v }),
      setPhone: (v: string) => dispatch({ type: "SET_PHONE", payload: v }),
      setEmail: (v: string) => dispatch({ type: "SET_EMAIL", payload: v }),
      setCode: (v: string) => {
        const digitsOnly = v.replace(/\D/g, "").slice(0, 6);
        dispatch({ type: "SET_CODE", payload: digitsOnly });
      },
      setPassword: (v: string) => dispatch({ type: "SET_PASSWORD", payload: v }),
      setConfirmPassword: (v: string) => dispatch({ type: "SET_CONFIRM_PASSWORD", payload: v }),

      setError: (msg: string | null) => dispatch({ type: "SET_ERROR", payload: msg }),
      setSuccess: (msg: string | null) => dispatch({ type: "SET_SUCCESS", payload: msg }),
      clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),

      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return {
    state,

    sendCode,
    verifyCode,
    register,

    goBackToForm,
    searchCompanies,
    selectCompany,
    hideDropdown,
    showDropdown,

    ...actions,
  };
}
