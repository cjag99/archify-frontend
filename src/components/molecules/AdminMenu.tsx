"use client";
import { useAdminTable } from "@/hooks/useAdminTable";
import { NavLink } from "../atoms/NavLink";
import { FC } from "react";

export const AdminMenu: FC = () => {
    const { currentTable, changeTable } = useAdminTable();
    const DBTables = [
        {
            label: "Users",
            href: "/admin/tables/users",
            icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-account-details" viewBox="0 0 24 24"><path d="M11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6C9.66 6 11 7.34 11 9M14 20H2V18C2 15.79 4.69 14 8 14C11.31 14 14 15.79 14 18M22 12V14H13V12M22 8V10H13V8M22 4V6H13V4Z" /></svg>',
            apiRoute: "users"
        },
        {
            label: "Projects",
            href: "/admin/tables/projects",
            icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-folder-information" viewBox="0 0 24 24"><path d="M21 11.1V8C21 6.9 20.1 6 19 6H11L9 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H10.3C11.6 21.9 13.8 23 16 23C19.9 23 23 19.9 23 16C23 14.2 22.3 12.4 21 11.1M16 21C13.2 21 11 18.8 11 16S13.2 11 16 11 21 13.2 21 16 18.8 21 16 21M17 20H15V15H17V20M17 14H15V12H17V14Z" /></svg>',
            apiRoute: "projects"
        },
        {
            label: "Architectures",
            href: "/admin/tables/architectures",
            icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-layers-search" viewBox="0 0 24 24"><path d="M19.31 18.9C19.75 18.21 20 17.38 20 16.5C20 14 18 12 15.5 12S11 14 11 16.5 13 21 15.5 21C16.37 21 17.19 20.75 17.88 20.32L21 23.39L22.39 22L19.31 18.9M15.5 19C14.12 19 13 17.88 13 16.5S14.12 14 15.5 14 18 15.12 18 16.5 16.88 19 15.5 19M9.59 19.2L3 14.07L4.62 12.81L9 16.22C9 16.32 9 16.41 9 16.5C9 17.46 9.22 18.38 9.59 19.2M4.63 10.27L3 9L12 2L21 9L19.36 10.27L18.65 10.82C17.72 10.3 16.64 10 15.5 10C12.79 10 10.46 11.68 9.5 14.05L4.63 10.27Z" /></svg>',
            apiRoute: "architectures"
        },
        {
            label: "Patterns",
            href: "/admin/tables/patterns",
            icon: '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-hammer-wrench" viewBox="0 0 24 24"><path d="M13.78 15.3L19.78 21.3L21.89 19.14L15.89 13.14L13.78 15.3M17.5 10.1C17.11 10.1 16.69 10.05 16.36 9.91L4.97 21.25L2.86 19.14L10.27 11.74L8.5 9.96L7.78 10.66L6.33 9.25V12.11L5.63 12.81L2.11 9.25L2.81 8.55H5.62L4.22 7.14L7.78 3.58C8.95 2.41 10.83 2.41 12 3.58L9.89 5.74L11.3 7.14L10.59 7.85L12.38 9.63L14.2 7.75C14.06 7.42 14 7 14 6.63C14 4.66 15.56 3.11 17.5 3.11C18.09 3.11 18.61 3.25 19.08 3.53L16.41 6.2L17.91 7.7L20.58 5.03C20.86 5.5 21 6 21 6.63C21 8.55 19.45 10.1 17.5 10.1Z" /></svg>',
            apiRoute: "patterns"
        }
    ];

    return (
        <nav className="flex flex-col items-start gap-4 p-6 bg-white rounded-lg shadow-md" >
            {
                DBTables.map((table) => (
                    <NavLink key={table.href} href={table.href} onClick={() => changeTable(table.apiRoute)} >
                        {table.icon && (
                            <span className="mr-2 w-[25px] h-[25px] inline-block align-middle" dangerouslySetInnerHTML={{ __html: table.icon }} />
                        )}
                        {table.label}
                    </NavLink>
                ))
            }
        </nav >
    );
}