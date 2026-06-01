"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/core/context/AuthContext";
import { BackLink } from "@/components/atoms/BackLink";
import { Button } from "@/components/atoms/Button";
import { FolderOpen } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import Modal from "@/components/organisms/Modal";
import { DeleteModal } from "@/components/organisms/DeleteModal";
import { ProjectStep1 } from "@/components/molecules/ProjectStep1";
import { ProjectStep2 } from "@/components/molecules/ProjectStep2";
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
import Image from "next/image";
import { UUID } from "crypto";
import { useImage } from "@/hooks/useImage";
import { ImageType } from "@/core/types/models";

interface ProjectViewProps {
  projectId: string;
}

const projectNodeTypes = {
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

type ProjectSchema = {
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

interface ProjectPayload {
  name: string;
  description: string;
  logo_id?: string;
}

interface ProjectNodeNameMap {
  [nodeType: string]: string;
}

export function ProjectView({ projectId }: ProjectViewProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { fetchProjectById, updateProject, deleteProject } = useProject();
  const { fetchImage } = useImage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageObj, setImageObj] = useState<ImageType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPayload, setEditPayload] = useState<ProjectPayload | null>(null);

  const isAuthorized = user && project && user.id === project.user_id;

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectById(projectId);
        if (active) {
          setProject(data || null);
          if (data?.project_logo) {
            const fetchedImage = await fetchImage(data.project_logo as UUID);
            if (active && fetchedImage) {
              setImageObj(fetchedImage);
            }
          }
        }
      } catch (err) {
        console.error("Error loading project data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [projectId, fetchProjectById, fetchImage]);

  const schema = project?.architecture as ProjectSchema | undefined;
  const hasSchema = Boolean(schema?.nodes?.length || schema?.edges?.length);

  const handleProjectEdit = () => {
    setIsEditing(true);
  };

  const handleProjectDelete = async () => {
    const deleted = await deleteProject(projectId);
    if (deleted) {
      router.push(ROUTES.projects);
    }
  };

  const handleEditStep1Next = (payload: ProjectPayload) => {
    setEditPayload(payload);
  };

  const handleEditStep2Finish = async (
    architecture_id: string,
    nodeNameMap: ProjectNodeNameMap,
    updatedSchema: { nodes: any[]; edges: any[] }
  ) => {
    if (!project) return;

    const updateData = {
      name: editPayload?.name || project.name,
      description: editPayload?.description || project.description,
      project_logo: editPayload?.logo_id ? (editPayload.logo_id as any) : project.project_logo,
      architecture: updatedSchema as unknown as JSON,
    };

    const result = await updateProject(projectId, updateData);
    if (result) {
      setProject(result);
      setIsEditing(false);
      setEditPayload(null);
    }
  };

  if (isEditing && project) {
    const currentEditPayload = editPayload ?? {
      name: decodeHtmlEntities(project.name),
      description: decodeHtmlEntities(project.description || ""),
      logo_id: project.project_logo,
    };

    return (
      <div className="app-shell p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <BackLink href={ROUTES.projects} label="Back to Projects" />
          <div className="glass-card rounded-2xl p-8 border border-slate-200">
            {!editPayload ? (
              <ProjectStep1
                initialName={currentEditPayload.name}
                initialDescription={currentEditPayload.description}
                onNext={handleEditStep1Next}
              />
            ) : (
              <ProjectStep2
                projectName={currentEditPayload.name}
                projectDescription={currentEditPayload.description}
                logo_id={currentEditPayload.logo_id}
                onBack={() => setEditPayload(null)}
                onFinish={handleEditStep2Finish}
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
        <BackLink href={ROUTES.projects} label="Back to Projects" />
      </div>

      <div className="max-w-6xl mx-auto overflow-hidden bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 transition-all duration-300">
        {/* Premium Header Area */}
        <div className="relative h-32 md:h-44 w-full bg-linear-to-br from-brand/10 via-brand/5 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <DeleteModal
            id={projectId}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleProjectDelete}
          />
        </Modal>

        <div className="px-6 md:px-10 pb-10 -mt-16 md:-mt-20 relative z-10 space-y-10">
          {/* Title and Actions Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end justify-between text-center md:text-left">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-100/50 text-brand shrink-0">
                  <FolderOpen size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight break-words w-full">
                  {loading ? "Loading..." : decodeHtmlEntities(project?.name || "Project Details")}
                </h1>
              </div>
              {!loading && project?.description && (
                <p className="text-base md:text-xl text-slate-500 max-w-3xl leading-relaxed whitespace-pre-line mx-auto md:mx-0">
                  {decodeHtmlEntities(project.description)}
                </p>
              )}
            </div>
            {!loading && project && isAuthorized && (
              <div className="flex gap-3 pb-2 justify-center md:justify-end">
                <Button variant="secondary" onClick={handleProjectEdit} className="rounded-2xl px-6">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="rounded-2xl px-6">
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Project Logo Section */}
          {imageObj && (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Project Logo
              </h3>
              <div className="w-full relative h-32 md:h-48 rounded-[2rem] shadow-inner overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                {imageObj?.url ? (
                  <Image 
                    src={imageObj.url} 
                    alt={project?.name || "Project logo"} 
                    width={200} 
                    height={200} 
                    className="object-contain" 
                    unoptimized 
                  />
                ) : (
                  <p className="text-slate-400">No logo available</p>
                )}
              </div>
            </div>
          )}

          {/* Schema Section */}
          {hasSchema ? (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Architecture Schema
              </h3>
              <div className="w-full h-[350px] sm:h-[500px] md:h-150 border border-slate-200 rounded-[2rem] shadow-inner overflow-hidden bg-slate-50/50 relative pointer-events-none">
                <SchemaCanvas
                  nodes={schema?.nodes || []}
                  edges={schema?.edges || []}
                  nodeTypes={projectNodeTypes}
                  readonly={true}
                />
              </div>
            </div>
          ) : (
            !loading && (
              <div className="p-12 bg-white/40 border border-white/50 rounded-3xl text-center shadow-sm">
                <p className="text-slate-500 font-medium text-lg">
                  No architecture schema available for this project yet.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
