export const ui = {
  page: "min-h-[100dvh] bg-bg text-text",
  container: "mx-auto max-w-6xl px-4 sm:px-6",

  h1: "text-2xl md:text-3xl font-semibold tracking-tight text-text",
  h2: "text-lg md:text-xl font-semibold tracking-tight text-text",
  muted: "text-muted",

  card: "rounded-2xl border border-border/70 bg-surface shadow-elev-1",

  input:
    "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm " +
    "text-text placeholder:text-muted/70 shadow-sm " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",

  buttonBase:
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium " +
    "transition duration-250 ease-premium " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
    "disabled:opacity-50 disabled:cursor-not-allowed",

  buttonPrimary:
    "text-white border border-black/10 bg-gradient-to-b from-accent to-accent-2 " +
    "shadow-elev-1 hover:shadow-elev-2 hover:brightness-[1.03] active:brightness-[0.98]",
};
