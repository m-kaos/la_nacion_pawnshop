'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_ACTIVE_CUSTOMER_ORDERS } from '@/lib/order-queries';

interface Order {
  id: string;
  code: string;
  state: string;
  orderPlacedAt: string;
  totalWithTax: number;
  currencyCode: string;
  lines: {
    id: string;
    quantity: number;
    productVariant: {
      id: string;
      name: string;
      product: {
        name: string;
        featuredAsset?: {
          preview: string;
        };
      };
    };
  }[];
}

export default function OrderHistoryPage() {
  const { customer, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login?redirect=/account/orders');
    }
  }, [customer, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;

      setLoading(true);
      try {
        const result = await graphqlClient.query(GET_ACTIVE_CUSTOMER_ORDERS, {
          options: {
            take: 50,
            sort: { orderPlacedAt: 'DESC' },
          },
        });

        if (result.data?.activeCustomer?.orders) {
          setOrders(result.data.activeCustomer.orders.items);
          setTotalOrders(result.data.activeCustomer.orders.totalItems);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getOrderStateLabel = (state: string) => {
    const stateMap: Record<string, { label: string; color: string }> = {
      'PaymentSettled': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'PaymentAuthorized': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      'ArrangingPayment': { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
      'AddingItems': { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
      'Shipped': { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
      'Delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
    };
    return stateMap[state] || { label: state, color: 'bg-gray-100 text-gray-800' };
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </Link>
          <h1 className="text-4xl font-bold mt-2">Order History</h1>
          <p className="text-gray-600 mt-2">
            {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} total
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/products"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const stateInfo = getOrderStateLabel(order.state);
              const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Order Number</p>
                          <p className="font-semibold font-mono">{order.code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Order Date</p>
                          <p className="font-semibold">{formatDate(order.orderPlacedAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Total Amount</p>
                          <p className="font-semibold">{formatPrice(order.totalWithTax, order.currencyCode)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stateInfo.color}`}>
                            {stateInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Product Images */}
                        <div className="flex -space-x-2">
                          {order.lines.slice(0, 4).map((line, idx) => (
                            <div
                              key={line.id}
                              className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white relative overflow-hidden"
                              style={{ zIndex: 4 - idx }}
                            >
                              {line.productVariant.product.featuredAsset?.preview ? (
                                <Image
                                  src={line.productVariant.product.featuredAsset.preview}
                                  alt={line.productVariant.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                          {order.lines.length > 4 && (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center text-xs text-gray-600 font-semibold">
                              +{order.lines.length - 4}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/checkout/success?orderId=${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
