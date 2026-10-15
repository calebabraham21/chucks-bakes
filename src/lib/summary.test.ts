import { describe, expect, it } from 'vitest';
import { buildRows, shortOptionLabel } from './summary';
import { CAKE_FLAVORS, CAKE_SIZES } from './constants';
import type { CartItem } from './validation';

const item: CartItem = {
  itemType: 'cake',
  config: {
    size: '6in-3layer',
    flavor: 'orange-olive-oil',
    filling: 'raspberry-jam',
    frostingFlavor: 'vanilla',
    toppings: ['sprinkles', 'pearls'],
    writingStyle: 'classic-script',
    writingText: 'Happy Birthday',
    theme: 'Floral',
    colors: 'pink, sage',
    specialRequests: '',
  },
};

describe('buildRows', () => {
  it('maps option values to their display labels', () => {
    expect(buildRows(item)).toEqual([
      { label: 'Size', value: '6" 3 Layer (serves 10-12) — starting at $110' },
      { label: 'Cake Flavor', value: 'Orange Olive Oil (+$10)' },
      { label: 'Filling', value: 'Raspberry Jam (+$10)' },
      { label: 'Frosting', value: 'Swiss Meringue Buttercream — Vanilla' },
      { label: 'Toppings', value: 'Sprinkles, Pearls (+$10)' },
      { label: 'Writing Style', value: 'Classic Script' },
      { label: 'Writing Text', value: '"Happy Birthday"' },
      { label: 'Theme / Design', value: 'Floral' },
      { label: 'Colors', value: 'pink, sage' },
    ]);
  });

  it('omits writing rows when no writing is requested', () => {
    const rows = buildRows({ ...item, config: { ...item.config, writingStyle: 'none' } });
    expect(rows.map((r) => r.label)).not.toContain('Writing Style');
    expect(rows.map((r) => r.label)).not.toContain('Writing Text');
  });
});

describe('shortOptionLabel', () => {
  it('drops serving and pricing details', () => {
    expect(shortOptionLabel(CAKE_SIZES, '6in-3layer')).toBe('6" 3 Layer');
    expect(shortOptionLabel(CAKE_SIZES, '2tier')).toBe('2 Tier');
    expect(shortOptionLabel(CAKE_SIZES, 'half-sheet')).toBe('½ Sheet Cake');
    expect(shortOptionLabel(CAKE_FLAVORS, 'orange-olive-oil')).toBe('Orange Olive Oil');
  });

  it('falls back to the raw value for unknown options', () => {
    expect(shortOptionLabel(CAKE_FLAVORS, 'mystery')).toBe('mystery');
  });
});
