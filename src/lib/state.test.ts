import { beforeEach, describe, expect, it } from 'vitest';
import { useOrderStore } from './state';
import type { CartItem } from './validation';

const cake = (flavor: string): CartItem => ({
  itemType: 'cake',
  config: { size: '6in-3layer', flavor, filling: 'none', frostingFlavor: 'vanilla', toppings: [], colors: '' },
});

describe('order store', () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.setState({ cart: [], orderDraft: null, currentStep: 1, lastOrderId: null });
  });

  it('persists cart changes to localStorage', () => {
    const { addToCart, removeFromCart } = useOrderStore.getState();
    addToCart(cake('vanilla'));
    addToCart(cake('chocolate'));
    removeFromCart(0);

    expect(useOrderStore.getState().cart.map((i) => i.config.flavor)).toEqual(['chocolate']);
    expect(JSON.parse(localStorage.getItem('chucks-bakes-cart')!)).toHaveLength(1);
  });

  it('restores state from localStorage', () => {
    localStorage.setItem('chucks-bakes-cart', JSON.stringify([cake('spice')]));
    localStorage.setItem('chucks-bakes-current-step', '3');
    localStorage.setItem('chucks-bakes-last-order-id', JSON.stringify('CB-260101-1234'));

    useOrderStore.getState().loadFromLocalStorage();

    const state = useOrderStore.getState();
    expect(state.cart[0].config.flavor).toBe('spice');
    expect(state.currentStep).toBe(3);
    expect(state.lastOrderId).toBe('CB-260101-1234');
  });

  it('clearDraft resets the wizard', () => {
    const { setOrderDraft, setCurrentStep, clearDraft } = useOrderStore.getState();
    setOrderDraft(cake('vanilla'));
    setCurrentStep(3);
    clearDraft();

    expect(useOrderStore.getState()).toMatchObject({ orderDraft: null, currentStep: 1 });
    expect(localStorage.getItem('chucks-bakes-order-draft')).toBeNull();
  });
});
