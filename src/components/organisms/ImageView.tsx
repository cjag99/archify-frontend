// Page-level UI component that renders the ImageView interface
"use client";

import { ImageType } from "@/core/types/models";

interface ImageViewProps {
    image: ImageType;
}

export const ImageView = ({ image }: ImageViewProps) => {
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Image Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">View the image metadata and preview.</p>
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">File Name</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">{image.file_name}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Usage Type</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">{image.usage_type}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Image ID</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 break-all">{image.id}</div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h3>
                <div className="mt-4 max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    <img src={image.url} alt={image.file_name} className="w-full object-cover" />
                </div>
            </div>
        </div>
    );
};

