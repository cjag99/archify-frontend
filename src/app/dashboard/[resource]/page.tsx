"use client";

import { useAuth } from "@/core/context/AuthContext";
import { projectService } from "@/core/api/projects.service";
import { patternService } from "@/core/api/patterns.service";
import { architectureService } from "@/core/api/architectures.service";
import { useRouter, useParams, usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { Button } from "@/components/atoms/Button";
import { Plus, Folder, FileCode, Workflow, HelpCircle } from "lucide-react";
import { CountLabel } from "@/components/molecules/CountLabel";
import { useEffect, useState } from "react";
import { Project, Pattern, Architecture } from "@/core/types/models";

const RESOURCE_CONFIG = {
    projects: {
        title: "Your Projects",
        subtitle: "Manage, design, and configure your software architectures.",
        service: projectService,
        icon: Folder,
        emptyIcon: Folder,
        emptyTitle: "No projects found",
        emptyDescription: "You don't have any projects in your workspace yet. Let's create your first architecture!",
        createButtonText: "Create your first project",
        newButtonText: "New Project",
        viewButtonText: "View project",
    },
    patterns: {
        title: "Your Patterns",
        subtitle: "Define, customize, and reuse architectural design patterns.",
        service: patternService,
        icon: FileCode,
        emptyIcon: FileCode,
        emptyTitle: "No patterns found",
        emptyDescription: "You don't have any design patterns in your catalog yet. Let's create one!",
        createButtonText: "Create your first pattern",
        newButtonText: "New Pattern",
        viewButtonText: "View pattern",
    },
    architectures: {
        title: "Your Architectures",
        subtitle: "View and design your system components and layouts.",
        service: architectureService,
        icon: Workflow,
        emptyIcon: Workflow,
        emptyTitle: "No architectures found",
        emptyDescription: "You don't have any architectures created yet. Let's design one!",
        createButtonText: "Create your first architecture",
        newButtonText: "New Architecture",
        viewButtonText: "View architecture",
    }
};

type ResourceType = keyof typeof RESOURCE_CONFIG;

type ResourceItem = Project | Pattern | Architecture;

export default function GenericResourcesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    
    const resource = (typeof params?.resource === "string" ? params.resource : (pathname.split("/")[2] || "")) as ResourceType;
    const config = RESOURCE_CONFIG[resource];

    const [items, setItems] = useState<ResourceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!config || !user) return;

        let active = true;
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await config.service.getAll();
                if (active) {
                    setItems(Array.isArray(result) ? result : []);
                }
            } catch (err) {
                if (active) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                    setItems([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchItems();
        return () => {
            active = false;
        };
    }, [resource, config, user]);

    if (!config) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
                    <div className="text-center py-12 glass-card rounded-3xl max-w-md mx-auto px-6 w-full">
                        <div className="w-16 h-16 bg-red-500/5 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Resource not found</h2>
                        <p className="text-slate-500 mb-6">
                            The requested directory {resource} does not exist in our dashboard.
                        </p>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="success"
                            fullWidth={false}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const Icon = config.icon;
    const EmptyIcon = config.emptyIcon;
    const isItemsEmpty = !loading && items.length === 0;

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
                                {config.title}
                            </h1>
                            <p className="text-slate-500">
                                {config.subtitle}
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

                    {loading ? (
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Loading {resource}...</p>
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
                    ) : isItemsEmpty ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CountLabel label={config.title} count={items.length} />
                            <div className="text-center py-20 glass-card rounded-3xl max-w-xl mx-auto px-6 w-full">
                                <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
                                    <EmptyIcon className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">{config.emptyTitle}</h2>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                    {config.emptyDescription}
                                </p>
                                <Button
                                    onClick={() => router.push(`/dashboard/${resource}/new`)}
                                    variant="success"
                                    fullWidth={false}
                                    className="mt-4"
                                >
                                    <Plus className="w-5 h-5" />
                                    {config.createButtonText}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Action Bar */}
                            <div className="flex items-center justify-between mb-8">
                                <CountLabel label={config.title} count={items.length} />
                                <Button
                                    onClick={() => router.push(`/dashboard/${resource}/new`)}
                                    variant="success"
                                    fullWidth={false}
                                >
                                    <Plus className="w-5 h-5" />
                                    {config.newButtonText}
                                </Button>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-12 gap-6">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="col-span-12 md:col-span-6 lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Item Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center font-bold text-lg group-hover:bg-brand group-hover:text-white transition-colors duration-300 shrink-0">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand transition-colors duration-300 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">
                                                        Created {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'recently'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Item Description */}
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-10">
                                                {item.description || `No description provided. Click below to view and configure this ${resource.replace(/s$/, "")}.`}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => router.push(`/dashboard/${resource}/${item.id}`)}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-slate-50 hover:bg-brand hover:text-white text-slate-700 transition-all duration-300 active:scale-[0.98] border border-slate-100 hover:border-brand cursor-pointer"
                                        >
                                            {config.viewButtonText}
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
