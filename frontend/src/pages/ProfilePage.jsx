import { useEffect, useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens";
import { Card, CardHeader, CardBody } from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import { Input, Label } from "../ui/components/Input";

function normalizeProfile(payload) {
  // Accept a few shapes:
  // 1) { user: { telegram_id, username, ... }, profile: {...} }
  // 2) { telegram_id, username, display_name, bio, avatar_url }
  // 3) { me: {...} }
  if (!payload || typeof payload !== "object") return null;
  const root = payload.me || payload.user || payload;
  const profile = payload.profile && typeof payload.profile === "object" ? payload.profile : {};
  return {
    telegram_id: root.telegram_id ?? root.telegramId ?? "",
    username: root.username ?? "",
    display_name: profile.display_name ?? root.display_name ?? "",
    bio: profile.bio ?? root.bio ?? "",
    avatar_url: profile.avatar_url ?? root.avatar_url ?? "",
    contact: profile.contact ?? root.contact ?? "",
  };
}

export default function ProfilePage() {
  const authed = !!getToken();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState("");
  const [profile, setProfile] = useState({
    telegram_id: "",
    username: "",
    display_name: "",
    bio: "",
    avatar_url: "",
    contact: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      setSaved("");

      if (!authed) {
        setLoading(false);
        return;
      }

      try {
        // Prefer new endpoint if it exists, otherwise fall back to /me
        let payload;
        try {
          payload = await api("/profile/me");
        } catch {
          payload = await api("/me");
        }

        const p = normalizeProfile(payload);
        if (!cancelled && p) setProfile((prev) => ({ ...prev, ...p }));
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function save() {
    setErr("");
    setSaved("");
    try {
      const payload = {
        display_name: profile.display_name || null,
        bio: profile.bio || null,
        avatar_url: profile.avatar_url || null,
        contact: profile.contact || null,
      };

      // Prefer new endpoint if it exists
      try {
        await api("/profile/me", { method: "PUT", body: JSON.stringify(payload) });
      } catch {
        await api("/me/profile", { method: "PUT", body: JSON.stringify(payload) });
      }
      setSaved("Saved");
    } catch (e) {
      setErr(e?.message || "Failed to save profile");
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className="py-8">
          <h1 className={ui.h1}>Profile</h1>
          <p className={ui.muted}>
            Telegram ID is read-only. You can edit display name, bio, contact, and optional avatar URL.
          </p>
        </div>

        {!authed && (
          <Card>
            <CardBody>
              <p className={ui.muted}>Please login first.</p>
            </CardBody>
          </Card>
        )}

        {authed && (
          <Card>
            <CardHeader title="Your profile" subtitle={loading ? "Loading..." : ""} />
            <CardBody>
              {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
              {saved && <p className="text-sm text-green-700 mb-3">{saved}</p>}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Username</Label>
                  <Input value={profile.username} readOnly />
                </div>
                <div>
                  <Label>Telegram ID</Label>
                  <Input value={String(profile.telegram_id || "")} readOnly />
                </div>
                <div className="md:col-span-2">
                  <Label>Display name</Label>
                  <Input
                    value={profile.display_name}
                    onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
                    placeholder="e.g. Lucas"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Bio</Label>
                  <textarea
                    className={ui.textarea}
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="A short description about you…"
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Contact</Label>
                  <Input
                    value={profile.contact}
                    onChange={(e) => setProfile((p) => ({ ...p, contact: e.target.value }))}
                    placeholder="Email or Telegram @username"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Avatar URL (optional)</Label>
                  <Input
                    value={profile.avatar_url}
                    onChange={(e) => setProfile((p) => ({ ...p, avatar_url: e.target.value }))}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={save} disabled={loading}>
                  Save
                </Button>
                <span className={ui.muted}>Changes apply to this account only.</span>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
