import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const fieldId = id || (name ? `select-${name}` : generatedId);
  const listboxId = `${fieldId}-listbox`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const optionId = (index: number) => `${fieldId}-option-${index}`;

  const selectedIndex = options.findIndex(o => o.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const active = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  const open = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSelect = (optionValue: string) => {
    close();
    onChange?.(optionValue);
    onBlur?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const last = options.length - 1;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        open(e.key === 'ArrowUp' && selectedIndex < 0 ? last : undefined);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, last));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) handleSelect(options[activeIndex].value);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case 'Tab':
        close();
        onBlur?.();
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const char = e.key.toLowerCase();
          const start = activeIndex + 1;
          const ordered = [...options.slice(start), ...options.slice(0, start)];
          const match = ordered.findIndex(o => o.label.toLowerCase().startsWith(char));
          if (match >= 0) setActiveIndex((start + match) % options.length);
        }
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label htmlFor={fieldId} className="block text-base font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-[#ff6b9d] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={fieldId}
          name={name}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          disabled={disabled}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleKeyDown}
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
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={label ? fieldId : undefined}
              className="max-h-64 overflow-y-auto py-1.5"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onPointerMove={(e) => {
                      // Scrolling the list under a stationary pointer must not steal the keyboard highlight.
                      if (e.movementX === 0 && e.movementY === 0) return;
                      if (index !== activeIndex) setActiveIndex(index);
                    }}
                    onClick={() => handleSelect(option.value)}
                    className={classNames(
                      'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors',
                      isSelected ? 'text-black font-semibold' : 'text-gray-700',
                      (isSelected || isActive) && 'bg-[#fff5f7]',
                      isActive && 'text-black'
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
          id={errorId}
          className="mt-2 text-sm px-3 py-2 rounded-lg font-semibold shadow-sm"
          style={{ backgroundColor: '#ef4444', color: 'white' }}
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && helperText && (
        <p id={helperId} className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
