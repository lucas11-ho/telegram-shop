export function getTelegramWebApp() {
  return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
}

export function getInitData() {
  const tg = getTelegramWebApp();
  return tg?.initData || "";
}
