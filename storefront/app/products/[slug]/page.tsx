'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/queries';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductResponse {
  product: Product | null;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const result = await graphqlClient.query<ProductResponse>(
          GET_PRODUCT_BY_SLUG,
          { slug }
        );
        setProduct(result.data?.product || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants[0];
  const price = defaultVariant?.priceWithTax || 0;
  const currency = defaultVariant?.currencyCode || 'USD';

  // Check if product is completely out of stock
  const hasAnyStock = product.variants.some(variant => variant.stockLevel !== 'OUT_OF_STOCK');
  const hasLowStock = product.variants.some(variant => variant.stockLevel === 'LOW_STOCK');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.featuredAsset ? (
              <Image
                src={product.featuredAsset.preview}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.assets && product.assets.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.assets.slice(0, 4).map((asset) => (
                <div
                  key={asset.id}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={asset.preview}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="mb-6">
            <p className="text-3xl font-bold text-primary-600">
              {formatPrice(price)}
            </p>
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Available Options</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-primary-600 cursor-pointer"
                  >
                    <span>{variant.name}</span>
                    <span className="font-semibold">
                      {formatPrice(variant.priceWithTax)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="mb-6">
            {!hasAnyStock ? (
              <div className="space-y-2">
                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                  ⚠️ Out of Stock
                </span>
                <p className="text-sm text-gray-600">
                  This product is currently unavailable. Please check back later.
                </p>
              </div>
            ) : hasLowStock ? (
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
                ⚡ Low Stock - Order Soon!
              </span>
            ) : (
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                ✓ In Stock
              </span>
            )}
          </div>

          {/* Add to cart button */}
          {hasAnyStock ? (
            <AddToCartButton product={product} />
          ) : (
            <button
              disabled
              className="w-full py-4 px-8 rounded-lg font-semibold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          {/* Product metadata */}
          {product.collections && product.collections.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.collections.map((collection) => (
                  <span
                    key={collection.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {collection.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
