import { useEffect, useMemo, useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    // If your app stores cart in localStorage, keep this logic minimal:
    try {
      const raw = localStorage.getItem("cart");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it?.price || 0), 0);
  }, [items]);

  async function checkout() {
    setErr("");
    const token = getToken();
    if (!token) {
      setErr("Please login first.");
      return;
    }

    try {
      // Keep your existing endpoint/contract:
      await api("/orders", {
        method: "POST",
        body: { items },
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("cart");
      setItems([]);
    } catch (e) {
      setErr(e?.message || "Failed to checkout");
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className="flex items-center justify-between py-6">
          <h1 className={ui.h1}>Cart</h1>
          <div className="text-sm text-neutral-600">Total: {total}</div>
        </div>

        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          {items.length === 0 ? (
            <div className={ui.muted}>Your cart is empty.</div>
          ) : (
            <>
              <ul className="divide-y divide-black/5">
                {items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{it?.title}</div>
                      <div className="text-sm text-neutral-500">{it?.price}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-end">
                <button className={ui.buttonPrimary} onClick={checkout}>
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
