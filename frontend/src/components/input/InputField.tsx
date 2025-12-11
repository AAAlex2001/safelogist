import styles from "./input.module.scss";

type InputFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
};

export function InputField({ label, placeholder, type = "text" }: InputFieldProps) {
  return (
    <label className={styles.inputBlock}>
      <span className={styles.label}>{label}</span>
      <input type={type} placeholder={placeholder} className={styles.input} />
    </label>
  );
}

