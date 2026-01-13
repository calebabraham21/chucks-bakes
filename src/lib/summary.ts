import type { OrderDraft, RequestItem, CakeConfig, TreatOrder } from './validation';
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
  
  // Toppings
  if (config.toppings && config.toppings.length > 0) {
    const toppingLabels = config.toppings.map(t => 
      CAKE_TOPPINGS.find(topping => topping.value === t)?.label || t
    );
    lines.push(`Toppings: ${toppingLabels.join(', ')}`);
  }
  
  // Writing
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
  
  if (config.colors && config.colors.length > 0) {
    lines.push(`Colors: ${config.colors.join(', ')}`);
  }
  
  if (config.specialRequests) {
    lines.push(`Special Requests: ${config.specialRequests}`);
  }
  
  return lines.join('\n');
}

// Generate human-readable summary for treat order
function summarizeTreatOrder(order: TreatOrder): string {
  return `Quantity: ${order.quantity}`;
}

// Generate plain text summary for a single draft or request item
export function makePlainTextSummary(item: OrderDraft | RequestItem): string {
  let lines: string[] = [];
  
  // Item type
  lines.push(`Item: ${ITEM_LABELS[item.itemType as keyof typeof ITEM_LABELS]}`);
  lines.push('');
  
  // Configuration details
  if (item.itemType === ITEMS.CAKE && 'config' in item) {
    lines.push(summarizeCakeConfig(item.config));
  } else if ('order' in item) {
    lines.push(summarizeTreatOrder(item.order));
  }
  
  // Contact information (if available)
  if ('contact' in item && item.contact) {
    lines.push('');
    lines.push('Contact Information:');
    lines.push(`Name: ${item.contact.name}`);
    lines.push(`Email: ${item.contact.email}`);
    
    if (item.contact.phone) {
      lines.push(`Phone: ${item.contact.phone}`);
    }
    
    lines.push(`Delivery Method: ${item.contact.deliveryMethod === 'pickup' ? 'Pickup in Arlington, VA' : 'Delivery (for larger orders)'}`);
    
    if (item.contact.targetDate) {
      lines.push(`Target Date: ${item.contact.targetDate}`);
    }
    
    if (item.contact.notes) {
      lines.push(`Notes: ${item.contact.notes}`);
    }
  }
  
  return lines.join('\n');
}

// Generate plain text summary for multiple items
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
