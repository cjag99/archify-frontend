// Diagram node component used in the schema editor palette
"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Node } from "@antv/x6";

interface DiagramNodeCardProps {

  node: Node;
  icon: ReactNode;
  defaultLabel: string;
  defaultDescription: string;
  title: string;
  tag: string;
}

export function DiagramNodeCard({
  node,
  icon,
  defaultLabel,
  defaultDescription,
  title,
  tag,
}: DiagramNodeCardProps) {


  if (!node || typeof node.getData !== 'function') {
    return <div className="p-2 text-xs bg-red-100 text-red-600 rounded-lg">Loading node...</div>;
  }
  
  const data = node.getData() || {};
  
  const label = typeof data?.label === "string" ? data.label : defaultLabel;
  const description =
    typeof data?.description === "string"
      ? data.description
      : defaultDescription;

  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800 w-16 h-16 sm:w-24 sm:h-24"
    >
      
      {}
      <div className="flex flex-col items-center gap-1 select-none text-slate-500 dark:text-slate-400 group-hover:text-brand transition-colors">
        {icon}
        <span className="text-[11px] sm:text-xs font-semibold text-slate-900 dark:text-slate-100 text-center truncate max-w-20">
          {label}
        </span>
      </div>

      {}
      {mounted && isHovered && rect && createPortal(
        <div 
          className="fixed z-[99999] pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
          style={{ 
            left: rect.left + rect.width / 2, 
            top: rect.top - 8, 
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <div className="w-48 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="font-bold uppercase text-brand text-[10px]">
                {title}
              </span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-semibold text-brand">
                {tag}
              </span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
            
            {}
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

