'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-brand-600 text-white hover:bg-brand-700': variant === 'primary',
          'bg-gray-100 text-gray-800 hover:bg-gray-200': variant === 'secondary',
          'border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'outline',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
