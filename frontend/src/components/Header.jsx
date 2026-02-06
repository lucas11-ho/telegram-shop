import { Link, NavLink, useNavigate } from "react-router-dom";
import { setToken, getToken } from "../lib/api";

export default function Header() {
  const nav = useNavigate();
  const authed = !!getToken();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Telegram Shop</Link>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/" className={({isActive})=>isActive?"font-semibold":""}>Shop</NavLink>
          <NavLink to="/upload" className={({isActive})=>isActive?"font-semibold":""}>Upload</NavLink>
          <NavLink to="/cart" className={({isActive})=>isActive?"font-semibold":""}>Cart</NavLink>
          <NavLink to="/admin" className={({isActive})=>isActive?"font-semibold":""}>Admin</NavLink>
          {authed && (
            <button
              className="ml-2 rounded px-2 py-1 border hover:bg-gray-50"
              onClick={() => { setToken(""); nav("/"); }}
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
