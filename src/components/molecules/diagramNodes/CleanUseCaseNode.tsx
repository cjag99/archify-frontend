"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Package } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanUseCaseNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<Package size={24} className="text-brand" />}
    defaultLabel="Use Case"
    defaultDescription="Orquesta la lógica de negocio y coordina las entidades en Clean Architecture."
    title="Clean Use Case"
    tag="Use Case"
  />
);
