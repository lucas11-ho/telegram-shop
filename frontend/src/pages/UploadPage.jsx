import { useState } from "react";
import { apiUrl, getToken } from "../lib/api";
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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [files, setFiles] = useState([]);
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
    if (!name.trim()) {
      setMsg("Title is required.");
      return;
    }
    if (!price || Number.isNaN(Number(price))) {
      setMsg("Price must be a number.");
      return;
    }
    if (!files?.length) {
      setMsg("Please choose at least one image.");
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();
      // Primary contract (matches original Telegram Shop):
      // name, price, currency, payment_instructions, images[]
      fd.append("name", name.trim());
      fd.append("price", String(price));
      fd.append("currency", currency);
      if (paymentInstructions.trim()) {
        fd.append("payment_instructions", paymentInstructions.trim());
      }
      files.forEach((f) => fd.append("images", f));

      // IMPORTANT: don't set Content-Type manually for FormData.
      const doUpload = async (formData) => {
        const r = await fetch(`${apiUrl()}/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });
        const data = await r.json().catch(() => ({}));
        return { ok: r.ok, status: r.status, data };
      };

      // Keep existing backend contract intact.

      let res = await doUpload(fd);

      // Backward compatibility: some backends use the *older* contract:
      // title, price, file
      if (!res.ok && res.status === 422) {
        const fd2 = new FormData();
        fd2.append("title", name.trim());
        fd2.append("price", String(price));
        // pick the first image as the single file
        fd2.append("file", files[0]);
        res = await doUpload(fd2);
        if (res.ok) {
          setMsg("Uploaded successfully.");
        }
      }

      if (!res.ok) {
        const d = res.data || {};
        setMsg(safeText(d.detail || d.error || d.message || d));
        return;
      }

      // Default success message (keep any special message set by the retry path)
      setMsg((prev) => (prev ? prev : "Uploaded successfully."));
      setName("");
      setPrice("");
      setCurrency("USD");
      setPaymentInstructions("");
      setFiles([]);
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <Label htmlFor="payment_instructions">Description / Instructions (optional)</Label>
              <textarea
                id="payment_instructions"
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
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
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
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
