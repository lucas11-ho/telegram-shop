export function getTelegramWebApp() {
  return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
}

export function getInitData() {
  const tg = getTelegramWebApp();
  return tg?.initData || "";
}

// Call this once early in app boot when running inside Telegram.
// Safe no-op in normal browsers.
export function initTelegramUI() {
  const tg = getTelegramWebApp();
  if (!tg) return;
  try {
    tg.ready();
    // expand() improves the default viewport height inside Telegram.
    tg.expand();
  } catch {
    // ignore
  }
}

export function closeTelegramWebApp() {
  const tg = getTelegramWebApp();
  try {
    tg?.close();
  } catch {
    // ignore
  }
}
