"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/core/context/AuthContext";
import { Validator } from "@/core/validations/validator";

export const useLoginForm = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<Record<string, string> | null>(null);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const emailValidation = Validator.validateString(
      "Email",
      data.email as string,
      5,
      255
    );
    const passwordValidation = Validator.validateString(
      "Password",
      data.password as string,
      8,
      128
    );

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setFormError({
        email: emailValidation.message,
        password: passwordValidation.message,
      });
      setLoading(false);
      return;
    }

    try {
      await login(
        {
          email: data.email as string,
          password: data.password as string,
        },
        nextPath
      );
      onSuccess?.();
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, formError };
};
