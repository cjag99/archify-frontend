"use client";

import React, { ReactNode } from "react";
import { Node } from "@antv/x6";

interface DiagramNodeCardProps {
  // ✨ En AntV X6, la instancia del nodo se pasa directamente en la propiedad 'node'
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
  // 🧭 En X6 los datos personalizados se guardan y leen a través de node.getData()
  // Añadida validación de seguridad por si en v3 la propiedad se inyecta tarde o con otro formato
  if (!node || typeof node.getData !== 'function') {
    return <div className="p-2 text-xs bg-red-100 text-red-600 rounded">Cargando nodo...</div>;
  }
  
  const data = node.getData() || {};
  
  const label = typeof data?.label === "string" ? data.label : defaultLabel;
  const description =
    typeof data?.description === "string"
      ? data.description
      : defaultDescription;

  return (
    // 🧱 Mantenemos intacto tu diseño, pero eliminamos el "relative" y los Handles
    <div className="group flex flex-col items-center justify-center rounded-2xl border border-brand/20 bg-brand/5 p-3 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:shadow-md w-24 h-24">
      
      {/* Contenido Visual del Nodo */}
      <div className="flex flex-col items-center gap-1 select-none">
        {icon}
        <span className="text-xs font-semibold text-slate-700 text-center truncate max-w-20">
          {label}
        </span>
      </div>

      {/* 💡 Tu Tooltip flotante (Se mantiene perfecto porque usa posicionamiento absolute respecto al nodo) */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 scale-95 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 opacity-0 shadow-lg transition-all duration-150 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 z-50">
        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold uppercase tracking-wider text-brand text-[10px]">
            {title}
          </span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-semibold text-brand">
            {tag}
          </span>
        </div>
        <p className="leading-relaxed text-slate-600">{description}</p>

        <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white" />
      </div>

    </div>
  );
}