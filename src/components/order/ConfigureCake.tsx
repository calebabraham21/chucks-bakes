import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cakeConfigSchema, type CakeConfig } from '../../lib/validation';
import {
  CAKE_SIZES,
  CAKE_FLAVORS,
  CAKE_FILLINGS,
  SMBC_FLAVORS,
  CAKE_TOPPINGS,
  WRITING_STYLES,
  MAX_THEME_LENGTH,
  MAX_WRITING_LENGTH,
  MAX_TOPPINGS,
} from '../../lib/constants';
import { Select } from '../ui/Select';
import { RadioGroup } from '../ui/RadioGroup';
import { Input } from '../ui/Input';

interface ConfigureCakeProps {
  defaultValues?: Partial<CakeConfig>;
  onSubmit: (data: CakeConfig) => void;
}

export function ConfigureCake({ defaultValues, onSubmit }: ConfigureCakeProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CakeConfig>({
    resolver: zodResolver(cakeConfigSchema),
    defaultValues: defaultValues || {
      size: '',
      flavor: '',
      filling: '',
      frostingFlavor: '',
      toppings: [],
      writingStyle: '',
      writingText: '',
      theme: '',
      colors: '',
      specialRequests: '',
    },
  });

  const toppings = watch('toppings') || [];
  const size = watch('size');
  const writingStyle = watch('writingStyle');
  const frostingFlavor = watch('frostingFlavor');
  const flavor = watch('flavor');
  const filling = watch('filling');

  const isChocolateFrosting = frostingFlavor === 'chocolate';

  const selectedSize = CAKE_SIZES.find(s => s.value === size);
  const sizeNote = selectedSize && 'note' in selectedSize ? selectedSize.note : undefined;

  const handleToppingToggle = (toppingValue: string) => {
    const currentToppings = toppings || [];
    if (currentToppings.includes(toppingValue)) {
      setValue('toppings', currentToppings.filter((t: string) => t !== toppingValue), { shouldValidate: true });
    } else if (currentToppings.length < MAX_TOPPINGS) {
      setValue('toppings', [...currentToppings, toppingValue], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Configure Your Cake
        </h2>
        <p className="text-gray-600 mb-6">
          All cakes are frosted in Swiss Meringue Buttercream
        </p>
      </div>

      {/* Size */}
      <RadioGroup
        label="Size"
        name="size"
        options={CAKE_SIZES.map(s => ({ value: s.value, label: s.label }))}
        value={size}
        onChange={(value) => setValue('size', value, { shouldValidate: true })}
        error={errors.size?.message}
        required
      />

      {sizeNote && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">📝 {sizeNote}</p>
        </div>
      )}

      {/* Flavor */}
      <Select
        label="Cake Flavor"
        options={CAKE_FLAVORS.map(f => ({ value: f.value, label: f.label }))}
        placeholder="Select a flavor"
        value={flavor}
        onChange={(val) => setValue('flavor', val, { shouldValidate: true })}
        error={errors.flavor?.message}
        required
      />

      {/* Filling */}
      <Select
        label="Filling"
        options={CAKE_FILLINGS.map(f => ({ value: f.value, label: f.label }))}
        placeholder="Select a filling"
        value={filling}
        onChange={(val) => setValue('filling', val, { shouldValidate: true })}
        error={errors.filling?.message}
        required
      />

      {/* Frosting Flavor (SMBC) */}
      <Select
        label="Frosting Flavor (Swiss Meringue Buttercream)"
        options={SMBC_FLAVORS.map(f => ({ value: f.value, label: f.label }))}
        placeholder="Select frosting flavor"
        value={frostingFlavor}
        onChange={(val) => setValue('frostingFlavor', val, { shouldValidate: true })}
        error={errors.frostingFlavor?.message}
        required
      />

      {isChocolateFrosting && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">🍫 Chocolate frosted cakes cannot be dyed</p>
        </div>
      )}

      {/* Writing Style */}
      <Select
        label="Writing Style (optional)"
        options={WRITING_STYLES.map(w => ({ value: w.value, label: w.label }))}
        placeholder="Select writing style"
        value={writingStyle ?? ''}
        onChange={(val) => setValue('writingStyle', val, { shouldValidate: true })}
        error={errors.writingStyle?.message}
      />

      {writingStyle === 'fondant' && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">✏️ Fondant writing adds $5 to your order</p>
        </div>
      )}

      {writingStyle && writingStyle !== 'none' && (
        <Input
          label="What should the cake say?"
          placeholder="e.g., Happy Birthday Sarah!"
          maxLength={MAX_WRITING_LENGTH}
          error={errors.writingText?.message}
          helperText={`Up to ${MAX_WRITING_LENGTH} characters`}
          {...register('writingText')}
        />
      )}

      {/* Toppings */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Toppings (optional)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select up to {MAX_TOPPINGS} toppings. For specific toppings not listed, use the Special Requests box below.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CAKE_TOPPINGS.map((topping) => {
            const isSelected = toppings.includes(topping.value);
            return (
              <button
                key={topping.value}
                type="button"
                onClick={() => handleToppingToggle(topping.value)}
                disabled={!isSelected && toppings.length >= MAX_TOPPINGS}
                className={`
                  flex items-center justify-center px-3 py-2.5 rounded-xl border-2 transition-all text-sm font-medium
                  ${isSelected
                    ? 'border-[#ff6b9d] bg-[#fff5f7] text-black'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  ${!isSelected && toppings.length >= MAX_TOPPINGS
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer active:scale-95'
                  }
                `}
                aria-pressed={isSelected}
              >
                {topping.label}
              </button>
            );
          })}
        </div>
        {toppings.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {toppings.length}/{MAX_TOPPINGS}
          </p>
        )}
      </div>

      {/* Theme/Design */}
      <Input
        label="Theme/Design (optional)"
        placeholder="e.g., Birthday, Wedding, Floral, Princess"
        maxLength={MAX_THEME_LENGTH}
        error={errors.theme?.message}
        helperText="Describe the look you're going for"
        {...register('theme')}
      />

      {/* Colors */}
      {!isChocolateFrosting && (
        <Input
          label="Colors (optional)"
          placeholder="e.g., pink, lavender, sage"
          error={errors.colors?.message}
          helperText="Describe any color preferences for your cake"
          {...register('colors')}
        />
      )}

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-base font-medium text-gray-700 mb-2">
          Special Requests (optional)
        </label>
        <textarea
          id="specialRequests"
          rows={3}
          placeholder="Any specific toppings not listed above, dietary restrictions, or other requests..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#ff6b9d] focus:ring-2 focus:ring-[#ff6b9d]/20 focus:outline-none transition-colors"
          {...register('specialRequests')}
        />
        <p className="text-sm text-gray-500 mt-1">
          For specific toppings not listed, I can evaluate if your request can be accommodated
        </p>
      </div>

      <input type="submit" className="hidden" />
    </form>
  );
}
