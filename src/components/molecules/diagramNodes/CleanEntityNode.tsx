"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Box } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanEntityNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<Box size={24} className="text-brand" />}
    defaultLabel="Entity"
    defaultDescription="Representa los objetos de dominio y las reglas centrales de Clean Architecture."
    title="Clean Entity"
    tag="Domain"
  />
);
