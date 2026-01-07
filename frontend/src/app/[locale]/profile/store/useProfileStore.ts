"use client";

import { useReducer, useCallback, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ENDPOINTS = {
  profile: `${API_URL}/api/profile`,
  changePassword: `${API_URL}/api/profile/change-password`,
  deleteAccount: `${API_URL}/api/profile/delete`,
} as const;

export type UserRole = "TRANSPORT_COMPANY" | "CARGO_OWNER" | "FORWARDER";
export type ActiveTab = "personal" | "security";

export interface ProfileState {
  activeTab: ActiveTab;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;

  personal: {
    fullName: string;
    industry: UserRole | "";
    phone: string;
    email: string;
    company: string;
    position: string;
    address: string;
    photo: string | null;
    photoFile: File | null;
  };

  security: {
    newPassword: string;
    repeatPassword: string;
    showNew: boolean;
    showRepeat: boolean;
    errors: {
      new: string | null;
      repeat: string | null;
    };
  };

  _original: {
    fullName: string;
    industry: UserRole | "";
    phone: string;
    email: string;
    company: string;
    position: string;
    address: string;
    photo: string | null;
  } | null;
}

type ProfileAction =
  | { type: "SET_TAB"; payload: ActiveTab }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_INDUSTRY"; payload: UserRole | "" }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_COMPANY"; payload: string }
  | { type: "SET_POSITION"; payload: string }
  | { type: "SET_ADDRESS"; payload: string }
  | { type: "SET_PHOTO"; payload: string | null }
  | { type: "SET_PHOTO_FILE"; payload: File | null }
  | { type: "LOAD_PROFILE"; payload: Partial<ProfileState["personal"]> }
  | { type: "SET_NEW_PASSWORD"; payload: string }
  | { type: "SET_REPEAT_PASSWORD"; payload: string }
  | { type: "TOGGLE_SHOW_NEW" }
  | { type: "TOGGLE_SHOW_REPEAT" }
  | { type: "SET_SECURITY_ERROR"; payload: { field: "new" | "repeat"; message: string | null } }
  | { type: "CLEAR_SECURITY_ERRORS" }
  | { type: "RESET_SECURITY" }
  | { type: "RESET" };

const initialState: ProfileState = {
  activeTab: "personal",
  loading: false,
  saving: false,
  error: null,
  success: null,

  personal: {
    fullName: "",
    industry: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    address: "",
    photo: null,
    photoFile: null,
  },

  security: {
    newPassword: "",
    repeatPassword: "",
    showNew: false,
    showRepeat: false,
    errors: {
      new: null,
      repeat: null,
    },
  },

  _original: null,
};

function reducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SAVING":
      return { ...state, saving: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, error: null, success: null };

    case "SET_FULL_NAME":
      return { ...state, personal: { ...state.personal, fullName: action.payload } };
    case "SET_INDUSTRY":
      return { ...state, personal: { ...state.personal, industry: action.payload } };
    case "SET_PHONE":
      return { ...state, personal: { ...state.personal, phone: action.payload } };
    case "SET_EMAIL":
      return { ...state, personal: { ...state.personal, email: action.payload } };
    case "SET_COMPANY":
      return { ...state, personal: { ...state.personal, company: action.payload } };
    case "SET_POSITION":
      return { ...state, personal: { ...state.personal, position: action.payload } };
    case "SET_ADDRESS":
      return { ...state, personal: { ...state.personal, address: action.payload } };
    case "SET_PHOTO":
      return { ...state, personal: { ...state.personal, photo: action.payload } };
    case "SET_PHOTO_FILE":
      return { ...state, personal: { ...state.personal, photoFile: action.payload } };
    case "LOAD_PROFILE":
      return {
        ...state,
        personal: { ...state.personal, ...action.payload },
        _original: {
          fullName: action.payload.fullName ?? state.personal.fullName,
          industry: (action.payload.industry ?? state.personal.industry) as UserRole | "",
          phone: action.payload.phone ?? state.personal.phone,
          email: action.payload.email ?? state.personal.email,
          company: action.payload.company ?? state.personal.company,
          position: action.payload.position ?? state.personal.position,
          address: action.payload.address ?? state.personal.address,
          photo: action.payload.photo ?? state.personal.photo,
        },
      };

    case "SET_NEW_PASSWORD":
      return {
        ...state,
        security: {
          ...state.security,
          newPassword: action.payload,
          errors: { ...state.security.errors, new: null },
        },
      };
    case "SET_REPEAT_PASSWORD":
      return {
        ...state,
        security: {
          ...state.security,
          repeatPassword: action.payload,
          errors: { ...state.security.errors, repeat: null },
        },
      };
    case "TOGGLE_SHOW_NEW":
      return { ...state, security: { ...state.security, showNew: !state.security.showNew } };
    case "TOGGLE_SHOW_REPEAT":
      return { ...state, security: { ...state.security, showRepeat: !state.security.showRepeat } };
    case "SET_SECURITY_ERROR":
      return {
        ...state,
        security: {
          ...state.security,
          errors: { ...state.security.errors, [action.payload.field]: action.payload.message },
        },
      };
    case "CLEAR_SECURITY_ERRORS":
      return {
        ...state,
        security: { ...state.security, errors: { new: null, repeat: null } },
      };
    case "RESET_SECURITY":
      return { ...state, security: initialState.security };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
}

