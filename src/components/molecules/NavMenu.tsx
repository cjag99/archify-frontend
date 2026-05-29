"use client";

import { useAuth } from "@/core/context/AuthContext";
import type { FC } from "react";
import { NavLink } from "../atoms/NavLink";
import { ROUTES } from "@/lib/routes";

export const NavMenu: FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <nav className="flex items-center gap-8">
        <NavLink href={ROUTES.home}>Home</NavLink>
      </nav>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: ROUTES.dashboard },
    { label: "Projects", href: ROUTES.projects },
    { label: "Patterns", href: ROUTES.patterns },
    { label: "Architectures", href: ROUTES.architectures },
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
