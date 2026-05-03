import type { FC } from "react";
import { NavLink } from "../atoms/NavLink";

interface NavItems {
    label: string;
    href: string;    
}

const menuItems: NavItems[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
];

export const NavMenu: FC = () => {
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