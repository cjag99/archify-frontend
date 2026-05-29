"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Package } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalAdapterNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Package size={24} className="text-brand" />}
    defaultLabel="Adapter"
    defaultDescription="Puertos y adaptadores que conectan el dominio con el exterior."
    title="Hexagonal Adapter"
    tag="Adapter"
  />
);
