import { useState } from 'react';
import { ShoppingBag, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';
import type { OrderDraft, CartItem } from '../../lib/validation';
import { makeItemSummary } from '../../lib/summary';
import { useOrderStore } from '../../lib/state';
import { MAX_CART_ITEMS } from '../../lib/constants';

interface ReviewAndAddProps {
  draft: OrderDraft;
}

export function ReviewAndAdd({ draft }: ReviewAndAddProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [itemAdded, setItemAdded] = useState(false);
  
  const addToCart = useOrderStore((state: any) => state.addToCart);
  const clearDraft = useOrderStore((state: any) => state.clearDraft);
  const cart = useOrderStore((state: any) => state.cart);
  const isCartFull = useOrderStore((state: any) => state.isCartFull);
  
  const summary = makeItemSummary(draft);
  const cartIsFull = isCartFull();
  
  const handleAddToCart = () => {
    // Try to add item to cart
    const success = addToCart(draft as CartItem);
    
    if (success) {
      // Show success state
      setItemAdded(true);
      setToastMessage('Item added to cart!');
      setToastType('success');
      setShowToast(true);
      
      // Clear current draft
      clearDraft();
    } else {
      // Cart is full
      setToastMessage(`Cart is full (max ${MAX_CART_ITEMS} items). Please checkout first.`);
      setToastType('error');
      setShowToast(true);
    }
  };
  
  // After adding, show options to continue or checkout
  if (itemAdded) {
    const cartNowFull = cart.length >= MAX_CART_ITEMS;
    
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-black mb-2">
          Added to Cart!
        </h2>
        <p className="text-gray-600 mb-6">
          You now have {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart.
          {cartNowFull && ' (Cart is full)'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          {!cartNowFull && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setItemAdded(false);
                clearDraft();
              }}
              className="flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Add Another Item
            </Button>
          )}
          
          <Link to="/" className={cartNowFull ? 'w-full max-w-xs mx-auto' : 'flex-1'}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartNowFull ? 'Proceed to Checkout' : 'View Cart & Checkout'}
            </Button>
          </Link>
        </div>
        
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    );
  }
  
  return (
    <div>
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Review Your Item
        </h2>
        <p className="text-gray-600 mb-6">
          Check the details below, then add to cart
        </p>
      </div>
      
      {/* Cart full warning */}
      {cartIsFull && (
        <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Cart is full</p>
            <p className="text-sm text-amber-700">
              You have {MAX_CART_ITEMS} items in your cart. Please checkout before adding more.
            </p>
          </div>
        </div>
      )}
      
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Item Summary</h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-bakery-cream p-4 rounded-lg">
          {summary}
        </pre>
      </Card>
      
      <div className="space-y-4">
        {cartIsFull ? (
          <Link to="/" className="block">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              Go to Cart & Checkout
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            Add to Cart ({cart.length}/{MAX_CART_ITEMS})
          </Button>
        )}
        
        <p className="text-sm text-gray-600 text-center">
          {cartIsFull 
            ? 'Complete your current order before adding more items.'
            : `You can add up to ${MAX_CART_ITEMS} items per order.`
          }
        </p>
      </div>
      
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
