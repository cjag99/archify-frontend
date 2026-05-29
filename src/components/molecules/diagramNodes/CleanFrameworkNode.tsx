"use client";

import React from "react";
import { Node } from "@antv/x6";
import { HardDrive } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanFrameworkNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<HardDrive size={24} className="text-brand" />}
    defaultLabel="Frameworks"
    defaultDescription="Incluye la infraestructura, la UI y los controladores externos de Clean Architecture."
    title="Clean Framework"
    tag="Infra"
  />
);
