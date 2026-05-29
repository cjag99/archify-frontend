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
    defaultDescription="Instancia única global en toda la aplicación. Restringe la creación de objetos de una clase a un solo espécimen compartido por todos los clientes."
    title="Creational Pattern"
    tag="Singleton"
  />

);