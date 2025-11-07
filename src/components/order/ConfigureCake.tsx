import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cakeConfigSchema, type CakeConfig } from '../../lib/validation';
import { CAKE_SIZES, CAKE_FLAVORS, CAKE_FILLINGS, FROSTING_OPTIONS, SMBC_FLAVORS, MAX_COLOR_CHIPS, MAX_THEME_LENGTH } from '../../lib/constants';
import { Select } from '../ui/Select';
import { RadioGroup } from '../ui/RadioGroup';
import { Input } from '../ui/Input';
import { ChipInput } from '../ui/ChipInput';

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
  
  const showSmbcFlavor = frostingType === 'smbc';
  const frostingHelper = FROSTING_OPTIONS.find(f => f.value === frostingType)?.helper;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-bakery-cocoa mb-2" tabIndex={-1}>
          Configure Your Cake
        </h2>
        <p className="text-bakery-brown-600 mb-6">
          Customize your perfect cake
        </p>
      </div>
      
      <Select
        label="Size"
        options={CAKE_SIZES}
        placeholder="Select a size"
        error={errors.size?.message}
        required
        {...register('size')}
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
          <p className="text-sm text-bakery-brown-700">{frostingHelper}</p>
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
      
      <ChipInput
        label="Colors (optional)"
        value={colors}
        onChange={(value) => setValue('colors', value, { shouldValidate: true })}
        maxChips={MAX_COLOR_CHIPS}
        placeholder="Type a color and press Enter"
        helperText="Add up to 3 colors. Press Enter to add each color."
        error={errors.colors?.message}
      />
      
      <input type="submit" className="hidden" />
    </form>
  );
}

