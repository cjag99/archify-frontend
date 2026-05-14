"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface RegisterFormProps {
  onSwitch?: () => void;
}
export const RegisterForm = ({ onSwitch }: RegisterFormProps) => {
  const { handleRegister, loading, error } = useRegisterForm();
  return (
    <form onSubmit={handleRegister} className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          name="first_name"
          type="text"
          error={error || ""}
        />
        <Input
          label="Last name"
          name="last_name"
          type="text"
          error={error || ""}
        />
      </div>
      <Input
        label="Username"
        name="username"
        type="text"
        error={error || ""}
      />
      <Input label="Email" name="email" type="email" error={error || ""} />
      <Input
        label="Password"
        name="password"
        type="password"
        error={error || ""}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        error={error || ""}
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
