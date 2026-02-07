 import { Link, NavLink, useNavigate } from "react-router-dom";
 import { clearToken, getToken, onTokenChange } from "../lib/api";
 import { useEffect, useState } from "react";
+import { ui } from "../ui/tokens";
+import { Button } from "../ui/components/Button";

 export default function Header() {
   const nav = useNavigate();
   const [authed, setAuthed] = useState(!!getToken());

   useEffect(() => {
     return onTokenChange(() => setAuthed(!!getToken()));
   }, []);

   return (
-    <header className="border-b bg-white">
-      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
-        <Link to="/" className="font-semibold text-lg">Telegram Shop</Link>
+    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
+      <div className={`${ui.container} py-4 flex items-center justify-between`}>
+        <Link to="/" className="font-semibold text-lg tracking-tight">Telegram Shop</Link>

-        <nav className="flex items-center gap-3 text-sm">
-          <NavLink to="/" className={({isActive})=>isActive?"font-semibold":""}>Shop</NavLink>
-          <NavLink to="/upload" className={({isActive})=>isActive?"font-semibold":""}>Upload</NavLink>
-          <NavLink to="/cart" className={({isActive})=>isActive?"font-semibold":""}>Cart</NavLink>
-          <NavLink to="/admin" className={({isActive})=>isActive?"font-semibold":""}>Admin</NavLink>
+        <nav className="flex items-center gap-4 text-sm text-neutral-700">
+          <NavLink to="/" className={({isActive})=>isActive?"font-semibold text-neutral-900":"hover:text-neutral-900"}>Shop</NavLink>
+          <NavLink to="/upload" className={({isActive})=>isActive?"font-semibold text-neutral-900":"hover:text-neutral-900"}>Upload</NavLink>
+          <NavLink to="/cart" className={({isActive})=>isActive?"font-semibold text-neutral-900":"hover:text-neutral-900"}>Cart</NavLink>
+          <NavLink to="/admin" className={({isActive})=>isActive?"font-semibold text-neutral-900":"hover:text-neutral-900"}>Admin</NavLink>

           {authed && (
-            <button
-              className="ml-2 rounded px-2 py-1 border hover:bg-gray-50"
-              onClick={() => { clearToken(); nav("/"); }}
-              title="Logout"
-            >
-              Logout
-            </button>
+            <Button
+              variant="secondary"
+              className="ml-2"
+              onClick={() => { clearToken(); nav("/"); }}
+              title="Logout"
+            >
+              Logout
+            </Button>
           )}
         </nav>
       </div>
     </header>
   );
 }
