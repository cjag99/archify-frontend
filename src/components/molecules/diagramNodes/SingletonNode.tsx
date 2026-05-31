"use client";

import React from "react";
import { Node } from "@antv/x6";
import { DiagramNodeCard } from "./DiagramNodeCard";
import { Boxes } from "lucide-react";

// Forzamos a que extienda NodeProps para que XYFlow lo maneje de forma nativa
export const SingletonNode: React.FC<{ node: Node }> = ({ node }) => (
  <DiagramNodeCard
    node={node}
    icon={<Boxes className="w-6 h-6 text-brand" />}
    defaultLabel="Singleton"
    defaultDescription="Single global instance throughout the application. Restricts the creation of objects of a class to a single specimen shared by all clients."
    title="Creational Pattern"
    tag="Singleton"
  />

);