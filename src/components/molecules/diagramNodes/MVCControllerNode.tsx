"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Compass } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";




export const MVCControllerNode: React.FC<NodeProps> = (props) => {
    return (
        <DiagramNodeCard
            {...props}
            icon={<Compass size={24} className="text-brand" />}
            defaultLabel="Controller"
            defaultDescription="Coordina la interacción entre el modelo y la vista."
            title="MVC Controller"
            tag="Logic"
        />
    );
};