import { useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens";
import { Card, CardHeader, CardBody } from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import { Input, Label } from "../ui/components/Input";

function safeText(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
      .join(", ");
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const authed = !!getToken();

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!authed) {
      setMsg("Please login first.");
      return;
    }
    if (!title.trim()) {
      setMsg("Title is required.");
      return;
    }
    if (!price || Number.isNaN(Number(price))) {
      setMsg("Price must be a number.");
      return;
    }
    if (!file) {
      setMsg("Please choose an image.");
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", String(price));
      // New field (backend should ignore if unsupported)
      if (description.trim()) fd.append("description", description.trim());
      fd.append("image", file);

      // IMPORTANT: don't set Content-Type manually for FormData.
      const res = await api("/products", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        setMsg(safeText(res.detail || res.error || res));
        return;
      }

      setMsg("Uploaded successfully.");
      setTitle("");
      setPrice("");
      setDescription("");
      setFile(null);
      // Clear file input value by resetting the form
      e.target.reset();
    } catch (err) {
      setMsg(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={ui.container + " py-6"}>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className={ui.h1}>Upload</h1>
        {!authed && (
          <p className={ui.muted}>
            You need to login before uploading.
          </p>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <div className="text-sm font-semibold">New product</div>
            <div className={ui.muted}>
              Add title, price, optional description, and an image.
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 90"
                inputMode="decimal"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what the buyer will get..."
                className={
                  ui.input +
                  " min-h-[100px] resize-y leading-relaxed py-3"
                }
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block text-sm"
              />
              <div className={ui.muted + " mt-1"}>
                PNG / JPG / WEBP recommended, up to 5MB.
              </div>
            </div>

            {msg ? (
              <div className={ui.muted} aria-live="polite">
                {safeText(msg)}
              </div>
            ) : null}

            <div className="pt-2">
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
