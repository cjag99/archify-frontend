"use client";

import React, { useState, useCallback } from "react";
import NodeSidebar, { SidebarNodeItem } from "@/components/organisms/NodeSidebar";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import { Node as X6Node } from "@antv/x6";

// Interfaces limpias para el tipado de datos de Archify (Mapeados con tu SchemaCanvas)
interface CanvasNodeData {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

interface CanvasEdgeData {
  id: string;
  source: string;
  source_port?: string;
  target: string;
  target_port?: string;
  vertices?: Array<{ x: number; y: number }>;
}

interface ConnectionPayload {
  id: string;
  source: string;
  source_port?: string;
  target: string;
  target_port?: string;
  vertices?: Array<{ x: number; y: number }>;
}

interface SchemeEditorProps {
  title: string;
  subtitle?: string;
  sidebarItems: SidebarNodeItem[];
  nodeTypes: Record<string, React.ComponentType<{ node: X6Node }>>;
  initialNodes?: CanvasNodeData[];
  initialEdges?: CanvasEdgeData[];
}

export default function SchemeEditor({
  title,
  subtitle,
  sidebarItems,
  nodeTypes,
  initialNodes = [],
  initialEdges = [],
}: SchemeEditorProps) {
  // 📦 Estados nativos de React simples. X6 se sincroniza con ellos de forma limpia.
  const [nodes, setNodes] = useState<CanvasNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<CanvasEdgeData[]>(initialEdges);

  // 1. Manejadores de cambios estructurales disparados desde el lienzo
  const handleNodesChange = useCallback((updatedNodes: CanvasNodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: CanvasEdgeData[]) => {
    setEdges(updatedEdges);
  }, []);

  // 2. Insertar nodos haciendo clic directo en el botón "+" de la barra lateral
  const handleAddNodeClick = useCallback((type: string, label: string) => {
    const id = crypto.randomUUID();
    const newNode: CanvasNodeData = {
      id,
      type,
      position: {
        x: 250 + Math.random() * 100,
        y: 200 + Math.random() * 100,
      },
      data: { label },
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  // 3. Sistema de Drag & Drop (Arrastrar desde barra lateral al canvas)
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      
      // Recuperamos el identificador del tipo de nodo (Recuerda ajustar tu Sidebar si usaba otro string en setData)
      const type = event.dataTransfer.getData("application/reactflow") || event.dataTransfer.getData("text/plain");
      if (!type) return;

      const configItem = sidebarItems.find((item) => item.type === type);
      const label = configItem ? configItem.label : "Component";

      // 🗺️ CÁLCULO DE COORDENADAS PERFECTO PARA X6 CON SCROLLER:
      // Obtenemos dónde ha caído el ratón relativo a la caja contenedora del lienzo.
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const id = crypto.randomUUID();
      const newNode: CanvasNodeData = {
        id,
        type,
        // Guardamos la posición relativa inicial
        position: { x: clientX - 48, y: clientY - 48 }, // Centramos un poco el nodo respecto al puntero (mitad de w-24 es 48px)
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [sidebarItems]
  );

  // 4. Intercepción de conexiones manuales
  const handleConnect = useCallback((connection: ConnectionPayload) => {
    setEdges((eds) => {
      // Evitamos duplicar cables idénticos si X6 lanza un doble evento por seguridad
      const exists = eds.some(
        (e) => 
          e.source === connection.source && 
          e.target === connection.target && 
          e.source_port === connection.source_port
      );
      if (exists) return eds;

      return eds.concat({
        id: connection.id || `edge-${crypto.randomUUID()}`,
        source: connection.source,
        source_port: connection.source_port,
        target: connection.target,
        target_port: connection.target_port,
        vertices: connection.vertices || [],
      });
    });
  }, []);

  return (
    <div className="flex flex-col xl:flex-row w-full h-full overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <NodeSidebar
        title={title}
        subtitle={subtitle}
        items={sidebarItems}
        onAddNode={handleAddNodeClick}
      />

      <div
        className="w-full grow relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <SchemaCanvas
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
        />
      </div>
    </div>
  );
}