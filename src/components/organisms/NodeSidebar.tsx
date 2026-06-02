// Page-level UI component that renders the NodeSidebar interface
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
  className?: string;
}

export default function NodeSidebar({ 
  title = "Components", 
  subtitle = "Click or drag to add to the canvas.", 
  items, 
  onAddNode,
  className = "",
}: SidebarProps) {

  return (
    <aside className={`hidden min-[901px]:flex z-10 h-auto select-none flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 sm:gap-5 sm:p-5 sm:w-40 md:w-52 xl:w-56 xl:rounded-none xl:border-y-0 xl:border-l-0 dark:border-slate-700 dark:bg-slate-900/50 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-950 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-1 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-3">
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
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600 sm:h-11 sm:w-11"
          >
            {node.icon}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2 py-1 text-xs text-white shadow-lg transition-opacity duration-200 group-hover:block">
              {node.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

