import { Link } from 'react-router-dom';

export function OrderPolicies() {
  return (
    <div className="bg-[#fde7ee] py-10">
      <div className="w-full max-w-2xl mx-auto px-4">

        <h1 className="font-bold text-black text-center mb-2">Order Policies</h1>
        <p className="text-center text-gray-500 text-sm mb-10 max-w-md mx-auto">
          By placing an order with Chuck's Bakes, you agree to the following policies.
        </p>

        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 space-y-8 text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Lead Time</h2>
            <p>
              All orders must be placed at least 10 days in advance. Last-minute requests may not be
              accommodated, so please plan ahead — especially for holidays and busy weekends.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Payment</h2>
            <p>
              Full payment is required to secure your order. An invoice will be sent once your order
              details are finalized. We currently accept Venmo and cash. No payment is collected
              through this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Pickup</h2>
            <p>
              All orders are pickup only in Arlington, VA. A specific address will be shared once
              your order is confirmed. We do not offer delivery at this time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Cancellations</h2>
            <p>
              If you need to cancel after your order has been confirmed, a cancellation fee equal to
              half the total order price applies. This covers the cost of ingredients and time
              already invested.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Right to Decline</h2>
            <p>
              Chuck's Bakes reserves the right to decline any order request at our discretion — for
              example, if the timeline is too tight, the design is outside our current capabilities,
              or capacity has been reached.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center">
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
    </div>
  );
}
