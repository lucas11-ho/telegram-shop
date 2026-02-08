import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/api";
import { useEffect, useState } from "react";
import { ui } from "../ui/tokens";

export default function Header() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());
  const buildId = (import.meta.env.VITE_BUILD_ID || "").trim();

  useEffect(() => {
    const t = setInterval(() => setAuthed(!!getToken()), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-black/5 bg-white">
      <div className={`${ui.container} flex items-center justify-between py-4`}>
        <div className="flex items-baseline gap-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Telegram Shop
          </Link>
          {buildId ? (
            <span className="rounded-md border border-black/10 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-600" title="Build ID">
              build:{buildId}
            </span>
          ) : null}
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "font-semibold" : "text-neutral-600 hover:text-neutral-900")}>
            Shop
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? "font-semibold" : "text-neutral-600 hover:text-neutral-900")}>
            Upload
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "font-semibold" : "text-neutral-600 hover:text-neutral-900")}>
            Cart
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "font-semibold" : "text-neutral-600 hover:text-neutral-900")}>
            Admin
          </NavLink>

          {authed && (
            <button
              className="ml-2 rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-neutral-50"
              onClick={() => {
                clearToken();
                nav("/");
                setAuthed(false);
              }}
              title="Logout"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
