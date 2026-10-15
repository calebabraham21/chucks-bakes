import { create } from 'zustand';
import type { OrderDraft, CartItem } from './validation';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from './utils';

const ORDER_DRAFT_KEY = 'chucks-bakes-order-draft';
const CART_KEY = 'chucks-bakes-cart';
const CURRENT_STEP_KEY = 'chucks-bakes-current-step';
const LAST_ORDER_ID_KEY = 'chucks-bakes-last-order-id';

export type ToastType = 'success' | 'error' | 'info';

export interface OrderState {
  // Current order being built (on Order page)
  orderDraft: OrderDraft | null;
  currentStep: number;

  // Shopping cart
  cart: CartItem[];

  // Last submitted order ID (for success page)
  lastOrderId: string | null;

  // Cart modal state
  isCartOpen: boolean;

  // Toast state (global)
  toast: { message: string; type: ToastType; isVisible: boolean };

  // Order page actions
  setOrderDraft: (draft: OrderDraft | null) => void;
  setCurrentStep: (step: number) => void;
  clearDraft: () => void;

  // Cart actions
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Cart modal actions
  openCart: () => void;
  closeCart: () => void;

  // Toast actions
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;

  // Success page
  setLastOrderId: (orderId: string | null) => void;

  // Persistence
  loadFromLocalStorage: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderDraft: null,
  currentStep: 1,
  cart: [],
  lastOrderId: null,
  isCartOpen: false,
  toast: { message: '', type: 'success', isVisible: false },

  setOrderDraft: (draft) => {
    set({ orderDraft: draft });
    safeLocalStorageSet(ORDER_DRAFT_KEY, draft);
    safeLocalStorageSet(CURRENT_STEP_KEY, get().currentStep);
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
    safeLocalStorageSet(CURRENT_STEP_KEY, step);
  },

  clearDraft: () => {
    set({ orderDraft: null, currentStep: 1 });
    safeLocalStorageRemove(ORDER_DRAFT_KEY);
    safeLocalStorageRemove(CURRENT_STEP_KEY);
  },

  addToCart: (item) => {
    set((state) => {
      const newCart = [...state.cart, item];
      safeLocalStorageSet(CART_KEY, newCart);
      return { cart: newCart };
    });
    return true;
  },

  removeFromCart: (index) => {
    set((state) => {
      const newCart = state.cart.filter((_, i) => i !== index);
      safeLocalStorageSet(CART_KEY, newCart);
      return { cart: newCart };
    });
  },

  clearCart: () => {
    set({ cart: [] });
    safeLocalStorageRemove(CART_KEY);
  },

  openCart: () => {
    set({ isCartOpen: true });
  },

  closeCart: () => {
    set({ isCartOpen: false });
  },

  showToast: (message, type = 'success') => {
    set({ toast: { message, type, isVisible: true } });
    setTimeout(() => {
      set((state) => {
        if (state.toast.message === message) {
          return { toast: { ...state.toast, isVisible: false } };
        }
        return state;
      });
    }, 4000);
  },

  hideToast: () => {
    set((state) => ({ toast: { ...state.toast, isVisible: false } }));
  },

  setLastOrderId: (orderId) => {
    set({ lastOrderId: orderId });
    if (orderId) {
      safeLocalStorageSet(LAST_ORDER_ID_KEY, orderId);
    } else {
      safeLocalStorageRemove(LAST_ORDER_ID_KEY);
    }
  },

  loadFromLocalStorage: () => {
    set({
      orderDraft: safeLocalStorageGet<OrderDraft | null>(ORDER_DRAFT_KEY, null),
      currentStep: safeLocalStorageGet<number>(CURRENT_STEP_KEY, 1),
      cart: safeLocalStorageGet<CartItem[]>(CART_KEY, []),
      lastOrderId: safeLocalStorageGet<string | null>(LAST_ORDER_ID_KEY, null),
    });
  },
}));

// Initialize store from localStorage on module load
if (typeof window !== 'undefined') {
  useOrderStore.getState().loadFromLocalStorage();
}
