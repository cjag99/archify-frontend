"use client";
import { useAuth } from "@/core/context/AuthContext";
import type { FC } from "react";
import { NavLink } from "../atoms/NavLink";

interface NavItems {
    label: string;
    href: string;
}



export const NavMenu: FC = () => {
    const { isAuthenticated } = useAuth();
    const menuItems: NavItems[] = [
        { label: "Home", href: isAuthenticated ? "/dashboard" : "/" },
        { label: "Projects", href: "/projects" },
        { label: "Patterns", href: "/patterns" },
        { label: "Architectures", href: "/architectures" },
    ];
    return (
        <nav className="flex items-center gap-8">
            {menuItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
};