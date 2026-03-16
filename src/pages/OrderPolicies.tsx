import { Link } from 'react-router-dom';
import { Clock, CreditCard, MapPin, XCircle, ShieldCheck } from 'lucide-react';

const POLICIES = [
  {
    icon: Clock,
    title: 'Lead Time',
    body: 'All orders must be placed at least 10 days in advance. Last-minute requests may not be accommodated, so please plan ahead — especially for holidays and busy weekends.',
  },
  {
    icon: CreditCard,
    title: 'Payment',
    body: 'Full payment is required to secure your order. An invoice will be sent once your order details are finalized. We currently accept Venmo and cash. No payment is collected through this website.',
  },
  {
    icon: MapPin,
    title: 'Pickup',
    body: 'All orders are pickup only in Arlington, VA. A specific address will be shared once your order is confirmed. We do not offer delivery at this time.',
  },
  {
    icon: XCircle,
    title: 'Cancellations',
    body: 'If you need to cancel after your order has been confirmed, a cancellation fee equal to half the total order price applies. This covers the cost of ingredients and time already invested.',
  },
  {
    icon: ShieldCheck,
    title: 'Right to Decline',
    body: 'Chuck\'s Bakes reserves the right to decline any order request at our discretion — for example, if the timeline is too tight, the design is outside our current capabilities, or capacity has been reached.',
  },
];

export function OrderPolicies() {
  return (
    <div className="bg-[#fde7ee] py-10">
      <div className="w-full max-w-2xl mx-auto px-4">

        <h1 className="font-bold text-black text-center mb-2">Order Policies</h1>
        <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto">
          By placing an order with Chuck's Bakes, you agree to the following policies.
          Please read them before submitting your request.
        </p>

        <div className="space-y-4">
          {POLICIES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl shadow-soft p-5 sm:p-6 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#fff5f7] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#ff6b9d]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black mb-1">{title}</h2>
                <p className="text-gray-600 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Ready to place an order?</p>
          <Link
            to="/order"
            className="inline-block bg-black text-white font-bold py-3 px-8 rounded-xl shadow-soft hover:bg-gray-800 transition-colors active:scale-95"
          >
            Start Your Order
          </Link>
        </div>

      </div>
    </div>
  );
}
