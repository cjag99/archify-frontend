import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = ({ label, error, options, defaultValue = 0, value, ...props }: SelectProps) => {
  return (
    <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          {...props}
          {...(value === undefined ? { defaultValue } : { value })}
          className={`
            w-full px-4 py-3 rounded-lg border shadow-sm transition-all outline-none
            ${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10'
            }
            placeholder:text-gray-400 text-gray-900
          `}
        >
            {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.value === 0}
                >
                    {option.label}
                </option>
            ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
    </div>
  );
};