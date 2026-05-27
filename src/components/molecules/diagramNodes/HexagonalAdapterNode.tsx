"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Package } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalAdapterNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<Package size={24} className="text-brand" />}
    defaultLabel="Adapter"
    defaultDescription="Puertos y adaptadores que conectan el dominio con el exterior."
    title="Hexagonal Adapter"
    tag="Adapter"
  />
);
