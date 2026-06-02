// Composite UI component used by views and forms for AuthQueryHandler
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/core/context/AuthContext";

type AuthQueryHandlerProps = {
  onOpenLogin: () => void;
};

function AuthQueryHandlerInner({ onOpenLogin }: AuthQueryHandlerProps) {
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading || isAuthenticated) return;
    if (searchParams.get("login") === "1") {
      onOpenLogin();
    }
  }, [searchParams, isAuthenticated, loading, onOpenLogin]);

  return null;
}

export function AuthQueryHandler(props: AuthQueryHandlerProps) {
  return (
    <Suspense fallback={null}>
      <AuthQueryHandlerInner {...props} />
    </Suspense>
  );
}

