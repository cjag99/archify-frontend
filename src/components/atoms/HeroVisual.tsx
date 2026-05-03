import type { FC } from 'react';

export const HeroVisual: FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:ml-auto">

      <div className="absolute -inset-4 bg-brand/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute -top-10 -left-10 w-48 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden sm:block animate-bounce-slow">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Patrón</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-brand" />
          <span className="text-xs font-semibold text-slate-700">Hexagonal Arch</span>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-slate-100 rounded" />
          <div className="h-1.5 w-2/3 bg-slate-100 rounded" />
        </div>
      </div>

      <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 transform hover:rotate-2 transition-transform duration-500">
        <div className="bg-slate-800/50 px-4 py-3 flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[11px] text-slate-400 font-mono">archify-project.zip</span>
        </div>

        <div className="p-6 font-mono text-sm">
            <div className="flex gap-4">
            <div className="w-[42%] border-r border-slate-800 pr-2 space-y-1.5 text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-[10px]">▼</span> <span className="text-[11px] font-bold">src</span>
                </div>
                <div className="pl-3 flex items-center gap-1.5">
                    <span className="text-[10px]">▼</span> <span className="text-[11px] text-brand-light font-medium">domain</span>
                </div>
                
                <div className="pl-7 text-[10px] hover:text-white cursor-pointer transition-colors whitespace-nowrap opacity-80">
                    UserService.ts
                </div>
                <div className="pl-7 text-[10px] hover:text-white cursor-pointer transition-colors whitespace-nowrap opacity-80">
                    UserEntity.ts
                </div>
                <div className="pl-3 flex items-center gap-1.5 opacity-60">
                    <span className="text-[10px]">▶</span> <span className="text-[11px]">infra</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] flex items-center gap-2 italic opacity-50">
                    <span>#</span> README.md
                </div>
            </div>



            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 bg-brand/20 rounded border border-brand/30 flex items-center px-2">
                <div className="h-1 w-20 bg-brand/40 rounded" />
              </div>
              <div className="h-4 w-full bg-slate-800 rounded px-2 flex items-center">
                <div className="h-1 w-32 bg-slate-700 rounded" />
              </div>
              <div className="h-32 w-full border border-dashed border-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden group">
                 <div className="w-20 h-10 bg-brand rounded flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-brand/40 group-hover:scale-110 transition-transform">
                    DOMAIN
                 </div>
                 <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path d="M10,50 Q50,10 90,50" fill="none" stroke="white" strokeWidth="0.5" />
                      <path d="M10,50 Q50,90 90,50" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 right-10 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-float">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-tighter">Scaffolding Ready</span>
      </div>

    </div>
  );
};