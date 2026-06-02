// Diagram node component used in the schema editor palette
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
    defaultDescription="Includes infrastructure, UI, and external controllers in Clean Architecture."
    title="Clean Framework"
    tag="Infra"
  />
);

