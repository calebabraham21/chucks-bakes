import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactInfoSchema, type ContactInfo } from '../../lib/validation';
import { Input } from '../ui/Input';
import { POLICIES } from '../../lib/constants';

interface ContactFormProps {
  defaultValues?: Partial<ContactInfo>;
  onSubmit: (data: ContactInfo) => void;
}

// Get minimum date (10 days from now)
function getMinDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split('T')[0];
}

export function ContactForm({ defaultValues, onSubmit }: ContactFormProps) {
  const minDate = getMinDate();

  const {
    register,
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
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Contact Information
        </h2>
        <p className="text-gray-600 mb-6">
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
        inputMode="numeric"
        autoComplete="tel"
        placeholder="5551234567"
        error={errors.phone?.message}
        helperText="Numbers only (no dashes or spaces)."
        required
        {...register('phone', {
          onChange: (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
          }
        })}
      />

      <div className="p-3 bg-[#fff5f7] rounded-xl border border-[#ffc1d4]">
        <p className="text-sm text-gray-700">📍 {POLICIES.pickup}</p>
      </div>

      <div>
        <Input
          label="Preferred Pickup Date"
          type="date"
          autoComplete="off"
          min={minDate}
          error={errors.targetDate?.message}
          required
          {...register('targetDate')}
        />
        <p className="text-xs text-gray-500 mt-1">
          ⏰ {POLICIES.advanceNotice}
        </p>
      </div>

      <div className="w-full">
        <label
          htmlFor="notes"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Additional Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Any special requests or things we should know?"
          className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 transition-smooth bg-white text-black text-base placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-bakery-pink-400 touch-manipulation resize-y min-h-[80px]"
          {...register('notes')}
        />
        {errors.notes && (
          <div
            className="mt-2 text-sm px-3 py-2 rounded-lg font-semibold shadow-sm"
            style={{ backgroundColor: '#ef4444', color: 'white' }}
            role="alert"
          >
            ⚠️ {errors.notes.message}
          </div>
        )}
      </div>

      {/* Policy reminder */}
      <div className="p-4 bg-[#fff5f7] rounded-xl border border-[#ffc1d4]">
        <h3 className="font-medium text-black mb-2">📋 Reminder</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• {POLICIES.payment}</li>
          <li>• {POLICIES.cancellationFee}</li>
          <li>• {POLICIES.orderDenied}</li>
        </ul>
      </div>

      <input type="submit" className="hidden" />
    </form>
  );
}
