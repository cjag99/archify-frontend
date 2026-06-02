// Page-level UI component that renders the CodeLanguageView interface
"use client";

import { useEffect, useState } from "react";
import { useImage } from "@/hooks/useImage";
import { CodeLanguage } from "@/core/types/models";

interface CodeLanguageViewProps {
    codeLanguage: CodeLanguage;
}

export const CodeLanguageView = ({ codeLanguage }: CodeLanguageViewProps) => {
    const { fetchImage } = useImage();
    const [iconUrl, setIconUrl] = useState<string | null>(codeLanguage.icon_url || null);

    useEffect(() => {
        let active = true;
        if (!codeLanguage.icon_url && codeLanguage.icon) {
            void fetchImage(codeLanguage.icon).then((img) => {
                if (active && img?.url) {
                    setIconUrl(img.url);
                }
            });
        }
        return () => {
            active = false;
        };
    }, [codeLanguage.icon, codeLanguage.icon_url, fetchImage]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Code Language Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review the metadata for this code language.</p>
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">{codeLanguage.name}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">File Extension</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">{codeLanguage.file_extension}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Icon ID</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 break-all">{codeLanguage.icon || "N/A"}</div>
                    </div>
                </div>
            </div>

            {iconUrl && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Language Icon</h3>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 dark:border-slate-700">
                            <img src={iconUrl} alt={`${codeLanguage.name} icon`} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Loaded from the language icon reference.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

