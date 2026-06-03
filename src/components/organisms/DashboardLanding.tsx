// Page-level UI component that renders the DashboardLanding interface
"use client";

import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/core/context/AuthContext";
import { ArrowRight, FolderPlus, Layers, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLandingProps {
  projectCount: number;
  loading?: boolean;
}

export const DashboardLanding = ({ projectCount, loading }: DashboardLandingProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const canCreateResources = user?.is_authorized;

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-3xl border border-slate-200/80 bg-white/90 dark:bg-slate-900/80 p-8 md:p-10 shadow-xl backdrop-blur-md">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Dashboard overview</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white">
              Your workspace, simplified.
            </h2>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300 leading-7">
              Manage projects, architectures and code assets from a clean dashboard that helps you move forward quickly.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Button
                variant="primary"
                onClick={() => router.push("/dashboard/projects")}
                className="flex-1"
              >
                Explore projects
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard/projects/new")}
                className="flex-1"
              >
                Create project
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 dark:bg-slate-950/80 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? "..." : projectCount}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <FolderPlus className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {loading
                ? "Gathering your workspace metrics..."
                : `You currently have ${projectCount} project${projectCount === 1 ? "" : "s"} created.`}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          aria-label="Open Architectures"
          onClick={() => router.push('/dashboard/architectures')}
          className="glass-card text-left rounded-3xl border border-slate-200/80 bg-white/90 dark:bg-slate-900/80 dark:border-slate-700/80 p-5 md:p-6 shadow-sm focus:outline-none hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Architectures</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Visualize and build</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {canCreateResources
              ? "Create architecture diagrams, connect models and explore system structure from a central place."
              : "Browse existing architecture diagrams and review system structure; creation is reserved for authorized users."}
          </p>
        </button>

        <button
          type="button"
          aria-label="Open Patterns"
          onClick={() => router.push('/dashboard/patterns')}
          className="glass-card text-left rounded-3xl border border-slate-200/80 bg-white/90 dark:bg-slate-900/80 dark:border-slate-700/80 p-5 md:p-6 shadow-sm focus:outline-none hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Patterns</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Design once, reuse everywhere</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {canCreateResources
              ? "Save your patterns and code snippets, then reuse them in future projects without losing consistency."
              : "View existing patterns and reusable snippets; creation and editing are restricted to authorized users."}
          </p>
        </button>
      </section>
    </div>
  );
};

