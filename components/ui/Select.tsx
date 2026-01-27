import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-csev-text-secondary mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3 py-2 rounded-lg
          bg-csev-slate-800 border border-csev-border
          text-csev-text-primary
          focus:outline-none focus:ring-2 focus:ring-csev-green focus:border-csev-green
          disabled:bg-csev-slate-700 disabled:cursor-not-allowed disabled:text-csev-text-muted
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="text-csev-text-muted">
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-csev-slate-800">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
