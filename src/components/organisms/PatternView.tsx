"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { usePatterns } from "@/hooks/usePattern";
import { usePatternCode } from "@/hooks/usePatternCode";
import { useCodeLanguage } from "@/hooks/useCodeLanguage";
import { useImage } from "@/hooks/useImage";
import { useAuth } from "@/core/context/AuthContext";
import { Pattern, ImageType, CodeLanguage } from "@/core/types/models";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import { UserNode } from "@/components/molecules/diagramNodes/UserNode";
import { SingletonNode } from "@/components/molecules/diagramNodes/SingletonNode";
import Image from "next/image";
import { UUID } from "crypto";

interface PatternViewProps {
  patternId: string;
}

const patternNodeTypes = {
  user: UserNode,
  singleton: SingletonNode,
};

function LanguageLogo({ src, alt, size = 20 }: { src: string; alt: string; size?: number }) {
  return (
    <img
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

export function PatternView({ patternId }: PatternViewProps) {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const { codeLanguages, fetchCodeLanguage } = useCodeLanguage();
  const { fetchPatternById } = usePatterns();
  const { patternCodes, fetchCodesByPatternId, loading: codesLoading } = usePatternCode();
  const { fetchImage } = useImage();
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageObj, setImageObj] = useState<ImageType | null>(null);

  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState<number>(0);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [languageImages, setLanguageImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPatternById(patternId);
      if (active) {
        setPattern(data || null);
        if (data?.image_id) {
          const fetchedImage = await fetchImage(data.image_id as UUID);
          if (active && fetchedImage) {
            setImageObj(fetchedImage);
          }
        }
        setLoading(false);
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

      for (const pc of patternCodes) {
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

    if (!authLoading && patternCodes.length > 0) {
      void resolveLogos();
    }

    return () => {
      active = false;
    };
  }, [patternCodes, codeLanguages, fetchCodeLanguage, fetchImage, authLoading]);

  const getLogoUrl = (lang: CodeLanguage | null | undefined) =>
    lang ? (lang.icon_url ?? languageImages[lang.id]) : undefined;

  const selectedSnippet = patternCodes[selectedSnippetIndex];
  const selectedLang = selectedSnippet ? codeLanguages.find(l => l.id === selectedSnippet.code_id) : null;
  const selectedLogoUrl = getLogoUrl(selectedLang);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a la lista</span>
        </button>

        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "Loading..." : pattern?.name || "Pattern Details"}
            </h1>
            {pattern?.description && (
              <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">{pattern.description}</p>
            )}
          </div>
          
          {pattern?.base_structure && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Schema
              </h3>
              <div className="w-full h-[600px] border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden bg-white relative pointer-events-none">
                <SchemaCanvas
                  nodes={pattern.base_structure.nodes || []}
                  edges={pattern.base_structure.edges || []}
                  nodeTypes={patternNodeTypes}
                  readonly={true}
                />
              </div>
            </div>
          )}

          {pattern?.image_id && imageObj && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Graphic Representation
              </h3>
              <div className="w-full relative h-[400px] md:h-[600px] rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-200 bg-white">
                <Image src={imageObj.url} alt={pattern.name} fill className="object-contain" unoptimized />
              </div>
            </div>
          )}
          
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Code Snippets</h3>
              
              {/* Custom Mini Select */}
              {!codesLoading && patternCodes && patternCodes.length > 0 && (
                <div className="relative z-20">
                  <button 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand/50 transition-colors"
                  >
                    {selectedLang && selectedLogoUrl && (
                      <LanguageLogo
                        src={selectedLogoUrl}
                        alt={`${selectedLang.name} logo`}
                        size={20}
                      />
                    )}
                    <span className="font-semibold text-slate-700 text-sm">
                      {selectedLang ? selectedLang.name : "Select language"}
                    </span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
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

            {codesLoading ? (
              <p className="text-slate-400">Loading code snippets...</p>
            ) : selectedSnippet ? (
              <div className="grid gap-6">
                <div className="p-8 bg-slate-900 rounded-[2rem] shadow-md border border-slate-800 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <pre className="text-sm md:text-base text-slate-100 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed relative z-10">
                    {selectedSnippet.code_snippet && typeof selectedSnippet.code_snippet === 'object' && 'code_snippet' in selectedSnippet.code_snippet
                      ? String((selectedSnippet.code_snippet as any).code_snippet)
                      : typeof selectedSnippet.code_snippet === 'string'
                      ? selectedSnippet.code_snippet
                      : JSON.stringify(selectedSnippet.code_snippet, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white border border-slate-200 rounded-[2rem] text-center">
                <p className="text-slate-500 font-medium text-lg">No code snippets available for this pattern yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
