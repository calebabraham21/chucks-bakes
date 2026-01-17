import { ShoppingBag, Trash2 } from 'lucide-react';
import type { ItemType } from '../../lib/constants';
import { ITEMS, MAX_CART_ITEMS } from '../../lib/constants';
import { useOrderStore } from '../../lib/state';
import { Button } from '../ui/Button';

interface ChooseItemProps {
  onSelect: (itemType: ItemType) => void;
}

// Order items
const ORDER_ITEMS = [
  {
    itemType: ITEMS.CAKE,
    label: 'Custom Cake',
  },
  {
    itemType: ITEMS.BROWNIES,
    label: 'Brownies',
  },
  {
    itemType: ITEMS.COOKIES,
    label: 'Chocolate Chip Cookies',
  },
];

export function ChooseItem({ onSelect }: ChooseItemProps) {
  const cart = useOrderStore((state: any) => state.cart);
  const isCartFull = useOrderStore((state: any) => state.isCartFull);
  const openCart = useOrderStore((state: any) => state.openCart);
  const removeFromCart = useOrderStore((state: any) => state.removeFromCart);
  const cartIsFull = isCartFull();
  
  // If cart is full, show a message instead of item options
  if (cartIsFull) {
    return (
      <div className="text-center py-6">
        {/* Shopping bag icon with items badge */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#ff6b9d] to-[#ff8ba7] flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <span className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white text-sm font-bold rounded-full flex items-center justify-center border-4 border-white shadow-md">
            {cart.length}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-2">
          Your Order is Ready!
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          You have {cart.length} items in your cart. 
          <span className="font-semibold"> Proceed to checkout</span> or remove an item to add something else.
        </p>
        
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          {/* Primary CTA - Open Cart */}
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
          
          {/* Quick remove option */}
          <button
            onClick={() => removeFromCart(cart.length - 1)}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove last item to add something else
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {cart.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            You have {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart. 
            You can add {MAX_CART_ITEMS - cart.length} more.
          </p>
        </div>
      )}
      
      {ORDER_ITEMS.map((item) => (
        <button
          key={item.itemType}
          onClick={() => onSelect(item.itemType as ItemType)}
          className="w-full px-6 py-5 rounded-xl border-2 border-gray-200 bg-white hover:border-[#ff6b9d] hover:bg-[#fff5f7] transition-all duration-200 active:scale-[0.98] text-left group"
        >
          <span className="text-xl font-semibold text-black group-hover:text-[#ff6b9d] transition-colors">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
