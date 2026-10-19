import React from "react";
import styles from "./Input.module.css";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  textLabel: string;
  id: string;
  value: string;
  setValue: (value: string) => void;
  icon?: React.ReactNode;
};

export default function Input({
  textLabel,
  id,
  value,
  setValue,
  icon,
  className,
  ...rest
}: InputProps) {
  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      <label htmlFor={id} className={styles.label}>
        {textLabel}
      </label>

      <div className={styles.wrapper}>
        <input
          {...rest}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${styles.input} ${icon ? styles.comIcone : ""}`}
        />
        {icon && <div className={styles.icone}>{icon}</div>}
      </div>
    </div>
  );
}