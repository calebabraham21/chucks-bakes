import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface RadioOption {
  value: string;
  label: string;
  helper?: string;
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  options: readonly RadioOption[] | RadioOption[];
  error?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ label, options, error, name, value, onChange, className, ...props }, ref) => {
    return (
      <fieldset ref={ref} className={classNames('w-full', className)}>
        {label && (
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {props.required && <span className="text-bakery-pink-500 ml-1">*</span>}
          </legend>
        )}
        
        <div className="space-y-3">
          {options.map((option) => {
            const radioId = `${name}-${option.value}`;
            const isChecked = value === option.value;
            
            return (
              <div key={option.value}>
                <label
                  htmlFor={radioId}
                  className={classNames(
                    'flex items-start p-4 rounded-xl border-2 cursor-pointer transition-smooth',
                    isChecked
                      ? 'border-bakery-pink-400 bg-bakery-pink-50'
                      : 'border-gray-200 hover:border-bakery-pink-300 hover:bg-bakery-pink-50/50',
                    'focus-within:ring-2 focus-within:ring-bakery-pink-400 focus-within:ring-offset-2'
                  )}
                >
                  <input
                    type="radio"
                    id={radioId}
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-bakery-pink-500 border-gray-300 focus:ring-bakery-pink-400"
                    {...props}
                  />
                  
                  <div className="ml-3 flex-1">
                    <span className="block text-sm font-medium text-gray-800">
                      {option.label}
                    </span>
                    {option.helper && (
                      <span className="block mt-1 text-sm text-gray-600">
                        {option.helper}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

