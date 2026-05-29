import { FC } from "react";

const steps = [
  {
    number: "01",
    title: "Choose your pattern",
    text: "Select Clean Architecture, Hexagonal or DDD. Archify prepares the layers and dependency rules automatically.",
  },
  {
    number: "02",
    title: "Define the domain",
    text: "Navigate the visual map and add entities, services and adapters where they belong.",
  },
  {
    number: "03",
    title: "Export the scaffolding",
    text: "Keep a project structure ready for coding with folders, interfaces and boilerplate already aligned.",
  },
];

export const StepSection: FC = () => {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          <span className="eyebrow mb-4">Workflow</span>
          <h2 className="mb-4 text-3xl font-bold text-slate-950 sm:text-4xl lg:text-5xl">
            Design your system in 3 steps
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            From idea to structured code without getting lost in initial
            configurations.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`section-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl sm:p-6 lg:p-7 ${
                index === 1 ? "ring-1 ring-brand/20" : ""
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black ${
                    index === 1 ? "bg-brand text-white" : "bg-brand/8 text-brand"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-4 h-px flex-1 bg-slate-200" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
