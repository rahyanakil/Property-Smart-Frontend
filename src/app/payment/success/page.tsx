import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your payment has been processed. An agent will contact you shortly to finalize the property transfer.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard/buyer" className="btn-primary">View My Dashboard</Link>
          <Link href="/properties" className="btn-secondary">Browse More</Link>
        </div>
      </div>
    </div>
  );
}
