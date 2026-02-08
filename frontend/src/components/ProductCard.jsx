import { apiUrl } from "../lib/api";
import { Card, CardBody } from "../ui/components/Card";
import { Button } from "../ui/components/Button";
import { ui } from "../ui/tokens";

export default function ProductCard({ product, onAdd }) {
  const img = product.images?.[0]?.url ? `${apiUrl()}${product.images[0].url}` : null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-black/5">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-sm ${ui.muted}`}>
            No image
          </div>
        )}
      </div>

      <CardBody>
        <div className="min-w-0">
          <div className="font-semibold line-clamp-1">{product.name}</div>
          {product.description ? (
            <div className="mt-1 line-clamp-2 text-xs text-neutral-600">
              {product.description}
            </div>
          ) : null}
          <div className={`text-sm mt-1 ${ui.muted}`}>
            {product.price} {product.currency}
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full" onClick={() => onAdd(product)}>
            Add to cart
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
