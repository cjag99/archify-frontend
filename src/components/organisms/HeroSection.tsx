// Page-level UI component that renders the HeroSection interface
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../atoms/Button";
import { HeroVisual } from "../atoms/HeroVisual";
import { ArrowRight } from "lucide-react";
export const HeroSection: FC = () => {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-linear-to-b from-brand/5 to-transparent" />
      <section className="mx-auto grid min-h-[70vh] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:gap-12 sm:px-6 sm:py-16 lg:min-h-[82vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-20">
        <div className="z-10 flex flex-col items-start text-left">
          <span className="eyebrow mb-6 sm:mb-8 font-medium">Architecture workspace</span>
          <h1 className="mb-6 tracking-tight text-4xl leading-[1.05] font-bold text-slate-950 dark:text-slate-50 sm:mb-8 sm:text-5xl lg:text-7xl">
            Your architecture, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">ready to code.</span>
          </h1>
          <p className="mb-7 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mb-8 sm:text-lg lg:text-xl">
            Great programming starts with great design. Choose your architectural
            pattern, define your domain and generate a professional scaffolding
            in seconds.
          </p>
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="primary"
              className="group w-full justify-center px-6 py-3.5 text-sm sm:w-auto sm:px-7 sm:py-4 sm:text-base"
              onClick={() => router.push('?register=1')}
            >
              Start designing now
              <span className="leading-none flex items-center transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
        <div className="relative w-full lg:pl-3">
          <HeroVisual />
        </div>
      </section>
    </div>
  );
};

