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
        placeholder="Your full name"
        error={errors.name?.message}
        required
        {...register('name')}
      />
      
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />
      
      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="(555) 123-4567"
        error={errors.phone?.message}
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Preferred Date (optional)"
          type="date"
          error={errors.targetDate?.message}
          helperText="When do you need it?"
          {...register('targetDate')}
        />
        
        <Input
          label="Preferred Time (optional)"
          type="time"
          error={errors.targetTime?.message}
          helperText="What time?"
          {...register('targetTime')}
        />
      </div>
      
      <Input
        label="Budget (optional)"
        type="text"
        placeholder="e.g., $50-100"
        error={errors.budget?.message}
        helperText="What's your approximate budget?"
        {...register('budget')}
      />
      
      <div className="w-full">
        <label 
          htmlFor="notes"
          className="block text-sm font-medium text-bakery-brown-700 mb-1.5"
        >
          Special Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Any special requests or dietary restrictions?"
          className="w-full px-4 py-2.5 rounded-xl border border-bakery-brown-200 transition-smooth bg-white text-bakery-cocoa placeholder:text-bakery-brown-300 focus:outline-none focus:ring-2 focus:ring-bakery-pink-400 focus:border-bakery-pink-400"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>
      
      <Input
        label="How did you hear about us? (optional)"
        type="text"
        placeholder="e.g., Instagram, friend referral, Google search"
        error={errors.referralSource?.message}
        {...register('referralSource')}
      />
      
      <input type="submit" className="hidden" />
    </form>
  );
}

