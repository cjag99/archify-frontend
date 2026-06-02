// Page-level UI component that renders the ProtectedRoute interface
"use client";

import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(ROUTES.login());
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

