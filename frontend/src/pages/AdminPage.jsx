import { useEffect, useMemo, useState } from "react";
import { api, apiUrl, getToken, setToken } from "../lib/api";

export default function AdminPage() {
  const [mode, setMode] = useState("login"); // login | dashboard
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    // naive: try load dashboard if token exists
    if (token) {
      loadAll().then(() => setMode("dashboard")).catch(()=>setMode("login"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    const [u, p, o, l] = await Promise.all([
      api("/admin/users"),
      api("/admin/products"),
      api("/admin/orders"),
      api("/admin/logs?limit=100"),
    ]);
    setUsers(u); setProducts(p); setOrders(o); setLogs(l);
  }

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);
      // Use the same base URL as the shared api() helper.
      const res = await fetch(`${apiUrl().replace(/\/+$/, "")}/auth/admin/login`, {
        method: "POST",
        body: form,
        headers: { "X-Request-ID": `admin_${Date.now()}` },
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const data = await res.json().catch(() => null);
      if (!data?.access_token) throw new Error("Invalid login response (missing access_token)");
      setToken(data.access_token);
      await loadAll();
      setMode("dashboard");
    } catch (e) {
      alert(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function toggleUser(id) {
    await api(`/admin/users/${id}/toggle-active`, { method: "PATCH" });
    await loadAll();
  }

  async function toggleProduct(id) {
    await api(`/admin/products/${id}/toggle-active`, { method: "PATCH" });
    await loadAll();
  }

  async function setOrderStatus(id, status) {
    await api(`/admin/orders/${id}/set-status?status=${status}`, { method: "PATCH" });
    await loadAll();
  }

  if (mode === "login") {
    return (
      <div className="max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Admin</h1>
        <form onSubmit={login} className="rounded-xl border bg-white p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button disabled={busy} className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-60">
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin dashboard</h1>
        <button className="text-sm rounded border px-2 py-1 hover:bg-gray-50" onClick={()=>{ setToken(""), location.reload(); }}>Logout</button>
      </div>

      <section className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-3">Users</div>
        <div className="space-y-2 text-sm">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{u.username || u.first_name || `User #${u.id}`}</div>
                <div className="text-gray-600">id: {u.id} • telegram: {u.telegram_id || "-"} • admin: {String(u.is_admin)}</div>
              </div>
              <button className="rounded border px-2 py-1 hover:bg-gray-50" onClick={()=>toggleUser(u.id)}>
                {u.is_active ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-3">Products</div>
        <div className="space-y-2 text-sm">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-600">id: {p.id} • owner: {p.owner_id} • {p.price} {p.currency}</div>
              </div>
              <button className="rounded border px-2 py-1 hover:bg-gray-50" onClick={()=>toggleProduct(p.id)}>
                {p.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-3">Orders</div>
        <div className="space-y-2 text-sm">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-gray-600">user: {o.user_id} • total: {o.total_price} {o.currency} • status: {o.payment_status}</div>
              </div>
              <div className="flex gap-2">
                {["pending","paid","failed","refunded"].map((s) => (
                  <button key={s} className="rounded border px-2 py-1 hover:bg-gray-50" onClick={()=>setOrderStatus(o.id, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-3">Logs (latest)</div>
        <div className="space-y-2 text-xs text-gray-700">
          {logs.map((l) => (
            <div key={l.id} className="border-b pb-2">
              <div><span className="font-semibold">{l.action}</span> • user: {l.user_id || "-"} • {l.created_at}</div>
              {l.meta && <div className="text-gray-500 break-all">{l.meta}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
