// src/lib/api.js
// Centralized API client used across the app.
//
// IMPORTANT:
// - Only VITE_* env vars are exposed to the browser by Vite.
// - Never place secrets (bot tokens, DB passwords, etc.) in VITE_*.

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://admin.lenagames.online").trim();

function joinUrl(base, path) {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

function makeRequestId() {
  // Lightweight request id for correlation across FE/BE logs.
  // Example: r_ks9n1p_1700000000000
  const rand = Math.random().toString(36).slice(2, 8);
  return `r_${rand}_${Date.now()}`;
}

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

export function apiUrl() {
  return API_BASE_URL;
}

export async function api(path, { method = "GET", headers, body, signal } = {}) {
  const token = getToken();
  const url = joinUrl(API_BASE_URL, path);
  const requestId = makeRequestId();

  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    method,
    signal,
    headers: {
      ...(isForm ? {} : body != null ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-Request-ID": requestId,
      ...(headers || {}),
    },
    body: body == null ? undefined : isForm ? body : JSON.stringify(body),
  });

  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      typeof payload === "string"
        ? payload
        : payload?.detail || payload?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.requestId = requestId;
    err.url = url;
    throw err;
  }

  return payload;
}
