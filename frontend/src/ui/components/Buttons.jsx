import { ui } from "../tokens";

export function Button({ variant = "primary", className = "", ...props }) {
  const v =
    variant === "secondary"
      ? ui.buttonSecondary
      : variant === "danger"
      ? ui.buttonDanger
      : ui.buttonPrimary;

  return <button className={`${ui.buttonBase} ${v} ${className}`} {...props} />;
}
