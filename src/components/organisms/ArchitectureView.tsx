"use client";

import { useEffect } from "react";
import { useArchitecture } from "@/hooks/useArchitecture";
import { BackLink } from "@/components/atoms/BackLink";
import { ROUTES } from "@/lib/routes";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import { UserNode } from "@/components/molecules/diagramNodes/UserNode";
import { MVCViewNode } from "@/components/molecules/diagramNodes/MVCViewNode";
import { MVCModelNode } from "@/components/molecules/diagramNodes/MVCModelNode";
import { MVCControllerNode } from "@/components/molecules/diagramNodes/MVCControllerNode";
import { CleanEntityNode } from "@/components/molecules/diagramNodes/CleanEntityNode";
import { CleanUseCaseNode } from "@/components/molecules/diagramNodes/CleanUseCaseNode";
import { CleanAdapterNode } from "@/components/molecules/diagramNodes/CleanAdapterNode";
import { CleanFrameworkNode } from "@/components/molecules/diagramNodes/CleanFrameworkNode";
import { HexagonalDomainNode } from "@/components/molecules/diagramNodes/HexagonalDomainNode";
import { HexagonalApplicationNode } from "@/components/molecules/diagramNodes/HexagonalApplicationNode";
import { HexagonalAdapterNode } from "@/components/molecules/diagramNodes/HexagonalAdapterNode";

interface ArchitectureViewProps {
  architectureId: string;
}

const architectureNodeTypes = {
  user: UserNode,
  "mvc-view": MVCViewNode,
  "mvc-model": MVCModelNode,
  "mvc-controller": MVCControllerNode,
  "clean-entity": CleanEntityNode,
  "clean-usecase": CleanUseCaseNode,
  "clean-adapter": CleanAdapterNode,
  "clean-framework": CleanFrameworkNode,
  "hex-domain": HexagonalDomainNode,
  "hex-application": HexagonalApplicationNode,
  "hex-adapter": HexagonalAdapterNode,
};

type ArchitectureSchema = {
  nodes?: Array<{
    id: string;
    type?: string;
    position?: { x: number; y: number };
    data?: Record<string, unknown>;
  }>;
  edges?: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};

export function ArchitectureView({ architectureId }: ArchitectureViewProps) {
  const { architecture, fetchArchitecture, loading } = useArchitecture();

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (active) {
        await fetchArchitecture(architectureId);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [architectureId, fetchArchitecture]);

  const schema = architecture?.base_structure as ArchitectureSchema | undefined;
  const hasSchema = Boolean(schema?.nodes?.length || schema?.edges?.length);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <BackLink href={ROUTES.architectures} label="Volver a architectures" />

        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "Loading..." : architecture?.name || "Architecture Details"}
            </h1>
            {architecture?.description && (
              <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
                {architecture.description}
              </p>
            )}
          </div>

          {hasSchema ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Schema
              </h3>
              <div className="w-full h-150 border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden bg-white relative pointer-events-none">
                <SchemaCanvas
                  nodes={schema?.nodes || []}
                  edges={schema?.edges || []}
                  nodeTypes={architectureNodeTypes}
                  readonly={true}
                />
              </div>
            </div>
          ) : (
            !loading && (
              <div className="p-8 bg-white border border-slate-200 rounded-4xl text-center">
                <p className="text-slate-500 font-medium text-lg">
                  No schema available for this architecture yet.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
