import { useEffect, useMemo, useState } from "react";
import { api, getToken } from "../lib/api";

function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export default function CartPage() {
  const authed = useMemo(() => !!getToken(), []);
  const [items, setItems] = useState(loadCart());
  const [busy, setBusy] = useState(false);

  useEffect(() => saveCart(items), [items]);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const inc = (i) => setItems((prev) => prev.map((x, idx) => idx===i ? { ...x, quantity: x.quantity+1 } : x));
  const dec = (i) => setItems((prev) => prev.map((x, idx) => idx===i ? { ...x, quantity: Math.max(1, x.quantity-1) } : x));
  const remove = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const clear = () => setItems([]);

  const checkout = async () => {
    if (!authed) return alert("Login required");
    if (!items.length) return;
    setBusy(true);
    try {
      const currency = items[0].currency || "USD";
      const body = { currency, items: items.map((x) => ({ product_id: x.product_id, quantity: x.quantity })) };
      const order = await api("/orders", { method: "POST", body });
      alert(`Order created (#${order.id}). Payment status: ${order.payment_status}.\n\nSeller payment instructions are on each product page in a full app.`);
      clear();
    } catch (e) {
      alert(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Cart</h1>
        <button className="text-sm text-gray-600 hover:underline" onClick={clear}>Clear</button>
      </div>

      {!items.length && (
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">Your cart is empty.</div>
      )}

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={`${it.product_id}-${i}`} className="rounded-xl border bg-white p-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-600">{it.price} {it.currency}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded border px-2 py-1" onClick={() => dec(i)}>-</button>
              <div className="w-8 text-center text-sm">{it.quantity}</div>
              <button className="rounded border px-2 py-1" onClick={() => inc(i)}>+</button>
              <button className="ml-2 text-sm text-red-600 hover:underline" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-4 rounded-xl border bg-white p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">Total: <span className="font-semibold">{total.toFixed(2)} {items[0].currency}</span></div>
          <button disabled={busy} className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-60" onClick={checkout}>
            {busy ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}

      {!authed && items.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">Login is required to create an order.</div>
      )}
    </div>
  );
}
