"use client";

import styles from "./button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "outline" | "tariff";
  as?: "button" | "label";
};

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = "primary",
  as = "button",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classNames = [
    styles.button,
    fullWidth ? styles.fullWidth : "",
    variant === "outline" ? styles.outline : "",
    variant === "tariff" ? styles.tariff : "",
  ].filter(Boolean).join(" ");

  const content = loading ? (
    <span className={styles.spinner} aria-label="loading" />
  ) : (
    children
  );

  if (as === "label") {
    return (
      <label className={classNames} style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}>
        {content}
      </label>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}

