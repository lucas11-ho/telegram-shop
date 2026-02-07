 import { useEffect, useMemo, useState } from "react";
 import ProductCard from "../components/ProductCard.jsx";
 import { api } from "../lib/api";
 import { ui } from "../ui/tokens";
 import { Input } from "../ui/components/Input";
 import { Card, CardBody } from "../ui/components/Card";

 function loadCart() {
   return JSON.parse(localStorage.getItem("cart") || "[]");
 }
 function saveCart(items) {
   localStorage.setItem("cart", JSON.stringify(items));
 }

 export default function HomePage() {
   const [products, setProducts] = useState([]);
   const [q, setQ] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
     api("/products")
       .then(setProducts)
       .catch((e) => setError(String(e.message || e)));
   }, []);

   const filtered = useMemo(() => {
     const qq = q.trim().toLowerCase();
     if (!qq) return products;
     return products.filter((p) => p.name.toLowerCase().includes(qq));
   }, [products, q]);

   const onAdd = (p) => {
     const cart = loadCart();
     const idx = cart.findIndex((x) => x.product_id === p.id);
     if (idx >= 0) cart[idx].quantity += 1;
     else cart.push({ product_id: p.id, name: p.name, price: p.price, currency: p.currency, quantity: 1 });
     saveCart(cart);
     alert("Added to cart");
   };

   return (
     <div>
-      <div className="flex items-center justify-between gap-3 mb-4">
-        <h1 className="text-xl font-semibold">Shop</h1>
-        <input
-          value={q}
-          onChange={(e) => setQ(e.target.value)}
-          placeholder="Search products..."
-          className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
-        />
-      </div>
+      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
+        <div>
+          <h1 className={ui.h1}>Shop</h1>
+          <div className={`text-sm ${ui.muted} mt-1`}>
+            Browse products and add to cart.
+          </div>
+        </div>
+        <div className="w-full sm:max-w-sm">
+          <Input
+            value={q}
+            onChange={(e) => setQ(e.target.value)}
+            placeholder="Search products..."
+          />
+        </div>
+      </div>

-      {error && <div className="rounded-lg border bg-red-50 p-3 text-sm text-red-700">{error}</div>}
+      {error && (
+        <Card className="border-red-500/20 bg-red-50">
+          <CardBody className="text-sm text-red-700">
+            {error}
+          </CardBody>
+        </Card>
+      )}

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         {filtered.map((p) => (
           <ProductCard key={p.id} product={p} onAdd={onAdd} />
         ))}
       </div>
     </div>
   );
 }
