export function Button({ className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium " +
    "border transition focus:outline-none focus:ring-2 focus:ring-[#F5D77A]/40";

  const variants = {
    // Gold primary
    primary:
      "bg-[#D4AF37] text-[#0B0F14] border-[#D4AF37] hover:bg-[#C9A227] active:bg-[#B88D12]",
    // Dark secondary
    secondary:
      "bg-[#101826] text-[#F5F7FA] border-[#2B3648] hover:bg-[#141F2F]",
    danger: "bg-[#FB7185] text-[#0B0F14] border-[#FB7185] hover:opacity-90",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    />
  );
}
