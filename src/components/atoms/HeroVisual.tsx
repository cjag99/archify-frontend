// Reusable atom UI component for HeroVisual
import type { FC } from "react";

export const HeroVisual: FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[36rem] lg:ml-auto">
      <div className="absolute -top-6 left-0 z-20 hidden w-44 rounded-xl border border-white/20 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 p-3 shadow-2xl md:block lg:-left-6 lg:w-48 lg:p-4 transition-colors duration-300 animate-float">
        <p className="mb-2 text-[10px] font-bold uppercase text-slate-400">Pattern</p>
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-brand" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Hexagonal Arch</span>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-1.5 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl transition-transform duration-500 hover:-translate-y-1 sm:rounded-3xl">
        <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[10px] text-slate-400 sm:text-[11px]">
            archify-project.zip
          </span>
        </div>
        <div className="p-4 font-mono text-xs sm:p-6 sm:text-sm">
          <div className="flex gap-3 sm:gap-4">
            <div className="w-[44%] space-y-1.5 border-r border-slate-800 pr-2 text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="text-[10px]">▼</span>{" "}
                <span className="text-[11px] font-bold">src</span>
              </div>
              <div className="pl-3 flex items-center gap-1.5">
                <span className="text-[10px]">▼</span>{" "}
                <span className="text-[11px] font-medium text-brand-light">domain</span>
              </div>
              <div className="pl-7 text-[10px] whitespace-nowrap opacity-80 transition-colors hover:text-white">
                UserService.ts
              </div>
              <div className="pl-7 text-[10px] whitespace-nowrap opacity-80 transition-colors hover:text-white">
                UserEntity.ts
              </div>
              <div className="pl-3 flex items-center gap-1.5 opacity-60">
                <span className="text-[10px]">▶</span>{" "}
                <span className="text-[11px]">infra</span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3 text-[10px] italic opacity-50 sm:mt-4 sm:pt-4">
                <span>#</span> README.md
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex h-4 w-3/4 items-center rounded border border-brand/30 bg-brand/20 px-2">
                <div className="h-1 w-20 rounded bg-brand/40" />
              </div>
              <div className="flex h-4 w-full items-center rounded bg-slate-800 px-2">
                <div className="h-1 w-32 rounded bg-slate-700" />
              </div>
              <div className="group relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-700 sm:h-32">
                <div className="flex h-9 w-20 items-center justify-center rounded bg-brand text-[10px] font-bold text-white shadow-lg shadow-brand/40 transition-transform group-hover:scale-110 sm:h-10">
                  DOMAIN
                </div>
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-20">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <path d="M10,50 Q50,10 90,50" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M10,50 Q50,90 90,50" fill="none" stroke="white" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 right-2 flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-white shadow-2xl sm:right-8 sm:px-4 animate-float-delayed">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span className="text-[11px] font-bold uppercase sm:text-xs">Scaffolding Ready</span>
      </div>
    </div>
  );
};

