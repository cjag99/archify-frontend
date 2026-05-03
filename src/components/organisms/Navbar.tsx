// src/components/organisms/Navbar.tsx
import type { FC } from 'react';
import { NavMenu } from '../molecules/NavMenu';

export const Navbar: FC = () => {
  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo "Fake" sin imagen */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Archify
          </span>
        </div>

        {/* Molécula de Enlaces */}
        <div className="hidden md:block">
          <NavMenu />
        </div>

        {/* Botón de Acción (Átomo rápido) */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-slate-600 font-medium hover:text-brand transition-colors">
            Iniciar sesión
          </button>
          <button className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95">
            Empezar gratis
          </button>
        </div>

      </div>
    </header>
  );
};