"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./input.module.scss";

type SelectOption = {
  value: string;
  label: string;
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

type InputFieldProps = TextInputProps | TextareaProps | SelectProps;

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

