import Button from './Button';
import styles from './button.module.css';

type ConfirmButtonProps = {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function ConfirmButton({
  text = 'Confirmar',
  type = 'button',
  onClick,
  disabled,
  className,
}: ConfirmButtonProps) {
  return (
    <Button
      text={text}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.confirmButton} ${className || ''}`.trim()}
    />
  );
}
