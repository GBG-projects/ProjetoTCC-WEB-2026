import styles from './input.module.css';

type InputProps<T extends string | number> = {
    fontSize?: number,
    className?: string,
    textLabel: string | number,
    type?: string,
    placeholder?: string,
    value?: T,
    id?: string,
    required?: boolean,
    setValue: (value: T) => void;
    icon?: React.ReactNode;
    disable?: boolean,
}

export default function Input<T extends string | number>({
    textLabel, type = 'text', placeholder = '', value, id = '', setValue, required, className, icon, disable
}: InputProps<T>) {
    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            <label htmlFor={id}>{textLabel}</label>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value as any}
                    id={id}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (type === 'number') {
                            setValue((v === '' ? 0 : Number(v)) as T);
                        } else {
                            setValue(v as T);
                        }
                    }}
                    required={required}
                    disabled={disable}
                />
                {icon}
            </div>
        </div>
    );
}