import { SidebarNodeItem } from "@/components/organisms/NodeSidebar"
import { Compass, Cpu, Binoculars, Box, Layers, Package, Server, HardDrive, User } from "lucide-react";
export const architectureList: SidebarNodeItem[] = [
    {
        type: "user",
        label: "User",
        description: "Representa un usuario o actor en el diagrama.",
        icon: <User size={20} className="text-brand" />
    },
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
    },
    {
        type: "clean-entity",
        label: "Clean Entity",
        description: "Entidad de dominio en Clean Architecture",
        icon: <Box size={20} className="text-brand" />
    },
    {
        type: "clean-usecase",
        label: "Clean Use Case",
        description: "Caso de uso para coordinar la lógica de negocio",
        icon: <Package size={20} className="text-brand" />
    },
    {
        type: "clean-adapter",
        label: "Clean Adapter",
        description: "Adaptador entre la capa de interfaz y el dominio",
        icon: <Server size={20} className="text-brand" />
    },
    {
        type: "clean-framework",
        label: "Clean Framework",
        description: "Infraestructura y drivers externos de Clean Architecture",
        icon: <HardDrive size={20} className="text-brand" />
    },
    {
        type: "hex-domain",
        label: "Hexagonal Domain",
        description: "Núcleo de dominio en arquitectura hexagonal",
        icon: <Layers size={20} className="text-brand" />
    },
    {
        type: "hex-application",
        label: "Hexagonal Application",
        description: "Capa de aplicación y casos de uso",
        icon: <Cpu size={20} className="text-brand" />
    },
    {
        type: "hex-adapter",
        label: "Hexagonal Adapter",
        description: "Puertos y adaptadores que conectan el dominio con el exterior",
        icon: <Package size={20} className="text-brand" />
    }
];