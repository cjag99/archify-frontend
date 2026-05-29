import { FC } from "react";
import 'devicon/devicon.min.css';


export const Footer: FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-12">
          <span className="text-xs font-bold uppercase text-slate-400">
            Powered by
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <i className="devicon-nextjs-plain-wordmark colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
            <i className="devicon-react-plain-wordmark colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
            <i className="devicon-typescript-plain colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
            <i className="devicon-tailwindcss-original colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
            <i className="devicon-fastapi-plain colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
            <i className="devicon-supabase-plain colored cursor-pointer text-4xl text-black transition-colors hover:text-brand sm:text-5xl"></i>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-bold text-white">
                A
              </div>
              <span className="text-xl font-bold text-slate-950">
                Archify
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Standardizing software design for the next generation of
              architects.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 mb-6 uppercase">
              Product
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Features
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Patterns
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Pricing
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 mb-6 uppercase">
              Resources
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Documentation
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Architecture Blog
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Support
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 mb-6 uppercase">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-brand cursor-pointer transition-colors">
                Privacy
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Terms
              </li>
              <li className="hover:text-brand cursor-pointer transition-colors">
                Cookies
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-center sm:mt-16 sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400">
            © 2026 Archify. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-slate-400 sm:justify-end sm:gap-6">
            <span className="text-xs hover:text-brand cursor-pointer transition-colors">
              GitHub
            </span>
            <span className="text-xs hover:text-brand cursor-pointer transition-colors">
              LinkedIn
            </span>
            <span className="text-xs hover:text-brand cursor-pointer transition-colors">
              X (Twitter)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
