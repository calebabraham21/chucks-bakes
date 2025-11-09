import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-bakery-pink-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={classNames(
              'w-full px-4 py-2.5 pr-10 rounded-xl border transition-smooth appearance-none',
              'bg-white text-black',
              'focus:outline-none focus:ring-2 focus:ring-bakery-pink-400 focus:border-bakery-pink-400',
              error 
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                : 'border-gray-200',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
            aria-hidden="true"
          />
        </div>
        
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

