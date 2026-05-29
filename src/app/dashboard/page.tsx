"use client";

import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "@/hooks/useProject";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error } = useProject();
  const isProjectsEmpty = !loading && projects.length === 0;
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <div className="page-container">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <span className="eyebrow mb-3">Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-2">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-slate-500">
                Manage your system designs and architectural configurations.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-8 p-4 bg-red-50/80 border border-red-100 text-red-700 rounded-2xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Content Area */}
          {loading ? (
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase mb-6">Loading projects...</p>
              <div className="grid grid-cols-12 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="col-span-12 md:col-span-6 lg:col-span-4 glass-card rounded-2xl p-6 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2 py-4">
                      <div className="h-3 bg-slate-100 rounded w-full" />
                      <div className="h-3 bg-slate-100 rounded w-4/5" />
                    </div>
                    <div className="h-10 bg-slate-100 rounded-2xl w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : isProjectsEmpty ? (
            <div className="text-center py-16 glass-card rounded-2xl max-w-xl mx-auto px-6">
              <div className="w-14 h-14 bg-brand/8 rounded-xl flex items-center justify-center text-brand mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">No projects found</h2>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                You dont have any projects in your workspace yet. Lets create your first architecture!
              </p>
              <Button
                onClick={() => router.push("/dashboard/projects/new")}
                variant="success"
                fullWidth={false}
                className="mt-4"
              >
                <Plus className="w-5 h-5" />
                Create your first project
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-slate-400 uppercase">Your Projects ({projects.length})</p>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="col-span-12 md:col-span-6 lg:col-span-4 glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Project Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-brand/8 text-brand flex items-center justify-center font-bold text-lg group-hover:bg-brand group-hover:text-white transition-colors duration-300 shrink-0">
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand transition-colors duration-300 truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Created {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'recently'}
                          </p>
                        </div>
                      </div>

                      {/* Project Description */}
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-10">
                        {project.description || "No description provided. Click below to view and design this project's architecture."}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white hover:bg-brand hover:text-white text-slate-700 transition-all duration-300 active:scale-[0.98] border border-slate-200 hover:border-brand cursor-pointer"
                    >
                      View project
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
