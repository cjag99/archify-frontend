"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { AlertCircle } from "lucide-react";

interface RegisterFormProps {
  onSwitch?: () => void;
  onSuccess?: () => void;
}
export const RegisterForm = ({ onSwitch, onSuccess }: RegisterFormProps) => {
  const { handleRegister, loading, error, formError } = useRegisterForm(onSuccess);
  return (
    <form onSubmit={handleRegister} className="w-full space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 text-sm font-medium text-red-600 border border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First name"
          name="first_name"
          type="text"
          placeholder="John"
          error={formError?.first_name || ""}
        />
        <Input
          label="Last name"
          name="last_name"
          type="text"
          placeholder="Doe"
          error={formError?.last_name || ""}
        />
      </div>
      <Input
        label="Username"
        name="username"
        type="text"
        placeholder="johndoe"
        error={formError?.username || ""}
      />
      <Input label="Email" name="email" type="email" placeholder="your@email.com" error={formError?.email || ""} />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        error={formError?.password || ""}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        error={formError?.confirmPassword || ""}
      />
      <Button type="submit" variant="primary" isLoading={loading} fullWidth>
        Sign up
      </Button>
      {onSwitch && (
        <p className="text-sm text-slate-600 pt-1 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-brand font-medium hover:text-brand-dark transition-colors"
          >
            Log in here
          </button>
        </p>
      )}
    </form>
  );
};
