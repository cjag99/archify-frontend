"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface RegisterFormProps {
  onSwitch?: () => void;
  onSuccess?: () => void;
}
export const RegisterForm = ({ onSwitch, onSuccess }: RegisterFormProps) => {
  const { handleRegister, loading, error, formError } = useRegisterForm(onSuccess);
  return (
    <form onSubmit={handleRegister} className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          name="first_name"
          type="text"
          error={formError?.first_name || error || ""}
        />
        <Input
          label="Last name"
          name="last_name"
          type="text"
          error={formError?.last_name || error || ""}
        />
      </div>
      <Input
        label="Username"
        name="username"
        type="text"
        error={formError?.username || error || ""}
      />
      <Input label="Email" name="email" type="email" error={formError?.email || error || ""} />
      <Input
        label="Password"
        name="password"
        type="password"
        error={formError?.password || error || ""}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        error={formError?.confirmPassword || error || ""}
      />
      <Button type="submit" variant="primary" isLoading={loading} fullWidth>
        Sign up
      </Button>
      {onSwitch && (
        <p className="text-sm text-slate-600 mt-4 text-center">
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
