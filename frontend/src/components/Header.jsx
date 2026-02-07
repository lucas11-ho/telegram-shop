import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken, onTokenChange } from "../lib/api";
import { useEffect, useState } from "react";
import { ui } from "../ui/tokens";

export default function Header() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());

  useEffect(() => {
    const off = onTokenChange?.(() => setAuthed(!!getToken()));
    return () => off?.();
  }, []);

  function logout() {
    clearToken();
    setAuthed(false);
    nav("/");
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <div className={`${ui.container} flex items-center justify-between py-4`}>
        <Link to="/" className="font-semibold tracking-tight">
          Telegram Shop
        </Link>

        <nav className="flex items-center gap-3 text-sm">
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
              className={`${ui.buttonBase} ${ui.buttonSecondary} ml-2`}
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
