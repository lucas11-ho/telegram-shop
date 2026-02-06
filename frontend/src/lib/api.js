const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://admin.lenagames.online";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

export async function api(path, { method = "GET", headers, body } = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export function apiUrl() {
  return API_URL;
}

console.log(import.meta.env.VITE_API_BASE_URL);  // Log the value
