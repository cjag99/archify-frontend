"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Box } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanEntityNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Box size={24} className="text-brand" />}
    defaultLabel="Entity"
    defaultDescription="Represents domain objects and core rules in Clean Architecture."
    title="Clean Entity"
    tag="Domain"
  />
);
