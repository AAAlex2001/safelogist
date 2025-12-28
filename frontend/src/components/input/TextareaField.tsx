"use client";

import styles from "./textareaField.module.scss";

type TextareaFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  name?: string;
  disabled?: boolean;
  rows?: number;
};

export function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  error,
  name,
  disabled = false,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <label className={styles.textareaBlock}>
      <span className={styles.label}>{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-label={label}
      />
    </label>
  );
}
