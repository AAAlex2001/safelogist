"use client";

import { useReducer, useCallback } from "react";

const PROFILE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/profile`;

type Tab = "personal" | "security";

type ProfileState = {
  activeTab: Tab;
  loading: boolean;
  error: string | null;
  success: string | null;

  // Personal data
  fullName: string;
  industry: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  address: string;
  photo: string | null;

  // Security data
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
  showNew: boolean;
  showRepeat: boolean;
};

type ProfileAction =
  | { type: "SET_TAB"; payload: Tab }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_INDUSTRY"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_COMPANY"; payload: string }
  | { type: "SET_POSITION"; payload: string }
  | { type: "SET_ADDRESS"; payload: string }
  | { type: "SET_PHOTO"; payload: string | null }
  | { type: "SET_CURRENT_PASSWORD"; payload: string }
  | { type: "SET_NEW_PASSWORD"; payload: string }
  | { type: "SET_REPEAT_PASSWORD"; payload: string }
  | { type: "TOGGLE_SHOW_NEW" }
  | { type: "TOGGLE_SHOW_REPEAT" }
  | { type: "RESET_SECURITY" }
  | { type: "LOAD_PROFILE"; payload: Partial<ProfileState> };

const initialState: ProfileState = {
  activeTab: "personal",
  loading: false,
  error: null,
  success: null,

  fullName: "",
  industry: "",
  phone: "",
  email: "",
  company: "",
  position: "",
  address: "",
  photo: null,

  currentPassword: "",
  newPassword: "",
  repeatPassword: "",
  showNew: false,
  showRepeat: false,
};

function reducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_INDUSTRY":
      return { ...state, industry: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_COMPANY":
      return { ...state, company: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_PHOTO":
      return { ...state, photo: action.payload };
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
    case "RESET_SECURITY":
      return {
        ...state,
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
        showNew: false,
        showRepeat: false,
      };
    case "LOAD_PROFILE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const useProfileStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProfile = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(PROFILE_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить профиль");
      }

      const data = await response.json();

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
          photo: data.photo || null,
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

  const savePersonal = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_SUCCESS", payload: null });

    try {
      const formData = new FormData();
      if (state.fullName) formData.append("name", state.fullName);
      if (state.company) formData.append("company_name", state.company);
      if (state.position) formData.append("position", state.position);
      if (state.address) formData.append("location", state.address);

      const response = await fetch(PROFILE_ENDPOINT, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить профиль");
      }

      const data = await response.json();

      dispatch({
        type: "LOAD_PROFILE",
        payload: {
          fullName: data.name || "",
          company: data.company_name || "",
          position: data.position || "",
          address: data.location || "",
        },
      });

      dispatch({ type: "SET_SUCCESS", payload: "Профиль сохранён" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Ошибка сохранения профиля",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.fullName, state.company, state.position, state.address]);

  return {
    state,
    loadProfile,
    savePersonal,
    setTab: (tab: Tab) => dispatch({ type: "SET_TAB", payload: tab }),
    setFullName: (value: string) => dispatch({ type: "SET_FULL_NAME", payload: value }),
    setIndustry: (value: string) => dispatch({ type: "SET_INDUSTRY", payload: value }),
    setPhone: (value: string) => dispatch({ type: "SET_PHONE", payload: value }),
    setEmail: (value: string) => dispatch({ type: "SET_EMAIL", payload: value }),
    setCompany: (value: string) => dispatch({ type: "SET_COMPANY", payload: value }),
    setPosition: (value: string) => dispatch({ type: "SET_POSITION", payload: value }),
    setAddress: (value: string) => dispatch({ type: "SET_ADDRESS", payload: value }),
    setCurrentPassword: (value: string) => dispatch({ type: "SET_CURRENT_PASSWORD", payload: value }),
    setNewPassword: (value: string) => dispatch({ type: "SET_NEW_PASSWORD", payload: value }),
    setRepeatPassword: (value: string) => dispatch({ type: "SET_REPEAT_PASSWORD", payload: value }),
    toggleShowNew: () => dispatch({ type: "TOGGLE_SHOW_NEW" }),
    toggleShowRepeat: () => dispatch({ type: "TOGGLE_SHOW_REPEAT" }),
    resetSecurity: () => dispatch({ type: "RESET_SECURITY" }),
  };
};
