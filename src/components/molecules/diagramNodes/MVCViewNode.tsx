"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Binoculars } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const MVCViewNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<Binoculars size={24} className="text-brand" />}
    defaultLabel="View"
    defaultDescription="Renderiza la interfaz y muestra los datos al usuario."
    title="MVC View"
    tag="UI"
  />
);