"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.login("/admin"));
      return;
    }

    if (!user?.is_authorized) {
      router.replace(ROUTES.dashboard);
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_authorized) {
    return null;
  }

  return <>{children}</>;
}
