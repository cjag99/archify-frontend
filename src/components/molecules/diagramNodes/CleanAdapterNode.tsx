"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Server } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";
  
export const CleanAdapterNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Server size={24} className="text-brand" />}
    defaultLabel="Adapter"
    defaultDescription="Adapts data and calls between the interface layer and the application core."
    title="Clean Adapter"
    tag="Adapter"
  />
);
