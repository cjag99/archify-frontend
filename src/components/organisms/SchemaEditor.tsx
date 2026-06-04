// Page-level UI component that renders the SchemaEditor interface
"use client";

import React, { useState, useCallback } from "react";
import NodeSidebar, { SidebarNodeItem } from "@/components/organisms/NodeSidebar";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
import { Node as X6Node } from "@antv/x6";


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

  const [nodes, setNodes] = useState<CanvasNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<CanvasEdgeData[]>(initialEdges);


  const handleNodesChange = useCallback((updatedNodes: CanvasNodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: CanvasEdgeData[]) => {
    setEdges(updatedEdges);
  }, []);


  const getDefaultNodePosition = (type: string, nodes: CanvasNodeData[]) => {
    const count = nodes.filter((node) => node.type === type).length;

    if (type === "user") {
      return { x: 60 + count * 120, y: 80 };
    }

    if (type.startsWith("mvc-")) {
      return { x: 80 + count * 120, y: 120 };
    }

    if (type.startsWith("clean-")) {
      return { x: 80 + (count % 2) * 160, y: 260 + Math.floor(count / 2) * 140 };
    }

    if (type.startsWith("hex-")) {
      return { x: 140 + (count % 3) * 140, y: 100 + Math.floor(count / 3) * 150 };
    }

    return { x: 220 + (count % 3) * 120, y: 200 + Math.floor(count / 3) * 120 };
  };

  const handleAddNodeClick = useCallback((type: string, label: string) => {
    const id = crypto.randomUUID();
    const position = getDefaultNodePosition(type, nodes);
    const newNode: CanvasNodeData = {
      id,
      type,
      position,
      data: { label },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes]);


  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      

      const type = event.dataTransfer.getData("application/reactflow") || event.dataTransfer.getData("text/plain");
      if (!type) return;

      const configItem = sidebarItems.find((item) => item.type === type);
      const label = configItem ? configItem.label : "Component";



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

      setNodes((nds) => nds.concat(newNode));
    },
    [sidebarItems]
  );


  const handleConnect = useCallback((connection: ConnectionPayload) => {
    setEdges((eds) => {

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
    <div className="flex flex-col sm:flex-row w-full h-full overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <NodeSidebar
        title={title}
        subtitle={subtitle}
        items={sidebarItems}
        onAddNode={handleAddNodeClick}
      />

      <div
        className="w-full grow relative min-h-[420px]"
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