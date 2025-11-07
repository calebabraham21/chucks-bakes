import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  selected?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, selected, padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'card-base transition-smooth';
    
    const hoverStyles = hoverable 
      ? 'cursor-pointer hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98]' 
      : '';
    
    const selectedStyles = selected 
      ? 'ring-2 ring-bakery-pink-400 shadow-soft-lg' 
      : '';
    
    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    return (
      <div
        ref={ref}
        className={classNames(
          baseStyles,
          hoverStyles,
          selectedStyles,
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

