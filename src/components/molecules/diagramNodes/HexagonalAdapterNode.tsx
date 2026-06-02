// Diagram node component used in the schema editor palette
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
    defaultDescription="Ports and adapters that connect the domain to the outside."
    title="Hexagonal Adapter"
    tag="Adapter"
  />
);

