// Bakery offerings and configuration constants

export const ITEMS = {
  CAKE: 'cake',
} as const;

export type ItemType = typeof ITEMS[keyof typeof ITEMS];

export const ITEM_LABELS = {
  [ITEMS.CAKE]: 'Custom Cake',
} as const;

export const ITEM_DESCRIPTIONS = {
  [ITEMS.CAKE]: 'Custom designed cake with your choice of flavors and decorations',
} as const;

// ========================================
// POLICIES
// ========================================
export const POLICIES = {
  advanceNotice: 'Orders must be placed at least 10 days in advance',
  cancellationFee: 'Cancellation fee is half of total once the order is confirmed',
  payment: 'Full payment required to secure order (invoice sent once order details are finalized)',
  pickup: 'All orders are pickup only in Arlington, VA',
  orderDenied: 'Orders may be denied at my discretion',
} as const;

// ========================================
// CAKE CONFIGURATIONS
// ========================================

// Cake sizes with pricing
export const CAKE_SIZES = [
  { value: '6in-3layer', label: '6" 3 Layer (serves 10-12) — starting at $110', price: 110, note: 'Writing on cake board if exceeding 7 characters' },
  { value: '8in-3layer', label: '8" 3 Layer (serves 20-25) — starting at $160', price: 160 },
  { value: '2tier', label: '2 Tier (contact for pricing)', price: null, note: 'Please inquire for pricing' },
  { value: '3tier', label: '3 Tier (serves 50-70) — contact for pricing', price: null, note: 'Please inquire for pricing' },
  { value: 'quarter-sheet', label: '¼ Sheet Cake (serves 20-30) — starting at $160', price: 160 },
  { value: 'half-sheet', label: '½ Sheet Cake (serves 40-50) — starting at $280', price: 280 },
] as const;

// Cake flavors
export const CAKE_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'funfetti', label: 'Funfetti' },
  { value: 'spice', label: 'Spice' },
  { value: 'orange-olive-oil', label: 'Orange Olive Oil (+$10)', upcharge: 10 },
  { value: 'almond', label: 'Almond' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'gf-chocolate', label: 'Gluten Free Chocolate' },
  { value: 'gf-vanilla', label: 'Gluten Free Vanilla' },
] as const;

// Cake fillings (+$5 base for most)
export const CAKE_FILLINGS = [
  { value: 'none', label: 'None - filled with Swiss Meringue Buttercream (same as outside)', upcharge: 0 },
  { value: 'raspberry-jam', label: 'Raspberry Jam (+$10)', upcharge: 10 },
  { value: 'cookies-and-cream', label: 'Cookies and Cream (+$5)', upcharge: 5 },
  { value: 'chocolate-buttercream', label: 'Chocolate Buttercream (+$5)', upcharge: 5 },
  { value: 'chocolate-ganache', label: 'Chocolate Ganache (+$10)', upcharge: 10 },
  { value: 'cream-cheese', label: 'Cream Cheese Frosting (+$5)', upcharge: 5 },
  { value: 'coconut-cream-cheese', label: 'Coconut Cream Cheese (+$5)', upcharge: 5 },
  { value: 'espresso-pastry-cream', label: 'Espresso Pastry Cream (+$10)', upcharge: 10 },
] as const;

// All cakes are frosted in Swiss Meringue Buttercream
export const SMBC_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'almond', label: 'Almond (+$3)', upcharge: 3 },
  { value: 'coconut', label: 'Coconut (+$3)', upcharge: 3 },
  { value: 'chocolate', label: 'Chocolate Buttercream', note: 'Cannot be dyed' },
] as const;

// Toppings
export const CAKE_TOPPINGS = [
  { value: 'sprinkles', label: 'Sprinkles' },
  { value: 'pearls', label: 'Pearls (+$10)', upcharge: 10 },
  { value: 'cherries', label: 'Cherries (+$5)', upcharge: 5 },
  { value: 'edible-glitter', label: 'Edible Glitter (+$10)', upcharge: 10 },
] as const;

// Writing styles
export const WRITING_STYLES = [
  { value: 'none', label: 'No Writing' },
  { value: 'classic-script', label: 'Classic Script' },
  { value: 'block', label: 'Block' },
  { value: 'fondant', label: 'Fondant (+$5)' },
  { value: 'chucks-choice', label: "Chuck's Choice (I'll pick what fits best!)" },
] as const;

// ========================================
// GENERAL
// ========================================

export const ORDER_EMAIL = 'orders@chucksbakes.com';

export const MAX_THEME_LENGTH = 100;
export const MAX_WRITING_LENGTH = 50;
export const MAX_TOPPINGS = 4;

