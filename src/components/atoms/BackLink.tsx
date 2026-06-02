"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label = "Back to" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-brand/30 hover:bg-slate-50 hover:text-brand dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-950 dark:hover:text-slate-100"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}
