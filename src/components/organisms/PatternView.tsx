// Page-level UI component that renders the PatternView interface
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePatterns } from "@/hooks/usePattern";
import { usePatternCode } from "@/hooks/usePatternCode";
import { useCodeLanguage } from "@/hooks/useCodeLanguage";
import { useImage } from "@/hooks/useImage";
import { useAuth } from "@/core/context/AuthContext";
import { BackLink } from "@/components/atoms/BackLink";
import { Button } from "@/components/atoms/Button";
import { Pattern, ImageType, CodeLanguage, PatternCode } from "@/core/types/models";
import { ROUTES } from "@/lib/routes";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import Modal from "@/components/organisms/Modal";
import { DeleteModal } from "@/components/organisms/DeleteModal";
import { PatternStep1 } from "@/components/molecules/PatternStep1";
import { PatternStep2 } from "@/components/molecules/PatternStep2";
import { UserNode } from "@/components/molecules/diagramNodes/UserNode";
import { SingletonNode } from "@/components/molecules/diagramNodes/SingletonNode";
import Image from "next/image";
import { UUID } from "crypto";
import { ChevronDown, Code } from "lucide-react";
import { decodeHtmlEntities } from "@/core/utils/string.utils";

interface PatternViewProps {
  patternId: string;
  hideActions?: boolean;
}

