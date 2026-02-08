export function Button({ className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium " +
    "border transition focus:outline-none focus:ring-2 focus:ring-black/20";

  const variants = {
    primary: "bg-black text-white border-black hover:bg-black/90",
    secondary: "bg-white text-neutral-900 border-black/10 hover:bg-neutral-50",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-500",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    />
  );
}
