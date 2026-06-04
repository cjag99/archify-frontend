// Diagram node component used in the schema editor palette
"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Layers } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalDomainNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Layers size={24} className="text-sky-100" />}
    defaultLabel="Domain"
    defaultDescription="Domain core with entities and rules in hexagonal architecture."
    title="Hexagonal Domain"
    tag="Core"
  />
);

