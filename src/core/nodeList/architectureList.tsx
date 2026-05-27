import { SidebarNodeItem } from "@/components/organisms/NodeSidebar"
import { Compass, Cpu, Binoculars } from "lucide-react";
export const architectureList: SidebarNodeItem[] = [
    {
        type: "mvc-controller",
        label: "MVC Controller",
        description: "Controlador de la arquitectura MVC",
        icon: <Compass size={20} className="text-brand" />
    },
    {
        type: "mvc-model",
        label: "MVC Model",
        description: "Modelo de la arquitectura MVC",
        icon: <Cpu size={20} className="text-brand" />
    },
    {
        type: "mvc-view",
        label: "MVC View",
        description: "Vista de la arquitectura MVC",
        icon: <Binoculars size={20} className="text-brand" />
    }
];