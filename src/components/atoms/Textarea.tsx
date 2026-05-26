import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, error, ...props }: TextareaProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full min-h-30 rounded-lg border shadow-sm transition-all outline-none px-4 py-3
          ${error
            ? "border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10"}
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
