import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cakeConfigSchema, type CakeConfig } from '../../lib/validation';
import { CAKE_SIZES, CAKE_FLAVORS, CAKE_FILLINGS, FROSTING_OPTIONS, SMBC_FLAVORS, MAX_COLOR_CHIPS, MAX_THEME_LENGTH, PRESET_COLORS } from '../../lib/constants';
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
      frostingType: undefined,
      smbcFlavor: '',
      theme: '',
      colors: [],
    },
  });
  
  const frostingType = watch('frostingType');
  const colors = watch('colors') || [];
  const size = watch('size');
  
  const showSmbcFlavor = frostingType === 'smbc';
  const frostingHelper = FROSTING_OPTIONS.find(f => f.value === frostingType)?.helper;
  
  const handleColorToggle = (colorValue: string) => {
    const currentColors = colors || [];
    if (currentColors.includes(colorValue)) {
      // Remove color
      setValue('colors', currentColors.filter((c: string) => c !== colorValue), { shouldValidate: true });
    } else if (currentColors.length < MAX_COLOR_CHIPS) {
      // Add color
      setValue('colors', [...currentColors, colorValue], { shouldValidate: true });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Configure Your Cake
        </h2>
        <p className="text-gray-600 mb-6">
          Customize your perfect cake
        </p>
      </div>
      
      <RadioGroup
        label="Size"
        name="size"
        options={CAKE_SIZES}
        value={size}
        onChange={(value) => setValue('size', value, { shouldValidate: true })}
        error={errors.size?.message}
        required
      />
      
      <Select
        label="Flavor"
        options={CAKE_FLAVORS}
        placeholder="Select a flavor"
        error={errors.flavor?.message}
        required
        {...register('flavor')}
      />
      
      <Select
        label="Filling"
        options={CAKE_FILLINGS}
        placeholder="Select a filling"
        error={errors.filling?.message}
        required
        {...register('filling')}
      />
      
      <RadioGroup
        label="Frosting & Decoration"
        name="frostingType"
        options={FROSTING_OPTIONS}
        value={frostingType}
        onChange={(value) => setValue('frostingType', value as 'smbc' | 'american', { shouldValidate: true })}
        error={errors.frostingType?.message}
        required
      />
      
      {showSmbcFlavor && (
        <Select
          label="SMBC Flavor"
          options={SMBC_FLAVORS}
          placeholder="Select SMBC flavor"
          error={errors.smbcFlavor?.message}
          helperText="Flavor for Swiss Meringue Buttercream piping"
          required
          {...register('smbcFlavor')}
        />
      )}
      
      {frostingHelper && (
        <div className="p-3 bg-bakery-pink-50 rounded-lg border border-bakery-pink-200">
          <p className="text-sm text-gray-700">{frostingHelper}</p>
        </div>
      )}
      
      <Input
        label="Theme (optional)"
        placeholder="e.g., Birthday, Wedding, Anniversary"
        maxLength={MAX_THEME_LENGTH}
        error={errors.theme?.message}
        helperText={`Up to ${MAX_THEME_LENGTH} characters`}
        {...register('theme')}
      />
      
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Colors (optional)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select up to {MAX_COLOR_CHIPS} colors
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PRESET_COLORS.map((color) => {
            const isSelected = colors.includes(color.value);
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorToggle(color.value)}
                disabled={!isSelected && colors.length >= MAX_COLOR_CHIPS}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-sm font-medium
                  ${isSelected
                    ? 'border-[#ff6b9d] bg-[#fff5f7] text-black'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  ${!isSelected && colors.length >= MAX_COLOR_CHIPS
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer active:scale-95'
                  }
                `}
                aria-pressed={isSelected}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="truncate">{color.label}</span>
              </button>
            );
          })}
        </div>
        {colors.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {colors.length}/{MAX_COLOR_CHIPS}
          </p>
        )}
        {errors.colors && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {errors.colors.message}</span>
          </div>
        )}
      </div>
      
      <input type="submit" className="hidden" />
    </form>
  );
}

