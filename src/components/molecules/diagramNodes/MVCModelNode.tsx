"use client";

import React from "react";
import { Node } from "@antv/x6";
import { Cpu } from "lucide-react";
import { DiagramNodeCard } from "./DiagramNodeCard";




export const MVCModelNode: React.FC<{ node: Node }> = ({ node }) => {
    return (
        <DiagramNodeCard
            node={node}
            icon={<Cpu size={24} className="text-brand" />}
            defaultLabel="Model"
            defaultDescription="Manages business logic and system data."
            title="MVC Model"
            tag="Data"
        />
    );
};