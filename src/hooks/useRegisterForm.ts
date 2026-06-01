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
    } catch (err: any) {
      let userFriendlyMessage = "An unexpected error occurred during registration. Please try again.";
      const serverError = err.cause;
      
      // Normalizamos el error del servidor (revisamos .detail y .error)
      const detail = serverError?.detail || serverError?.error;

      if (detail) {
        if (typeof detail === "string") {
          const lowerDetail = detail.toLowerCase();
          if (lowerDetail.includes("already exists") || lowerDetail.includes("registered")) {
            userFriendlyMessage = "An account with this email or username already exists.";
          } else {
            userFriendlyMessage = detail;
          }
        } else if (Array.isArray(detail)) {
          userFriendlyMessage = detail[0]?.msg || "Invalid data provided.";
        }
      } else if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes("already exists") || message.includes("registered")) {
          userFriendlyMessage = "An account with this email or username already exists.";
        } else {
          userFriendlyMessage = err.message;
        }
      }

      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleRegister, formError };
};
