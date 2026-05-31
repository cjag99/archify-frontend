"use client";
import { useAuth } from "@/core/context/AuthContext";
import { useState } from "react"; // 💡 Añadimos useEffect
import Link from "next/link";
import Modal from "./Modal";
import { useTheme } from "@/core/context/ThemeContext";
import type { FC } from "react";
import { NavMenu } from "../molecules/NavMenu";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { ProfileMenu } from "../molecules/ProfileMenu";
import { AuthQueryHandler } from "../molecules/AuthQueryHandler";
import { ROUTES } from "@/lib/routes";
import { Menu, X, Sun, Moon } from "lucide-react";
export const Navbar: FC = () => {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth(); // Asegúrate de que useAuth esté importado arriba si faltaba
  const { resolvedTheme, setTheme } = useTheme();
 
  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
  
  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-brand/10 dark:bg-brand/20" />
            <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </header>
    );
  }

  const closeModal = () => setModalType(null);
  const openModal = (type: "login" | "register") => {
    setMobileMenuOpen(false);
    setModalType(type);
  };
  const homeHref = isAuthenticated ? ROUTES.dashboard : ROUTES.home;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/80">
        <AuthQueryHandler onOpenLogin={() => openModal("login")} />
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href={homeHref}
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2"
          >
            <div className="refraction-gradient flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black text-white shadow-lg shadow-brand/20 transition-transform group-hover:scale-105">
              A
            </div>
            <span className="text-xl font-bold text-slate-950 transition-colors dark:text-slate-100 sm:text-2xl">
              Archify
            </span>
          </Link>
          <div className="hidden md:block">
            <NavMenu />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
           <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {/* Icono de la Luna: Se muestra por defecto, se oculta en modo oscuro */}
            <Moon className="h-5 w-5 block dark:hidden" />

            {/* Icono del Sol: Se oculta por defecto, se muestra en modo oscuro */}
            <Sun className="h-5 w-5 hidden dark:block" />
          </button>
            {isAuthenticated ? (
              <ProfileMenu />
            ) : (
              <>
                <button
                  onClick={() => openModal("login")}
                  className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand lg:block"
                >
                  Log in
                </button>
                <button
                  onClick={() => openModal("register")}
                  className="refraction-gradient-hover hidden rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] sm:inline-flex"
                >
                  Start for free
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/70 bg-white/95 dark:border-slate-700/70 dark:bg-slate-950/95 md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="space-y-4">
                <NavMenu mobile onNavigate={() => setMobileMenuOpen(false)} />
                {!isAuthenticated && (
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => openModal("login")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => openModal("register")}
                      className="refraction-gradient-hover rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                    >
                      Start for free
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {!isAuthenticated && (
        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === "login" && (
            <LoginForm
              onSwitch={() => setModalType("register")}
              onSuccess={closeModal}
            />
          )}
          {modalType === "register" && (
            <RegisterForm
              onSwitch={() => setModalType("login")}
              onSuccess={closeModal}
            />
          )}
        </Modal>
      )}
    </>
  );
};