export function useProfileStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetch(ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить профиль");
      }

      const data = await response.json();

      const photoUrl = data.photo
        ? `${API_URL}/static/user_photos/${data.photo}`
        : null;

      dispatch({
        type: "LOAD_PROFILE",
        payload: {
          fullName: data.name || "",
          industry: data.role || "",
          phone: data.phone || "",
          email: data.email || "",
          company: data.company_name || "",
          position: data.position || "",
          address: data.location || "",
          photo: photoUrl,
        },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка загрузки профиля",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const saveProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    dispatch({ type: "SET_SAVING", payload: true });
    dispatch({ type: "CLEAR_NOTIFICATIONS" });

    try {
      const formData = new FormData();
      formData.append("name", state.personal.fullName);
      formData.append("role", state.personal.industry);
      formData.append("phone", state.personal.phone);
      formData.append("company_name", state.personal.company);
      formData.append("position", state.personal.position);
      formData.append("location", state.personal.address);

      if (state.personal.photoFile) {
        formData.append("photo", state.personal.photoFile);
      }

      const response = await fetch(ENDPOINTS.profile, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить профиль");
      }

      const data = await response.json();

      const photoUrl = data.photo
        ? `${API_URL}/static/user_photos/${data.photo}`
        : null;

      dispatch({
        type: "LOAD_PROFILE",
        payload: {
          fullName: data.name || "",
          industry: data.role || "",
          phone: data.phone || "",
          email: data.email || "",
          company: data.company_name || "",
          position: data.position || "",
          address: data.location || "",
          photo: photoUrl,
        },
      });

      dispatch({ type: "SET_PHOTO_FILE", payload: null });
      dispatch({ type: "SET_SUCCESS", payload: "Профиль сохранён" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка сохранения профиля",
      });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, [state.personal]);

  const changePassword = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return false;

    dispatch({ type: "CLEAR_SECURITY_ERRORS" });
    dispatch({ type: "CLEAR_NOTIFICATIONS" });

    let hasError = false;
    const { newPassword, repeatPassword } = state.security;

    if (!newPassword) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: { field: "new", message: "Введите новый пароль" } });
      hasError = true;
    } else if (newPassword.length < 8) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: { field: "new", message: "Минимум 8 символов" } });
      hasError = true;
    }

    if (!repeatPassword) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: { field: "repeat", message: "Повторите пароль" } });
      hasError = true;
    } else if (newPassword !== repeatPassword) {
      dispatch({ type: "SET_SECURITY_ERROR", payload: { field: "repeat", message: "Пароли не совпадают" } });
      hasError = true;
    }

    if (hasError) {
      dispatch({ type: "SET_ERROR", payload: "Проверьте введённые данные" });
      return false;
    }

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.changePassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Не удалось изменить пароль");
      }

      dispatch({ type: "SET_SUCCESS", payload: "Пароль успешно изменён" });
      dispatch({ type: "RESET_SECURITY" });
      return true;
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка изменения пароля",
      });
      return false;
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, [state.security]);

  const deleteAccount = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    if (!confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) {
      return;
    }

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      const response = await fetch(ENDPOINTS.deleteAccount, {
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
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, []);

  const hasChanges = useMemo(() => {
    if (!state._original) return false;

    const { personal, _original } = state;
    return (
      personal.fullName !== _original.fullName ||
      personal.industry !== _original.industry ||
      personal.phone !== _original.phone ||
      personal.company !== _original.company ||
      personal.position !== _original.position ||
      personal.address !== _original.address ||
      personal.photoFile !== null
    );
  }, [state.personal, state._original]);

  const actions = useMemo(
    () => ({
      setTab: (tab: ActiveTab) => dispatch({ type: "SET_TAB", payload: tab }),
      setError: (msg: string | null) => dispatch({ type: "SET_ERROR", payload: msg }),
      setSuccess: (msg: string | null) => dispatch({ type: "SET_SUCCESS", payload: msg }),
      clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),

      setFullName: (v: string) => dispatch({ type: "SET_FULL_NAME", payload: v }),
      setIndustry: (v: UserRole | "") => dispatch({ type: "SET_INDUSTRY", payload: v }),
      setPhone: (v: string) => dispatch({ type: "SET_PHONE", payload: v }),
      setEmail: (v: string) => dispatch({ type: "SET_EMAIL", payload: v }),
      setCompany: (v: string) => dispatch({ type: "SET_COMPANY", payload: v }),
      setPosition: (v: string) => dispatch({ type: "SET_POSITION", payload: v }),
      setAddress: (v: string) => dispatch({ type: "SET_ADDRESS", payload: v }),
      setPhoto: (v: string | null) => dispatch({ type: "SET_PHOTO", payload: v }),
      setPhotoFile: (v: File | null) => dispatch({ type: "SET_PHOTO_FILE", payload: v }),

      setNewPassword: (v: string) => dispatch({ type: "SET_NEW_PASSWORD", payload: v }),
      setRepeatPassword: (v: string) => dispatch({ type: "SET_REPEAT_PASSWORD", payload: v }),
      toggleShowNew: () => dispatch({ type: "TOGGLE_SHOW_NEW" }),
      toggleShowRepeat: () => dispatch({ type: "TOGGLE_SHOW_REPEAT" }),

      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return {
    state,
    hasChanges,

    loadProfile,
    saveProfile,
    changePassword,
    deleteAccount,

    ...actions,
  };
}

export type ProfileStore = ReturnType<typeof useProfileStore>;

