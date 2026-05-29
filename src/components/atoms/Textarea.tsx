import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, error, ...props }: TextareaProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full min-h-30 rounded-xl border bg-white/90 shadow-sm transition-all outline-none px-4 py-3
          ${error
            ? "border-red-300 text-red-900 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-slate-200 focus:border-brand/60 focus:ring-4 focus:ring-brand/10 hover:border-slate-300"}
          placeholder:text-slate-400 text-slate-900
        `}
      />
      {error && (
        <p className="text-xs text-red-600 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};
