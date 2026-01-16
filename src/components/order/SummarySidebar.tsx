import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import type { OrderDraft, CakeConfig, TreatOrder } from '../../lib/validation';
import { ITEMS, ITEM_LABELS } from '../../lib/constants';
import { classNames } from '../../lib/utils';

// Helper components to avoid IIFE type inference issues
function CakeConfigSummary({ config }: { config: CakeConfig }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Configuration
      </p>
      <div className="space-y-1.5 text-sm text-gray-700">
        {config.size && <p>Size: {config.size}</p>}
        {config.flavor && <p>Flavor: {config.flavor}</p>}
        {config.filling && <p>Filling: {config.filling}</p>}
        {config.frostingFlavor && <p>Frosting: {config.frostingFlavor}</p>}
        {config.writingStyle && config.writingStyle !== 'none' && (
          <p>Writing: {config.writingText || config.writingStyle}</p>
        )}
        {config.toppings && config.toppings.length > 0 && (
          <p>Toppings: {config.toppings.join(', ')}</p>
        )}
        {config.theme && <p>Theme: {config.theme}</p>}
        {config.colors && config.colors.length > 0 && (
          <p>Colors: {config.colors.join(', ')}</p>
        )}
      </div>
    </div>
  );
}

function TreatOrderSummary({ order }: { order: TreatOrder }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Quantity
      </p>
      <p className="text-sm text-gray-700">
        {order.quantity || '—'}
      </p>
    </div>
  );
}

interface SummarySidebarProps {
  draft: OrderDraft | null;
  currentStep: number;
}

export function SummarySidebar({ draft, currentStep }: SummarySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!draft) {
    return null;
  }
  
  const itemLabel = ITEM_LABELS[draft.itemType as keyof typeof ITEM_LABELS];
  
  return (
    <div className="lg:sticky lg:top-4">
      <Card padding="md" className="bg-bakery-pink-50/50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full mb-4 lg:cursor-default"
          aria-expanded={!isCollapsed}
          aria-controls="summary-content"
        >
          <h3 className="text-lg font-semibold text-black">
            Order Summary
          </h3>
          <span className="lg:hidden">
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </span>
        </button>
        
        <div
          id="summary-content"
          className={classNames(
            'space-y-4',
            isCollapsed && 'hidden lg:block'
          )}
        >
          {/* Item type */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Item
            </p>
            <p className="text-sm font-medium text-black">
              {itemLabel}
            </p>
          </div>
          
          {/* Configuration details - Cake */}
          {draft.itemType === ITEMS.CAKE && 'config' in draft && currentStep >= 2 && (
            <CakeConfigSummary config={(draft as { config: CakeConfig }).config} />
          )}
          
          {/* Configuration details - Treats */}
          {draft.itemType !== ITEMS.CAKE && 'order' in draft && currentStep >= 2 && (
            <TreatOrderSummary order={(draft as { order: TreatOrder }).order} />
          )}
          
          {currentStep < 2 && (
            <p className="text-xs text-gray-500 italic">
              Continue to see full summary
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

