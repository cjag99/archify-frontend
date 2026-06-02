// Architecture node palette definitions used in schema diagrams
﻿import { SidebarNodeItem } from "@/components/organisms/NodeSidebar"
import { Compass, Cpu, Binoculars, Box, Layers, Package, Server, HardDrive, User } from "lucide-react";
export const architectureList: SidebarNodeItem[] = [
    {
        type: "user",
        label: "User",
        description: "Represents a user or actor in the diagram.",
        icon: <User size={20} className="text-brand" />
    },
    {
        type: "mvc-controller",
        label: "MVC Controller",
        description: "Controller in the MVC architecture.",
        icon: <Compass size={20} className="text-brand" />
    },
    {
        type: "mvc-model",
        label: "MVC Model",
        description: "Model in the MVC architecture.",
        icon: <Cpu size={20} className="text-brand" />
    },
    {
        type: "mvc-view",
        label: "MVC View",
        description: "View in the MVC architecture.",
        icon: <Binoculars size={20} className="text-brand" />
    },
    {
        type: "clean-entity",
        label: "Clean Entity",
        description: "Domain entity in Clean Architecture.",
        icon: <Box size={20} className="text-brand" />
    },
    {
        type: "clean-usecase",
        label: "Clean Use Case",
        description: "Use case to coordinate business logic.",
        icon: <Package size={20} className="text-brand" />
    },
    {
        type: "clean-adapter",
        label: "Clean Adapter",
        description: "Adapter between the interface layer and the domain.",
        icon: <Server size={20} className="text-brand" />
    },
    {
        type: "clean-framework",
        label: "Clean Framework",
        description: "Infrastructure and external drivers in Clean Architecture.",
        icon: <HardDrive size={20} className="text-brand" />
    },
    {
        type: "hex-domain",
        label: "Hexagonal Domain",
        description: "Domain core in hexagonal architecture.",
        icon: <Layers size={20} className="text-brand" />
    },
    {
        type: "hex-application",
        label: "Hexagonal Application",
        description: "Application layer and use cases.",
        icon: <Cpu size={20} className="text-brand" />
    },
    {
        type: "hex-adapter",
        label: "Hexagonal Adapter",
        description: "Ports and adapters connecting the domain with the outside world.",
        icon: <Package size={20} className="text-brand" />
    }
];

