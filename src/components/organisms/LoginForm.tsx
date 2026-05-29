"use client";

import { Suspense } from "react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface LoginFormProps {
  onSwitch?: () => void;
  onSuccess?: () => void;
}

function LoginFormInner({ onSwitch, onSuccess }: LoginFormProps) {
  const { handleLogin, loading, error, formError } = useLoginForm(onSuccess);

  return (
    <form onSubmit={handleLogin} className="w-full space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        error={formError?.email || error || ""}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        error={formError?.password || error || ""}
      />
      <Button type="submit" variant="primary" isLoading={loading} fullWidth>
        Log in
      </Button>
      {onSwitch && (
        <p className="text-sm text-slate-600 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-brand font-medium hover:text-brand-dark transition-colors"
          >
            Register here
          </button>
        </p>
      )}
    </form>
  );
}

export const LoginForm = (props: LoginFormProps) => (
  <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
    <LoginFormInner {...props} />
  </Suspense>
);
