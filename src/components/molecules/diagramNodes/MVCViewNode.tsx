"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Binoculars } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const MVCViewNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Binoculars size={24} className="text-brand" />}
    defaultLabel="View"
    defaultDescription="Renderiza la interfaz y muestra los datos al usuario."
    title="MVC View"
    tag="UI"
  />
);