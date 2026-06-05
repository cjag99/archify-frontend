// Reusable molecule UI component for Input
"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input = ({ label, error, className = "", type = "text", ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === "password";
  const displayType = isPasswordInput && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={displayType}
          className={`
            w-full px-4 py-3 rounded-xl border bg-white/90 dark:bg-slate-900/50 shadow-sm transition-all outline-none
            ${error 
              ? 'border-red-300 dark:border-red-500/50 text-red-900 dark:text-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20' 
              : 'border-slate-200 dark:border-slate-800 focus:border-brand/60 focus:ring-4 focus:ring-brand/10 dark:focus:ring-brand/20 hover:border-slate-300 dark:hover:border-slate-700'
            }
            placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 ${isPasswordInput ? "pr-10" : ""} ${className}
          `}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};

