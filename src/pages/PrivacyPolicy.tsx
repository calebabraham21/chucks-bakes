export function PrivacyPolicy() {
  return (
    <div className="bg-[#fde7ee] py-10">
      <div className="w-full max-w-2xl mx-auto px-4">

        <h1 className="font-bold text-black text-center mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 space-y-8 text-gray-700 leading-relaxed">

          <p>
            Chuck's Bakes is a small, home-based custom cake bakery. This page explains what
            information we collect when you place an order, how we use it, and your rights around
            that data. We keep things simple — your information is used only to fulfill your order.
          </p>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">What we collect</h2>
            <p className="mb-3">When you submit an order request through this site, we collect:</p>
            <ul className="space-y-1.5 list-none">
              {[
                'Your name',
                'Email address',
                'Phone number',
                'Order details (cake type, size, flavors, toppings, etc.)',
                'Requested pickup date',
                'Any notes or special requests you include',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#ff6b9d] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> collect or store payment information. Payments are handled
              separately (Venmo, cash, etc.) and no card data ever passes through this site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">How we use your information</h2>
            <p className="mb-3">Your information is used only to:</p>
            <ul className="space-y-1.5 list-none">
              {[
                'Review and confirm your order request',
                'Contact you with questions, confirmations, or updates about your order',
                'Schedule and fulfill your order',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#ff6b9d] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We will never sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Where your data is stored</h2>
            <p className="mb-3">
              Order submissions are stored securely and are only accessible to the bakery owner.
              Confirmation emails are sent via a third-party email service.
            </p>
            <p>
              Data is retained as long as needed to fulfill and follow up on orders. We don't keep
              your information longer than necessary.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Your rights</h2>
            <p>
              You can ask us to view or delete your personal information at any time. Just email us
              at <a href="mailto:orders@chucksbakes.com" className="text-[#ff6b9d] hover:underline font-medium">orders@chucksbakes.com</a> and
              we'll take care of it promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-3">Contact</h2>
            <p>
              Questions about this policy? Reach us at{' '}
              <a href="mailto:orders@chucksbakes.com" className="text-[#ff6b9d] hover:underline font-medium">
                orders@chucksbakes.com
              </a>.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400 italic">
              This privacy policy is provided for informational purposes only and does not
              constitute legal advice.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
