"use client";

import { useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { Validator } from "@/core/validations/validator";

export const useRegisterForm = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<Record<string, string> | null>(null);
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const registerValidation = {
      first_name: Validator.validateString(
        "First name",
        data.first_name as string,
        2,
        255,
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/
      ),
      last_name: Validator.validateString(
        "Last name",
        data.last_name as string,
        2,
        255,
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/
      ),
      username: Validator.validateString(
        "Username",
        data.username as string,
        3,
        20,
        /^[a-zA-Z0-9_-]+$/
      ),
      email: Validator.validateString("Email", data.email as string, 5, 255),
      password: Validator.validateString(
        "Password",
        data.password as string,
        8,
        128
      ),
    };

    const formErrors: Record<string, string> = {};
    for (const key in registerValidation) {
      const validation =
        registerValidation[key as keyof typeof registerValidation];
      if (!validation.isValid) {
        formErrors[key] = validation.message;
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setFormError(formErrors);
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setFormError((prevError) => ({
        ...(prevError || {}),
        confirmPassword: "Passwords do not match",
      }));
      setLoading(false);
      return;
    }

    try {
      await register({
        first_name: data.first_name as string,
        last_name: data.last_name as string,
        username: data.username as string,
        email: data.email as string,
        password: data.password as string,
      });
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

  return { loading, error, handleRegister, formError };
};
