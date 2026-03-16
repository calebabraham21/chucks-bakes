import type { OrderDraft, RequestItem, CartItem, CakeConfig, ContactInfo } from './validation';
import { ITEMS, ITEM_LABELS, CAKE_SIZES, CAKE_FLAVORS, CAKE_FILLINGS, SMBC_FLAVORS, CAKE_TOPPINGS, WRITING_STYLES } from './constants';

// Generate human-readable summary for cake configuration
function summarizeCakeConfig(config: CakeConfig): string {
  const size = CAKE_SIZES.find(s => s.value === config.size)?.label || config.size;
  const flavor = CAKE_FLAVORS.find(f => f.value === config.flavor)?.label || config.flavor;
  const filling = CAKE_FILLINGS.find(f => f.value === config.filling)?.label || config.filling;
  const frostingFlavor = SMBC_FLAVORS.find(f => f.value === config.frostingFlavor)?.label || config.frostingFlavor;

  let lines = [
    `Size: ${size}`,
    `Cake Flavor: ${flavor}`,
    `Filling: ${filling}`,
    `Frosting: Swiss Meringue Buttercream - ${frostingFlavor}`,
  ];

  if (config.toppings && config.toppings.length > 0) {
    const toppingLabels = config.toppings.map(t =>
      CAKE_TOPPINGS.find(topping => topping.value === t)?.label || t
    );
    lines.push(`Toppings: ${toppingLabels.join(', ')}`);
  }

  if (config.writingStyle && config.writingStyle !== 'none') {
    const writingStyleLabel = WRITING_STYLES.find(w => w.value === config.writingStyle)?.label || config.writingStyle;
    lines.push(`Writing Style: ${writingStyleLabel}`);
    if (config.writingText) {
      lines.push(`Writing Text: "${config.writingText}"`);
    }
  }

  if (config.theme) {
    lines.push(`Theme/Design: ${config.theme}`);
  }

  if (config.colors) {
    lines.push(`Colors: ${config.colors}`);
  }

  if (config.specialRequests) {
    lines.push(`Special Requests: ${config.specialRequests}`);
  }

  return lines.join('\n');
}

// Generate summary for a cart item (no contact info)
export function makeItemSummary(item: OrderDraft | CartItem): string {
  let lines: string[] = [];
  lines.push(`Item: ${ITEM_LABELS[item.itemType as keyof typeof ITEM_LABELS]}`);
  lines.push('');
  if (item.itemType === ITEMS.CAKE && 'config' in item) {
    lines.push(summarizeCakeConfig(item.config));
  }
  return lines.join('\n');
}

// Generate summary for cart items (for display in cart)
export function makeCartSummary(items: CartItem[]): string {
  if (items.length === 0) {
    return 'No items in cart.';
  }

  const itemSummaries = items.map((item, index) => {
    const separator = '-'.repeat(40);
    return `${separator}\nITEM ${index + 1}\n${separator}\n\n${makeItemSummary(item)}`;
  });

  return itemSummaries.join('\n\n');
}

// Generate plain text summary for a single request item (with contact info)
export function makePlainTextSummary(item: RequestItem): string {
  let lines: string[] = [];

  lines.push(`Item: ${ITEM_LABELS[item.itemType as keyof typeof ITEM_LABELS]}`);
  lines.push('');

  if (item.itemType === ITEMS.CAKE && 'config' in item) {
    lines.push(summarizeCakeConfig(item.config));
  }

  if (item.contact) {
    lines.push('');
    lines.push('Contact Information:');
    lines.push(`Name: ${item.contact.name}`);
    lines.push(`Email: ${item.contact.email}`);
    if (item.contact.phone) {
      lines.push(`Phone: ${item.contact.phone}`);
    }
    lines.push(`Pickup: Arlington, VA`);
    if (item.contact.targetDate) {
      lines.push(`Target Date: ${item.contact.targetDate}`);
    }
    if (item.contact.notes) {
      lines.push(`Notes: ${item.contact.notes}`);
    }
  }

  return lines.join('\n');
}

// Format contact info for display
export function formatContactInfo(contact: ContactInfo): string {
  let lines: string[] = [];
  lines.push(`Name: ${contact.name}`);
  lines.push(`Email: ${contact.email}`);
  if (contact.phone) {
    lines.push(`Phone: ${contact.phone}`);
  }
  lines.push(`Pickup: Arlington, VA`);
  lines.push(`Target Date: ${contact.targetDate}`);
  if (contact.notes) {
    lines.push(`Notes: ${contact.notes}`);
  }
  return lines.join('\n');
}

// Generate plain text summary for multiple request items (with contact)
export function makeCombinedPlainTextSummary(items: RequestItem[]): string {
  if (items.length === 0) {
    return 'No items in request.';
  }

  const itemSummaries = items.map((item, index) => {
    const separator = '='.repeat(50);
    return `${separator}\nITEM ${index + 1}\n${separator}\n\n${makePlainTextSummary(item)}`;
  });

  return itemSummaries.join('\n\n');
}

// Generate full order summary with items and contact (for checkout review)
export function makeOrderSummary(items: CartItem[], contact: ContactInfo): string {
  let parts: string[] = [];

  parts.push('ORDER ITEMS');
  parts.push('='.repeat(50));
  items.forEach((item, index) => {
    parts.push(`\nItem ${index + 1}: ${ITEM_LABELS[item.itemType as keyof typeof ITEM_LABELS]}`);
    parts.push('-'.repeat(30));
    if (item.itemType === ITEMS.CAKE && 'config' in item) {
      parts.push(summarizeCakeConfig(item.config));
    }
  });

  parts.push('\n' + '='.repeat(50));
  parts.push('CONTACT & PICKUP');
  parts.push('='.repeat(50));
  parts.push(formatContactInfo(contact));

  return parts.join('\n');
}

// Generate email subject
export function makeSubject(itemCount: number = 1): string {
  if (itemCount === 1) {
    return "Chuck's Bakes Order Request";
  }
  return `Chuck's Bakes Order Request (${itemCount} items)`;
}

// Generate mailto link
export function makeMailtoLink(items: RequestItem[]): string {
  const subject = encodeURIComponent(makeSubject(items.length));
  const body = encodeURIComponent(makeCombinedPlainTextSummary(items));
  return `mailto:orders@chucksbakes.com?subject=${subject}&body=${body}`;
}
