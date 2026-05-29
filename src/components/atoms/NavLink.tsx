"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";

export const NavLink: FC<{
  href: string;
  children: ReactNode;
  onClick?: () => void;
  compact?: boolean;
}> = ({ href, children, onClick, compact = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 group ${
        isActive
          ? "bg-brand/8 text-brand"
          : "text-slate-600 hover:bg-slate-100 hover:text-brand"
      }`}
    >
      {children}
      {!compact && (
        <span
          className={`absolute bottom-1 left-3 right-3 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      )}
    </Link>
  );
};
