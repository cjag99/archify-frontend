// Composite UI component used by views and forms for NavMenu
"use client";

import { useAuth } from "@/core/context/AuthContext";
import type { FC } from "react";
import { NavLink } from "../atoms/NavLink";
import { ROUTES } from "@/lib/routes";
interface NavMenuProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export const NavMenu: FC<NavMenuProps> = ({ mobile = false, onNavigate }) => {
  const { isAuthenticated, loading } = useAuth();
  const navClassName = mobile
    ? "flex flex-col items-stretch gap-2"
    : "flex items-center gap-5 lg:gap-7";

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { label: "Dashboard", href: ROUTES.dashboard },
    { label: "Projects", href: ROUTES.projects },
    { label: "Patterns", href: ROUTES.patterns },
    { label: "Architectures", href: ROUTES.architectures },
  ];

  return (
    <nav className={navClassName}>
      {menuItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          compact={mobile}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

