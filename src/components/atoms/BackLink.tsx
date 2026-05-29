"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label = "Volver" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
