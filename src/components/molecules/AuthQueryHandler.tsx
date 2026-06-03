// Composite UI component used by views and forms for AuthQueryHandler
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/core/context/AuthContext";

// Extend props to handle both login and register modals
type AuthQueryHandlerProps = {
  onOpenLogin: () => void;
  onOpenRegister?: () => void; // optional
};

function AuthQueryHandlerInner({ onOpenLogin, onOpenRegister }: AuthQueryHandlerProps) {
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading || isAuthenticated) return;
    // Open login modal when ?login=1
    if (searchParams.get("login") === "1") {
      onOpenLogin();
    }
    // Open register modal when ?register=1
    if (searchParams.get("register") === "1" && onOpenRegister) {
      onOpenRegister();
    }
  }, [searchParams, isAuthenticated, loading, onOpenLogin, onOpenRegister]);

  return null;
}

export function AuthQueryHandler(props: AuthQueryHandlerProps) {
  return (
    <Suspense fallback={null}>
      <AuthQueryHandlerInner {...props} />
    </Suspense>
  );
}

