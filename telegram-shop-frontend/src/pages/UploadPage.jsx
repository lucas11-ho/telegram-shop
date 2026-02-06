import { useMemo, useState } from "react";
import { api, getToken } from "../lib/api";

export default function UploadPage() {
  const authed = useMemo(() => !!getToken(), []);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("currency", currency);
      if (description) fd.append("description", description);
      if (paymentInstructions) fd.append("payment_instructions", paymentInstructions);
      for (const f of images) fd.append("images", f);

      const created = await api("/products", { method: "POST", body: fd });
      alert(`Uploaded: ${created.name}`);
      setName(""); setPrice(""); setDescription(""); setPaymentInstructions(""); setImages([]);
    } catch (e) {
      alert(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  if (!authed) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <div className="font-medium">Login required</div>
        <div className="text-sm text-gray-600 mt-1">Open the app inside Telegram or use the Telegram Login widget on top to login.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Upload product</h1>
      <form onSubmit={submit} className="rounded-xl border bg-white p-4 space-y-3">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Price</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={currency} onChange={(e)=>setCurrency(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" rows="3" value={description} onChange={(e)=>setDescription(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">Payment instructions (QR/notes)</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" rows="3" value={paymentInstructions} onChange={(e)=>setPaymentInstructions(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">Images</label>
          <input className="mt-1 w-full text-sm" type="file" multiple accept="image/*" onChange={(e)=>setImages(Array.from(e.target.files || []))} />
        </div>

        <button disabled={busy} className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-60">
          {busy ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
