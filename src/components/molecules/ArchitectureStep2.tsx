"use client";

import React, { useCallback, useState } from "react";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import NodeSidebar from "@/components/organisms/NodeSidebar";
import { Button } from "@/components/atoms/Button";
import { architectureList } from "@/core/nodeList/architectureList";
import { MVCViewNode } from "./diagramNodes/MVCViewNode";
import { MVCModelNode } from "./diagramNodes/MVCModelNode";
import { MVCControllerNode } from "./diagramNodes/MVCControllerNode";
import { CleanEntityNode } from "./diagramNodes/CleanEntityNode";
import { CleanUseCaseNode } from "./diagramNodes/CleanUseCaseNode";
import { CleanAdapterNode } from "./diagramNodes/CleanAdapterNode";
import { CleanFrameworkNode } from "./diagramNodes/CleanFrameworkNode";
import { HexagonalDomainNode } from "./diagramNodes/HexagonalDomainNode";
import { HexagonalApplicationNode } from "./diagramNodes/HexagonalApplicationNode";
import { HexagonalAdapterNode } from "./diagramNodes/HexagonalAdapterNode";
import { UserNode } from "./diagramNodes/UserNode";

// Interfaces de Dominio unificadas con tu nuevo SchemaCanvas
interface CanvasNodeData {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

interface CanvasEdgeData {
  id: string;
  source: string;
  target: string;
}

interface ConnectionPayload {
  id: string;
  source: string;
  target: string;
}

interface ArchitectureStep2Props {
  architectureName: string;
  architectureDescription: string;
  enabled: boolean;
  initialNodes?: CanvasNodeData[];
  initialEdges?: CanvasEdgeData[];
  onBack: () => void;
  // ✨ Tipado actualizado con tus nuevos modelos limpios
  onFinish: (
    schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] },
    payload: { name: string; description: string; enabled: boolean }
  ) => void;
}

const architectureNodeTypes = {
  user: UserNode,
  "mvc-view": MVCViewNode,
  "mvc-model": MVCModelNode,
  "mvc-controller": MVCControllerNode,
  "clean-entity": CleanEntityNode,
  "clean-usecase": CleanUseCaseNode,
  "clean-adapter": CleanAdapterNode,
  "clean-framework": CleanFrameworkNode,
  "hex-domain": HexagonalDomainNode,
  "hex-application": HexagonalApplicationNode,
  "hex-adapter": HexagonalAdapterNode,
};

export const ArchitectureStep2: React.FC<ArchitectureStep2Props> = ({
  architectureName,
  architectureDescription,
  enabled,
  initialNodes = [],
  initialEdges = [],
  onBack,
  onFinish,
}) => {
  // 📦 Estados nativos puros de React (Adiós React Flow)
  const [nodes, setNodes] = useState<CanvasNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<CanvasEdgeData[]>(initialEdges);

  // 1. Sincronizadores que se alimentan del ciclo interno de X6
  const handleNodesChange = useCallback((updatedNodes: CanvasNodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: CanvasEdgeData[]) => {
    setEdges(updatedEdges);
  }, []);

  // 2. Insertar componentes mediante click manual directo en la sidebar
  const handleAddNode = useCallback((type: string, label: string) => {
    const id = crypto.randomUUID();
    const newNode: CanvasNodeData = {
      id,
      type,
      position: {
        x: 220 + Math.random() * 120,
        y: 180 + Math.random() * 120,
      },
      data: { label },
    };
    setNodes((current) => current.concat(newNode));
  }, []);

  // 3. Mecanismo de arrastre (Drag & Drop) relativo al lienzo contenedor
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow") || event.dataTransfer.getData("text/plain");
      if (!type) return;

      const item = architectureList.find((node) => node.type === type);
      const label = item ? item.label : "Component";

      // Coordenadas calculadas en base a la bounding box para evitar desvíos en el canvas de X6
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const id = crypto.randomUUID();
      const newNode: CanvasNodeData = {
        id,
        type,
        position: { x: clientX - 48, y: clientY - 48 }, // Centramos respecto al ratón
        data: { label },
      };

      setNodes((current) => current.concat(newNode));
    },
    []
  );

  // 4. Orquestación de cables reactivos simplificados (Manhattan inteligente de X6)
  const onConnect = useCallback((connection: ConnectionPayload) => {
    setEdges((currentEdges) => {
      const exists = currentEdges.some(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (exists) return currentEdges;

      return currentEdges.concat({
        id: connection.id || `edge-${crypto.randomUUID()}`,
        source: connection.source,
        target: connection.target,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Step 2: Design your architecture</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Diseña la estructura visual de <strong>{architectureName}</strong>. Añade nodos, conecta capas y define la arquitectura usando el editor.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Status</p>
            <p>{enabled ? "Enabled" : "Disabled"}</p>
            <p className="mt-1 text-xs text-slate-500">{architectureDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-340px)] gap-6">
        <NodeSidebar
          title="Architecture Components"
          subtitle="Drag or click a node to add it to the canvas."
          items={architectureList}
          onAddNode={handleAddNode}
        />

        <div
          className="grow rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <SchemaCanvas
            nodes={nodes}
            edges={edges}
            nodeTypes={architectureNodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Button variant="secondary" onClick={onBack}>
          Back to Step 1
        </Button>
        <Button
          variant="success"
          onClick={() =>
            onFinish(
              { nodes, edges },
              { name: architectureName, description: architectureDescription, enabled }
            )
          }
          disabled={nodes.length === 0}
        >
          Finish Architecture
        </Button>
      </div>
    </div>
  );
};
