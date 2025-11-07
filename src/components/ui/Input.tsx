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
            className="block text-sm font-medium text-bakery-brown-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-bakery-pink-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full px-4 py-2.5 rounded-xl border transition-smooth',
            'bg-white text-bakery-cocoa',
            'placeholder:text-bakery-brown-300',
            'focus:outline-none focus:ring-2 focus:ring-bakery-pink-400 focus:border-bakery-pink-400',
            error 
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
              : 'border-bakery-brown-200',
            'disabled:bg-bakery-brown-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-bakery-brown-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

