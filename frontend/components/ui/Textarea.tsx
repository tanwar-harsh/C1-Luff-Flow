import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-semibold text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`min-h-[120px] resize-y rounded border bg-surface-container-lowest px-3.5 py-2.5 text-body-md text-foreground outline-none transition-colors placeholder:text-on-surface-variant focus:border-2 focus:border-primary ${
            error ? 'border-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-body-md text-error">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
