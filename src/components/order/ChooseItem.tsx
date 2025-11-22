import { Cake, Cookie, Cherry } from 'lucide-react';
import { Card } from '../ui/Card';
import { ITEMS, ITEM_LABELS, ITEM_DESCRIPTIONS } from '../../lib/constants';
import { useOrderPage } from '../../lib/useOrderPage';
import type { ItemType } from '../../lib/constants';

interface ChooseItemProps {
  onSelect: (itemType: ItemType) => void;
}

export function ChooseItem({ onSelect }: ChooseItemProps) {
  const { orderPage } = useOrderPage();

  const items = [
    {
      type: ITEMS.CAKE,
      icon: Cake,
      color: 'text-bakery-pink-500',
    },
    {
      type: ITEMS.CUPCAKES,
      icon: Cake,
      color: 'text-bakery-pink-400',
    },
    {
      type: ITEMS.BROWNIES,
      icon: Cookie,
      color: 'text-gray-700',
    },
    {
      type: ITEMS.COOKIES,
      icon: Cookie,
      color: 'text-gray-800',
    },
    {
      type: ITEMS.SEASONAL,
      icon: Cherry,
      color: 'text-bakery-pink-600',
    },
  ];

  // Get labels and descriptions from Sanity or fallback to constants
  const getLabel = (itemType: ItemType) => {
    if (!orderPage) return ITEM_LABELS[itemType];
    switch (itemType) {
      case ITEMS.CAKE: return orderPage.cakeLabel || ITEM_LABELS[itemType];
      case ITEMS.CUPCAKES: return orderPage.cupcakesLabel || ITEM_LABELS[itemType];
      case ITEMS.BROWNIES: return orderPage.browniesLabel || ITEM_LABELS[itemType];
      case ITEMS.COOKIES: return orderPage.cookiesLabel || ITEM_LABELS[itemType];
      case ITEMS.SEASONAL: return orderPage.seasonalLabel || ITEM_LABELS[itemType];
      default: return ITEM_LABELS[itemType];
    }
  };

  const getDescription = (itemType: ItemType) => {
    if (!orderPage) return ITEM_DESCRIPTIONS[itemType];
    switch (itemType) {
      case ITEMS.CAKE: return orderPage.cakeDescription || ITEM_DESCRIPTIONS[itemType];
      case ITEMS.CUPCAKES: return orderPage.cupcakesDescription || ITEM_DESCRIPTIONS[itemType];
      case ITEMS.BROWNIES: return orderPage.browniesDescription || ITEM_DESCRIPTIONS[itemType];
      case ITEMS.COOKIES: return orderPage.cookiesDescription || ITEM_DESCRIPTIONS[itemType];
      case ITEMS.SEASONAL: return orderPage.seasonalDescription || ITEM_DESCRIPTIONS[itemType];
      default: return ITEM_DESCRIPTIONS[itemType];
    }
  };

  const title = orderPage?.chooseItemTitle || 'Choose Your Item';
  const subtitle = orderPage?.chooseItemSubtitle || "Select what you'd like to order";
  
  return (
    <div>
      <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
        {title}
      </h2>
      <p className="text-gray-600 mb-6">
        {subtitle}
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
              aria-label={`Select ${getLabel(item.type)}`}
            >
              <div className="flex flex-col items-center text-center py-4">
                <div className={`p-4 rounded-2xl bg-bakery-cream mb-4 group-hover:scale-110 transition-smooth ${item.color}`}>
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {getLabel(item.type)}
                </h3>
                <p className="text-sm text-gray-600">
                  {getDescription(item.type)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

