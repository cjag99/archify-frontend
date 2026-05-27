"use client";

import React, { useCallback } from "react";
import {
  Connection,
  Node,
  Edge,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  OnReconnect,
} from "@xyflow/react";
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

interface ArchitectureStep2Props {
  architectureName: string;
  architectureDescription: string;
  enabled: boolean;
  onBack: () => void;
  onFinish: (
    schema: { nodes: Node[]; edges: Edge[] },
    payload: { name: string; description: string; enabled: boolean }
  ) => void;
}

export const ArchitectureStep2: React.FC<ArchitectureStep2Props> = ({
  architectureName,
  architectureDescription,
  enabled,
  onBack,
  onFinish,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const handleAddNode = useCallback(
    (type: string, label: string) => {
      const id = crypto.randomUUID();
      setNodes((current) =>
        current.concat({
          id,
          type,
          position: {
            x: 220 + Math.random() * 120,
            y: 180 + Math.random() * 120,
          },
          data: { label },
        })
      );
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const item = architectureList.find((node) => node.type === type);
      const label = item ? item.label : "Component";
      const position = {
        x: event.clientX - 120,
        y: event.clientY - 120,
      };

      const id = crypto.randomUUID();
      setNodes((current) =>
        current.concat({
          id,
          type,
          position,
          data: { label },
        })
      );
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((current) => addEdge(connection, current)),
    [setEdges]
  );

  const onReconnect = useCallback<OnReconnect>(
    (oldEdge, connection) => setEdges((current) => reconnectEdge(oldEdge, connection, current)),
    [setEdges]
  );

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
          className="grow rounded-3xl border border-slate-200 bg-white shadow-sm"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <SchemaCanvas
            nodes={nodes}
            edges={edges}
            nodeTypes={architectureNodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
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
