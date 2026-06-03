// Page-level UI component that renders the ProjectView interface
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/core/context/AuthContext";
import { BackLink } from "@/components/atoms/BackLink";
import { Button } from "@/components/atoms/Button";
import { FolderOpen, Download } from "lucide-react";
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
import { useImage } from "@/hooks/useImage";
import { ImageType } from "@/core/types/models";
import { UUID } from "crypto";

interface ProjectViewProps {
  projectId: string;
  hideActions?: boolean;
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

export function ProjectView({ projectId, hideActions = false }: ProjectViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchProjectById, updateProject, deleteProject, downloadProject } = useProject();
  const { fetchImage } = useImage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageObj, setImageObj] = useState<ImageType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editPayload, setEditPayload] = useState<ProjectPayload | null>(null);

  const isAuthorized = user && project && user.id === project.user_id;

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectById(projectId);
        if (active) {
          setProject(data || null);
          if (data?.project_logo) {
            const img = await fetchImage(data.project_logo as UUID);
            if (active && img) setImageObj(img);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [projectId, fetchProjectById, fetchImage]);

  const schema = project?.architecture as ProjectSchema | undefined;
  const hasSchema = Boolean(schema?.nodes?.length || schema?.edges?.length);

  const handleEdit = () => setIsEditing(true);
  const handleDelete = async () => {
    const ok = await deleteProject(projectId);
    if (ok) router.push(ROUTES.projects);
  };
  const handleDownload = async () => {
    if (!project) return;
    setIsDownloading(true);
    await downloadProject(projectId, project.name);
    setIsDownloading(false);
  };
  const nextStep = (payload: ProjectPayload) => setEditPayload(payload);
  const finishEdit = async (archId: string, _: any, updated: { nodes: any[]; edges: any[] }) => {
    if (!project) return;
    const data = {
      name: editPayload?.name || project.name,
      description: editPayload?.description || project.description,
      project_logo: editPayload?.logo_id ? editPayload.logo_id : project.project_logo,
      architecture: { ...updated, architecture_id: archId } as unknown as JSON,
      architecture_id: archId,
    };
    const res = await updateProject(projectId, data);
    if (res) {
      setProject(res);
      setIsEditing(false);
      setEditPayload(null);
    }
  };

  if (isEditing && project) {
    const cur = editPayload ?? {
      name: decodeHtmlEntities(project.name),
      description: decodeHtmlEntities(project.description || ""),
      logo_id: project.project_logo,
    };
    return (
      <div className="app-shell p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {!hideActions && <BackLink href={ROUTES.projects} label="Back to Projects" />}
          <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
            {!editPayload ? (
              <ProjectStep1 initialName={cur.name} initialDescription={cur.description} onNext={nextStep} />
            ) : (
              <ProjectStep2
                projectName={cur.name}
                projectDescription={cur.description}
                logo_id={cur.logo_id}
                initialArchitectureId={project.architecture_id || (project.architecture as any)?.architecture_id}
                initialSchema={schema ? { nodes: schema.nodes || [], edges: schema.edges || [], architecture_id: (schema as any).architecture_id } : undefined}
                onBack={() => setEditPayload(null)}
                onFinish={finishEdit}
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
        {!hideActions && <BackLink href={ROUTES.projects} label="Back to Projects" />}
      </div>
      <div className="max-w-6xl mx-auto overflow-hidden glass-card border border-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-900/60 dark:border-slate-700/60">
        <div className="relative h-32 md:h-44 w-full bg-linear-to-br from-brand/10 via-brand/5 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-float-delayed" />
        </div>
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <DeleteModal id={projectId} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />
        </Modal>
        <div className="px-6 md:px-10 pb-10 -mt-16 md:-mt-20 relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end justify-between text-center md:text-left">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-100/50 text-brand shrink-0 dark:bg-slate-900/50 dark:border-slate-700/50">
                  <FolderOpen size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight break-words w-full">
                  {loading ? "Loading..." : decodeHtmlEntities(project?.name || "Project Details")}
                </h1>
              </div>
              {!loading && project?.description && (
                <p className="text-base md:text-xl text-slate-500 dark:text-slate-300 max-w-3xl leading-relaxed whitespace-pre-line mx-auto md:mx-0">
                  {decodeHtmlEntities(project.description)}
                </p>
              )}
            </div>
            {isAuthorized && !hideActions && (
              <div className="flex gap-3 pb-2 justify-center md:justify-end">
                <Button variant="success" onClick={handleDownload} isLoading={isDownloading} className="rounded-2xl px-6 glass-card-hover">
                  <Download className="w-5 h-5" /> Export ZIP
                </Button>
                <Button variant="secondary" onClick={handleEdit} className="rounded-2xl px-6 glass-card-hover">Edit</Button>
                <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="rounded-2xl px-6 glass-card-hover">Delete</Button>
              </div>
            )}
          </div>
          {imageObj && (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><div className="w-2 h-8 bg-brand rounded-full" /> Project Logo</h3>
              <div className="w-full relative h-32 md:h-48 rounded-[2rem] shadow-inner overflow-hidden border border-slate-200 bg-white dark:bg-slate-900/50 dark:border-slate-700 flex items-center justify-center">
                <Image src={imageObj.url} alt={project?.name || "Project logo"} width={200} height={200} className="object-contain" unoptimized />
              </div>
            </div>
          )}
          {hasSchema ? (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><div className="w-2 h-8 bg-brand rounded-full" /> Architecture Schema</h3>
              <div className="w-full h-[350px] sm:h-[500px] md:h-150 border border-slate-200 rounded-[2rem] shadow-inner overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 relative pointer-events-none">
                <SchemaCanvas nodes={schema?.nodes || []} edges={schema?.edges || []} nodeTypes={projectNodeTypes} readonly={true} />
              </div>
            </div>
          ) : (!loading && (
            <div className="p-12 bg-white/40 border border-white/50 rounded-3xl text-center shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
              <p className="text-slate-500 font-medium text-lg dark:text-slate-300">No architecture schema available for this project yet.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
