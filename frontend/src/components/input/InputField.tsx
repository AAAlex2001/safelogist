import styles from "./input.module.scss";

type InputFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  name?: string;
  disabled?: boolean;
};

export function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  name,
  disabled = false,
}: InputFieldProps) {
  return (
    <label className={styles.inputBlock}>
      <span className={styles.label}>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-label={label}
      />
    </label>
  );
}

