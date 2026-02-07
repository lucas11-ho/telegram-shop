export function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm " +
        "placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/20 " +
        className
      }
      {...props}
    />
  );
}

// Small helper so pages can import { Label } from "../ui/components/Input".
export function Label({ className = "", ...props }) {
  return (
    <label
      className={
        "block text-sm font-medium text-neutral-900 " +
        "" +
        className
      }
      {...props}
    />
  );
}
