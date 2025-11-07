// Bakery offerings and configuration constants

export const ITEMS = {
  CAKE: 'cake',
  BROWNIES: 'brownies',
  COOKIES: 'cookies',
  SEASONAL: 'seasonal',
} as const;

export type ItemType = typeof ITEMS[keyof typeof ITEMS];

export const ITEM_LABELS = {
  [ITEMS.CAKE]: 'Custom Cake',
  [ITEMS.BROWNIES]: 'Brownies',
  [ITEMS.COOKIES]: 'Chocolate Chip Cookies',
  [ITEMS.SEASONAL]: 'Seasonal: Apple Pie Almond Scones',
} as const;

export const ITEM_DESCRIPTIONS = {
  [ITEMS.CAKE]: 'Custom designed cake with your choice of flavors and decorations',
  [ITEMS.BROWNIES]: 'Rich, fudgy brownies (minimum 16)',
  [ITEMS.COOKIES]: 'Classic chocolate chip cookies (minimum 12)',
  [ITEMS.SEASONAL]: 'Apple Pie Almond Scones (through November, minimum 6)',
} as const;

// Cake configurations
export const CAKE_SIZES = [
  { value: '8-round', label: '8" round (serves 20–24)' },
  { value: '18x12-sheet', label: '18x12 sheet (serves 36–48)' },
] as const;

export const CAKE_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'orange-olive-oil', label: 'Orange Olive Oil' },
  { value: 'spice', label: 'Spice' },
  { value: 'funfetti', label: 'Funfetti' },
] as const;

export const CAKE_FILLINGS = [
  { value: 'raspberry-jam', label: 'Raspberry Jam' },
  { value: 'cream-cheese', label: 'Cream Cheese Frosting' },
  { value: 'dark-chocolate', label: 'Dark Chocolate Ganache' },
  { value: 'caramel', label: 'Caramel' },
] as const;

export const FROSTING_TYPES = {
  SMBC: 'smbc',
  AMERICAN: 'american',
} as const;

export const FROSTING_OPTIONS = [
  { 
    value: FROSTING_TYPES.SMBC, 
    label: 'Swiss Meringue Buttercream (SMBC)',
    helper: 'Piping decoration and writing will be Swiss Meringue Buttercream.',
  },
  { 
    value: FROSTING_TYPES.AMERICAN, 
    label: 'American Buttercream',
    helper: 'Natural frost; no piping or writing.',
  },
] as const;

export const SMBC_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'almond', label: 'Almond' },
  { value: 'coconut', label: 'Coconut' },
] as const;

// Treat minimums
export const TREAT_MINIMUMS = {
  [ITEMS.BROWNIES]: 16,
  [ITEMS.COOKIES]: 12,
  [ITEMS.SEASONAL]: 6,
} as const;

// Contact & order
export const ORDER_EMAIL = 'orders@chucksbakes.com';

export const MAX_COLOR_CHIPS = 3;
export const MAX_THEME_LENGTH = 60;

// Seasonal availability
export const SEASONAL_AVAILABILITY = 'through November';

