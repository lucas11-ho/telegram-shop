import { apiUrl } from "../lib/api";

export default function ProductCard({ product, onAdd }) {
  const img = product.images?.[0]?.url ? `${apiUrl()}${product.images[0].url}` : null;

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <div className="aspect-[4/3] bg-gray-50">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium line-clamp-1">{product.name}</div>
        <div className="text-sm text-gray-600 mt-1">
          {product.price} {product.currency}
        </div>
        <button
          className="mt-3 w-full rounded-lg bg-black text-white py-2 text-sm hover:opacity-90"
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
