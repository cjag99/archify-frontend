import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = ({ label, error, options, defaultValue = 0, value, ...props }: SelectProps) => {
  return (
    <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <select
          {...props}
          {...(value === undefined ? { defaultValue } : { value })}
          className={`
            w-full appearance-none px-4 py-3 rounded-xl border bg-white/90 shadow-sm transition-all outline-none
            ${error
              ? 'border-red-300 text-red-900 focus:border-red-400 focus:ring-4 focus:ring-red-100'
              : 'border-slate-200 focus:border-brand/60 focus:ring-4 focus:ring-brand/10 hover:border-slate-300'
            }
            placeholder:text-slate-400 text-slate-900
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
          <p className="text-xs text-red-600 font-semibold">
            {error}
          </p>
        )}
    </div>
  );
};
