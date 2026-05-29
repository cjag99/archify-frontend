"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useArchitecture } from "@/hooks/useArchitecture";
import { BackLink } from "@/components/atoms/BackLink";
import { Button } from "@/components/atoms/Button";
import { ROUTES } from "@/lib/routes";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import Modal from "@/components/organisms/Modal";
import { DeleteModal } from "@/components/organisms/DeleteModal";
import { ArchitectureStep1 } from "@/components/molecules/ArchitectureStep1";
import { ArchitectureStep2 } from "@/components/molecules/ArchitectureStep2";
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
  const router = useRouter();
  const {
    architecture,
    fetchArchitecture,
    updateArchitecture,
    deleteArchitecture,
    loading,
  } = useArchitecture();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPayload, setEditPayload] = useState<{ name: string; description: string; enabled: boolean } | null>(null);

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

  if (isEditing && architecture) {
    const currentEditPayload = editPayload ?? {
      name: architecture.name,
      description: architecture.description || "",
      enabled: architecture.enabled ?? true,
    };

    return (
      <div className="app-shell p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <BackLink href={ROUTES.architectures} label="Volver a architectures" />
          <div className="glass-card rounded-2xl p-8 border border-slate-200">
            {!editPayload ? (
              <ArchitectureStep1
                initialName={currentEditPayload.name}
                initialDescription={currentEditPayload.description}
                initialEnabled={currentEditPayload.enabled}
                onNext={(payload) => setEditPayload(payload)}
              />
            ) : (
              <ArchitectureStep2
                architectureName={currentEditPayload.name}
                architectureDescription={currentEditPayload.description}
                enabled={currentEditPayload.enabled}
                initialNodes={schema?.nodes || []}
                initialEdges={schema?.edges || []}
                onBack={() => setEditPayload(null)}
                onFinish={async (updatedSchema, payload) => {
                  await updateArchitecture(architectureId, {
                    ...payload,
                    base_structure: updatedSchema as unknown as JSON,
                  });
                  await fetchArchitecture(architectureId);
                  setIsEditing(false);
                  setEditPayload(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <BackLink href={ROUTES.architectures} label="Volver a architectures" />
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <DeleteModal
            id={architectureId}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={async () => {
              const deleted = await deleteArchitecture(architectureId);
              if (deleted) {
                router.push(ROUTES.architectures);
              }
            }}
          />
        </Modal>

        <div className="space-y-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-950">
                {loading ? "Loading..." : architecture?.name || "Architecture Details"}
              </h1>
              {architecture?.description && (
                <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
                  {architecture.description}
                </p>
              )}
            </div>
            {!loading && architecture && (
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {hasSchema ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Schema
              </h3>
              <div className="w-full h-150 border border-slate-200 rounded-2xl shadow-sm overflow-hidden bg-white relative pointer-events-none">
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
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center">
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
