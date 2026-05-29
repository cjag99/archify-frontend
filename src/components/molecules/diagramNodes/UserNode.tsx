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
    defaultDescription="Representa un usuario o actor en el diagrama."
    title="User Node"
    tag="User"
  />
  </div>
);
