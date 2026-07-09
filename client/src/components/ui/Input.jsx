import React from 'react';
import { clsx } from 'clsx';

const Input = ({
  label,
  error,
  type = 'text',
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg border bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent',
          error ? 'border-red-500' : 'border-[var(--border-color)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;