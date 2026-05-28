"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Node, Edge } from "@xyflow/react";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PatternStep1 } from "@/components/molecules/PatternStep1";
import { PatternStep2 } from "@/components/molecules/PatternStep2";
import { PatternStep3 } from "@/components/molecules/PatternStep3";
import { ArchitectureStep1 } from "@/components/molecules/ArchitectureStep1";
import { ArchitectureStep2 } from "@/components/molecules/ArchitectureStep2";
import { Button } from "@/components/atoms/Button";
import { useArchitecture } from "@/hooks/useArchitecture";

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
    const [architecturePayload, setArchitecturePayload] = useState<ArchitecturePayload | null>(null);
    const [patternPayload, setPatternPayload] = useState<PatternPayload | null>(null);
    const [patternId, setPatternId] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const resource = (typeof params?.resource === "string" ? params.resource : (pathname.split("/")[2] || ""));
    const { createArchitecture } = useArchitecture();
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
      schema: { nodes: Node[]; edges: Edge[] },
      payload: ArchitecturePayload | null
    ) => {
      const finalPayload = {
        name: payload?.name || "Untitled Architecture",
        description: payload?.description || "",
        enabled: payload?.enabled ?? true,
        schema: schema as unknown as JSON,
      };

      createArchitecture(finalPayload);
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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
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
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-300 glass-card rounded-3xl p-8 border border-slate-100">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/5 text-brand capitalize">
                            Active Config: {resource}
                        </span>
                    </div>

                    {renderResourceContent()}
                </div>
            </div>
        </ProtectedRoute>
    );
}
