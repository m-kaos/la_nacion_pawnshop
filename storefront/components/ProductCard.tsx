import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.priceWithTax || 0;
  const currency = product.variants[0]?.currencyCode || 'USD';

  // Check stock status
  const hasAnyStock = product.variants.some(variant => variant.stockLevel !== 'OUT_OF_STOCK');
  const hasLowStock = product.variants.some(variant => variant.stockLevel === 'LOW_STOCK');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square bg-gray-200">
          {product.featuredAsset ? (
            <Image
              src={product.featuredAsset.preview}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Stock badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {!hasAnyStock && (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                SOLD OUT
              </span>
            )}
            {hasAnyStock && hasLowStock && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                LOW STOCK
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
              {product.description}
            </p>
          )}

          <div className="mt-auto">
            <p className="text-xl font-bold text-primary-600">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
