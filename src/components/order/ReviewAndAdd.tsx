import { useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { OrderDraft, CartItem } from '../../lib/validation';
import { useOrderStore } from '../../lib/state';
import {
  ITEMS,
  CAKE_SIZES,
  CAKE_FLAVORS,
  CAKE_FILLINGS,
  SMBC_FLAVORS,
  CAKE_TOPPINGS,
  WRITING_STYLES,
} from '../../lib/constants';

interface ReviewAndAddProps {
  draft: OrderDraft;
}

function buildRows(draft: OrderDraft): { label: string; value: string }[] {
  if (draft.itemType !== ITEMS.CAKE || !('config' in draft)) return [];
  const c = draft.config;
  const rows: { label: string; value: string }[] = [];

  const size = CAKE_SIZES.find(s => s.value === c.size)?.label || c.size;
  const flavor = CAKE_FLAVORS.find(f => f.value === c.flavor)?.label || c.flavor;
  const filling = CAKE_FILLINGS.find(f => f.value === c.filling)?.label || c.filling;
  const frosting = SMBC_FLAVORS.find(f => f.value === c.frostingFlavor)?.label || c.frostingFlavor;

  rows.push({ label: 'Size', value: size });
  rows.push({ label: 'Cake Flavor', value: flavor });
  rows.push({ label: 'Filling', value: filling });
  rows.push({ label: 'Frosting', value: `Swiss Meringue Buttercream — ${frosting}` });

  if (c.toppings?.length) {
    const labels = c.toppings.map(t => CAKE_TOPPINGS.find(tp => tp.value === t)?.label || t);
    rows.push({ label: 'Toppings', value: labels.join(', ') });
  }

  if (c.writingStyle && c.writingStyle !== 'none') {
    const styleLabel = WRITING_STYLES.find(w => w.value === c.writingStyle)?.label || c.writingStyle;
    rows.push({ label: 'Writing Style', value: styleLabel });
    if (c.writingText) rows.push({ label: 'Writing Text', value: `"${c.writingText}"` });
  }

  if (c.theme) rows.push({ label: 'Theme / Design', value: c.theme });
  if (c.colors) rows.push({ label: 'Colors', value: c.colors });
  if (c.specialRequests) rows.push({ label: 'Special Requests', value: c.specialRequests });

  return rows;
}

export function ReviewAndAdd({ draft }: ReviewAndAddProps) {
  const [itemAdded, setItemAdded] = useState(false);

  const addToCart = useOrderStore((state: any) => state.addToCart);
  const clearDraft = useOrderStore((state: any) => state.clearDraft);
  const cart = useOrderStore((state: any) => state.cart);
  const openCart = useOrderStore((state: any) => state.openCart);
  const showToast = useOrderStore((state: any) => state.showToast);

  const rows = buildRows(draft);

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
