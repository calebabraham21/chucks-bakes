import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import type { OrderDraft } from '../../lib/validation';
import { ITEMS, ITEM_LABELS } from '../../lib/constants';
import { classNames } from '../../lib/utils';

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
          
          {/* Configuration details */}
          {draft.itemType === ITEMS.CAKE && 'config' in draft && currentStep >= 2 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Configuration
              </p>
              <div className="space-y-1.5 text-sm text-gray-700">
                {draft.config.size && (
                  <p>Size: {draft.config.size}</p>
                )}
                {draft.config.flavor && (
                  <p>Flavor: {draft.config.flavor}</p>
                )}
                {draft.config.filling && (
                  <p>Filling: {draft.config.filling}</p>
                )}
                {draft.config.frostingFlavor && (
                  <p>Frosting: {draft.config.frostingFlavor}</p>
                )}
                {draft.config.writingStyle && draft.config.writingStyle !== 'none' && (
                  <p>Writing: {draft.config.writingText || draft.config.writingStyle}</p>
                )}
                {draft.config.toppings && draft.config.toppings.length > 0 && (
                  <p>Toppings: {draft.config.toppings.join(', ')}</p>
                )}
                {draft.config.theme && (
                  <p>Theme: {draft.config.theme}</p>
                )}
                {draft.config.colors && draft.config.colors.length > 0 && (
                  <p>Colors: {draft.config.colors.join(', ')}</p>
                )}
              </div>
            </div>
          )}
          
          {draft.itemType !== ITEMS.CAKE && 'order' in draft && currentStep >= 2 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Quantity
              </p>
              <p className="text-sm text-gray-700">
                {draft.order.quantity || '—'}
              </p>
            </div>
          )}
          
          {/* Contact info */}
          {'contact' in draft && draft.contact && currentStep >= 3 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Contact
              </p>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p>{draft.contact.name}</p>
                <p>{draft.contact.email}</p>
                {draft.contact.phone && <p>{draft.contact.phone}</p>}
                {draft.contact.targetDate && (
                  <p>Pickup: {draft.contact.targetDate}</p>
                )}
              </div>
            </div>
          )}
          
          {currentStep < 3 && (
            <p className="text-xs text-gray-500 italic">
              Continue to see full summary
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

