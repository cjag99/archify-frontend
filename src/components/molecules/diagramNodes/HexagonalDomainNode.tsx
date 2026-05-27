"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Layers } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalDomainNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<Layers size={24} className="text-brand" />}
    defaultLabel="Domain"
    defaultDescription="Núcleo de dominio con entidades y reglas en arquitectura hexagonal."
    title="Hexagonal Domain"
    tag="Core"
  />
);
