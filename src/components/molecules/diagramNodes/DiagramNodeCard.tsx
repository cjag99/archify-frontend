// Diagram node component used in the schema editor palette
"use client";

import React, { ReactNode, useState, useRef } from "react";
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

function getNodeStyle(type: string) {
  const base = {
    background: "#ffffff",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
    clipPath: undefined as string | undefined,
    badgeBackground: "#f8fafc",
    badgeColor: "#0f172a",
    borderRadius: "24px",
  };

  if (type === "user") {
    return {
      ...base,
      background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
      borderColor: "#14b8a6",
      textColor: "#ffffff",
      badgeBackground: "rgba(255,255,255,0.18)",
      badgeColor: "#ffffff",
      borderRadius: "9999px",
    };
  }

  if (type.startsWith("mvc-")) {
    return {
      ...base,
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      borderColor: "#34d399",
      textColor: "#ffffff",
      badgeBackground: "rgba(255,255,255,0.18)",
      badgeColor: "#ffffff",
      borderRadius: "28px",
    };
  }

  if (type.startsWith("clean-")) {
    return {
      ...base,
      background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
      borderColor: "#64748b",
      textColor: "#f8fafc",
      badgeBackground: "rgba(241, 245, 249, 0.16)",
      badgeColor: "#f8fafc",
      borderRadius: "26px",
    };
  }

  if (type.startsWith("hex-")) {
    return {
      ...base,
      background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      borderColor: "#38bdf8",
      textColor: "#ffffff",
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
      badgeBackground: "rgba(255,255,255,0.18)",
      badgeColor: "#ffffff",
      borderRadius: "18px",
    };
  }

  return base;
}

export function DiagramNodeCard({
  node,
  icon,
  defaultLabel,
  defaultDescription,
  title,
  tag,
}: DiagramNodeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!node || typeof node.getData !== 'function') {
    return <div className="p-2 text-xs bg-red-100 text-red-600 rounded-lg">Loading node...</div>;
  }

  const nodeType = typeof node.shape === "string" ? node.shape.replace(/^custom-/, "") : "";
  const style = getNodeStyle(nodeType);
  const data = node.getData() || {};
  const label = typeof data?.label === "string" ? data.label : defaultLabel;
  const description =
    typeof data?.description === "string"
      ? data.description
      : defaultDescription;

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
      className="group flex flex-col items-center justify-center border p-2 shadow-sm transition-all duration-300 hover:shadow-lg w-full h-full"
      style={{
        background: style.background,
        borderColor: style.borderColor,
        color: style.textColor,
        clipPath: style.clipPath,
        borderRadius: style.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        boxSizing: 'border-box',
        minWidth: 0,
        minHeight: 0,
        maxWidth: 108,
        maxHeight: 108,
        width: 108,
        height: 108,
        overflow: 'hidden',
      }}
    >
      <div className="flex flex-col items-center gap-1 select-none text-center" style={{ color: style.textColor }}>
        <div className="flex flex-col items-center gap-1 sm:flex-row">
          {icon}
          <span
            style={{ backgroundColor: style.badgeBackground, color: style.badgeColor }}
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
          >
            {tag}
          </span>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold leading-tight wrap-break-word whitespace-normal text-center max-w-22 w-full px-1">
          {label}
        </span>
        <span className="text-[9px] uppercase tracking-[0.16em] opacity-80 wrap-break-word whitespace-normal text-center max-w-22 w-full px-1">
          {title}
        </span>
      </div>

      {isHovered && rect && createPortal(
        <div 
          className="fixed z-99999 pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
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
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

