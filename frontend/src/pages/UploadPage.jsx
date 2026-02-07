import { useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    const token = getToken();
    if (!token) {
      setMsg("Please login first.");
      return;
    }

    if (!title.trim() || !price) {
      setMsg("Title and price are required.");
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    form.append("price", price);
    if (file) form.append("file", file);

    try {
      await api("/products", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle("");
      setPrice("");
      setFile(null);
      setMsg("Uploaded!");
    } catch (e2) {
      setMsg(e2?.message || "Upload failed");
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <h1 className={`${ui.h1} py-6`}>Upload</h1>

        {msg && (
          <div className="mb-4 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input className={ui.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Price</label>
              <input className={ui.input} value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Image</label>
              <input
                className="block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <button className={ui.buttonPrimary} type="submit">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
