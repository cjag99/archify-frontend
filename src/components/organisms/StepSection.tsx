import { FC } from "react";
import { Blocks, Map, Download } from "lucide-react";

const steps = [
  {
    icon: Blocks,
    title: "Choose your pattern",
    text: "Select Clean Architecture, Hexagonal or DDD. Archify prepares the layers and dependency rules automatically.",
  },
  {
    icon: Map,
    title: "Define the domain",
    text: "Navigate the visual map and add entities, services and adapters where they belong.",
  },
  {
    icon: Download,
    title: "Export the scaffolding",
    text: "Keep a project structure ready for coding with folders, interfaces and boilerplate already aligned.",
  },
];

export const StepSection: FC = () => {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          <span className="eyebrow mb-6 uppercase tracking-wider">Workflow</span>
          <h2 className="mb-6 tracking-tight text-3xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-4xl lg:text-5xl">
            Design your system in 3 steps
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            From idea to structured code without getting lost in initial
            configurations.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
            <div
              key={index}
              className={`glass-card rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_8px_30px_rgba(140,3,239,0.1)] sm:p-8 ${
                index === 1 ? "ring-1 ring-brand/30 bg-white/60 dark:bg-slate-900/60" : ""
              }`}
            >
              <div className="mb-8 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    index === 1 ? "bg-brand text-white shadow-lg shadow-brand/30" : "bg-brand/10 text-brand"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="ml-4 h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-950 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {step.text}
              </p>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};

