'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_ORDER_BY_ID } from '@/lib/order-queries';
import { useAuth } from '@/contexts/AuthContext';

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

interface Payment {
  id: string;
  transactionId?: string;
  amount: number;
  method: string;
  state: string;
  errorMessage?: string;
  metadata?: any;
  createdAt: string;
}

interface Fulfillment {
  id: string;
  state: string;
  method: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface HistoryEntry {
  id: string;
  type: string;
  createdAt: string;
  data: any;
}

interface Order {
  id: string;
  code: string;
  state: string;
  active: boolean;
  orderPlacedAt?: string;
  updatedAt: string;
  totalWithTax: number;
  shippingWithTax: number;
  subTotalWithTax: number;
  currencyCode: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
  };
  shippingAddress?: {
    fullName?: string;
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
  };
  billingAddress?: {
    fullName?: string;
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
  };
  lines: OrderLine[];
  shippingLines: Array<{
    shippingMethod: {
      id: string;
      name: string;
      code: string;
      description?: string;
    };
    priceWithTax: number;
  }>;
  payments?: Payment[];
  fulfillments?: Fulfillment[];
  history?: {
    items: HistoryEntry[];
  };
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { customer, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = params?.id as string;

  useEffect(() => {
    if (authLoading) return;

    if (!customer) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [customer, authLoading, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const result = await graphqlClient.query(GET_ORDER_BY_ID, {
        id: orderId,
      });

      if (result.data?.order) {
        setOrder(result.data.order);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currencyCode || 'USD',
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusInfo = (state: string) => {
    const statusMap: { [key: string]: { label: string; color: string; description: string } } = {
      AddingItems: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800',
        description: 'Order is being prepared',
      },
      ArrangingPayment: {
        label: 'Pending Payment',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Awaiting payment confirmation',
      },
      PaymentAuthorized: {
        label: 'Payment Authorized',
        color: 'bg-blue-100 text-blue-800',
        description: 'Payment has been authorized',
      },
      PaymentSettled: {
        label: 'Paid',
        color: 'bg-green-100 text-green-800',
        description: 'Payment confirmed and settled',
      },
      PartiallyShipped: {
        label: 'Partially Shipped',
        color: 'bg-purple-100 text-purple-800',
        description: 'Some items have been shipped',
      },
      Shipped: {
        label: 'Shipped',
        color: 'bg-indigo-100 text-indigo-800',
        description: 'Order has been shipped',
      },
      PartiallyDelivered: {
        label: 'Partially Delivered',
        color: 'bg-teal-100 text-teal-800',
        description: 'Some items have been delivered',
      },
      Delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800',
        description: 'Order has been delivered',
      },
      Cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        description: 'Order has been cancelled',
      },
    };

    return statusMap[state] || {
      label: state,
      color: 'bg-gray-100 text-gray-800',
      description: 'Order status',
    };
  };

  const getPaymentStatusInfo = (state: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      Created: { label: 'Created', color: 'bg-gray-100 text-gray-800' },
      Authorized: { label: 'Authorized', color: 'bg-blue-100 text-blue-800' },
      Settled: { label: 'Settled', color: 'bg-green-100 text-green-800' },
      Declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
      Error: { label: 'Error', color: 'bg-red-100 text-red-800' },
      Cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
    };

    return statusMap[state] || { label: state, color: 'bg-gray-100 text-gray-800' };
  };

  const getFulfillmentStatusInfo = (state: string) => {
    const statusMap: { [key: string]: { label: string; color: string; icon: string } } = {
      Pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      Shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-800', icon: '🚚' },
      Delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' },
      Cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
    };

    return statusMap[state] || { label: state, color: 'bg-gray-100 text-gray-800', icon: '📦' };
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="mb-4">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/account"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.state);
  const isPaid = ['PaymentAuthorized', 'PaymentSettled', 'Shipped', 'PartiallyShipped', 'Delivered', 'PartiallyDelivered'].includes(order.state);
  const isShipped = ['Shipped', 'PartiallyShipped', 'Delivered', 'PartiallyDelivered'].includes(order.state);
  const isDelivered = ['Delivered', 'PartiallyDelivered'].includes(order.state);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/account"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order #{order.code}</h1>
              <p className="text-gray-600">
                Placed on {order.orderPlacedAt ? formatDate(order.orderPlacedAt) : 'N/A'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <p className="text-gray-600 mb-6">{statusInfo.description}</p>

          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              {/* Step 1: Order Placed */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.orderPlacedAt ? 'bg-green-500' : 'bg-gray-300'} text-white font-bold mb-2`}>
                  {order.orderPlacedAt ? '✓' : '1'}
                </div>
                <p className="text-xs text-center font-semibold">Order Placed</p>
                <p className="text-xs text-gray-500 text-center">
                  {order.orderPlacedAt ? formatDate(order.orderPlacedAt) : 'Pending'}
                </p>
              </div>

              <div className={`flex-1 h-1 ${isPaid ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>

              {/* Step 2: Payment Confirmed */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-green-500' : 'bg-gray-300'} text-white font-bold mb-2`}>
                  {isPaid ? '✓' : '2'}
                </div>
                <p className="text-xs text-center font-semibold">Payment Confirmed</p>
                <p className="text-xs text-gray-500 text-center">
                  {order.payments && order.payments.length > 0 ? formatDate(order.payments[0].createdAt) : 'Pending'}
                </p>
              </div>

              <div className={`flex-1 h-1 ${isShipped ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>

              {/* Step 3: Shipped */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isShipped ? 'bg-green-500' : 'bg-gray-300'} text-white font-bold mb-2`}>
                  {isShipped ? '✓' : '3'}
                </div>
                <p className="text-xs text-center font-semibold">Shipped</p>
                <p className="text-xs text-gray-500 text-center">
                  {order.fulfillments && order.fulfillments.length > 0 ? formatDate(order.fulfillments[0].createdAt) : 'Pending'}
                </p>
              </div>

              <div className={`flex-1 h-1 ${isDelivered ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDelivered ? 'bg-green-500' : 'bg-gray-300'} text-white font-bold mb-2`}>
                  {isDelivered ? '✓' : '4'}
                </div>
                <p className="text-xs text-center font-semibold">Delivered</p>
                <p className="text-xs text-gray-500 text-center">Pending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.lines.map((line) => (
                  <div key={line.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {line.productVariant.product.featuredAsset ? (
                        <Image
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{line.productVariant.product.name}</h3>
                      <p className="text-sm text-gray-600">{line.productVariant.name}</p>
                      <p className="text-sm text-gray-500">SKU: {line.productVariant.sku}</p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {line.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(line.linePriceWithTax)}</p>
                      <p className="text-sm text-gray-500">{formatPrice(line.productVariant.priceWithTax)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Information */}
            {order.fulfillments && order.fulfillments.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  {order.fulfillments.map((fulfillment) => {
                    const statusInfo = getFulfillmentStatusInfo(fulfillment.state);
                    return (
                      <div key={fulfillment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{statusInfo.icon}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(fulfillment.updatedAt)}</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Shipping Method</p>
                            <p className="text-sm">{fulfillment.method || 'Standard Shipping'}</p>
                          </div>
                          {fulfillment.trackingCode && (
                            <div>
                              <p className="text-sm text-gray-600 font-semibold">Tracking Number</p>
                              <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded border">
                                {fulfillment.trackingCode}
                              </p>
                              <a
                                href={`https://www.google.com/search?q=${fulfillment.trackingCode}+tracking`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 font-semibold mt-1 inline-block"
                              >
                                Track Package →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {order.payments && order.payments.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  {order.payments.map((payment) => {
                    const statusInfo = getPaymentStatusInfo(payment.state);
                    return (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <p className="font-semibold">{formatPrice(payment.amount)}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-medium">{payment.method}</span>
                          </div>
                          {payment.transactionId && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Transaction ID</span>
                              <span className="font-mono text-xs">{payment.transactionId}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span>{formatDate(payment.createdAt)}</span>
                          </div>
                          {payment.errorMessage && (
                            <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-xs mt-2">
                              {payment.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Addresses */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(order.subTotalWithTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatPrice(order.shippingWithTax)}</span>
                </div>
                {order.shippingLines && order.shippingLines.length > 0 && (
                  <div className="text-xs text-gray-500 pl-4">
                    {order.shippingLines[0].shippingMethod.name}
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.totalWithTax)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm space-y-1">
                  {order.shippingAddress.fullName && <p className="font-semibold">{order.shippingAddress.fullName}</p>}
                  {order.shippingAddress.streetLine1 && <p>{order.shippingAddress.streetLine1}</p>}
                  {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                  </p>
                  {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                  {order.shippingAddress.phoneNumber && (
                    <p className="mt-2 text-gray-600">Phone: {order.shippingAddress.phoneNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Billing Address */}
            {order.billingAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                <div className="text-sm space-y-1">
                  {order.billingAddress.fullName && <p className="font-semibold">{order.billingAddress.fullName}</p>}
                  {order.billingAddress.streetLine1 && <p>{order.billingAddress.streetLine1}</p>}
                  {order.billingAddress.streetLine2 && <p>{order.billingAddress.streetLine2}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.province} {order.billingAddress.postalCode}
                  </p>
                  {order.billingAddress.country && <p>{order.billingAddress.country}</p>}
                  {order.billingAddress.phoneNumber && (
                    <p className="mt-2 text-gray-600">Phone: {order.billingAddress.phoneNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Support */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-3">
                If you have questions about your order, please contact our support team.
              </p>
              <a
                href="mailto:support@example.com"
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
