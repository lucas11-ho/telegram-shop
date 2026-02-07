import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/api";
import { useEffect, useState } from "react";
import { ui } from "../ui/tokens";

export default function Header() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());

  useEffect(() => {
    const t = setInterval(() => setAuthed(!!getToken()), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-black/5 bg-white">
      <div className={`${ui.container} flex items-center justify-between py-4`}>
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Lucas Shoppyfly 💕
        </Link>

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
