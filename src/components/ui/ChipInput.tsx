import { useState, forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface ChipInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxChips?: number;
  placeholder?: string;
  error?: string;
  helperText?: string;
  id?: string;
}

export const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
  ({ label, value, onChange, maxChips, placeholder, error, helperText, id }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const chipInputId = id || `chip-input-${Math.random().toString(36).substr(2, 9)}`;
    
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        
        if (maxChips && value.length >= maxChips) {
          return;
        }
        
        if (!value.includes(inputValue.trim())) {
          onChange([...value, inputValue.trim()]);
          setInputValue('');
        }
      }
      
      if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    };
    
    const removeChip = (indexToRemove: number) => {
      onChange(value.filter((_, index) => index !== indexToRemove));
    };
    
    const isMaxReached = maxChips && value.length >= maxChips;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={chipInputId}
            className="block text-sm font-medium text-bakery-brown-700 mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div
          className={classNames(
            'w-full min-h-[42px] px-3 py-2 rounded-xl border transition-smooth',
            'bg-white flex flex-wrap gap-2 items-center',
            'focus-within:ring-2 focus-within:ring-bakery-pink-400 focus-within:border-bakery-pink-400',
            error 
              ? 'border-red-400 focus-within:ring-red-400 focus-within:border-red-400' 
              : 'border-bakery-brown-200'
          )}
        >
          {value.map((chip, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bakery-pink-100 text-bakery-brown-800 text-sm font-medium animate-in fade-in duration-200"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(index)}
                className="hover:bg-bakery-pink-200 rounded-full p-0.5 transition-smooth focus:outline-none focus:ring-2 focus:ring-bakery-pink-400"
                aria-label={`Remove ${chip}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          <input
            ref={ref}
            id={chipInputId}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : undefined}
            disabled={!!isMaxReached}
            className={classNames(
              'flex-1 min-w-[120px] outline-none bg-transparent text-bakery-cocoa placeholder:text-bakery-brown-300',
              isMaxReached && 'cursor-not-allowed'
            )}
            aria-describedby={
              error ? `${chipInputId}-error` : helperText ? `${chipInputId}-helper` : undefined
            }
          />
        </div>
        
        {error && (
          <p id={`${chipInputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p id={`${chipInputId}-helper`} className="mt-1.5 text-sm text-bakery-brown-500">
            {helperText}
          </p>
        )}
        
        {maxChips && (
          <p className="mt-1 text-xs text-bakery-brown-500">
            {value.length} / {maxChips} colors
          </p>
        )}
      </div>
    );
  }
);

ChipInput.displayName = 'ChipInput';

