"use client";

import React from "react";
import { Position, Handle, NodeProps } from "@xyflow/react";
import { Cpu } from "lucide-react";




export const MVCModelNode: React.FC<NodeProps> = ({ id, data }) => {
    const label = typeof data?.label === "string" ? data.label : "Model";
    const description =
        typeof data?.description === "string"
            ? data.description
            : "Gestiona la lógica de negocio y los datos del sistema.";

    return (
        <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-brand/20 bg-brand/5 p-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:shadow-md w-24 h-24">
            
            <Handle
                type="target"
                position={Position.Top}
                id={`${id}-top`}
                className="absolute left-1/2 -translate-x-1/2 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand"
            />


            <div className="flex flex-col items-center gap-1 select-none">
                <Cpu size={24} className="text-brand" />
                <span className="text-xs font-semibold text-slate-700 text-center truncate max-w-20">
                    {label}
                </span>
            </div>

            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 scale-95 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 opacity-0 shadow-lg transition-all duration-150 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 z-50">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold uppercase tracking-wider text-brand text-[10px]">
                        MVC Model
                    </span>
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-semibold text-brand">
                        Data
                    </span>
                </div>
                <p className="leading-relaxed text-slate-600">{description}</p>
                

                <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white" />
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id={`${id}-bottom`}
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand"
            />
        </div>
    );
};