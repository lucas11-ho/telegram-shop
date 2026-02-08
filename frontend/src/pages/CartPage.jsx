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
    return items.reduce((sum, it) => {
      const price = Number.parseFloat(it?.price) || 0;
      const qty = Number(it?.quantity || 1) || 1;
      return sum + price * qty;
    }, 0);
  }, [items]);

  const currency = items?.[0]?.currency || "USD";

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
          <div className="text-sm text-[#C7CDD8]">Total: {total} {currency}</div>
        </div>

        {err && (
          <div className="mb-4 rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 px-4 py-3 text-sm text-[#FB7185]">
            {err}
          </div>
        )}

        <div className={ui.card + " p-6"}>
          {items.length === 0 ? (
            <div className={ui.muted}>Your cart is empty.</div>
          ) : (
            <>
              <ul className="divide-y divide-[#1F2A37]">
                {items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{it?.name}</div>
                      <div className="text-sm text-[#98A2B3]">
                        {it?.price} {it?.currency} · qty {it?.quantity || 1}
                      </div>
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
