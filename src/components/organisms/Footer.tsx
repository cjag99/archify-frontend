// Page-level UI component that renders the Footer interface
import { FC } from "react";
import 'devicon/devicon.min.css';
import Link from "next/link";


export const Footer: FC = () => {
  return (
    <footer className="glass-card border-t border-brand/20 dark:border-brand/30">
      <div className="border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-12">
          <span className="text-xs font-bold uppercase text-slate-400">
            Powered by
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <i className="devicon-nextjs-plain-wordmark cursor-pointer text-4xl text-slate-900 dark:text-slate-100 transition-all duration-300 hover:text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
            <i className="devicon-react-plain-wordmark colored cursor-pointer text-4xl transition-all duration-300 hover:!text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
            <i className="devicon-typescript-plain colored cursor-pointer text-4xl transition-all duration-300 hover:!text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
            <i className="devicon-tailwindcss-original colored cursor-pointer text-4xl transition-all duration-300 hover:!text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
            <i className="devicon-fastapi-plain colored cursor-pointer text-4xl transition-all duration-300 hover:!text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
            <i className="devicon-supabase-plain colored cursor-pointer text-4xl transition-all duration-300 hover:!text-brand hover:bg-brand/5 p-2 rounded-xl sm:text-5xl"></i>
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
              <span className="text-xl font-bold text-slate-950 dark:text-slate-100">
                Archify
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Standardizing software design for the next generation of
              architects.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-6 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard/projects" className="hover:text-brand transition-colors flex items-center gap-2">
                Project Manager
                </Link>
              </li>
              <li>
                <Link href="/dashboard/patterns" className="hover:text-brand transition-colors flex items-center gap-2">
                Pattern Catalog
                </Link>
              </li>
              <li>
                <Link href="/dashboard/architectures" className="hover:text-brand transition-colors flex items-center gap-2">
                Architecture Lab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-6 uppercase tracking-wider">
              Learn
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="https://en.wikipedia.org/wiki/Clean_Architecture" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Clean Architecture
                </a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Hexagonal Guide
                </a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Domain-driven_design" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                DDD Best Practices
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-6 uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="https://github.com/your-org/archify" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                GitHub (Contribute)
                </a>
              </li>
              <li>
                <a href="https://discord.gg/your-invite" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Join Discord
                </a>
              </li>
              <li>
                <a href="https://github.com/your-org/archify/issues" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 text-center sm:mt-16 sm:flex-row sm:text-left">
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

