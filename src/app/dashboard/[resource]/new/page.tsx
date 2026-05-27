"use client";

import { useParams, usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PatternStep1 } from "@/components/molecules/PatternStep1";

export default function NewResourcePage() {
    const params = useParams();
    const pathname = usePathname();

    const resource = (typeof params?.resource === "string" ? params.resource : (pathname.split("/")[2] || ""));

    const handlePatternNext = (payload: { name: string; description: string }) => {
        console.log("Pattern step 1 payload:", payload);
        
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-xl glass-card rounded-3xl p-8 border border-slate-100">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/5 text-brand capitalize">
                            Active Config: {resource}
                        </span>
                    </div>

                    {resource === "patterns" ? (
                        <PatternStep1 onNext={handlePatternNext} />
                    ) : (
                        <div className="text-center py-6">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Creating new {resource}
                            </h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                You have entered with config: <strong className="text-slate-800">{resource}</strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
