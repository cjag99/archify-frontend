// Page-level UI component that renders the LoginForm interface
"use client";

import { Suspense } from "react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSwitch?: () => void;
  onSuccess?: () => void;
}

function LoginFormInner({ onSwitch, onSuccess }: LoginFormProps) {
  const { handleLogin, loading, error, formError } = useLoginForm(onSuccess);

  return (
    <form onSubmit={handleLogin} className="w-full space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 text-sm font-medium text-red-600 border border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        error={formError?.email || ""}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
        error={formError?.password || ""}
      />
      <Button type="submit" variant="primary" isLoading={loading} fullWidth>
        Log in
      </Button>
      {onSwitch && (
        <p className="text-sm text-slate-600 pt-1 text-center">
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


