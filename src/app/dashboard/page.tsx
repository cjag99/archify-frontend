// Dashboard home page showing authenticated user content
"use client";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "@/hooks/useProject";
import { AlertCircle } from "lucide-react";
import { DashboardLanding } from "@/components/organisms/DashboardLanding";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error } = useProject();

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <div className="page-container">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <span className="eyebrow mb-3">Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-slate-100 mb-2">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-slate-500">
                Manage your system designs and architectural configurations.
              </p>
            </div>
          </div>

          {}
          {error && (
            <div className="mb-8 p-4 bg-red-50/80 border border-red-100 text-red-700 rounded-2xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DashboardLanding projectCount={projects.length} loading={loading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

