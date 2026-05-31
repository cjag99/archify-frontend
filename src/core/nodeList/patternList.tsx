import { SidebarNodeItem } from "@/components/organisms/NodeSidebar";
import { Boxes, User } from "lucide-react";

export const patternList: SidebarNodeItem[] = [
    {
        type: "user",
        label: "User",
        description: "Represents a user or actor in the diagram.",
        icon: <User size={20} className="text-brand" />
    },
    {
        type: "singleton",
        label: "Singleton",
        description: "Single global instance throughout the application.",
        icon: <Boxes size={20} className="text-brand" />
    }
]