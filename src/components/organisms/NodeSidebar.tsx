"use client";

import React, { ReactNode } from "react";
import { NodeButton } from "../molecules/NodeButton";

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
    <aside className="w-64 border-r border-slate-200 bg-white p-5 flex flex-col gap-5 h-full z-10 select-none">
      <div>
        <h3 className="font-semibold text-sm text-slate-950 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((node) => (
          <NodeButton
            key={node.type}
            label={node.label}
            description={node.description}
            icon={node.icon}
            onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
              e.dataTransfer.setData("application/reactflow", node.type);
              e.dataTransfer.effectAllowed = "move";
            }}
            onclick={() => onAddNode(node.type, node.label)}
          />
        ))}
      </div>
    </aside>
  );
}