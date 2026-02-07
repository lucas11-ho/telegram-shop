import { useEffect, useRef } from "react";

// Telegram Login Widget only works in regular browsers (not inside Telegram WebApp).
// It will call window.onTelegramAuth(user) with widget payload.

export default function TelegramLoginWidget({ botUsername }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!botUsername) return;
    // Clean container
    if (ref.current) ref.current.innerHTML = "";

    // Create script tag with attributes
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    // Telegram expects the bot username WITHOUT leading '@'.
    s.setAttribute("data-telegram-login", String(botUsername).replace(/^@/, ""));
    s.setAttribute("data-size", "large");
    s.setAttribute("data-userpic", "true");
    s.setAttribute("data-request-access", "write");
    s.setAttribute("data-onauth", "onTelegramAuth(user)");
    if (ref.current) ref.current.appendChild(s);
  }, [botUsername]);

  return <div ref={ref} />;
}
