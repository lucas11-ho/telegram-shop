import { ui } from "../tokens";

export function Input({ className = "", ...props }) {
  return <input className={`${ui.input} ${className}`} {...props} />;
}

export function Label({ className = "", children, ...props }) {
  return (
    <label className={`text-sm font-medium text-neutral-700 ${className}`} {...props}>
      {children}
    </label>
  );
}
