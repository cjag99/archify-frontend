// Composite UI component used by views and forms for AdminMenu
"use client";

import { useAdminTable } from "@/hooks/useAdminTable";
import { FC } from "react";
import { Users, Folder, Layers, Wrench, Code2, Text, ImageIcon } from "lucide-react";

export const AdminMenu: FC = () => {
    const { currentTable, changeTable } = useAdminTable();
    const DBTables = [
        {
            label: "Users",
            href: "/admin/tables/users",
            icon: Users,
            apiRoute: "users"
        },
        {
            label: "Projects",
            href: "/admin/tables/projects",
            icon: Folder,
            apiRoute: "projects"
        },
        {
            label: "Architectures",
            href: "/admin/tables/architectures",
            icon: Layers,
            apiRoute: "architectures"
        },
        {
            label: "Patterns",
            href: "/admin/tables/patterns",
            icon: Wrench,
            apiRoute: "patterns"
        },
        {
            label: "Code language",
            href: "/admin/tables/code-languages",
            icon: Code2,
            apiRoute: "code-languages"
        },
        {
            label: "Patterns Code",
            href: "/admin/tables/patterns-code",
            icon: Text,
            apiRoute: "patterns-code"
        },
        {
            label: "Images",
            href: "/admin/tables/images",
            icon: ImageIcon,
            apiRoute: "images"
        }
    ];

    return (
        <nav className="grid grid-cols-5 md:grid-cols-1 md:flex md:flex-col place-items-center md:items-start md:justify-start gap-2 md:gap-1.5 p-2 md:p-3 glass-card rounded-2xl w-full" >
            <p className="hidden md:block text-[9px] md:text-[10px] font-bold uppercase text-slate-400 px-3 mb-2">
                Tables
            </p>
            {
                DBTables.map((table) => {
                    const isActive = currentTable === table.apiRoute;
                    const IconComponent = table.icon;
                    return (
                        <a
                            key={table.href}
                            href={table.href}
                            onClick={() => changeTable(table.apiRoute)}
                            className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-0 md:px-3 py-1.5 md:py-2 md:w-full rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isActive
                                ? "bg-brand/10 text-brand ring-2 ring-brand"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-brand/10 dark:hover:text-brand"
                                }`}
                        >
                            <div className="flex items-center justify-center rounded-lg mb-1 md:mb-0 w-10 h-10 md:w-11 md:h-11">
                                {IconComponent && (
                                    <IconComponent
                                        className={`transition-colors duration-200 ${isActive ? "text-brand w-6 h-6" : "text-slate-400 dark:text-slate-300 w-5 h-5"}`}
                                    />
                                )}
                            </div>
                            <span className="hidden md:inline ml-2">{table.label}</span>
                        </a>
                    );
                })
            }
        </nav>
    );
}

