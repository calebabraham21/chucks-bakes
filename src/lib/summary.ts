import type { OrderDraft, RequestItem, CakeConfig, CupcakeConfig, TreatOrder } from './validation';
import { ITEMS, ITEM_LABELS, CAKE_SIZES, CAKE_FLAVORS, CUPCAKE_FLAVORS, CAKE_FILLINGS, FROSTING_OPTIONS, SMBC_FLAVORS } from './constants';

// Generate human-readable summary for cake configuration
function summarizeCakeConfig(config: CakeConfig): string {
  const size = CAKE_SIZES.find(s => s.value === config.size)?.label || config.size;
  const flavor = CAKE_FLAVORS.find(f => f.value === config.flavor)?.label || config.flavor;
  const filling = CAKE_FILLINGS.find(f => f.value === config.filling)?.label || config.filling;
  const frosting = FROSTING_OPTIONS.find(f => f.value === config.frostingType)?.label || config.frostingType;
  
  let lines = [
    `Size: ${size}`,
    `Flavor: ${flavor}`,
    `Filling: ${filling}`,
    `Frosting: ${frosting}`,
  ];
  
  if (config.frostingType === 'smbc' && config.smbcFlavor) {
    const smbcFlavor = SMBC_FLAVORS.find(f => f.value === config.smbcFlavor)?.label || config.smbcFlavor;
    lines.push(`SMBC Flavor: ${smbcFlavor}`);
  }
  
  if (config.theme) {
    lines.push(`Theme: ${config.theme}`);
  }
  
  if (config.colors && config.colors.length > 0) {
    lines.push(`Colors: ${config.colors.join(', ')}`);
  }
  
  return lines.join('\n');
}

// Generate human-readable summary for cupcake configuration
function summarizeCupcakeConfig(config: CupcakeConfig): string {
  let lines = [
    `Quantity: ${config.quantity}`,
  ];
  
  if (config.flavors && config.flavors.length > 0) {
    const flavorLabels = config.flavors.map(f => 
      CUPCAKE_FLAVORS.find(flavor => flavor.value === f)?.label || f
    );
    lines.push(`Flavors: ${flavorLabels.join(', ')}`);
  }
  
  if (config.fillings && config.fillings.length > 0) {
    const fillingLabels = config.fillings.map(f => 
      CAKE_FILLINGS.find(filling => filling.value === f)?.label || f
    );
    lines.push(`Fillings: ${fillingLabels.join(', ')}`);
  }
  
  if (config.smbcFlavor) {
    const smbcFlavor = SMBC_FLAVORS.find(f => f.value === config.smbcFlavor)?.label || config.smbcFlavor;
    lines.push(`Buttercream: ${smbcFlavor}`);
  }
  
  if (config.theme) {
    lines.push(`Theme: ${config.theme}`);
  }
  
  if (config.colors && config.colors.length > 0) {
    lines.push(`Colors: ${config.colors.join(', ')}`);
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
  } else if (item.itemType === ITEMS.CUPCAKES && 'config' in item) {
    lines.push(summarizeCupcakeConfig(item.config));
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
    
    if (item.contact.targetDate) {
      lines.push(`Target Pickup Date: ${item.contact.targetDate}`);
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

