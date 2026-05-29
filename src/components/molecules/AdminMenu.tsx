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
        <nav className="flex flex-col gap-1.5 p-4 glass-card rounded-2xl w-full" >
            <p className="text-[10px] font-bold uppercase text-slate-400 px-3 mb-2">
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isActive
                                ? "bg-brand/10 text-brand"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            {IconComponent && (
                                <IconComponent
                                    className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-brand" : "text-slate-400"}`}
                                />
                            )}
                            {table.label}
                        </a>
                    );
                })
            }
        </nav >
    );
}
