const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function join(base, path) {
  return `${base.replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
}

export function apiUrl() {
  if (!API_BASE_URL) throw new Error("VITE_API_BASE_URL is missing");
  return API_BASE_URL;
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem("token", token);
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem("token");
  } catch {}
}

function requestId() {
  try {
    return crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
}

export async function api(path, { method = "GET", headers, body } = {}) {
  const base = apiUrl();
  const token = getToken();

  const res = await fetch(join(base, path), {
    method,
    headers: {
      "X-Request-ID": requestId(),
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });

  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      typeof payload === "string"
        ? payload
        : (payload?.detail || payload?.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return payload;
}
