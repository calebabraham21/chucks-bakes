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
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bakery-pink-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-manipulation';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900 shadow-soft active:scale-[0.98]',
      secondary: 'border-2 border-bakery-pink-300 text-black hover:bg-bakery-pink-50 active:bg-bakery-pink-100 active:scale-[0.98]',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98]',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-5 py-3 text-base min-h-[44px]',
      lg: 'px-6 py-3.5 text-lg min-h-[48px]',
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

