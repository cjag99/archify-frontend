// Diagram node component used in the schema editor palette
"use client";

import React from "react";
import { Node } from "@antv/x6";
import { User } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const UserNode: React.FC<{ node: Node }> = ({ node }) => (
  <div className="pointer-events-auto">
  <DiagramNodeCard
    node={node}
    icon={<User size={24} className="text-brand" />}
    defaultLabel="User"
    defaultDescription="Represents a user or actor in the diagram."
    title="User Node"
    tag="User"
  />
  </div>
);

