import type { OrderDraft } from './validation';
import { ITEMS, CAKE_SIZES, CAKE_FLAVORS, CAKE_FILLINGS, SMBC_FLAVORS, CAKE_TOPPINGS, WRITING_STYLES } from './constants';

type Option = { readonly value: string; readonly label: string };

export function optionLabel(options: readonly Option[], value: string): string {
  return options.find((o) => o.value === value)?.label || value;
}

/** Option label without pricing/serving details, e.g. `6" 3 Layer` or `Orange Olive Oil`. */
export function shortOptionLabel(options: readonly Option[], value: string): string {
  return optionLabel(options, value).split(/ \(| — /)[0];
}

export interface DetailRow {
  label: string;
  value: string;
}

/** Human-readable rows describing a cake configuration, for the review step and cart. */
export function buildRows(draft: OrderDraft): DetailRow[] {
  if (draft.itemType !== ITEMS.CAKE || !('config' in draft)) return [];
  const c = draft.config;
  const rows: DetailRow[] = [
    { label: 'Size', value: optionLabel(CAKE_SIZES, c.size) },
    { label: 'Cake Flavor', value: optionLabel(CAKE_FLAVORS, c.flavor) },
    { label: 'Filling', value: optionLabel(CAKE_FILLINGS, c.filling) },
    { label: 'Frosting', value: `Swiss Meringue Buttercream — ${optionLabel(SMBC_FLAVORS, c.frostingFlavor)}` },
  ];

  if (c.toppings?.length) {
    rows.push({ label: 'Toppings', value: c.toppings.map((t) => optionLabel(CAKE_TOPPINGS, t)).join(', ') });
  }

  if (c.writingStyle && c.writingStyle !== 'none') {
    rows.push({ label: 'Writing Style', value: optionLabel(WRITING_STYLES, c.writingStyle) });
    if (c.writingText) rows.push({ label: 'Writing Text', value: `"${c.writingText}"` });
  }

  if (c.theme) rows.push({ label: 'Theme / Design', value: c.theme });
  if (c.colors) rows.push({ label: 'Colors', value: c.colors });
  if (c.specialRequests) rows.push({ label: 'Special Requests', value: c.specialRequests });

  return rows;
}
