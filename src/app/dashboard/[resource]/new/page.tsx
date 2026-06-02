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
import { ProjectStep1 } from "@/components/molecules/ProjectStep1";
import { ProjectStep2 } from "@/components/molecules/ProjectStep2";
import { Button } from "@/components/atoms/Button";
import { useArchitecture } from "@/hooks/useArchitecture";
import { useRouter } from "next/navigation";
import { projectService } from "@/core/api/projects.service";
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

interface ProjectPayload {
    name: string;
    description: string;
    logo_id?: string;
    architecture?: JSON;
}

interface ProjectNodeNameMap {
    [nodeType: string]: string;
}


export default function NewResourcePage() {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [architecturePayload, setArchitecturePayload] = useState<ArchitecturePayload | null>(null);
    const [patternPayload, setPatternPayload] = useState<PatternPayload | null>(null);
    const [projectPayload, setProjectPayload] = useState<ProjectPayload | null>(null);
    const [patternId, setPatternId] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

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

    const handleArchitectureFinish = async (
      schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] },
      payload: ArchitecturePayload | null
    ) => {
      const finalPayload = {
        name: payload?.name || "Untitled Architecture",
        description: payload?.description || "",
        enabled: payload?.enabled ?? true,
        base_structure: schema as unknown as JSON,
      };

      await createArchitecture(finalPayload);
    };

    const handleProjectNext = (payload: ProjectPayload) => {
        setProjectPayload(payload);
        setStep(2);
    };

    const handleProjectBack = () => setStep(1);

    const handleProjectFinish = async (
        architecture_id: string,
        nodeNameMap: ProjectNodeNameMap,
        schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] }
    ) => {
        setIsCreatingProject(true);
      setCreateError(null);
      if (!user?.id) {
        console.error("Cannot create project: missing user id");
        setCreateError("No authenticated user found. Please sign in and try again.");
        setIsCreatingProject(false);
        return;
      }
        try {
            // Create the project with the selected architecture and updated schema
            const payload = {
              name: projectPayload?.name || "Untitled Project",
              description: projectPayload?.description || "",
              project_logo: projectPayload?.logo_id as any,
              architecture: { ...schema, architecture_id } as unknown as JSON, // ✨ Inyectamos el ID
              architecture_id: architecture_id,
              user_id: user?.id,
            } as const;
            console.log("Creating project payload:", payload);
            await projectService.create(payload as any);
        } catch (err) {
            console.error("Failed to create project:", err);
          setCreateError("Failed to create project. See console for details.");
        } finally {
            setIsCreatingProject(false);
        }
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

    const renderProjectSteps = () => {
      if (step === 1 || !projectPayload) {
        return <ProjectStep1 onNext={handleProjectNext} />;
      } else if (step === 2 && projectPayload) {
        return (
          <ProjectStep2
            projectName={projectPayload.name}
            projectDescription={projectPayload.description}
            logo_id={projectPayload.logo_id}
            onBack={handleProjectBack}
            onFinish={handleProjectFinish}
          />
        );
      }
      return <ProjectStep1 onNext={handleProjectNext} />;
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
        case "projects":
          return renderProjectSteps();
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
            {createError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600 font-semibold">{createError}</p>
              </div>
            )}
        </ProtectedRoute>
    );
}
