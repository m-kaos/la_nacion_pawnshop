'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { graphqlClient } from '@/lib/graphql-client';
import {
  SET_SHIPPING_ADDRESS,
  GET_ELIGIBLE_SHIPPING_METHODS,
  SET_SHIPPING_METHOD,
  ADD_PAYMENT_TO_ORDER,
  ADD_ITEM_TO_ORDER,
  GET_ACTIVE_ORDER,
  TRANSITION_TO_STATE,
} from '@/lib/checkout-queries';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import StripePaymentForm from '@/components/StripePaymentForm';

type Step = 'address' | 'shipping' | 'payment' | 'review';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  priceWithTax: number;
}

export default function CheckoutPage() {
  console.log('=== CHECKOUT PAGE RENDER ===');
  const { customer, loading: authLoading } = useAuth();
  const { items, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  console.log('1. Checkout State:', {
    hasCustomer: !!customer,
    customerEmail: customer?.emailAddress,
    authLoading,
    itemsCount: items.length,
    items: items.map(i => ({ id: i.variantId, name: i.productName, qty: i.quantity })),
    orderId,
    step
  });

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'US', // United States country code
    phoneNumber: '',
  });

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  // Stripe states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise] = useState(() => getStripe());

  // Flag to prevent redirect when payment is being processed
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Ref to prevent multiple order creations
  const orderCreationInProgress = useRef(false);

  useEffect(() => {
    console.log('2. First useEffect - Auth/Redirect Check');
    if (!authLoading && !customer) {
      console.log('   -> Not logged in, redirecting to login');
      router.push('/login?redirect=/checkout');
    }

    if (customer && items.length === 0 && !isProcessingPayment) {
      console.log('   -> Cart is empty, redirecting to cart');
      router.push('/cart');
    }

    // Pre-fill name from customer
    if (customer && !address.fullName) {
      console.log('   -> Pre-filling customer name:', customer.firstName, customer.lastName);
      setAddress(prev => ({
        ...prev,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phoneNumber: customer.phoneNumber || '',
      }));
    }
  }, [customer, authLoading, items, router, address.fullName, isProcessingPayment]);

  // Create order when checkout starts - ROBUST VERSION
  useEffect(() => {
    console.log('[ORDER MANAGEMENT] Starting order creation check...');

    // Prevent multiple simultaneous order creations
    if (orderCreationInProgress.current) {
      console.log('[ORDER MANAGEMENT] Order creation already in progress, skipping');
      return;
    }

    const createOrder = async () => {
      console.log('[ORDER MANAGEMENT] Conditions - customer:', !!customer, 'items:', items.length, 'orderId:', orderId);

      if (!customer || items.length === 0) {
        console.log('[ORDER MANAGEMENT] Missing customer or items, skipping');
        return;
      }

      orderCreationInProgress.current = true;

      try {
        // Check for existing active order with fresh data
        console.log('[ORDER MANAGEMENT] Checking for existing active order...');
        const checkResult = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
          requestPolicy: 'network-only', // Always fetch fresh
        });

        const existingOrder = checkResult.data?.activeOrder;

        if (existingOrder) {
          console.log('[ORDER MANAGEMENT] Found order:', existingOrder.id, 'State:', existingOrder.state);

          // Check if order is in a USABLE state
          const usableStates = ['AddingItems', 'ArrangingPayment'];

          if (!usableStates.includes(existingOrder.state)) {
            console.warn('[ORDER MANAGEMENT] ⚠️ Order is in non-usable state:', existingOrder.state);
            console.log('[ORDER MANAGEMENT] This is a COMPLETED order. Cart should start fresh.');
            console.log('[ORDER MANAGEMENT] Clearing local state and starting new order...');

            // Clear the local orderId so we can start fresh
            setOrderId(null);
            orderCreationInProgress.current = false;

            // Items need to be added to create a NEW order
            console.log('[ORDER MANAGEMENT] Adding items to create NEW order...');

            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              console.log(`[ORDER MANAGEMENT] Adding item ${i + 1}/${items.length}:`, item.productName);

              const addResult = await graphqlClient.mutation(ADD_ITEM_TO_ORDER, {
                productVariantId: item.variantId,
                quantity: item.quantity,
              });

              if (addResult.data?.addItemToOrder?.errorCode) {
                console.error('[ORDER MANAGEMENT] ❌ Error adding item:', addResult.data.addItemToOrder.message);

                // If error is "no active order", it means the old order is truly stuck
                if (addResult.data.addItemToOrder.errorCode === 'NO_ACTIVE_ORDER_ERROR') {
                  console.log('[ORDER MANAGEMENT] Confirmed: Old order is stuck. Creating completely new session...');
                  // Continue - Vendure will create new order on next item add
                }
              } else if (addResult.data?.addItemToOrder?.id) {
                console.log(`[ORDER MANAGEMENT] ✅ Item added to order ${addResult.data.addItemToOrder.id}`);
              }
            }

            // Fetch the newly created order
            const newOrderResult = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
              requestPolicy: 'network-only',
            });

            if (newOrderResult.data?.activeOrder?.id) {
              console.log('[ORDER MANAGEMENT] ✅ New order created:', newOrderResult.data.activeOrder.id);
              setOrderId(newOrderResult.data.activeOrder.id);
            }

            orderCreationInProgress.current = false;
            return;
          }

          // Order is in usable state
          console.log('[ORDER MANAGEMENT] Order is in usable state:', existingOrder.state);

          if (existingOrder.lines && existingOrder.lines.length > 0) {
            console.log('[ORDER MANAGEMENT] Order already has', existingOrder.lines.length, 'items');

            // Update orderId if different
            if (orderId !== existingOrder.id) {
              console.log('[ORDER MANAGEMENT] Updating orderId to:', existingOrder.id);
              setOrderId(existingOrder.id);
            }

            orderCreationInProgress.current = false;
            return;
          }

          console.log('[ORDER MANAGEMENT] Order exists but is empty, adding items...');
        } else {
          console.log('[ORDER MANAGEMENT] No active order found, will create new one by adding items');
        }

        // Add items to order (creates new order if none exists)
        console.log('[ORDER MANAGEMENT] Adding', items.length, 'items to order...');

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          console.log(`[ORDER MANAGEMENT] Adding item ${i + 1}/${items.length}:`, item.productName);

          const addResult = await graphqlClient.mutation(ADD_ITEM_TO_ORDER, {
            productVariantId: item.variantId,
            quantity: item.quantity,
          });

          if (addResult.data?.addItemToOrder?.errorCode) {
            console.error('[ORDER MANAGEMENT] ❌ Error:', addResult.data.addItemToOrder.message);
          } else if (addResult.data?.addItemToOrder?.id) {
            console.log(`[ORDER MANAGEMENT] ✅ Item added to order ${addResult.data.addItemToOrder.id}`);
          }
        }

        // Get final order
        const finalResult = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
          requestPolicy: 'network-only',
        });

        if (finalResult.data?.activeOrder?.id) {
          console.log('[ORDER MANAGEMENT] ✅ Order ready:', finalResult.data.activeOrder.id);
          setOrderId(finalResult.data.activeOrder.id);
        } else {
          console.error('[ORDER MANAGEMENT] ❌ Failed to create order');
        }

      } catch (err) {
        console.error('[ORDER MANAGEMENT] ❌ Exception:', err);
      } finally {
        orderCreationInProgress.current = false;
      }
    };

    createOrder();
  }, [customer, items.length]); // Only re-run when customer or item count changes

  const handleAddressSubmit = async (e: React.FormEvent) => {
    console.log('4. SUBMIT ADDRESS CLICKED');
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('   -> Address to submit:', address);
      console.log('   -> Current orderId:', orderId);

      console.log('   -> Calling setOrderShippingAddress mutation...');
      const result = await Promise.race([
        graphqlClient.mutation(SET_SHIPPING_ADDRESS, {
          input: address,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Mutation timeout after 10s')), 10000)
        )
      ]);

      console.log('   -> Address mutation completed');
      console.log('   -> Full result:', JSON.stringify(result, null, 2));

      if ((result as any).data?.setOrderShippingAddress?.id) {
        console.log('   -> ✓ Address set successfully!');
        // Fetch shipping methods
        console.log('   -> Fetching shipping methods...');
        const methodsResult = await graphqlClient.query(GET_ELIGIBLE_SHIPPING_METHODS, {});
        console.log('   -> Shipping methods result:', JSON.stringify(methodsResult, null, 2));
        console.log('   -> Shipping methods count:', methodsResult.data?.eligibleShippingMethods?.length || 0);

        const methods = methodsResult.data?.eligibleShippingMethods || [];
        if (methods.length === 0) {
          console.warn('   -> ⚠️  WARNING: No shipping methods returned!');
          console.warn('   -> This could mean:');
          console.warn('      1. Shipping methods not configured in Vendure');
          console.warn('      2. Shipping methods not assigned to channel');
          console.warn('      3. No shipping methods eligible for this order');
        } else {
          console.log('   -> Found methods:', methods.map((m: any) => m.name).join(', '));
        }

        setShippingMethods(methods);
        setStep('shipping');
        console.log('   -> ✓ Moving to shipping step');
      } else if ((result as any).data?.setOrderShippingAddress?.errorCode) {
        console.error('   -> ✗ Address error:', (result as any).data.setOrderShippingAddress);
        setError((result as any).data.setOrderShippingAddress.message || 'Failed to set shipping address');
      } else {
        console.error('   -> ✗ No ID and no error in response');
        setError('Failed to set shipping address');
      }
    } catch (err: any) {
      console.error('   -> ✗ EXCEPTION:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    console.log('[SHIPPING] Shipping method selected:', selectedShipping);
    e.preventDefault();

    if (!selectedShipping) {
      console.warn('[SHIPPING] No shipping method selected!');
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, check current order state
      console.log('[SHIPPING] Checking current order state...');
      const orderCheck = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
        requestPolicy: 'network-only',
      });

      const currentOrder = orderCheck.data?.activeOrder;

      if (!currentOrder) {
        console.error('[SHIPPING] No active order found!');
        setError('Order not found. Please start over.');
        setLoading(false);
        return;
      }

      console.log('[SHIPPING] Current order state:', currentOrder.state);

      // Check if order is in a state where we can modify it
      // Vendure allows modifications ONLY in AddingItems state
      if (currentOrder.state !== 'AddingItems') {
        console.warn('[SHIPPING] Order is in', currentOrder.state, 'state - cannot modify!');
        console.log('[SHIPPING] This happened because setting address auto-transitioned the order');

        // The order transitioned when we set the address
        // We need to work with it as-is and NOT try to modify
        // Just proceed to payment with current state

        console.log('[SHIPPING] Proceeding to payment with current order state...');

        // Get current order total
        const orderTotal = currentOrder.totalWithTax;
        console.log('[SHIPPING] Order total:', orderTotal);

        // Create Stripe Payment Intent
        console.log('[SHIPPING] Creating Stripe Payment Intent...');
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: orderTotal,
              orderId: orderId,
            }),
          });

          const data = await response.json();
          console.log('[SHIPPING] Payment Intent response:', data);

          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setStep('payment');
            console.log('[SHIPPING] ✓ Moving to payment step');
          } else {
            console.error('[SHIPPING] No client secret received:', data);
            setError(data.error || 'Failed to initialize payment');
          }
        } catch (paymentErr: any) {
          console.error('[SHIPPING] Payment Intent error:', paymentErr);
          setError('Failed to initialize payment. Please try again.');
        }

        setLoading(false);
        return;
      }

      // Order is in AddingItems state, we can set shipping method
      console.log('[SHIPPING] Order is in AddingItems state - setting shipping method...');
      const result = await graphqlClient.mutation(SET_SHIPPING_METHOD, {
        shippingMethodId: [selectedShipping],
      });

      console.log('[SHIPPING] Shipping method result:', (result as any).data?.setOrderShippingMethod);

      if ((result as any).data?.setOrderShippingMethod?.id) {
        console.log('[SHIPPING] ✓ Shipping method set successfully!');

        // Calculate total with shipping
        const orderTotal = (result as any).data.setOrderShippingMethod.totalWithTax;
        console.log('[SHIPPING] Order total with shipping:', orderTotal);

        // Create Stripe Payment Intent
        console.log('[SHIPPING] Creating Stripe Payment Intent...');
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: orderTotal,
              orderId: orderId,
            }),
          });

          const data = await response.json();
          console.log('[SHIPPING] Payment Intent response:', data);

          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setStep('payment');
            console.log('[SHIPPING] ✓ Moving to payment step');
          } else {
            console.error('[SHIPPING] No client secret received:', data);
            setError(data.error || 'Failed to initialize payment');
          }
        } catch (paymentErr: any) {
          console.error('[SHIPPING] Payment Intent error:', paymentErr);
          setError('Failed to initialize payment. Please try again.');
        }
      } else if ((result as any).data?.setOrderShippingMethod?.errorCode) {
        console.error('[SHIPPING] Shipping method error:', (result as any).data.setOrderShippingMethod);

        // If we get ORDER_MODIFICATION_ERROR, the order transitioned during our operation
        if ((result as any).data.setOrderShippingMethod.errorCode === 'ORDER_MODIFICATION_ERROR') {
          console.warn('[SHIPPING] Order transitioned during operation - recovering...');

          // Get fresh order state and proceed with current total
          const freshOrder = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
            requestPolicy: 'network-only',
          });

          if (freshOrder.data?.activeOrder) {
            const orderTotal = freshOrder.data.activeOrder.totalWithTax;
            console.log('[SHIPPING] Using current order total:', orderTotal);

            // Create payment intent with current state
            const response = await fetch('/api/create-payment-intent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: orderTotal,
                orderId: orderId,
              }),
            });

            const data = await response.json();
            if (data.clientSecret) {
              setClientSecret(data.clientSecret);
              setStep('payment');
              console.log('[SHIPPING] ✓ Recovered - moving to payment');
              setLoading(false);
              return;
            }
          }
        }

        setError((result as any).data.setOrderShippingMethod.message || 'Failed to set shipping method');
      } else {
        console.error('[SHIPPING] Unknown error setting shipping method');
        setError('Failed to set shipping method');
      }
    } catch (err: any) {
      console.error('[SHIPPING] Exception:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // New Stripe payment success handler
  const handlePaymentSuccess = async () => {
    console.log('[STRIPE] Payment confirmed by Stripe, completing order...');
    setLoading(true);
    setIsProcessingPayment(true);
    setError('');

    try {
      // First check current order state
      console.log('[STRIPE] Checking current order state...');
      const orderCheck = await graphqlClient.query(GET_ACTIVE_ORDER, {}, {
        requestPolicy: 'network-only', // Force fresh fetch
      });
      const currentOrder = orderCheck.data?.activeOrder;

      if (!currentOrder) {
        console.error('[STRIPE] ERROR: No active order found after payment!');
        setError('Order not found. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('[STRIPE] Current order state:', currentOrder.state);

      // Transition to ArrangingPayment if still in AddingItems
      if (currentOrder.state === 'AddingItems') {
        console.log('[STRIPE] Transitioning to ArrangingPayment...');
        const transitionResult = await graphqlClient.mutation(TRANSITION_TO_STATE, {
          state: 'ArrangingPayment',
        });

        if (transitionResult.data?.transitionOrderToState?.errorCode) {
          console.error('[STRIPE] Transition error:', transitionResult.data.transitionOrderToState);
          setError('Failed to process payment. Please contact support.');
          setLoading(false);
          return;
        }
        console.log('[STRIPE] Transitioned successfully');
      }

      // Add payment to Vendure order
      console.log('[STRIPE] Adding payment to Vendure order...');
      const result = await graphqlClient.mutation(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: 'dummy-payment-method', // Use configured payment method
          metadata: {
            stripePaymentCompleted: true,
            source: 'stripe',
          },
        },
      });

      console.log('[STRIPE] Payment add result:', (result as any).data?.addPaymentToOrder);

      if ((result as any).data?.addPaymentToOrder?.id) {
        console.log('[STRIPE] ✓ Payment successful! Order ID:', (result as any).data.addPaymentToOrder.id);
        // Clear local cart
        clearCart();
        // Redirect to success page
        router.push(`/checkout/success?orderId=${(result as any).data.addPaymentToOrder.id}`);
      } else if ((result as any).data?.addPaymentToOrder?.errorCode) {
        console.error('[STRIPE] Payment error:', (result as any).data.addPaymentToOrder);
        setError((result as any).data.addPaymentToOrder.message || 'Payment failed');
        setLoading(false);
      } else {
        console.error('[STRIPE] Unknown payment error');
        setError('Payment processing failed');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[STRIPE] Exception:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading authentication...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Please login to continue</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step === 'address' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>1</div>
            <span className="ml-2">Address</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'shipping' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>2</div>
            <span className="ml-2">Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'payment' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>3</div>
            <span className="ml-2">Payment</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
              {error.includes('no active Order') && (
                <p className="text-xs mt-2 text-red-600">
                  The previous order is stuck in a completed state.
                </p>
              )}
            </div>
            {error.includes('no active Order') && (
              <button
                onClick={async () => {
                  setError('');
                  console.log('[RECOVERY] Clearing session and reloading...');
                  // Clear cookies
                  document.cookie.split(";").forEach(c => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                  });
                  // Reload to start fresh
                  window.location.href = '/cart';
                }}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition whitespace-nowrap"
              >
                Clear & Start Over
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Address Step */}
          {step === 'address' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.streetLine1}
                    onChange={(e) => setAddress({ ...address, streetLine1: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={address.streetLine2}
                    onChange={(e) => setAddress({ ...address, streetLine2: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">State/Province</label>
                    <input
                      type="text"
                      required
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={address.phoneNumber}
                      onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Continue to Shipping'}
                </button>
              </form>
            </div>
          )}

          {/* Shipping Step */}
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className="block p-4 border rounded-lg cursor-pointer hover:border-primary-600"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={(e) => {
                        setSelectedShipping(e.target.value);
                        setShippingPrice(method.priceWithTax);
                      }}
                      className="mr-3"
                    />
                    <span className="font-semibold">{method.name}</span>
                    <span className="float-right">{formatPrice(method.priceWithTax)}</span>
                    {method.description && (
                      <p className="text-sm text-gray-600 ml-7">{method.description}</p>
                    )}
                  </label>
                ))}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedShipping}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && clientSecret && stripePromise && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep('shipping')}
                  totalAmount={totalPrice + shippingPrice}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{item.productName}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingPrice > 0 ? formatPrice(shippingPrice) : 'TBD'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(totalPrice + shippingPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
