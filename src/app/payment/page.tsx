'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '@/components/layout/Navbar';
import { useProperty } from '@/hooks/useProperties';
import { paymentApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment/success` },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full py-3">
        {loading ? 'Processing...' : `Pay ${formatPrice(amount)}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';
  const { data: property } = useProperty(propertyId);

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!property) return;

    paymentApi.createIntent({ propertyId, amount: property.price })
      .then(({ data }) => setClientSecret(data.data.clientSecret))
      .catch(() => toast.error('Failed to initialize payment'))
      .finally(() => setLoading(false));
  }, [property, propertyId, user, router]);

  if (!property) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Purchase</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order summary */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              {property.images?.[0] && (
                <img src={property.images[0]} alt="" className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <div className="space-y-2 text-sm">
                <div className="font-medium text-gray-900">{property.title}</div>
                <div className="text-gray-500">{property.city}, {property.state}</div>
                <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(property.price)}</span>
                </div>
              </div>
            </div>

            {/* Payment form */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Payment Details</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm">Initializing payment...</div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm amount={property.price} onSuccess={() => toast.success('Payment successful!')} />
                </Elements>
              ) : (
                <p className="text-red-500 text-sm">Failed to initialize payment. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
