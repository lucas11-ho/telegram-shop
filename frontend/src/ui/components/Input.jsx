export function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-[#2B3648] bg-[#0F1520] px-3 py-2 text-sm text-[#F5F7FA] " +
        "placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] " +
        className
      }
      {...props}
    />
  );
}


export function Label({ children, className = "", ...props }) {
  return (
    <label className={`block text-sm font-medium text-[#C7CDD8] mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
