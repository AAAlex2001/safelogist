"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./input.module.scss";
import { Loader } from "@/components/loader/Loader";

type SelectOption = {
  value: string;
  label: string;
};

type AutocompleteItem = {
  id: string | number;
  label: string;
  value: any;
};

type BaseProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  name?: string;
  disabled?: boolean;
  variant?: "default" | "white";
};

type TextInputProps = BaseProps & {
  type?: "text" | "email" | "password" | "tel" | "number";
};

type TextareaProps = BaseProps & {
  type: "textarea";
  rows?: number;
};

type SelectProps = BaseProps & {
  type: "select";
  options: SelectOption[];
};

type AutocompleteProps = BaseProps & {
  type: "autocomplete";
  items: AutocompleteItem[];
  loading?: boolean;
  showDropdown?: boolean;
  onSelect?: (item: AutocompleteItem) => void;
  onClose?: () => void;
  loadingText?: string;
  emptyText?: string;
};

type InputFieldProps = TextInputProps | TextareaProps | SelectProps | AutocompleteProps;

export function InputField(props: InputFieldProps) {
  const {
    label,
    placeholder = "",
    value = "",
    onChange,
    error,
    name,
    disabled = false,
    variant = "default",
  } = props;

  const type = "type" in props ? props.type : "text";
  const variantClass = variant === "white" ? styles.inputWhite : "";
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (type === "autocomplete" && "onClose" in props && props.onClose) {
          props.onClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [type, props]);

  if (type === "textarea") {
    const { rows = 4 } = props as TextareaProps;
    return (
      <label className={styles.inputBlock}>
        <span className={styles.label}>{label}</span>
        <textarea
          name={name}
          placeholder={placeholder}
          className={`${styles.input} ${styles.textarea} ${variantClass} ${error ? styles.inputError : ""}`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          rows={rows}
          aria-invalid={Boolean(error)}
        />
        {error && <span className={styles.error}>{error}</span>}
      </label>
    );
  }

  if (type === "autocomplete") {
    const { items, loading = false, showDropdown = false, onSelect, loadingText = "Загрузка...", emptyText = "Нет данных" } = props as AutocompleteProps;

    return (
      <div className={styles.inputBlock} ref={ref}>
        <span className={styles.label}>{label}</span>
        <div className={`${styles.autocompleteWrapper} ${showDropdown ? styles.autocompleteWrapperOpen : ""}`}>
          <input
            name={name}
            type="text"
            placeholder={placeholder}
            className={`${styles.input} ${styles.autocompleteInput} ${variantClass} ${error ? styles.inputError : ""}`}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            autoComplete="off"
          />
          {showDropdown && (
            <div className={styles.selectDropdown}>
              {loading ? (
                <div className={styles.selectLoading}>
                  <Loader size="medium" color="primary" />
                </div>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.selectOption}
                    onClick={() => onSelect?.(item)}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className={styles.selectEmpty}>{emptyText}</div>
              )}
            </div>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  if (type === "select") {
    const { options } = props as SelectProps;
    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div className={styles.inputBlock} ref={ref}>
        <span className={styles.label}>{label}</span>
        <button
          type="button"
          className={`${styles.input} ${styles.select} ${variantClass} ${isOpen ? styles.selectOpen : ""} ${error ? styles.inputError : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={selectedOption ? styles.selectValue : styles.selectPlaceholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ""}`}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className={styles.selectDropdown}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.selectOption} ${option.value === value ? styles.selectOptionActive : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  if (type === "password") {
    return (
      <div className={styles.inputBlock}>
        <span className={styles.label}>{label}</span>
        <div className={styles.passwordWrapper}>
          <input
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`${styles.input} ${styles.passwordInput} ${variantClass} ${error ? styles.inputError : ""}`}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(error)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return (
    <label className={styles.inputBlock}>
      <span className={styles.label}>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${variantClass} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

function EyeOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.9974 9.99788C12.9974 11.5867 11.653 12.8747 9.99457 12.8747C8.33617 12.8747 6.99177 11.5867 6.99177 9.99788C6.99177 8.40901 8.33617 7.12101 9.99457 7.12101C11.653 7.121 12.9974 8.40903 12.9974 9.99788ZM10 4.00781C8.28292 4.01543 6.5031 4.43345 4.81827 5.23376C3.5673 5.85246 2.34817 6.72536 1.2899 7.80278C0.770133 8.35276 0.107183 9.14913 0 9.99881C0.0126667 10.7348 0.802167 11.6433 1.2899 12.1949C2.28228 13.23 3.46967 14.0785 4.81827 14.7645C6.38945 15.527 8.12853 15.966 10 15.9905C11.7187 15.9827 13.4981 15.5599 15.1811 14.7645C16.4321 14.1458 17.6518 13.2723 18.7101 12.1949C19.2299 11.6449 19.8928 10.8485 20 9.99881C19.9873 9.2628 19.1978 8.3543 18.7101 7.80275C17.7177 6.76765 16.5297 5.91976 15.1811 5.23373C13.6107 4.4718 11.8674 4.0358 10 4.00781ZM9.99873 5.49528C12.6007 5.49528 14.71 7.51185 14.71 9.99946C14.71 12.4871 12.6007 14.5036 9.99873 14.5036C7.39675 14.5036 5.28748 12.487 5.28748 9.99946C5.28748 7.51185 7.39675 5.49528 9.99873 5.49528Z" fill="#959595"/>
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.521 1.47833C18.3335 1.29086 18.0792 1.18555 17.814 1.18555C17.5488 1.18555 17.2945 1.29086 17.107 1.47833L1.48 17.1073C1.38449 17.1996 1.30831 17.3099 1.2559 17.4319C1.20349 17.5539 1.1759 17.6852 1.17475 17.8179C1.1736 17.9507 1.1989 18.0824 1.24918 18.2053C1.29946 18.3282 1.37371 18.4398 1.4676 18.5337C1.5615 18.6276 1.67315 18.7019 1.79605 18.7522C1.91894 18.8024 2.05062 18.8277 2.1834 18.8266C2.31618 18.8254 2.4474 18.7978 2.5694 18.7454C2.69141 18.693 2.80175 18.6168 2.894 18.5213L18.52 2.89233C18.7075 2.70481 18.8128 2.4505 18.8128 2.18533C18.8128 1.92017 18.7085 1.66586 18.521 1.47833ZM3.108 13.4983L5.668 10.9383C5.59517 10.6309 5.55727 10.3163 5.555 10.0003C5.555 7.62133 7.545 5.69133 10 5.69133C10.286 5.69133 10.564 5.72333 10.835 5.77333L12.038 4.57133C11.3642 4.46124 10.6827 4.40439 10 4.40133C3.44 4.40033 0 9.23133 0 10.0003C0 10.4233 1.057 12.0913 3.108 13.4983ZM16.895 6.50533L14.333 9.06533C14.402 9.36733 14.444 9.67833 14.444 10.0003C14.444 12.3793 12.455 14.3073 10 14.3073C9.716 14.3073 9.44 14.2753 9.171 14.2263L7.967 15.4293C8.609 15.5333 9.283 15.5993 10 15.5993C16.56 15.5993 20 10.7663 20 10.0003C20 9.57633 18.944 7.91033 16.895 6.50533Z" fill="#959595"/>
    </svg>
  );
}

