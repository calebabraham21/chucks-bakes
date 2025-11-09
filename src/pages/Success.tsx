import { Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Success() {
  return (
    <div className="min-h-screen bg-[#fde7ee] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card padding="lg" className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle className="w-12 h-12" aria-hidden="true" />
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4">
            Order Request Sent!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order request! We've received your details and 
            will get back to you shortly to confirm and discuss next steps.
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <p className="text-sm text-gray-600 bg-bakery-cream p-4 rounded-xl">
              💌 Check your email for a confirmation. We typically respond within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/" className="flex-1">
                <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" aria-hidden="true" />
                  Back to Home
                </Button>
              </Link>
              
              <Link to="/order" className="flex-1">
                <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  New Order
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

