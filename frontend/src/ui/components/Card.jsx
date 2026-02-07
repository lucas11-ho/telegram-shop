// Premium UI tokens (Tailwind class tokens)
export const ui = {
  page: "min-h-screen bg-[#FAFAFA] text-neutral-900",
  container: "mx-auto max-w-5xl px-4",

  // Typography
  h1: "text-2xl md:text-3xl font-semibold tracking-tight",
  h2: "text-lg md:text-xl font-semibold tracking-tight",
  muted: "text-neutral-500",

  // Surfaces
  card: "rounded-2xl border border-black/5 bg-white shadow-sm",
  cardHeader: "px-5 pt-5",
  cardBody: "px-5 pb-5",

  // Controls
  input:
    "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm " +
    "placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10",
  buttonBase:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium " +
    "transition focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed",
  buttonPrimary: "bg-black text-white hover:bg-black/90",
  buttonSecondary: "border border-black/10 bg-white hover:bg-black/5",
  buttonDanger: "border border-red-500/20 bg-red-50 text-red-700 hover:bg-red-100",
};
