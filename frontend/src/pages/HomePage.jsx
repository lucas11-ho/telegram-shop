import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../lib/api";
import { ui } from "../ui/tokens";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    api("/products")
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setErr("");
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.message || "Failed to fetch");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => (p?.title || "").toLowerCase().includes(s));
  }, [products, q]);

  return (
    <div className={`${ui.page}`}>
      <div className={ui.container}>
        <div className="flex items-center justify-between gap-4 py-6">
          <h1 className={ui.h1}>Shop</h1>
          <input
            className={ui.input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
          />
        </div>

        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
