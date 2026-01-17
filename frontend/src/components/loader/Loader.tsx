import styles from "./loader.module.scss";

type LoaderProps = {
  size?: "small" | "medium" | "large";
  color?: "white" | "primary";
  className?: string;
};

export function Loader({ size = "medium", color = "white", className = "" }: LoaderProps) {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  const colorClass = color === "primary" ? styles.primary : styles.white;

  return (
    <span 
      className={`${styles.loader} ${sizeClass} ${colorClass} ${className}`}
      aria-label="loading"
      role="status"
    />
  );
}
