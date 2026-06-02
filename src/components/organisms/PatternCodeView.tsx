// Page-level UI component that renders the PatternCodeView interface
"use client";

import { PatternCode } from "@/core/types/models";

interface PatternCodeViewProps {
    patternCode: PatternCode;
}

export const PatternCodeView = ({ patternCode }: PatternCodeViewProps) => {
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pattern Code Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review the linked pattern and code language details.</p>
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pattern ID</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 break-all">{patternCode.pattern_id}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Code Language ID</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 break-all">{patternCode.code_id}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created at</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">{patternCode.created_at ? new Date(patternCode.created_at).toLocaleString() : "N/A"}</div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Code Snippet</h3>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    {typeof patternCode.code_snippet === "string"
                        ? patternCode.code_snippet
                        : JSON.stringify(patternCode.code_snippet, null, 2)}
                </pre>
            </div>
        </div>
    );
};

