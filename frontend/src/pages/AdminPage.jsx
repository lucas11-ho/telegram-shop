import { useEffect, useMemo, useState } from "react";
import { api, apiUrl, getToken, setToken, clearToken } from "../lib/api";
import { ui } from "../ui/tokens";
import { Card, CardHeader, CardBody } from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import { Input, Label } from "../ui/components/Input";

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
    if (token) {
      loadAll()
        .then(() => setMode("dashboard"))
        .catch(() => setMode("login"));
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
    setUsers(u);
    setProducts(p);
    setOrders(o);
    setLogs(l);
  }

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

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
        <h1 className={`${ui.h1} mb-4`}>Admin</h1>
        <Card>
          <CardBody className="space-y-4">
            <form onSubmit={login} className="space-y-4">
              <div>
                <Label>Username</Label>
                <div className="mt-1">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="mt-1">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button disabled={busy} className="w-full">
                {busy ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={ui.h1}>Admin dashboard</h1>
        <Button
          variant="secondary"
          onClick={() => {
            clearToken();
            setMode("login");
          }}
        >
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className={ui.h2}>Users</div>
            <div className={`text-sm ${ui.muted}`}>{users.length}</div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-black/5 text-sm">
            {users.map((u) => (
              <div key={u.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">
                    {u.username || u.first_name || `User #${u.id}`}
                  </div>
                  <div className={ui.muted}>
                    id: {u.id} • telegram: {u.telegram_id || "-"} • admin:{" "}
                    {String(u.is_admin)}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => toggleUser(u.id)}>
                  {u.is_active ? "Disable" : "Enable"}
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className={ui.h2}>Products</div>
            <div className={`text-sm ${ui.muted}`}>{products.length}</div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-black/5 text-sm">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className={ui.muted}>
                    id: {p.id} • owner: {p.owner_id} • {p.price} {p.currency}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => toggleProduct(p.id)}>
                  {p.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className={ui.h2}>Orders</div>
            <div className={`text-sm ${ui.muted}`}>{orders.length}</div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-black/5 text-sm">
            {orders.map((o) => (
              <div key={o.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className={ui.muted}>
                    user: {o.user_id} • total: {o.total_price} {o.currency} • status:{" "}
                    {o.payment_status}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {["pending", "paid", "failed", "refunded"].map((s) => (
                    <Button
                      key={s}
                      variant="secondary"
                      className="px-3 py-1"
                      onClick={() => setOrderStatus(o.id, s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className={ui.h2}>Logs</div>
            <div className={`text-sm ${ui.muted}`}>latest</div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-black/5 text-xs text-neutral-700">
            {logs.map((l) => (
              <div key={l.id} className="py-3">
                <div>
                  <span className="font-semibold">{l.action}</span> • user:{" "}
                  {l.user_id || "-"} • {l.created_at}
                </div>
                {l.meta && <div className="text-neutral-500 break-all">{l.meta}</div>}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
