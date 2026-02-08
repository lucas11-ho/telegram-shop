// Minimal design tokens (Tailwind class strings)
// Target look: Facebook-like premium (soft gray canvas + crisp white cards + one accent).

export const ui = {
  // Layout
  page: "min-h-[100dvh] bg-[#F0F2F5] text-neutral-900",
  container: "mx-auto max-w-5xl px-4",

  // Typography
  h1: "text-2xl md:text-3xl font-semibold tracking-tight",
  h2: "text-lg md:text-xl font-semibold tracking-tight",
  muted: "text-neutral-600",

  // Surfaces
  card: "rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
  cardHeader: "px-6 pt-6",
  cardBody: "px-6 pb-6",

  // Inputs
  input:
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm " +
    "placeholder:text-neutral-400 shadow-[0_1px_0_rgba(0,0,0,0.02)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#1877F2]/30 focus:border-[#1877F2]/40",
  textarea:
    "w-full min-h-[120px] rounded-xl border border-black/10 bg-white px-4 py-3 text-sm " +
    "placeholder:text-neutral-400 shadow-[0_1px_0_rgba(0,0,0,0.02)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#1877F2]/30 focus:border-[#1877F2]/40",

  // Buttons
  buttonPrimary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold " +
    "bg-[#1877F2] text-white shadow-sm hover:bg-[#166FE5] active:bg-[#135FC5] " +
    "focus:outline-none focus:ring-2 focus:ring-[#1877F2]/30 disabled:opacity-60",
  buttonSecondary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold " +
    "bg-white text-neutral-900 border border-black/10 hover:bg-black/5 active:bg-black/10 " +
    "focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60",

  // Header
  header:
    "sticky top-0 z-10 border-b border-black/5 bg-white/90 backdrop-blur " +
    "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
  navLink:
    "text-sm font-medium text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded-lg " +
    "hover:bg-black/5",
  navLinkActive: "text-neutral-900 bg-black/5",
};
