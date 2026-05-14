import { FC } from "react";
import 'devicon/devicon.min.css';


export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Potenciado por
          </span>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <i className="devicon-nextjs-plain-wordmark colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
            <i className="devicon-react-plain-wordmark colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
            <i className="devicon-typescript-plain colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
            <i className="devicon-tailwindcss-original colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
            <i className="devicon-fastapi-plain colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
            <i className="devicon-supabase-plain colored text-black text-5xl hover:text-brand cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Archify
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Estandarizando el diseño de software para la próxima generación de
              arquitectos.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
              Producto
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Características
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Patrones
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Precios
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
              Recursos
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Documentación
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Blog de Arquitectura
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Soporte
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Privacidad
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Términos
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Cookies
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2026 Archify. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-slate-400">
            <span className="text-xs hover:text-brand cursor-pointer">
              GitHub
            </span>
            <span className="text-xs hover:text-brand cursor-pointer">
              LinkedIn
            </span>
            <span className="text-xs hover:text-brand cursor-pointer">
              X (Twitter)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
