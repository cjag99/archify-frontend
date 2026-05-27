"use client";

import React, { ReactNode } from "react";

export interface SidebarNodeItem {
  type: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface SidebarProps {
  title?: string;
  subtitle?: string;
  items: SidebarNodeItem[];
  onAddNode: (type: string, label: string) => void;
}

export default function NodeSidebar({ 
  title = "Componentes", 
  subtitle = "Haz click o arrastra para añadir al lienzo.", 
  items, 
  onAddNode 
}: SidebarProps) {
  return (
    <aside className="w-52 border-r border-slate-200 bg-white p-5 flex flex-col gap-5 h-full z-10 select-none">
      <div>
        <h3 className="font-semibold text-sm text-slate-950 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 overflow-visible pb-2">
        {items.map((node) => (
          <button
            key={node.type}
            type="button"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", node.type);
              event.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onAddNode(node.type, node.label)}
            className="group relative flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-200 hover:border-brand hover:bg-brand/10 focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {node.icon}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-2 py-1 text-xs text-white shadow-lg transition-opacity duration-200 group-hover:block">
              {node.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}