import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cupcakeConfigSchema, type CupcakeConfig } from '../../lib/validation';
import { CUPCAKE_FLAVORS, CAKE_FILLINGS, SMBC_FLAVORS, MAX_CUPCAKE_FLAVORS, MAX_CUPCAKE_FILLINGS, MAX_COLOR_CHIPS, MAX_THEME_LENGTH, PRESET_COLORS, TREAT_UNITS, ITEMS } from '../../lib/constants';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

interface ConfigureCupcakesProps {
  defaultValues?: Partial<CupcakeConfig>;
  onSubmit: (data: CupcakeConfig) => void;
}

export function ConfigureCupcakes({ defaultValues, onSubmit }: ConfigureCupcakesProps) {
  const unitInfo = TREAT_UNITS[ITEMS.CUPCAKES];
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CupcakeConfig>({
    resolver: zodResolver(cupcakeConfigSchema),
    defaultValues: defaultValues || {
      quantity: unitInfo.perUnit,
      flavors: [],
      fillings: [],
      smbcFlavor: '',
      theme: '',
      colors: [],
    },
  });
  
  const flavors = watch('flavors') || [];
  const fillings = watch('fillings') || [];
  const colors = watch('colors') || [];
  const quantity = watch('quantity');
  const selectedUnits = Math.floor(quantity / unitInfo.perUnit);
  
  const handleFlavorToggle = (flavorValue: string) => {
    const currentFlavors = flavors || [];
    if (currentFlavors.includes(flavorValue)) {
      // Remove flavor
      setValue('flavors', currentFlavors.filter((f: string) => f !== flavorValue), { shouldValidate: true });
    } else if (currentFlavors.length < MAX_CUPCAKE_FLAVORS) {
      // Add flavor
      setValue('flavors', [...currentFlavors, flavorValue], { shouldValidate: true });
    }
  };
  
  const handleFillingToggle = (fillingValue: string) => {
    const currentFillings = fillings || [];
    if (currentFillings.includes(fillingValue)) {
      // Remove filling
      setValue('fillings', currentFillings.filter((f: string) => f !== fillingValue), { shouldValidate: true });
    } else if (currentFillings.length < MAX_CUPCAKE_FILLINGS) {
      // Add filling
      setValue('fillings', [...currentFillings, fillingValue], { shouldValidate: true });
    }
  };
  
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
  
  // Generate unit options (1 dozen, 2 dozen, etc.)
  const unitOptions = Array.from({ length: unitInfo.maxUnits }, (_, i) => {
    const units = i + 1;
    const totalQuantity = units * unitInfo.perUnit;
    const unitLabel = units === 1 ? unitInfo.singular : unitInfo.plural;
    return {
      units,
      quantity: totalQuantity,
      label: `${units} ${unitLabel} (${totalQuantity} cupcakes)`,
    };
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Configure Your Cupcakes
        </h2>
        <p className="text-gray-600 mb-6">
          Customize your perfect cupcakes
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
                <div className="text-xs text-gray-600 mt-1">{option.quantity} cupcakes</div>
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
      
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Flavors <span className="text-red-600">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select up to {MAX_CUPCAKE_FLAVORS} flavors
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CUPCAKE_FLAVORS.map((flavor) => {
            const isSelected = flavors.includes(flavor.value);
            return (
              <button
                key={flavor.value}
                type="button"
                onClick={() => handleFlavorToggle(flavor.value)}
                disabled={!isSelected && flavors.length >= MAX_CUPCAKE_FLAVORS}
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium
                  ${isSelected
                    ? 'border-[#ff6b9d] bg-[#fff5f7] text-black'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  ${!isSelected && flavors.length >= MAX_CUPCAKE_FLAVORS
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer active:scale-95'
                  }
                `}
                aria-pressed={isSelected}
              >
                {flavor.label}
              </button>
            );
          })}
        </div>
        {flavors.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {flavors.length}/{MAX_CUPCAKE_FLAVORS}
          </p>
        )}
        {errors.flavors && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {errors.flavors.message}</span>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Fillings (optional)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select up to {MAX_CUPCAKE_FILLINGS} fillings
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CAKE_FILLINGS.map((filling) => {
            const isSelected = fillings.includes(filling.value);
            return (
              <button
                key={filling.value}
                type="button"
                onClick={() => handleFillingToggle(filling.value)}
                disabled={!isSelected && fillings.length >= MAX_CUPCAKE_FILLINGS}
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium
                  ${isSelected
                    ? 'border-[#ff6b9d] bg-[#fff5f7] text-black'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  ${!isSelected && fillings.length >= MAX_CUPCAKE_FILLINGS
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer active:scale-95'
                  }
                `}
                aria-pressed={isSelected}
              >
                {filling.label}
              </button>
            );
          })}
        </div>
        {fillings.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {fillings.length}/{MAX_CUPCAKE_FILLINGS}
          </p>
        )}
        {errors.fillings && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {errors.fillings.message}</span>
          </div>
        )}
      </div>
      
      <Select
        label="Swiss Meringue Buttercream Flavor"
        options={SMBC_FLAVORS}
        placeholder="Select SMBC flavor"
        error={errors.smbcFlavor?.message}
        helperText="Frosting flavor for your cupcakes"
        required
        {...register('smbcFlavor')}
      />
      
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

