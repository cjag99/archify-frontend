"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { HardDrive } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanFrameworkNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<HardDrive size={24} className="text-brand" />}
    defaultLabel="Frameworks"
    defaultDescription="Incluye la infraestructura, la UI y los controladores externos de Clean Architecture."
    title="Clean Framework"
    tag="Infra"
  />
);
