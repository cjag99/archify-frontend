// Composite UI component used by views and forms for ArchitectureStep2
"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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

  onFinish: (
    schema: { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] },
    payload: { name: string; description: string; enabled: boolean }
  ) => Promise<void> | void;
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
  const router = useRouter();

  const [nodes, setNodes] = useState<CanvasNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<CanvasEdgeData[]>(initialEdges);


  const handleNodesChange = useCallback((updatedNodes: CanvasNodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: CanvasEdgeData[]) => {
    setEdges(updatedEdges);
  }, []);


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


      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      const id = crypto.randomUUID();
      const newNode: CanvasNodeData = {
        id,
        type,
        position: { x: clientX - 48, y: clientY - 48 },
        data: { label },
      };

      setNodes((current) => current.concat(newNode));
    },
    []
  );


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

  const handleFinishAction = async () => {
    await onFinish(
      { nodes, edges },
      { name: architectureName, description: architectureDescription, enabled }
    );

    router.push("/dashboard/architectures");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Step 2: Design your architecture</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Design the visual structure of <strong>{architectureName}</strong>. Add nodes, connect layers, and define the architecture using the editor.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Status</p>
            <p>{enabled ? "Enabled" : "Disabled"}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{architectureDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row h-[calc(100vh-340px)] gap-4 sm:gap-6">
        <NodeSidebar
          title="Architecture Components"
          subtitle="Drag or click a node to add it to the canvas."
          items={architectureList}
          onAddNode={handleAddNode}
        />

        <div
          className="grow rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900/50"
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
          onClick={handleFinishAction}
        >
          Finish Architecture
        </Button>
      </div>
    </div>
  );
};

