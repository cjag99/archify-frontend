import { FC } from "react";
export const StepSection: FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Diseña tu sistema en 3 pasos
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            De la idea al código estructurado sin perderte en configuraciones
            iniciales.
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
              Elige tu Patrón
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Selecciona entre <b>Clean Architecture</b>, <b>Hexagonal</b> o{" "}
              <b>DDD</b>. Archify prepara las capas y reglas de dependencia
              automáticamente.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ring-2 ring-brand/20">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Define el Dominio
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Navega por el mapa visual y añade tus entidades y servicios. Es
              aquí donde <b>diseñas la lógica</b> de tu aplicación.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand font-bold text-xl mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Exporta el Scaffolding
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Recibe un proyecto listo para <b>picar código</b>, con todas las
              carpetas, interfaces y boilerplate configurados según el estándar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
