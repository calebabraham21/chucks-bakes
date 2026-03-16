import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  value = '',
  onChange,
  onBlur,
  required,
  disabled,
  name,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldId = id || `select-${name || Math.random().toString(36).substr(2, 9)}`;

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    setIsOpen(false);
    onChange?.(optionValue);
    onBlur?.();
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label htmlFor={fieldId} className="block text-base font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-[#ff6b9d] ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={fieldId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-required={required}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          className={classNames(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left min-h-[48px] bg-white',
            'focus:outline-none focus:ring-2 focus:ring-[#ff8ba7]',
            error
              ? 'border-red-400 focus:ring-red-300'
              : isOpen
                ? 'border-[#ff6b9d] ring-2 ring-[#ff8ba7]'
                : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          )}
        >
          <span className={classNames('flex-1 truncate', selectedOption ? 'text-black' : 'text-gray-400')}>
            {selectedOption?.label ?? placeholder ?? 'Select...'}
          </span>
          <ChevronDown
            className={classNames(
              'w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200',
              isOpen && 'rotate-180 text-[#ff6b9d]'
            )}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1.5 bg-white rounded-xl border border-gray-200 overflow-hidden"
            style={{ boxShadow: '0 8px 32px -4px rgba(74,53,40,0.15), 0 2px 8px -2px rgba(74,53,40,0.08)' }}
          >
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option.value)}
                    className={classNames(
                      'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-[#fff5f7] text-black font-semibold'
                        : 'text-gray-700 hover:bg-[#fff5f7] hover:text-black'
                    )}
                  >
                    <span className="flex-1 pr-2">{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#ff6b9d] flex-shrink-0" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div
          className="mt-2 text-sm px-3 py-2 rounded-lg font-semibold shadow-sm"
          style={{ backgroundColor: '#ef4444', color: 'white' }}
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {!error && helperText && (
        <p className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
