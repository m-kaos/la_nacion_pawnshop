'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const defaultVariant = product.variants[0];
  const isOutOfStock = defaultVariant?.stockLevel === 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    if (!defaultVariant || isOutOfStock) {
      return;
    }

    setIsAdding(true);

    const cartItem = {
      productId: product.id,
      productName: product.name,
      variantId: defaultVariant.id,
      variantName: defaultVariant.name,
      price: defaultVariant.priceWithTax,
      quantity: quantity,
      image: product.featuredAsset?.preview,
    };

    addItem(cartItem);

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="font-semibold">Quantity:</label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border-x py-2"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
        className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
            ? 'bg-green-600 text-white'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {isOutOfStock ? 'Out of Stock' : isAdding ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
