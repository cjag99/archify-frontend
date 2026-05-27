"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Cpu } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";




export const MVCModelNode: React.FC<NodeProps> = (props) => {
    return (
        <DiagramNodeCard
            {...props}
            icon={<Cpu size={24} className="text-brand" />}
            defaultLabel="Model"
            defaultDescription="Gestiona la lógica de negocio y los datos del sistema."
            title="MVC Model"
            tag="Data"
        />
    );
};