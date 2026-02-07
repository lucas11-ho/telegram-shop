import { useState } from "react";
import { api, getToken } from "../lib/api";
import { ui } from "../ui/tokens.jsx";
import { Card, CardBody } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { Input, Label } from "../ui/components/Input.jsx";

export default function UploadPage() {
  const authed = !!getToken();
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

      setName("");
      setPrice("");
      setCurrency("USD");
      setDescription("");
      setPaymentInstructions("");
      setImages([]);
    } catch (e) {
      alert(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  if (!authed) {
    return (
      <Card className="max-w-2xl">
        <CardBody>
          <div className="font-medium">Login required</div>
          <div className={`text-sm ${ui.muted} mt-1`}>
            Open the app inside Telegram or use the Telegram Login widget to login.
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className={`${ui.h1} mb-4`}>Upload product</h1>

      <Card>
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1">
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Currency</Label>
                <div className="mt-1">
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className={`${ui.input} mt-1 min-h-[96px]`}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label>Payment instructions (QR/notes)</Label>
              <textarea
                className={`${ui.input} mt-1 min-h-[96px]`}
                rows={3}
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
              />
            </div>

            <div>
              <Label>Images</Label>
              <input
                className="mt-2 w-full text-sm"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
              <div className={`text-xs ${ui.muted} mt-1`}>PNG/JPG/WebP recommended.</div>
            </div>

            <Button disabled={busy} className="w-full sm:w-auto">
              {busy ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
