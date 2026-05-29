"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";

export const NavLink: FC<{
  href: string;
  children: ReactNode;
  onClick?: () => void;
}> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative py-1 font-medium transition-colors duration-300 group ${
        isActive ? "text-brand" : "text-black hover:text-brand"
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
};
