import { ui } from "../tokens";

export function Card({ className = "", children }) {
  return <div className={`${ui.card} ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }) {
  return <div className={`${ui.cardHeader} ${className}`}>{children}</div>;
}

export function CardBody({ className = "", children }) {
  return <div className={`${ui.cardBody} ${className}`}>{children}</div>;
}
