import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactInfoSchema, type ContactInfo } from '../../lib/validation';
import { Input } from '../ui/Input';
import { RadioGroup } from '../ui/RadioGroup';

interface ContactFormProps {
  defaultValues?: Partial<ContactInfo>;
  onSubmit: (data: ContactInfo) => void;
}

export function ContactForm({ defaultValues, onSubmit }: ContactFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      phone: '',
      deliveryMethod: 'pickup',
      targetDate: '',
      targetTime: '',
      budget: '',
      notes: '',
      referralSource: '',
    },
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-bakery-cocoa mb-2" tabIndex={-1}>
          Contact Information
        </h2>
        <p className="text-bakery-brown-600 mb-6">
          How can we reach you about your order?
        </p>
      </div>
      
      <Input
        label="Name"
        type="text"
        inputMode="text"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message}
        required
        {...register('name')}
      />
      
      <Input
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />
      
      <Input
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(555) 123-4567"
        error={errors.phone?.message}
        helperText="We'll text you for quick updates"
        {...register('phone')}
      />
      
      <Controller
        name="deliveryMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Fulfillment Method"
            options={[
              { value: 'pickup', label: 'Pickup' },
              { value: 'delivery', label: 'Delivery' },
            ]}
            error={errors.deliveryMethod?.message}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      
      <div className="space-y-4">
        <Input
          label="Preferred Date"
          type="date"
          autoComplete="off"
          error={errors.targetDate?.message}
          helperText="When do you need it?"
          {...register('targetDate')}
        />
        
        <Input
          label="Preferred Time"
          type="time"
          autoComplete="off"
          error={errors.targetTime?.message}
          helperText="What time works best?"
          {...register('targetTime')}
        />
      </div>
      
      <Input
        label="Budget (optional)"
        type="text"
        inputMode="text"
        placeholder="e.g., $50-100"
        error={errors.budget?.message}
        helperText="Helps us suggest options"
        {...register('budget')}
      />
      
      <div className="w-full">
        <label 
          htmlFor="notes"
          className="block text-base font-medium text-bakery-brown-700 mb-2"
        >
          Special Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={4}
          placeholder="Any special requests or dietary restrictions?"
          className="w-full px-3 py-3 rounded-xl border-2 border-bakery-brown-200 transition-smooth bg-white text-bakery-cocoa text-base placeholder:text-bakery-brown-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-bakery-pink-400 touch-manipulation resize-y min-h-[100px]"
          {...register('notes')}
        />
        {errors.notes && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {errors.notes.message}</span>
          </div>
        )}
      </div>
      
      <Input
        label="How did you hear about us? (optional)"
        type="text"
        inputMode="text"
        placeholder="Instagram, friend, Google, etc."
        error={errors.referralSource?.message}
        {...register('referralSource')}
      />
      
      <input type="submit" className="hidden" />
    </form>
  );
}

