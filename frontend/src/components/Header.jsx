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

  const linkClass = (isActive) =>
    isActive
      ? "font-semibold text-[#F5F7FA]"
      : "text-[#C7CDD8] hover:text-[#F5F7FA]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#1F2A37] bg-[#0F1520]/80 backdrop-blur">
      <div className={`${ui.container} flex items-center justify-between py-3`}>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#0B0F14] text-sm">TS</span>
          <span>
            Telegram <span className="text-[#F5D77A]">Shop</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            Shop
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => linkClass(isActive)}>
            Upload
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => linkClass(isActive)}>
            Cart
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
            Profile
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => linkClass(isActive)}>
            Admin
          </NavLink>

          {authed && (
            <button
              className="ml-2 rounded-lg border border-[#2B3648] bg-[#101826] px-3 py-1.5 text-sm text-[#F5F7FA] hover:bg-[#141F2F]"
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
