import { Link } from 'react-router-dom';
import { useOrderStore } from '../lib/state';

export function Success() {
  const lastOrderId = useOrderStore((state: any) => state.lastOrderId);

  return (
    <div className="bg-[#fde7ee] py-16">
      <div className="w-full max-w-md mx-auto px-4 text-center">

        <h1 className="font-bold text-black mb-3">Order Received</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Thanks for your order! We'll review the details and reach out within 24 hours to confirm everything.
        </p>

        {lastOrderId && (
          <div className="bg-white rounded-2xl shadow-soft p-5 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-bold text-black font-mono tracking-wide">{lastOrderId}</p>
            <p className="text-xs text-gray-400 mt-1">Save this for your records</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 bg-white border-2 border-black text-black hover:bg-[#d63f6f] hover:text-white font-bold py-3 px-6 rounded-lg shadow-soft transition-all duration-300 active:scale-95"
          >
            Back to Home
          </Link>
          <Link
            to="/order"
            className="flex-1 bg-white border-2 border-black text-black hover:bg-[#d63f6f] hover:text-white font-bold py-3 px-6 rounded-lg shadow-soft transition-all duration-300 active:scale-95"
          >
            Place Another Order
          </Link>
        </div>

      </div>
    </div>
  );
}
