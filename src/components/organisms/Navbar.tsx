// Page-level UI component that renders the Navbar interface
"use client";
import { useAuth } from "@/core/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Modal from "./Modal";
import { useTheme } from "@/core/context/ThemeContext";
import type { FC } from "react";
import { NavMenu } from "../molecules/NavMenu";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { ProfileMenu } from "../molecules/ProfileMenu";
import { MobileProfileMenu } from "../molecules/MobileProfileMenu";
import { AuthQueryHandler } from "../molecules/AuthQueryHandler";
import { ROUTES } from "@/lib/routes";
import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import logoImg from "@/public/logo.png";

export const Navbar: FC = () => {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const openModal = (type: "login" | "register") => {
    setMobileMenuOpen(false);
    setModalType(type);
  };
  const closeModal = () => setModalType(null);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0a]/80 glass-card">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-brand/10 dark:bg-brand/20" />
          <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      </header>
    );
  }

  const homeLink = isAuthenticated ? ROUTES.dashboard : ROUTES.home;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0a]/80 glass-card">
        <AuthQueryHandler onOpenLogin={() => openModal('login')} onOpenRegister={() => openModal('register')} />
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1">
            {/* Hamburger (leftmost) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-slate-600 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo (always visible) */}
            {isAuthenticated ? (
              <Link href={homeLink} onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                  <Image src={logoImg} alt="Archify Logo" fill sizes="40px" className="object-contain" />
                </div>
                <span className="text-xl font-bold text-slate-950 transition-colors dark:text-slate-100 sm:text-2xl">
                  Archify
                </span>
              </Link>
            ) : (
              <div className="group flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm">
                  <Image src={logoImg} alt="Archify Logo" fill sizes="40px" className="object-contain" />
                </div>
                <span className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                  Archify
                </span>
              </div>
            )}
          </div>

          {/* Right side (desktop) */}
          <div className="ml-auto hidden md:flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <ProfileMenu />
                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="relative z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Moon className="h-5 w-5 block dark:hidden" />
                  <Sun className="h-5 w-5 hidden dark:block" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openModal('login')}
                  className="rounded-xl bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark dark:bg-brand/30 dark:hover:bg-brand-dark"
                >
                  Log in
                </button>
                <button
                  onClick={() => openModal('register')}
                  className="rounded-xl bg-brand hover:bg-brand-dark px-4 py-2.5 text-sm font-bold text-white transition-all"
                >
                  Start for free
                </button>
                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="relative z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Moon className="h-5 w-5 block dark:hidden" />
                  <Sun className="h-5 w-5 hidden dark:block" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/70 bg-white/95 dark:border-slate-700/70 dark:bg-slate-950/95 md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="space-y-4">
                          {isAuthenticated && (
                  <MobileProfileMenu />
                )}
                {!isAuthenticated && (
                  <> 
                    {/* Theme toggle for unauthenticated users */}
                    <label className="inline-flex items-center cursor-pointer px-3">
                      <input
                        type="checkbox"
                        checked={resolvedTheme === 'dark'}
                        onChange={toggleTheme}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-brand after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                      <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
                      </span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => openModal('login')}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => openModal('register')}
                        className="rounded-xl bg-brand hover:bg-brand-dark px-4 py-2.5 text-sm font-bold text-white transition-all"
                      >
                        Start for free
                      </button>
                      {/* Theme toggle button */}
                      <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="relative z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        <Moon className="h-5 w-5 block dark:hidden" />
                        <Sun className="h-5 w-5 hidden dark:block" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals (only when not authenticated) */}
      {!isAuthenticated && (
        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === 'login' && (
            <LoginForm onSwitch={() => setModalType('register')} onSuccess={closeModal} />
          )}
          {modalType === 'register' && (
            <RegisterForm onSwitch={() => setModalType('login')} onSuccess={closeModal} />
          )}
        </Modal>
      )}
    </>
  );
};