// Page-level UI component that renders the ArchitectureView interface
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useArchitecture } from "@/hooks/useArchitecture";
import { useAuth } from "@/core/context/AuthContext";
import { BackLink } from "@/components/atoms/BackLink";
import { Button } from "@/components/atoms/Button";
import { Lock } from "lucide-react";
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
import { decodeHtmlEntities } from "@/core/utils/string.utils";

interface ArchitectureViewProps {
  architectureId: string;
  hideActions?: boolean;
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
    source_port?: string;
    target: string;
    target_port?: string;
    vertices?: Array<{ x: number; y: number }>;
  }>;
};

export function ArchitectureView({ architectureId, hideActions = false }: ArchitectureViewProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isAuthorized = user?.is_authorized || user?.role === "admin";
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
      name: decodeHtmlEntities(architecture.name),
      description: decodeHtmlEntities(architecture.description || ""),
      enabled: architecture.enabled ?? true,
    };

    return (
      <div className="app-shell p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {!hideActions && <BackLink href={ROUTES.architectures} label="Back to Architectures" />}
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
    <div className="app-shell p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto mb-6">
        {!hideActions && <BackLink href={ROUTES.architectures} label="Back to Architectures" />}
      </div>

      <div className="max-w-6xl mx-auto overflow-hidden glass-card border border-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-950/80 dark:border-slate-700/80">
        {}
        <div className="relative h-32 md:h-44 w-full bg-linear-to-br from-brand/10 via-brand/5 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

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

        <div className="px-6 md:px-10 pb-10 -mt-16 md:-mt-20 relative z-10 space-y-10">
          {}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end justify-between text-center md:text-left">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-100/50 text-brand shrink-0 dark:bg-slate-900/50 dark:border-slate-700/50">
                  <Lock size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight break-words w-full">
                  {loading ? "Loading..." : decodeHtmlEntities(architecture?.name || "Architecture Details")}
                </h1>
              </div>
              {!loading && architecture?.description && (
                <p className="text-base md:text-xl text-slate-500 dark:text-slate-300 max-w-3xl leading-relaxed whitespace-pre-line mx-auto md:mx-0">
                  {decodeHtmlEntities(architecture.description)}
                </p>
              )}
            </div>
            {!loading && architecture && isAuthorized && !hideActions && (
              <div className="flex gap-3 pb-2 justify-center md:justify-end">
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="rounded-2xl px-6">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="rounded-2xl px-6">
                  Delete
                </Button>
              </div>
            )}
          </div>

          {}
          {hasSchema ? (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-950/70 dark:border-slate-700/80">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Schema
              </h3>
              <div className="w-full h-[350px] sm:h-[500px] md:h-150 border border-slate-700/60 rounded-[2rem] shadow-inner overflow-hidden bg-slate-50/50 dark:bg-slate-950/70 relative pointer-events-none">
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
              <div className="p-12 bg-white/40 border border-white/50 rounded-3xl text-center shadow-sm dark:bg-slate-950/70 dark:border-slate-700/80">
                <p className="text-slate-500 font-medium text-lg dark:text-slate-300">
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

