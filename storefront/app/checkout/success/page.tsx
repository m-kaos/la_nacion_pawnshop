'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_ORDER_BY_ID } from '@/lib/order-queries';

interface OrderLine {
  id: string;
  quantity: number;
  linePriceWithTax: number;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    priceWithTax: number;
    product: {
      name: string;
      featuredAsset?: {
        preview: string;
      };
    };
  };
}

interface ShippingAddress {
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

interface Order {
  id: string;
  code: string;
  state: string;
  orderPlacedAt?: string;
  totalWithTax: number;
  shippingWithTax: number;
  subTotalWithTax: number;
  currencyCode: string;
  shippingAddress?: ShippingAddress;
  lines: OrderLine[];
  shippingLines?: {
    shippingMethod: {
      name: string;
      description?: string;
    };
    priceWithTax: number;
  }[];
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    setOrderId(id);
  }, [searchParams]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await graphqlClient.query(GET_ORDER_BY_ID, { id: orderId });

        if (result.data?.order) {
          setOrder(result.data.order);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currencyCode || 'USD',
    }).format(price / 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-red-600">Unable to load order details</p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Info Header */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="font-semibold font-mono">{order.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-semibold">{formatDate(order.orderPlacedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-semibold text-xl">{formatPrice(order.totalWithTax)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.lines.map((line) => (
                  <div key={line.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                      {line.productVariant.product.featuredAsset?.preview ? (
                        <Image
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{line.productVariant.product.name}</h3>
                      <p className="text-sm text-gray-600">{line.productVariant.name}</p>
                      <p className="text-xs text-gray-500 mt-1">SKU: {line.productVariant.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(line.linePriceWithTax)}</p>
                      <p className="text-sm text-gray-600">Qty: {line.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="text-gray-700">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.streetLine1}</p>
                  {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
                  <p>
                    {order.shippingAddress.city}
                    {order.shippingAddress.province && `, ${order.shippingAddress.province}`} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phoneNumber && <p className="mt-2">{order.shippingAddress.phoneNumber}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subTotalWithTax)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingWithTax)}</span>
                </div>
                {order.shippingLines && order.shippingLines.length > 0 && (
                  <div className="text-sm text-gray-600 pl-4">
                    {order.shippingLines.map((line, idx) => (
                      <p key={idx}>{line.shippingMethod.name}</p>
                    ))}
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalWithTax)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Link
                href={`/orders/${order.id}`}
                className="block w-full bg-primary-600 text-white text-center px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Track Order
              </Link>
              <Link
                href="/account"
                className="block w-full border border-gray-300 text-center px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                View All Orders
              </Link>
              <Link
                href="/products"
                className="block w-full border border-gray-300 text-center px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
