"use client";

import React, { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  Node,
  Edge,
  NodeProps,
  OnReconnect,
} from "@xyflow/react";

import NodeSidebar, { SidebarNodeItem } from "@/components/organisms/NodeSidebar";
import SchemaCanvas from "@/components/organisms/SchemaCanvas";
interface SchemeEditorProps {
  title: string;
  subtitle?: string;
  sidebarItems: SidebarNodeItem[];
  nodeTypes: Record<string, React.ComponentType<NodeProps>>;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

function EditorContent({
  title,
  subtitle,
  sidebarItems,
  nodeTypes,
  initialNodes = [],
  initialEdges = []
}: SchemeEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  
  const { screenToFlowPosition } = useReactFlow();

  const handleAddNodeClick = useCallback((type: string, label: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      position: {
        x: 250 + Math.random() * 100,
        y: 200 + Math.random() * 100,
      },
      data: { label },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    const configItem = sidebarItems.find((item) => item.type === type);
    const label = configItem ? configItem.label : "Component";

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      position,
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, sidebarItems, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onReconnect = useCallback<OnReconnect>(
    (oldEdge, connection) =>
      setEdges((eds) => reconnectEdge(oldEdge, connection, eds)),
    [setEdges]
  );

  return (
    <div className="flex w-full h-full overflow-hidden bg-slate-50">
      <NodeSidebar
        title={title}
        subtitle={subtitle}
        items={sidebarItems}
        onAddNode={handleAddNodeClick}
      />

      <div 
        className="grow h-full relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <SchemaCanvas
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
        />
      </div>
    </div>
  );
}

export default function SchemeEditor(props: SchemeEditorProps) {
  return (
    <ReactFlowProvider>
      <EditorContent {...props} />
    </ReactFlowProvider>
  );
}