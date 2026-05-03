import { FC } from "react";
import { Button } from "../atoms/Button";
import { HeroVisual } from "../atoms/HeroVisual";

export const HeroSection: FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />
      <div className="absolute top-1/2 -right-1/4 w-125 h-125 bg-[#8C03EF]/10 rounded-full blur-[120px] -z-10" />
      <section className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-start text-left z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 leading-[1.1] tracking-tight">
            Tu arquitectura, <br />
            <span className="text-[#8C03EF]">lista para programar.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
            La mejor programación empieza con un gran diseño. Elige tu patrón
            arquitectónico, aterriza tu dominio y materializa un scaffolding
            profesional en segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              variant="primary"
              className="px-12 py-8 text-xl shadow-2xl shadow-brand/20 group inline-flex items-center justify-center"
            >
              Empieza a diseñar ahora
              <span className="ml-3 transition-transform duration-300 ease-in-out group-hover:translate-x-2 leading-none flex items-cente relative top-0.5">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>

        <div className="relative w-full">
          <HeroVisual />
        </div>
      </section>
    </div>
  );
};
