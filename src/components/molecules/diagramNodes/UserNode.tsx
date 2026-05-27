"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { User } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";

export const UserNode: React.FC<NodeProps> = (props) => (
  <DiagramNodeCard
    {...props}
    icon={<User size={24} className="text-brand" />}
    defaultLabel="User"
    defaultDescription="Representa un usuario o actor en el diagrama."
    title="User Node"
    tag="User"
  />
);
