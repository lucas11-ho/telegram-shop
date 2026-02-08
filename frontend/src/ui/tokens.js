// Luxury dark design tokens (Tailwind class strings)
// Single accent: gold (#D4AF37).

export const ui = {
  // Layout
  page: "min-h-[100dvh] bg-[#0B0F14] text-[#F5F7FA]",
  container: "mx-auto max-w-6xl px-4 md:px-6",

  // Typography
  h1: "text-2xl md:text-3xl font-semibold tracking-tight",
  h2: "text-lg md:text-xl font-semibold tracking-tight",
  muted: "text-[#98A2B3]",

  // Surfaces
  card:
    "rounded-2xl border border-[#1F2A37] bg-[#101826] shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
  cardHeader: "px-6 pt-6",
  cardBody: "px-6 pb-6",

  // Inputs
  input:
    "w-full rounded-xl border border-[#2B3648] bg-[#0F1520] px-4 py-3 text-sm text-[#F5F7FA] " +
    "placeholder:text-[#667085] shadow-[0_1px_0_rgba(0,0,0,0.2)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#F5D77A] focus:border-[#D4AF37]",
  textarea:
    "w-full min-h-[120px] rounded-xl border border-[#2B3648] bg-[#0F1520] px-4 py-3 text-sm text-[#F5F7FA] " +
    "placeholder:text-[#667085] shadow-[0_1px_0_rgba(0,0,0,0.2)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#F5D77A] focus:border-[#D4AF37]",

  // Buttons
  buttonPrimary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold " +
    "bg-[#D4AF37] text-[#0B0F14] shadow-sm hover:bg-[#C9A227] active:bg-[#B88D12] " +
    "focus:outline-none focus:ring-2 focus:ring-[#F5D77A] disabled:opacity-60",
  buttonSecondary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold " +
    "bg-[#101826] text-[#F5F7FA] border border-[#2B3648] hover:bg-[#141F2F] active:bg-[#0F1520] " +
    "focus:outline-none focus:ring-2 focus:ring-[#F5D77A] disabled:opacity-60",

  // Header
  header:
    "sticky top-0 z-10 border-b border-[#1F2A37] bg-[#0B0F14]/80 backdrop-blur " +
    "shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
  navLink:
    "text-sm font-medium text-[#C7CDD8] hover:text-[#F5F7FA] px-2 py-1 rounded-lg " +
    "hover:bg-[#101826]",
  navLinkActive: "text-[#F5F7FA] bg-[#101826]",
};
