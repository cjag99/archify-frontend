import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-lg border shadow-sm transition-all outline-none
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }
          placeholder:text-gray-400 text-gray-900
        `}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};