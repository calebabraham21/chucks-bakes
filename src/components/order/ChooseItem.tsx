import type { ItemType } from '../../lib/constants';
import { ITEMS } from '../../lib/constants';
import { Button } from '../ui/Button';

interface ChooseItemProps {
  onSelect: (itemType: ItemType) => void;
}

const ORDER_ITEMS = [
  {
    itemType: ITEMS.CAKE,
    label: 'Custom Cake',
  },
];

export function ChooseItem({ onSelect }: ChooseItemProps) {
  return (
    <div className="space-y-3">
      {ORDER_ITEMS.map((item) => (
        <button
          key={item.itemType}
          onClick={() => onSelect(item.itemType as ItemType)}
          className="w-full px-6 py-5 rounded-xl border-2 border-gray-200 bg-white hover:border-[#ff6b9d] hover:bg-[#fff5f7] transition-all duration-200 active:scale-[0.98] text-left group"
        >
          <span className="text-xl font-semibold text-black group-hover:text-[#ff6b9d] transition-colors">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
