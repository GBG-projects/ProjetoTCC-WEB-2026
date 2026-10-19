import React from "react";
import styles from "./Button.module.css";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  text?: string;
  variant?: "primary" | "ghost" | "icon";
  children?: React.ReactNode;
};

export default function Button({
  text,
  variant = "primary",
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  return (
    <button
      {...rest}
      type={type ?? (variant === "icon" ? "button" : "submit")}
      className={classes}
    >
      {children ?? text}
    </button>
  );
}