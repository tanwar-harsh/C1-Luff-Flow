import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-semibold text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`rounded border bg-surface-container-lowest px-3.5 py-2.5 text-body-md text-foreground outline-none transition-colors focus:border-2 focus:border-primary ${
            error ? 'border-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-body-md text-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
