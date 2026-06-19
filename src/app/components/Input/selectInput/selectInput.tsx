import styles from './select.module.css';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  fontSize?: number;
  className?: string;
  textLabel: string;
  value: string;
  id: string;
  required?: boolean;
  setValue: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disable?: boolean;
};

export default function Select({
  textLabel,
  value,
  id,
  setValue,
  required,
  className,
  options,
  placeholder,
  disable,
}: SelectProps) {
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <label htmlFor={id}>{textLabel}</label>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={value}
          id={id}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          disabled={disable}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}