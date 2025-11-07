import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { treatOrderSchema, type TreatOrder } from '../../lib/validation';
import { TREAT_MINIMUMS, ITEM_LABELS } from '../../lib/constants';
import { Input } from '../ui/Input';
import type { ItemType } from '../../lib/constants';

interface ConfigureTreatsProps {
  itemType: ItemType;
  defaultValues?: Partial<TreatOrder>;
  onSubmit: (data: TreatOrder) => void;
}

export function ConfigureTreats({ itemType, defaultValues, onSubmit }: ConfigureTreatsProps) {
  const minimum = TREAT_MINIMUMS[itemType as keyof typeof TREAT_MINIMUMS];
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TreatOrder>({
    resolver: zodResolver(treatOrderSchema),
    defaultValues: defaultValues || {
      type: itemType as 'brownies' | 'cookies' | 'seasonal',
      quantity: minimum,
    },
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-bakery-cocoa mb-2" tabIndex={-1}>
          Configure Your Order
        </h2>
        <p className="text-bakery-brown-600 mb-6">
          {ITEM_LABELS[itemType]}
        </p>
      </div>
      
      <Input
        label="Quantity"
        type="number"
        min={0}
        step={1}
        placeholder={`Minimum ${minimum}`}
        error={errors.quantity?.message}
        helperText={`Enter 0 or at least ${minimum}`}
        required
        {...register('quantity', { valueAsNumber: true })}
      />
      
      <div className="p-4 bg-bakery-pink-50 rounded-xl border border-bakery-pink-200">
        <h3 className="font-medium text-bakery-cocoa mb-2">Order Details</h3>
        <ul className="text-sm text-bakery-brown-700 space-y-1">
          <li>• Minimum order: {minimum} {itemType}</li>
          <li>• Fresh baked to order</li>
          <li>• Perfect for parties and events</li>
        </ul>
      </div>
      
      <input type="submit" className="hidden" />
    </form>
  );
}

