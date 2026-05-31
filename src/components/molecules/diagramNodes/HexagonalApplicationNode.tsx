"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Cpu } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const HexagonalApplicationNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Cpu size={24} className="text-brand" />}
    defaultLabel="Application"
    defaultDescription="Application layer that coordinates use cases and the domain."
    title="Hexagonal App"
    tag="App"
  />
);
