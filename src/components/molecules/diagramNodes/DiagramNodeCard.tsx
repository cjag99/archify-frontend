"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Node } from "@antv/x6";

interface DiagramNodeCardProps {
  // ✨ In AntV X6, the node instance is passed directly in the 'node' property
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
  // 🧭 In X6 custom data is stored and read via node.getData()
  // Added security validation in case in v3 the property is injected late or with another format
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
      className="group flex flex-col items-center justify-center rounded-xl border border-brand/20 bg-brand/5 p-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:shadow-md w-24 h-24"
    >
      
      {/* Node Visual Content */}
      <div className="flex flex-col items-center gap-1 select-none">
        {icon}
        <span className="text-xs font-semibold text-slate-700 text-center truncate max-w-20">
          {label}
        </span>
      </div>

      {/* 💡 Floating tooltip with Portal to avoid SVG/foreignObject clipping */}
      {mounted && isHovered && rect && createPortal(
        <div 
          className="fixed z-[99999] pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
          style={{ 
            left: rect.left + rect.width / 2, 
            top: rect.top - 8, 
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <div className="w-48 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl">
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold uppercase text-brand text-[10px]">
                {title}
              </span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-semibold text-brand">
                {tag}
              </span>
            </div>
            <p className="leading-relaxed text-slate-600">{description}</p>
            
            {/* Bottom triangle arrow */}
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white" />
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
