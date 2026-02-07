import { useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!getToken()) {
      setErr("You must be logged in to upload.");
      return;
    }
    if (!title.trim()) return setErr("Title is required.");
    if (!price || isNaN(Number(price))) return setErr("Valid price is required.");
    if (!file) return setErr("Image is required.");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", String(price));
      fd.append("image", file);

      await api("/products", { method: "POST", body: fd });
      setMsg("Uploaded successfully.");
      setTitle("");
      setPrice("");
      setFile(null);
    } catch (e2) {
      setErr(e2?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <h1 className={`${ui.h1} pt-6`}>Upload</h1>

        <form onSubmit={submit} className="mt-6 max-w-xl space-y-4">
          <div>
            <div className="mb-1 text-sm text-neutral-700">Title</div>
            <input className={ui.input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <div className="mb-1 text-sm text-neutral-700">Price</div>
            <input className={ui.input} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div>
            <div className="mb-1 text-sm text-neutral-700">Photo</div>
            <input
              className={ui.input}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}
          {msg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {msg}
            </div>
          )}

          <button className={`${ui.buttonBase} ${ui.buttonPrimary}`} disabled={loading} type="submit">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
