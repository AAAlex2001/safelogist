"use client";

import styles from "./button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${styles.button} ${fullWidth ? styles.fullWidth : ""}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
    >
      {loading ? (
        <span className={styles.spinner} aria-label="loading" />
      ) : (
        children
      )}
    </button>
  );
}

