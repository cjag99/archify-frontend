import { FC } from "react";
export const StepSection: FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Design your system in 3 steps
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            From idea to structured code without getting lost in initial
            configurations.
          </p>
        </div>

        {/* Grid de Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Paso 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand font-bold text-xl mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Choose your Pattern
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Select between <b>Clean Architecture</b>, <b>Hexagonal</b> or{" "}
              <b>DDD</b>. Archify prepares the layers and dependency rules
              automatically.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ring-2 ring-brand/20">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Define the Domain
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Navigate the visual map and add your entities and services. This is
              where you <b>design the logic</b> of your application.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand font-bold text-xl mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Export the Scaffolding
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Receive a project ready for <b>coding</b>, with all folders,
              interfaces and boilerplate configured according to the standard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
