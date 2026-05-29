import { SidebarNodeItem } from "@/components/organisms/NodeSidebar";
import { Boxes, User } from "lucide-react";

export const patternList: SidebarNodeItem[] = [
    {
        type: "user",
        label: "User",
        description: "Representa un usuario o actor en el diagrama.",
        icon: <User size={20} className="text-brand" />
    },
    {
        type: "singleton",
        label: "Singleton",
        description: "Instancia única global en toda la aplicación",
        icon: <Boxes size={20} className="text-brand" />
    }
]