"use client";

import React from 'react';
import { ReactFlow, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, OnReconnect, BackgroundVariant, NodeProps, MarkerType } from '@xyflow/react';
import SchemeBackground from '../molecules/SchemaBackground';
import '@xyflow/react/dist/style.css';

interface SchemeCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: Record<string, React.ComponentType<NodeProps>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onReconnect: OnReconnect;
}

export default function SchemeCanvas({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
}: SchemeCanvasProps) {
  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      edgesReconnectable
      reconnectRadius={20}
      defaultEdgeOptions={{
        markerEnd: { type: MarkerType.ArrowClosed },
      }}
      fitView
    >
      <SchemeBackground variant={BackgroundVariant.Dots} color="#cbd5e1" />
    </ReactFlow>
  );
} 