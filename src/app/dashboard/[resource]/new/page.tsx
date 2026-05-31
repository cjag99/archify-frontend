"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/core/context/AuthContext";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { BackLink } from "@/components/atoms/BackLink";
import { dashboardResourceList } from "@/lib/routes";
import { PatternStep1 } from "@/components/molecules/PatternStep1";
import { PatternStep2 } from "@/components/molecules/PatternStep2";
import { PatternStep3 } from "@/components/molecules/PatternStep3";
import { ArchitectureStep1 } from "@/components/molecules/ArchitectureStep1";
import { ArchitectureStep2 } from "@/components/molecules/ArchitectureStep2";
import { Button } from "@/components/atoms/Button";
import { useArchitecture } from "@/hooks/useArchitecture";
import { Lock } from "lucide-react";
interface CanvasNodeData {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, any>;
}

interface CanvasEdgeData {
  id: string;
  source: string;
  target: string;
}
interface ArchitecturePayload {
    name: string;
    description: string;
    enabled: boolean;
}

interface PatternPayload {
    name: string;
    description: string;
    graphicType: number;
}


export default function NewResourcePage() {
    const params = useParams();
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();
    const [architecturePayload, setArchitecturePayload] = useState<ArchitecturePayload | null>(null);
    const [patternPayload, setPatternPayload] = useState<PatternPayload | null>(null);
    const [patternId, setPatternId] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const resource = (typeof params?.resource === "string" ? params.resource : (pathname.split("/")[2] || ""));
    const { createArchitecture } = useArchitecture();
    
    // Authorization check: Only authorized users can create patterns and architectures
    const isAuthorized = user?.is_authorized || user?.role === "admin";
    const canCreateResource = isAuthorized || resource === "projects";
    
    // Show access denied if not authorized for this resource type
    if (!authLoading && !canCreateResource && (resource === "patterns" || resource === "architectures")) {
        return (
            <ProtectedRoute>
                <div className="app-shell flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-300 glass-card rounded-2xl p-8 border border-slate-200">
                        <div className="mb-6">
                            <BackLink
                                href={dashboardResourceList(resource)}
                                label={`Volver a ${resource}`}
                            />
                        </div>
                        <div className="text-center py-12 space-y-6">
                            <div className="w-14 h-14 bg-red-500/8 rounded-xl flex items-center justify-center text-red-500 mx-auto">
                                <Lock className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                                <p className="text-slate-500">
                                    You don't have permission to create {resource}. Only authorized users can create this resource type.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }
    const handlePatternNext = (payload: PatternPayload) => {
        setPatternPayload(payload);
        setStep(2);
    };

    const handlePatternFinish = (createdPatternId: string) => {
        setPatternId(createdPatternId);
        setStep(3);
    };


    const handleArchitectureNext = (payload: ArchitecturePayload) => {
        setArchitecturePayload(payload);
        setStep(2);
    };

    const handleArchitectureBack = () => setStep(1);

    const handleArchitectureFinish = (
      schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] },
      payload: ArchitecturePayload | null
    ) => {
      const finalPayload = {
        name: payload?.name || "Untitled Architecture",
        description: payload?.description || "",
        enabled: payload?.enabled ?? true,
        base_structure: schema as unknown as JSON,
      };

      void createArchitecture(finalPayload);
    };

    const renderArchitectureSteps = () => {
      if (step === 1 || !architecturePayload) {
        return <ArchitectureStep1 onNext={handleArchitectureNext} />;
      } else if (step === 2 && architecturePayload) {
        return (
          <ArchitectureStep2
            architectureName={architecturePayload.name}
            architectureDescription={architecturePayload.description}
            enabled={architecturePayload.enabled}
            onBack={handleArchitectureBack}
            onFinish={handleArchitectureFinish}
          />
        );
      } else {

      }
    };

    const renderPatternSteps = () => {
      if (step === 1 || !patternPayload) {
        return <PatternStep1 onNext={handlePatternNext} />;
      }

      if (step === 2 && patternPayload) {
        return (
          <PatternStep2
            patternName={patternPayload.name}
            patternDescription={patternPayload.description}
            graphicType={patternPayload.graphicType}
            onBack={() => setStep(1)}
            onFinish={handlePatternFinish}
          />
        );
      }

      if (step === 3 && patternPayload && patternId) {
        return (
          <PatternStep3
            patternId={patternId}
            patternName={patternPayload.name}
            onBackToStart={() => {
              setPatternPayload(null);
              setPatternId(null);
              setStep(1);
            }}
          />
        );
      }

      return <PatternStep1 onNext={handlePatternNext} />;
    };

    const renderResourceContent = () => {
      switch (resource) {
        case "patterns":
          return renderPatternSteps();
        case "architectures":
          return renderArchitectureSteps();
        default:
          return (
            <div className="text-center py-6">
              <h1 className="text-2xl font-extrabold text-slate-950">
                Creating new {resource}
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                You have entered with config: <strong className="text-slate-800">{resource}</strong>
              </p>
            </div>
          );
      }
    };

    return (
        <ProtectedRoute>
            <div className="app-shell flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-300 glass-card rounded-2xl p-8 border border-slate-200">
                    <div className="mb-6">
                        <BackLink
                            href={dashboardResourceList(resource)}
                            label={`Volver a ${resource}`}
                        />
                    </div>
                    <div className="mb-4">
                        <span className="eyebrow capitalize">
                            Active Config: {resource}
                        </span>
                    </div>

                    {renderResourceContent()}
                </div>
            </div>
        </ProtectedRoute>
    );
}
