// Bakery offerings and configuration constants

export const ITEMS = {
  CAKE: 'cake',
  CUPCAKES: 'cupcakes',
  BROWNIES: 'brownies',
  COOKIES: 'cookies',
  SEASONAL: 'seasonal',
} as const;

export type ItemType = typeof ITEMS[keyof typeof ITEMS];

export const ITEM_LABELS = {
  [ITEMS.CAKE]: 'Custom Cake',
  [ITEMS.CUPCAKES]: 'Cupcakes',
  [ITEMS.BROWNIES]: 'Brownies',
  [ITEMS.COOKIES]: 'Chocolate Chip Cookies',
  [ITEMS.SEASONAL]: 'Seasonal: Apple Pie Almond Scones',
} as const;

export const ITEM_DESCRIPTIONS = {
  [ITEMS.CAKE]: 'Custom designed cake with your choice of flavors and decorations',
  [ITEMS.CUPCAKES]: 'Custom cupcakes with your choice of flavors and fillings (minimum 12)',
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

// Cupcake configurations
export const CUPCAKE_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'spice', label: 'Spice' },
  { value: 'funfetti', label: 'Funfetti' },
] as const;

export const MAX_CUPCAKE_FLAVORS = 2;
export const MAX_CUPCAKE_FILLINGS = 2;

// Treat minimums
export const TREAT_MINIMUMS = {
  [ITEMS.CUPCAKES]: 12,
  [ITEMS.BROWNIES]: 16,
  [ITEMS.COOKIES]: 12,
  [ITEMS.SEASONAL]: 6,
} as const;

// Treat batch/unit information
export const TREAT_UNITS = {
  [ITEMS.CUPCAKES]: {
    singular: 'dozen',
    plural: 'dozen',
    perUnit: 12,
    maxUnits: 10, // Allow up to 10 dozen
  },
  [ITEMS.BROWNIES]: {
    singular: 'pan',
    plural: 'pans',
    perUnit: 16,
    maxUnits: 6, // Allow up to 6 pans
  },
  [ITEMS.COOKIES]: {
    singular: 'dozen',
    plural: 'dozen',
    perUnit: 12,
    maxUnits: 10, // Allow up to 10 dozen
  },
  [ITEMS.SEASONAL]: {
    singular: 'batch',
    plural: 'batches',
    perUnit: 6,
    maxUnits: 8, // Allow up to 8 batches
  },
} as const;

// Contact & order
export const ORDER_EMAIL = 'orders@chucksbakes.com';

export const MAX_COLOR_CHIPS = 3;
export const MAX_THEME_LENGTH = 60;

// Preset color options for cakes
export const PRESET_COLORS = [
  { value: 'pink', label: 'Pink', hex: '#ff6b9d' },
  { value: 'lavender', label: 'Lavender', hex: '#c8a2d0' },
  { value: 'mint', label: 'Mint', hex: '#98d8c8' },
  { value: 'peach', label: 'Peach', hex: '#ffb088' },
  { value: 'sky-blue', label: 'Sky Blue', hex: '#87ceeb' },
  { value: 'lemon', label: 'Lemon', hex: '#fff44f' },
  { value: 'coral', label: 'Coral', hex: '#ff7f50' },
  { value: 'sage', label: 'Sage', hex: '#b2c9ab' },
  { value: 'lilac', label: 'Lilac', hex: '#c8a2c8' },
  { value: 'cream', label: 'Cream', hex: '#fffdd0' },
  { value: 'rose-gold', label: 'Rose Gold', hex: '#b76e79' },
  { value: 'white', label: 'White', hex: '#ffffff' },
] as const;

// Seasonal availability
export const SEASONAL_AVAILABILITY = 'through November';

