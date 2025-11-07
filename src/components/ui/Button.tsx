import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bakery-pink-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-bakery-brown-700 text-white hover:bg-bakery-brown-800 active:bg-bakery-brown-900 shadow-soft',
      secondary: 'border-2 border-bakery-pink-300 text-bakery-brown-700 hover:bg-bakery-pink-50 active:bg-bakery-pink-100',
      ghost: 'text-bakery-brown-600 hover:bg-bakery-brown-50 active:bg-bakery-brown-100',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3.5 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={classNames(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

