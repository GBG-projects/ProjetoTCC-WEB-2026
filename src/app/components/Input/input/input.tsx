import styles from './input.module.css';

type inputProps = {
    fontSize?: number,
    className?: string,
    textLabel: string,
    type: string,
    placeholder: string,
    value: string,
    id: string,
    required?: boolean,
    setValue: (value: string) => void;
    icon?: React.ReactNode;
    disable?: boolean;
}

export default function Input({ textLabel, type, placeholder, value, id, setValue, required, className, icon , disable}: inputProps) {
    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            <label htmlFor={id}>{textLabel}</label>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    id={id}
                    onChange={(e) => setValue(e.target.value)}
                    required={required}
                    disabled={disable}
                />
                {icon}
            </div>
        </div>
    );
}