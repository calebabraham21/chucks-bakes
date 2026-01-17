import { useState } from 'react';
import { ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { OrderDraft, CartItem } from '../../lib/validation';
import { makeItemSummary } from '../../lib/summary';
import { useOrderStore } from '../../lib/state';
import { MAX_CART_ITEMS } from '../../lib/constants';

interface ReviewAndAddProps {
  draft: OrderDraft;
}

export function ReviewAndAdd({ draft }: ReviewAndAddProps) {
  const [itemAdded, setItemAdded] = useState(false);
  
  const addToCart = useOrderStore((state: any) => state.addToCart);
  const clearDraft = useOrderStore((state: any) => state.clearDraft);
  const cart = useOrderStore((state: any) => state.cart);
  const isCartFull = useOrderStore((state: any) => state.isCartFull);
  const openCart = useOrderStore((state: any) => state.openCart);
  const showToast = useOrderStore((state: any) => state.showToast);
  const removeFromCart = useOrderStore((state: any) => state.removeFromCart);
  
  const summary = makeItemSummary(draft);
  const cartIsFull = isCartFull();
  
  const handleAddToCart = () => {
    // Try to add item to cart
    const success = addToCart(draft as CartItem);
    
    if (success) {
      // Show global toast
      showToast('✓ Item added to cart!', 'success');
      
      // Show success state
      setItemAdded(true);
      
      // Clear current draft
      clearDraft();
    } else {
      // Cart is full - show error toast
      showToast(`Cart is full! Max ${MAX_CART_ITEMS} items per order.`, 'error');
    }
  };
  
  // After adding, show options to continue or checkout
  if (itemAdded) {
    const cartNowFull = cart.length >= MAX_CART_ITEMS;
    
    return (
      <div className="text-center py-6">
        {/* Success checkmark with animation */}
        <div 
          className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center success-pop shadow-lg"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}
        >
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-2">
          Added to Cart!
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in your order
          {cartNowFull && <span className="block text-sm text-green-600 font-semibold mt-1">Cart is full - ready to checkout!</span>}
        </p>
        
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={openCart}
            className="flex items-center justify-center gap-2 text-lg py-4 font-semibold"
          >
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            {cartNowFull ? 'Checkout Now' : 'View Cart & Checkout'}
          </Button>
          
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
              Add Another Item ({cart.length}/{MAX_CART_ITEMS})
            </Button>
          )}
        </div>
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
        <div className="mb-4 p-4 bg-[#fff5f7] rounded-xl border-2 border-[#ff6b9d] flex items-start gap-3">
          <ShoppingBag className="w-5 h-5 text-[#ff6b9d] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-black">Cart is full!</p>
            <p className="text-sm text-gray-700">
              You have {MAX_CART_ITEMS} items. Checkout now or remove an item to add something else.
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
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={openCart}
              className="flex items-center justify-center gap-2 py-4 text-lg font-semibold"
            >
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              View Cart & Checkout
            </Button>
            
            <button
              onClick={() => removeFromCart(cart.length - 1)}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove last item to add this instead
            </button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 py-4 font-semibold"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            Add to Cart ({cart.length}/{MAX_CART_ITEMS})
          </Button>
        )}
        
        <p className="text-sm text-gray-600 text-center">
          {cartIsFull 
            ? 'Complete checkout to place your order!'
            : `You can add up to ${MAX_CART_ITEMS} items per order. One order at a time!`
          }
        </p>
      </div>
    </div>
  );
}
