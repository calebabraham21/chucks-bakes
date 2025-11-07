import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-base font-medium text-bakery-brown-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full px-3 py-3 rounded-xl border-2 transition-smooth text-base min-h-[48px]',
            'bg-white text-bakery-cocoa',
            'placeholder:text-bakery-brown-300',
            'focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-bakery-pink-400',
            'touch-manipulation',
            error 
              ? 'border-red-500 bg-red-50/30 focus:ring-red-400 focus:border-red-500' 
              : 'border-bakery-brown-200',
            'disabled:bg-bakery-brown-50 disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {error && (
          <div id={`${inputId}-error`} className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
            <span className="font-medium">⚠️ {error}</span>
          </div>
        )}
        
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-bakery-brown-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

