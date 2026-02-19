'use client';

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onSuccess: () => void;
  onBack: () => void;
  totalAmount: number;
}

export default function StripePaymentForm({
  onSuccess,
  onBack,
  totalAmount,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (confirmError) {
        // Payment failed
        console.error('[Stripe] Payment confirmation error:', confirmError);

        // Handle specific error types
        switch (confirmError.type) {
          case 'card_error':
            setError(confirmError.message || 'Your card was declined. Please try a different payment method.');
            break;
          case 'validation_error':
            setError('Please check your payment details and try again.');
            break;
          case 'invalid_request_error':
            setError('There was an error processing your payment. Please try again.');
            break;
          default:
            setError(confirmError.message || 'An unexpected error occurred. Please try again.');
        }

        setProcessing(false);
        return;
      }

      // Payment succeeded
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('[Stripe] Payment succeeded:', paymentIntent.id);
        onSuccess();
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // Additional authentication required (3D Secure, etc.)
        console.log('[Stripe] Payment requires additional action');
        setError('Additional authentication required. Please follow the prompts.');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        // Payment is processing
        console.log('[Stripe] Payment is processing');
        setError('Your payment is being processed. Please wait...');

        // Poll for payment status (optional)
        setTimeout(() => {
          onSuccess(); // Optimistically proceed
        }, 2000);
      } else {
        console.error('[Stripe] Unexpected payment status:', paymentIntent?.status);
        setError('Payment status unknown. Please contact support.');
        setProcessing(false);
      }

    } catch (err: any) {
      console.error('[Stripe] Payment exception:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

        {/* Total Amount Display */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Stripe Payment Element */}
        <div className="mb-6">
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ${formatPrice(totalAmount)}`
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-center text-sm text-gray-500">
        <svg
          className="w-4 h-4 inline mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Secure payment powered by Stripe
      </div>
    </form>
  );
}
