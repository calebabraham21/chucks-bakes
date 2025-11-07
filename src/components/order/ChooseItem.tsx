import { Cake, Cookie, Cherry } from 'lucide-react';
import { Card } from '../ui/Card';
import { ITEMS, ITEM_LABELS, ITEM_DESCRIPTIONS } from '../../lib/constants';
import type { ItemType } from '../../lib/constants';

interface ChooseItemProps {
  onSelect: (itemType: ItemType) => void;
}

export function ChooseItem({ onSelect }: ChooseItemProps) {
  const items = [
    {
      type: ITEMS.CAKE,
      icon: Cake,
      color: 'text-bakery-pink-500',
    },
    {
      type: ITEMS.BROWNIES,
      icon: Cookie,
      color: 'text-bakery-brown-500',
    },
    {
      type: ITEMS.COOKIES,
      icon: Cookie,
      color: 'text-bakery-brown-600',
    },
    {
      type: ITEMS.SEASONAL,
      icon: Cherry,
      color: 'text-bakery-pink-600',
    },
  ];
  
  return (
    <div>
      <h2 id="step-heading" className="text-2xl font-semibold text-bakery-cocoa mb-2" tabIndex={-1}>
        Choose Your Item
      </h2>
      <p className="text-bakery-brown-600 mb-6">
        Select what you'd like to order
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          
          return (
            <Card
              key={item.type}
              hoverable
              onClick={() => onSelect(item.type)}
              className="cursor-pointer group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(item.type);
                }
              }}
              aria-label={`Select ${ITEM_LABELS[item.type]}`}
            >
              <div className="flex flex-col items-center text-center py-4">
                <div className={`p-4 rounded-2xl bg-bakery-cream mb-4 group-hover:scale-110 transition-smooth ${item.color}`}>
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-bakery-cocoa mb-2">
                  {ITEM_LABELS[item.type]}
                </h3>
                <p className="text-sm text-bakery-brown-600">
                  {ITEM_DESCRIPTIONS[item.type]}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

