// Reusable atom UI component for Textarea
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, error, ...props }: TextareaProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full min-h-30 rounded-xl border bg-white/90 dark:bg-slate-900/50 shadow-sm transition-all outline-none px-4 py-3
          ${error
            ? "border-red-300 dark:border-red-500/50 text-red-900 dark:text-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20"
            : "border-slate-200 dark:border-slate-800 focus:border-brand/60 focus:ring-4 focus:ring-brand/10 dark:focus:ring-brand/20 hover:border-slate-300 dark:hover:border-slate-700"}
          placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100
        `}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};

