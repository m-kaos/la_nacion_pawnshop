'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Add some products to your cart to see them here
              </p>
              <Link
                href="/products"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-semibold text-sm md:text-base whitespace-nowrap"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                {item.variantName !== item.productName && (
                  <p className="text-sm text-gray-600 mb-2">{item.variantName}</p>
                )}
                <p className="text-primary-600 font-semibold">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>

                <p className="text-gray-900 font-semibold sm:text-gray-600 sm:font-normal text-base sm:text-sm">
                  {formatPrice(item.price * item.quantity)}
                </p>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <Link
            href="/products"
            className="inline-block text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Cart Summary */}
        <div>
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
