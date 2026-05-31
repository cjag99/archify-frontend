"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Package } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const CleanUseCaseNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Package size={24} className="text-brand" />}
    defaultLabel="Use Case"
    defaultDescription="Orchestrates business logic and coordinates entities in Clean Architecture."
    title="Clean Use Case"
    tag="Use Case"
  />
);
