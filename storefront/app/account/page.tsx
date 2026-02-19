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

export default function AccountPage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login');
    }
  }, [customer, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;

      try {
        const result = await graphqlClient.query(GET_ACTIVE_CUSTOMER_ORDERS, {
          options: {
            take: 5,
            sort: { orderPlacedAt: 'DESC' },
          },
        });

        if (result.data?.activeCustomer?.orders?.items) {
          setOrders(result.data.activeCustomer.orders.items);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Account</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">
                  {customer.title && `${customer.title} `}
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{customer.emailAddress}</p>
              </div>
              {customer.phoneNumber && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{customer.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/account/orders"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Order History</p>
                <p className="text-sm text-gray-600">View your past orders</p>
              </a>
              <a
                href="/account/addresses"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Addresses</p>
                <p className="text-sm text-gray-600">Manage shipping addresses</p>
              </a>
              <a
                href="/account/settings"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Account Settings</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            {orders.length > 0 && (
              <Link
                href="/account/orders"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                View All Orders →
              </Link>
            )}
          </div>

          {ordersLoading ? (
            <div className="text-center py-8 text-gray-600">
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const stateInfo = getOrderStateLabel(order.state);
                const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-primary-600 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex gap-4">
                        {/* Order Images */}
                        <div className="flex -space-x-2">
                          {order.lines.slice(0, 3).map((line, idx) => (
                            <div
                              key={line.id}
                              className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-white relative overflow-hidden"
                              style={{ zIndex: 3 - idx }}
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
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          {order.lines.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center text-sm text-gray-600 font-semibold">
                              +{order.lines.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.code}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.orderPlacedAt)}</p>
                          <p className="text-sm text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatPrice(order.totalWithTax, order.currencyCode)}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stateInfo.color}`}>
                            {stateInfo.label}
                          </span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
