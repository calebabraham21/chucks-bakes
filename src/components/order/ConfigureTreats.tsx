import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { treatOrderSchema, type TreatOrder } from '../../lib/validation';
import { TREAT_UNITS, ITEM_LABELS } from '../../lib/constants';
import type { ItemType } from '../../lib/constants';

interface ConfigureTreatsProps {
  itemType: ItemType;
  defaultValues?: Partial<TreatOrder>;
  onSubmit: (data: TreatOrder) => void;
}

export function ConfigureTreats({ itemType, defaultValues, onSubmit }: ConfigureTreatsProps) {
  const unitInfo = TREAT_UNITS[itemType as keyof typeof TREAT_UNITS];
  
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TreatOrder>({
    resolver: zodResolver(treatOrderSchema),
    defaultValues: defaultValues || {
      type: itemType as 'brownies' | 'cookies' | 'seasonal',
      quantity: unitInfo.perUnit, // Start with 1 unit
    },
  });
  
  const quantity = watch('quantity');
  const selectedUnits = Math.floor(quantity / unitInfo.perUnit);
  
  // Generate unit options (1 pan, 2 pans, etc.)
  const unitOptions = Array.from({ length: unitInfo.maxUnits }, (_, i) => {
    const units = i + 1;
    const totalQuantity = units * unitInfo.perUnit;
    const unitLabel = units === 1 ? unitInfo.singular : unitInfo.plural;
    return {
      units,
      quantity: totalQuantity,
      label: `${units} ${unitLabel} (${totalQuantity} ${itemType})`,
    };
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Configure Your Order
        </h2>
        <p className="text-gray-600 mb-6">
          {ITEM_LABELS[itemType]}
        </p>
      </div>
      
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Quantity <span className="text-red-600">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select how many {unitInfo.plural} you'd like
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unitOptions.map((option) => {
            const isSelected = quantity === option.quantity;
            return (
              <button
                key={option.units}
                type="button"
                onClick={() => setValue('quantity', option.quantity, { shouldValidate: true })}
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium text-left
                  ${isSelected
                    ? 'border-[#ff6b9d] bg-[#fff5f7] text-black'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  cursor-pointer active:scale-95
                `}
                aria-pressed={isSelected}
              >
                <div className="font-bold">{option.units} {option.units === 1 ? unitInfo.singular : unitInfo.plural}</div>
                <div className="text-xs text-gray-600 mt-1">{option.quantity} {itemType}</div>
              </button>
            );
          })}
        </div>
        {errors.quantity && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {errors.quantity.message}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-bakery-pink-50 rounded-xl border border-bakery-pink-200">
        <h3 className="font-medium text-black mb-2">Order Details</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Fresh baked to order</li>
          <li>• Perfect for parties and events</li>
          {selectedUnits > 0 && (
            <li className="font-medium text-black pt-2">
              • Your order: {selectedUnits} {selectedUnits === 1 ? unitInfo.singular : unitInfo.plural} ({quantity} {itemType})
            </li>
          )}
        </ul>
      </div>
      
      <input type="submit" className="hidden" />
    </form>
  );
}
