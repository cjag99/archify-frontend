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
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
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