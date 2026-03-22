import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { OrderDraft, CartItem } from '../../lib/validation';
import { makeItemSummary } from '../../lib/summary';
import { useOrderStore } from '../../lib/state';

interface ReviewAndAddProps {
  draft: OrderDraft;
}

export function ReviewAndAdd({ draft }: ReviewAndAddProps) {
  const [itemAdded, setItemAdded] = useState(false);

  const addToCart = useOrderStore((state: any) => state.addToCart);
  const clearDraft = useOrderStore((state: any) => state.clearDraft);
  const cart = useOrderStore((state: any) => state.cart);
  const openCart = useOrderStore((state: any) => state.openCart);
  const showToast = useOrderStore((state: any) => state.showToast);

  const summary = makeItemSummary(draft);

  const handleAddToCart = () => {
    addToCart(draft as CartItem);
    showToast('✓ Item added to cart!', 'success');
    setItemAdded(true);
    clearDraft();
  };

  if (itemAdded) {
    return (
      <div className="text-center py-6">
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
            View Cart & Checkout
          </Button>

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
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Review your Cake
        </h2>
        <p className="text-gray-600 mb-6">
          Check the details below, then add to cart
        </p>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Item Summary</h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-bakery-cream p-4 rounded-lg">
          {summary}
        </pre>
      </Card>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAddToCart}
        className="flex items-center justify-center gap-2 py-4 font-semibold"
      >
        <ShoppingBag className="w-5 h-5" aria-hidden="true" />
        Add to Cart
      </Button>
    </div>
  );
}