const patternNodeTypes = {
  user: UserNode,
  singleton: SingletonNode,
};
function LanguageLogo({ src, alt, size = 20 }: { src: string; alt: string; size?: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export function PatternView({ patternId, hideActions = false }: PatternViewProps) {
  const router = useRouter();
  const { loading: authLoading, user } = useAuth();
  const isAuthorized = user?.is_authorized || user?.role === "admin";
  const canLoadCodeLanguages = Boolean(isAuthorized);
  const { codeLanguages, fetchCodeLanguage, error: languagesError, loading: languagesLoading } = useCodeLanguage({
    autoFetch: canLoadCodeLanguages,
    logErrors: canLoadCodeLanguages,
  });
  const { fetchPatternById, deletePattern } = usePatterns();
  const { patternCodes, fetchCodesByPatternId, loading: codesLoading, error: codesError } = usePatternCode();
  const { fetchImage } = useImage();
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageObj, setImageObj] = useState<ImageType | null>(null);

  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState<number>(0);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [languageImages, setLanguageImages] = useState<Record<string, string>>({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPayload, setEditPayload] = useState<{ name: string; description: string; graphicType: number } | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchPatternById(patternId);
        if (active) {
          setPattern(data || null);
          if (data?.image_id) {
            const fetchedImage = await fetchImage(data.image_id as UUID);
            if (active && fetchedImage) {
              setImageObj(fetchedImage);
            }
          }
        }
      } catch (err) {
        console.error("Error loading pattern data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadData();
    fetchCodesByPatternId(patternId);
    
    return () => {
      active = false;
    };
  }, [patternId, fetchPatternById, fetchCodesByPatternId, fetchImage]);

  useEffect(() => {
    let active = true;

    const resolveLogos = async () => {
      const newImages: Record<string, string> = {};

      if (!patternCodes) return;

      for (const pc of patternCodes) {
        if (!pc || !pc.code_id || String(pc.code_id) === "undefined") {
        continue;
      }

        const lang =
          codeLanguages.find((l) => l.id === pc.code_id) ??
          (await fetchCodeLanguage(pc.code_id));

        if (!lang || newImages[lang.id]) continue;

        if (lang.icon_url) {
          newImages[lang.id] = lang.icon_url;
          continue;
        }

        if (!lang.icon) continue;

        const imgObj = await fetchImage(lang.icon as UUID);
        if (imgObj?.url) {
          newImages[lang.id] = imgObj.url;
        }
      }

      if (active && Object.keys(newImages).length > 0) {
        setLanguageImages((prev) => ({ ...prev, ...newImages }));
      }
    };

    if (!authLoading && canLoadCodeLanguages && Array.isArray(patternCodes) && patternCodes.length > 0) {
      void resolveLogos();
    }

    return () => {
      active = false;
    };
  }, [patternCodes, codeLanguages, fetchCodeLanguage, fetchImage, authLoading, canLoadCodeLanguages]);

  const getLogoUrl = (lang: CodeLanguage | null | undefined) =>
    lang ? (lang.icon_url ?? languageImages[lang.id]) : undefined;

  const selectedSnippet = (Array.isArray(patternCodes) && patternCodes.length > 0) ? patternCodes[selectedSnippetIndex] : null;
  const selectedLang = selectedSnippet ? codeLanguages.find(l => l.id === selectedSnippet.code_id) : null;
  const selectedLogoUrl = getLogoUrl(selectedLang);
  const patternSchema = pattern?.base_structure as { 
    nodes?: any[]; 
    edges?: { 
      id: string, 
      source: string, source_port?: string, 
      target: string, target_port?: string,
      vertices?: Array<{ x: number; y: number }> 
    }[] 
  } | undefined;
  const hasSchema = Boolean(patternSchema?.nodes?.length || patternSchema?.edges?.length);
  const getPatternGraphicType = () => pattern?.image_id ? 1 : patternSchema ? 2 : 0;

  if (isEditing && pattern) {
    const currentEditPayload = editPayload ?? {
      name: decodeHtmlEntities(pattern.name),
      description: decodeHtmlEntities(pattern.description || ""),
      graphicType: getPatternGraphicType(),
    };

    

    return (
      <div className="app-shell p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {!hideActions && <BackLink href={ROUTES.patterns} label="Back to Patterns" />}
          <div className="glass-card rounded-2xl p-8 border border-slate-200">
            {!editPayload ? (
              <PatternStep1
                initialName={currentEditPayload.name}
                initialDescription={currentEditPayload.description}
                initialGraphicType={currentEditPayload.graphicType}
                onNext={(payload) => setEditPayload(payload)}
              />
            ) : (
              <PatternStep2
                mode="edit"
                patternId={patternId}
                patternName={currentEditPayload.name}
                patternDescription={currentEditPayload.description}
                graphicType={currentEditPayload.graphicType}
                initialNodes={patternSchema?.nodes || []}
                initialEdges={patternSchema?.edges || []}
                initialImageId={pattern.image_id || null}
                onBack={() => setEditPayload(null)}
                onFinish={() => {
                  setIsEditing(false);
                  setEditPayload(null);
                  void fetchPatternById(patternId).then((data) => setPattern(data || null));
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
        {!hideActions && <BackLink href={ROUTES.patterns} label="Back to Patterns" />}
      </div>

      <div className="max-w-6xl mx-auto overflow-hidden bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 transition-all duration-300 dark:bg-slate-900/60 dark:border-slate-700/60">
        {}
        <div className="relative h-32 md:h-44 w-full bg-linear-to-br from-brand/10 via-brand/5 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <DeleteModal
            id={patternId}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={async () => {
              const deleted = await deletePattern(patternId);
              if (deleted) {
                router.push(ROUTES.patterns);
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
                  <Code size={28} />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight break-words w-full">
                  {loading ? "Loading..." : pattern?.name || "Pattern Details"}
                </h1>
              </div>
              {!loading && pattern?.description && (
                <p className="text-base md:text-xl text-slate-500 dark:text-slate-300 max-w-3xl leading-relaxed whitespace-pre-line mx-auto md:mx-0">
                  {decodeHtmlEntities(pattern.description)}
                </p>
              )}
            </div>
            {!loading && pattern && isAuthorized && !hideActions && (
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
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Schema
              </h3>
              <div className="w-full h-[350px] sm:h-[500px] md:h-150 border border-slate-200 rounded-[2rem] shadow-inner overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 relative pointer-events-none">
                <SchemaCanvas
                  nodes={patternSchema?.nodes || []}
                  edges={patternSchema?.edges || []}
                  nodeTypes={patternNodeTypes}
                  readonly={true}
                />
              </div>
            </div>
          ) : (
            !loading && (
              <div className="p-12 bg-white/40 border border-white/50 rounded-3xl text-center shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
                <p className="text-slate-500 font-medium text-lg dark:text-slate-300">
                  No schema available for this pattern yet.
                </p>
              </div>
            )
          )}

          {pattern?.image_id && imageObj && (
            <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Graphic Representation
              </h3>
              <div className="w-full relative h-100 md:h-150 rounded-[2rem] shadow-inner overflow-hidden border border-slate-200 bg-white dark:bg-slate-900/50 dark:border-slate-700">
                <Image src={imageObj.url} alt={pattern.name} fill className="object-contain" unoptimized />
              </div>
            </div>
          )}
          
          {}
          <div className="space-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand rounded-full"></div>
                Code Snippets
              </h3>
              
              {}
              {!codesLoading && !loading && !languagesLoading && !codesError && !languagesError && Array.isArray(patternCodes) && patternCodes.length > 0 && (
                <div className="relative z-20">
                  <button 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand transition-all active:scale-95"
                  >
                    {selectedLang && selectedLogoUrl && (
                      <LanguageLogo src={selectedLogoUrl} alt={selectedLang.name} size={20} />
                    )}
                    <span className="font-bold text-slate-700 text-sm">
                      {selectedLang ? selectedLang.name : "Select Language"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSelectOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                      {patternCodes.map((pc, idx) => {
                        const lang = codeLanguages.find(l => l.id === pc.code_id);
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedSnippetIndex(idx);
                              setIsSelectOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${selectedSnippetIndex === idx ? 'bg-brand/5 text-brand font-semibold' : 'text-slate-600'}`}
                          >
                            {lang && getLogoUrl(lang) && (
                              <LanguageLogo
                                src={getLogoUrl(lang)!}
                                alt={`${lang.name} logo`}
                                size={18}
                              />
                            )}
                            <span>{lang ? lang.name : "Unknown"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {(codesLoading || loading || languagesLoading) && !codesError && !languagesError ? (
              <p className="text-slate-400">Loading code snippets...</p>
            ) : !codesError && !languagesError && Array.isArray(patternCodes) && patternCodes.length > 0 && selectedSnippet ? (
              <div className="grid gap-6">
                <div className="p-4 sm:p-6 md:p-8 bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-800 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Code className="w-6 h-6 text-slate-500" />
                  </div>
                  <pre className="text-sm md:text-base text-slate-100 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed relative z-10">
                    {selectedSnippet.code_snippet && typeof selectedSnippet.code_snippet === 'object' && 'code_snippet' in selectedSnippet.code_snippet
                      ? String((selectedSnippet.code_snippet as unknown as PatternCode).code_snippet)
                      : typeof selectedSnippet.code_snippet === 'string'
                      ? selectedSnippet.code_snippet
                      : JSON.stringify(selectedSnippet.code_snippet, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white/40 border border-white/50 rounded-2xl text-center shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
                <p className="text-slate-500 font-medium text-lg dark:text-slate-300">
                  {codesError || languagesError
                    ? "An error occurred or you are not authorized to view code snippets." 
                    : "No code snippets available for this pattern yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

