"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Layers } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalDomainNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Layers size={24} className="text-brand" />}
    defaultLabel="Domain"
    defaultDescription="Núcleo de dominio con entidades y reglas en arquitectura hexagonal."
    title="Hexagonal Domain"
    tag="Core"
  />
);
