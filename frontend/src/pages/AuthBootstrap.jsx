import { useEffect, useState } from "react";
import TelegramLoginWidget from "../components/TelegramLoginWidget.jsx";
import { api, getToken, setToken } from "../lib/api";
import { getInitData, initTelegramUI } from "../lib/telegram";

/**
 * If running inside Telegram WebApp: auto-login by verifying initData.
 * If in normal browser: show Telegram Login Widget to obtain widget payload,
 * then verify it via backend.
 */
export default function AuthBootstrap() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("unknown"); // webapp | widget | none
  const [token, setTokenState] = useState(() => getToken());

  useEffect(() => {
    async function run() {
      try {
        // No-op in regular browsers. Helps layout + lifecycle inside Telegram.
        initTelegramUI();

        if (token) {
          setMode("done");
          setReady(true);
          return;
        }
        const initData = getInitData();
        if (initData) {
          setMode("webapp");
          const data = await api("/auth/webapp", { method: "POST", body: { init_data: initData } });
          setToken(data.access_token);
          setTokenState(data.access_token);
          setMode("done");
        } else {
          setMode("widget");
          // widget flow handled via global callback below
        }
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Telegram widget callback must be global string `onTelegramAuth(user)`
  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      try {
        const data = await api("/auth/telegram-widget", { method: "POST", body: user });
        setToken(data.access_token);
        setTokenState(data.access_token);
        setMode("done");
      } catch (e) {
        alert("Telegram login failed. Check backend TELEGRAM_BOT_TOKEN and bot username.");
        console.error(e);
      }
    };
    return () => { delete window.onTelegramAuth; };
  }, []);

  if (!ready) return null;
  if (mode !== "widget" || token) return null;

  const botUsername = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "").trim();
  if (!botUsername) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4">
      <div className="rounded-xl border bg-white p-4 flex items-center justify-between gap-4">
        <div>
          <div className="font-medium">Login with Telegram</div>
          <div className="text-sm text-gray-600">If you're not opening this inside Telegram, use the widget to login.</div>
        </div>
        <TelegramLoginWidget botUsername={botUsername} />
      </div>
    </div>
  );
}
