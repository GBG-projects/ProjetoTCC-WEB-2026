import styles from './button.module.css';

type buttonProps = {
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children?: React.ReactNode;
    variant?: 'primary' | 'icon';
    className?: string;
    disabled?: boolean;
}

export default function Button({ text, onClick, type, children, variant = 'primary', className , disabled}: buttonProps) {
  return (
    <button 
      className={`${variant === 'icon' ? styles.iconButton : styles.button} ${className || ''}`}
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {children || text}
    </button>
  )
}