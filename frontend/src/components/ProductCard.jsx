import { apiUrl } from "../lib/api";
import { Card, CardBody } from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import { ui } from "../ui/tokens";

export default function ProductCard({ product, onAdd }) {
  const title = product?.name || product?.title || "Untitled";
  const price = product?.price;
  const currency = product?.currency || "USD";
  const rawImg = product?.images?.[0]?.url || product?.image_url || product?.image;
  const img = rawImg
    ? rawImg.startsWith("http")
      ? rawImg
      : `${apiUrl()}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`
    : null;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="aspect-[4/3] bg-[#0F1520]">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-sm ${ui.muted}`}>
            No image
          </div>
        )}
      </div>

      <CardBody>
        <div className="min-w-0">
          <div className="font-semibold line-clamp-1">{title}</div>
          {(product.description || product.payment_instructions) ? (
            <div className={`mt-1 line-clamp-2 text-xs ${ui.muted}`}>
              {product.description || product.payment_instructions}
            </div>
          ) : null}
          <div className={`text-sm mt-1 ${ui.muted}`}>
            {price} {currency}
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full"
            onClick={() => onAdd?.(product)}
            disabled={!onAdd}
          >
            Add to cart
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
