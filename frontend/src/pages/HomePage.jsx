import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../lib/api";
import { ui } from "../ui/tokens";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    api("/products")
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.products)
              ? data.products
              : [];
        setProducts(list);
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
    return products.filter((p) => {
      const title = p?.name || p?.title || "";
      const desc = p?.description || "";
      return `${title} ${desc}`.toLowerCase().includes(s);
    });
  }, [products, q]);

  function addToCart(product) {
    try {
      const current = JSON.parse(localStorage.getItem("cart") || "[]");
      const product_id = product?.id;
      const name = product?.name || product?.title || "Untitled";
      // backend may return price as string; keep numeric for totals
      const price = Number.parseFloat(product?.price) || 0;
      const currency = product?.currency || "USD";
      const existingIdx = current.findIndex((x) => x?.product_id === product_id);
      if (existingIdx >= 0) {
        current[existingIdx].quantity = (current[existingIdx].quantity || 1) + 1;
      } else {
        current.push({ product_id, name, price, currency, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(current));
      setNotice("Added to cart");
      window.setTimeout(() => setNotice(""), 1200);
    } catch {
      setErr("Could not update cart");
    }
  }

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
          <div className="mb-4 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 px-4 py-3 text-sm text-[#FB7185]">
            {err}
          </div>
        )}

        {notice && (
          <div className="mb-4 rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-3 text-sm text-[#2DD4BF]">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}
