"use client";

import styles from "./button.module.scss";
import { ArrowRightCtaIcon } from "@/icons";
import { Loader } from "@/components/loader/Loader";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "outline" | "tariff";
  as?: "button" | "label";
  showArrow?: boolean;
  className?: string;
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
  showArrow = false,
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classNames = [
    styles.button,
    fullWidth ? styles.fullWidth : "",
    variant === "outline" ? styles.outline : "",
    variant === "tariff" ? styles.tariff : "",
    className,
  ].filter(Boolean).join(" ");

  const content = loading ? (
    <Loader size="medium" color="white" />
  ) : (
    <>
      {children}
      {showArrow && <ArrowRightCtaIcon className={styles.arrow} />}
    </>
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

