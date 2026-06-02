// Diagram node component used in the schema editor palette
"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Compass } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";




export const MVCControllerNode: React.FC<{ node: Node }> = ({ node }) => {
    return (
        <DiagramNodeCard
            node={node}
            icon={<Compass size={24} className="text-brand" />}
            defaultLabel="Controller"
            defaultDescription="Coordinates interaction between the model and the view."
            title="MVC Controller"
            tag="Logic"
        />
    );
};