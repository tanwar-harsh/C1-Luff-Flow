import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-dark disabled:opacity-50',
  secondary:
    'bg-surface-container text-foreground hover:bg-surface-container-high disabled:opacity-50',
  ghost:
    'bg-transparent text-primary hover:bg-surface-container-low disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  isLoading,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded px-5 py-2.5 text-body-md font-medium transition-colors ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
