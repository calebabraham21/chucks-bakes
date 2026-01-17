import { create } from 'zustand';
import type { OrderDraft, CartItem, ContactInfo } from './validation';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from './utils';
import { MAX_CART_ITEMS } from './constants';

const ORDER_DRAFT_KEY = 'chucks-bakes-order-draft';
const CART_KEY = 'chucks-bakes-cart';
const CURRENT_STEP_KEY = 'chucks-bakes-current-step';
const LAST_ORDER_ID_KEY = 'chucks-bakes-last-order-id';
const CHECKOUT_CONTACT_KEY = 'chucks-bakes-checkout-contact';

interface OrderState {
  // Current order being built (on Order page)
  orderDraft: OrderDraft | null;
  currentStep: number;
  
  // Shopping cart - items without contact info
  cart: CartItem[];
  
  // Checkout state
  checkoutStep: number; // 1 = view cart, 2 = contact form, 3 = review
  checkoutContact: ContactInfo | null;
  
  // Last submitted order ID (for success page)
  lastOrderId: string | null;
  
  // Cart modal state
  isCartOpen: boolean;
  
  // Toast state (global)
  toast: { message: string; type: 'success' | 'error' | 'info'; isVisible: boolean };
  
  // Order page actions
  setOrderDraft: (draft: OrderDraft | null) => void;
  setCurrentStep: (step: number) => void;
  clearDraft: () => void;
  
  // Cart actions
  addToCart: (item: CartItem) => boolean; // Returns false if cart is full
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isCartFull: () => boolean;
  
  // Cart modal actions
  openCart: () => void;
  closeCart: () => void;
  
  // Toast actions
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  // Checkout actions
  setCheckoutStep: (step: number) => void;
  setCheckoutContact: (contact: ContactInfo | null) => void;
  resetCheckout: () => void;
  
  // Success page
  setLastOrderId: (orderId: string | null) => void;
  
  // Persistence
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderDraft: null,
  currentStep: 1,
  cart: [],
  checkoutStep: 1,
  checkoutContact: null,
  lastOrderId: null,
  isCartOpen: false,
  toast: { message: '', type: 'success' as const, isVisible: false },
  
  setOrderDraft: (draft: OrderDraft | null) => {
    set({ orderDraft: draft });
    const state = get();
    safeLocalStorageSet(ORDER_DRAFT_KEY, draft);
    safeLocalStorageSet(CURRENT_STEP_KEY, state.currentStep);
  },
  
  setCurrentStep: (step: number) => {
    set({ currentStep: step });
    safeLocalStorageSet(CURRENT_STEP_KEY, step);
  },
  
  clearDraft: () => {
    set({ orderDraft: null, currentStep: 1 });
    safeLocalStorageRemove(ORDER_DRAFT_KEY);
    safeLocalStorageRemove(CURRENT_STEP_KEY);
  },
  
  addToCart: (item: CartItem) => {
    const state = get();
    if (state.cart.length >= MAX_CART_ITEMS) {
      return false; // Cart is full
    }
    set((state: OrderState) => {
      const newCart = [...state.cart, item];
      safeLocalStorageSet(CART_KEY, newCart);
      return { cart: newCart };
    });
    return true;
  },
  
  removeFromCart: (index: number) => {
    set((state: OrderState) => {
      const newCart = state.cart.filter((_: CartItem, i: number) => i !== index);
      safeLocalStorageSet(CART_KEY, newCart);
      return { cart: newCart };
    });
  },
  
  clearCart: () => {
    set({ cart: [] });
    safeLocalStorageRemove(CART_KEY);
  },
  
  isCartFull: () => {
    return get().cart.length >= MAX_CART_ITEMS;
  },
  
  openCart: () => {
    set({ isCartOpen: true });
  },
  
  closeCart: () => {
    set({ isCartOpen: false });
  },
  
  showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    set({ toast: { message, type, isVisible: true } });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      set((state: OrderState) => {
        if (state.toast.message === message) {
          return { toast: { ...state.toast, isVisible: false } };
        }
        return state;
      });
    }, 4000);
  },
  
  hideToast: () => {
    set((state: OrderState) => ({ toast: { ...state.toast, isVisible: false } }));
  },
  
  setCheckoutStep: (step: number) => {
    set({ checkoutStep: step });
  },
  
  setCheckoutContact: (contact: ContactInfo | null) => {
    set({ checkoutContact: contact });
    if (contact) {
      safeLocalStorageSet(CHECKOUT_CONTACT_KEY, contact);
    } else {
      safeLocalStorageRemove(CHECKOUT_CONTACT_KEY);
    }
  },
  
  resetCheckout: () => {
    set({ checkoutStep: 1, checkoutContact: null });
    safeLocalStorageRemove(CHECKOUT_CONTACT_KEY);
  },
  
  setLastOrderId: (orderId: string | null) => {
    set({ lastOrderId: orderId });
    if (orderId) {
      safeLocalStorageSet(LAST_ORDER_ID_KEY, orderId);
    } else {
      safeLocalStorageRemove(LAST_ORDER_ID_KEY);
    }
  },
  
  loadFromLocalStorage: () => {
    const draft = safeLocalStorageGet<OrderDraft | null>(ORDER_DRAFT_KEY, null);
    const step = safeLocalStorageGet<number>(CURRENT_STEP_KEY, 1);
    const cart = safeLocalStorageGet<CartItem[]>(CART_KEY, []);
    const checkoutContact = safeLocalStorageGet<ContactInfo | null>(CHECKOUT_CONTACT_KEY, null);
    const lastOrderId = safeLocalStorageGet<string | null>(LAST_ORDER_ID_KEY, null);
    
    set({
      orderDraft: draft,
      currentStep: step,
      cart,
      checkoutContact,
      lastOrderId,
    });
  },
  
  saveToLocalStorage: () => {
    const state = get();
    safeLocalStorageSet(ORDER_DRAFT_KEY, state.orderDraft);
    safeLocalStorageSet(CURRENT_STEP_KEY, state.currentStep);
    safeLocalStorageSet(CART_KEY, state.cart);
  },
}));

// Initialize store from localStorage on module load
if (typeof window !== 'undefined') {
  useOrderStore.getState().loadFromLocalStorage();
}

