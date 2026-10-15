import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { OrderDraft } from '../../lib/validation';
import { useOrderStore } from '../../lib/state';
import { buildRows } from '../../lib/summary';

interface ReviewAndAddProps {
  draft: OrderDraft;
}

export function ReviewAndAdd({ draft }: ReviewAndAddProps) {
  const [itemAdded, setItemAdded] = useState(false);

  const addToCart = useOrderStore((state) => state.addToCart);
  const clearDraft = useOrderStore((state) => state.clearDraft);
  const cart = useOrderStore((state) => state.cart);
  const openCart = useOrderStore((state) => state.openCart);
  const showToast = useOrderStore((state) => state.showToast);

  const rows = buildRows(draft);

  const handleAddToCart = () => {
    addToCart(draft);
    showToast('Item added to cart!', 'success');
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
          <ShoppingBag className="w-10 h-10 text-white" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">Added to Cart!</h2>
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
            onClick={() => { setItemAdded(false); clearDraft(); }}
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
      <Card className="mb-4">
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-1" tabIndex={-1}>
          Review your Cake
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Check the details below, then add to cart
        </p>

        <div className="divide-y divide-gray-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="py-3 flex flex-col sm:flex-row sm:gap-4">
              <span className="text-sm font-medium text-gray-500 sm:w-40 flex-shrink-0">{label}</span>
              <span className="text-sm text-gray-900 mt-0.5 sm:mt-0">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        All cakes are prepared in a home kitchen that also handles gluten, dairy, and nuts.
      </p>

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
