"use client";

import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "@/hooks/useProject";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { Button } from "@/components/atoms/Button";
import { Plus, FolderPlus } from "lucide-react";
import { CountLabel } from "@/components/molecules/CountLabel";

export default function ProjectsPage() {
    const { user } = useAuth();
    const { projects, loading, error } = useProject();
    const isProjectsEmpty = !loading && projects.length === 0;
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50/50">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                Your Projects
                            </h1>
                            <p className="text-slate-500">
                                Manage, design, and configure your software architectures.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Loading projects...</p>
                            <div className="grid grid-cols-12 gap-6">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="col-span-12 md:col-span-6 lg:col-span-4 glass-card rounded-3xl p-6 space-y-4 animate-pulse">
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
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CountLabel label="Projects" count={projects.length} />
                            <div className="text-center py-20 glass-card rounded-3xl max-w-xl mx-auto px-6 w-full">
                                <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
                                    <FolderPlus className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">No projects found</h2>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                    You don't have any projects in your workspace yet. Let's create your first architecture!
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
                        </div>
                    ) : (
                        <div>
                            {/* Action Bar (CountLabel & New Project Button) */}
                            <div className="flex items-center justify-between mb-8">
                                <CountLabel label="Projects" count={projects.length} />
                                <Button
                                    onClick={() => router.push("/dashboard/projects/new")}
                                    variant="success"
                                    fullWidth={false}
                                >
                                    <Plus className="w-5 h-5" />
                                    New Project
                                </Button>
                            </div>

                            {/* Projects Grid */}
                            <div className="grid grid-cols-12 gap-6">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="col-span-12 md:col-span-6 lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Project Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center font-bold text-lg group-hover:bg-brand group-hover:text-white transition-colors duration-300 shrink-0">
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
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">
                                                {project.description || "No description provided. Click below to view and design this project's architecture."}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-slate-50 hover:bg-brand hover:text-white text-slate-700 transition-all duration-300 active:scale-[0.98] border border-slate-100 hover:border-brand cursor-pointer"
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

