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
    } catch (err: any) {
      let userFriendlyMessage = "An unexpected error occurred. Please try again later.";
      const serverError = err.cause;
      
      // Normalizamos el error del servidor (revisamos .detail y .error)
      const detail = serverError?.detail || serverError?.error;

      if (detail) {
        if (typeof detail === "string") {
          // Si el mensaje contiene palabras clave de fallo de autenticación
          const lowerDetail = detail.toLowerCase();
          if (lowerDetail.includes("credentials") || lowerDetail.includes("invalid")) {
            userFriendlyMessage = "The email or password you entered is incorrect.";
          } else {
            userFriendlyMessage = detail;
          }
        } else if (Array.isArray(detail)) {
          // Errores de validación (Pydantic)
          userFriendlyMessage = detail[0]?.msg || "Invalid data provided.";
        }
      } else if (err instanceof Error) {
        // Fallback al mensaje del error (que ya viene procesado por el apiClient)
        const message = err.message.toLowerCase();
        if (message.includes("credentials") || message.includes("invalid")) {
          userFriendlyMessage = "The email or password you entered is incorrect.";
        } else {
          userFriendlyMessage = err.message;
        }
      }

      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, formError };
};
