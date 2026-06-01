"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PatternView } from "@/components/organisms/PatternView";
import { ArchitectureView } from "@/components/organisms/ArchitectureView";
import { ProjectView } from "@/components/organisms/ProjectView";
import { BackLink } from "@/components/atoms/BackLink";
import { dashboardResourceList } from "@/lib/routes";
import { Briefcase } from "lucide-react";

export default function ResourceDetailPage() {
    const params = useParams();
    const resource = typeof params?.resource === "string" ? params.resource : "";
    const id = typeof params?.id === "string" ? params.id : "";

    if (!id || !resource) {
        return (
            <ProtectedRoute>
                <div className="app-shell flex items-center justify-center p-6">
                    <p className="text-slate-500">Invalid resource parameters.</p>
                </div>
            </ProtectedRoute>
        );
    }

    if (resource === "patterns") {
        return (
            <ProtectedRoute>
                <PatternView patternId={id} />
            </ProtectedRoute>
        );
    }

    if (resource === "architectures") {
        return (
            <ProtectedRoute>
                <ArchitectureView architectureId={id} />
            </ProtectedRoute>
        );
    }

    if (resource === "projects") {
        return (
            <ProtectedRoute>
                <ProjectView projectId={id} />
            </ProtectedRoute>
        );
    }

    // Placeholder for other resources
    return (
        <ProtectedRoute>
            <div className="app-shell flex flex-col items-center justify-center p-6">
                <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto px-6 w-full">
                    <div className="w-14 h-14 bg-brand/8 rounded-xl flex items-center justify-center text-brand mx-auto mb-6">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">View not available</h2>
                    <p className="text-slate-500 mb-6">
                        Detailed view for {resource} is currently under construction.
                    </p>
                    <BackLink
                        href={dashboardResourceList(resource)}
                        label={`Volver a ${resource}`}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
