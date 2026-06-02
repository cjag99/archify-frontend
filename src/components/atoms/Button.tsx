// Reusable atom UI component for Button
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  fullWidth = false,
  className = "", 
  disabled,
  ...props 
}: ButtonProps) => {
  

  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand/30";
  

  const variants = {
    primary: "refraction-gradient-hover text-white shadow-lg shadow-brand/15 hover:-translate-y-0.5",
    secondary: "bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600",
    outline: "border border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-brand/40 hover:text-brand hover:bg-brand/5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800",
    success: "success-gradient-hover text-white shadow-lg shadow-emerald-500/15 hover:-translate-y-0.5",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/15 hover:bg-red-600 hover:-translate-y-0.5",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {}
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

