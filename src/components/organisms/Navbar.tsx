"use client";
import { useAuth } from "@/core/context/AuthContext";
import { useState } from "react";
import Modal from "./Modal";
import type { FC } from "react";
import { NavMenu } from "../molecules/NavMenu";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";


export const Navbar: FC = () => {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const { isAuthenticated, logout, loading } = useAuth();
  if (loading) return <nav className="p-4 bg-gray-800 text-white">Loading...</nav>;

  const closeModal = () => setModalType(null);
  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Archify
          </span>
        </div>

        <div className="hidden md:block">
          <NavMenu />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Log out
            </button>
          </>
        ) : (
           <>
          <button
            onClick={() => setModalType("login")}
            className="hidden sm:block text-slate-600 font-medium hover:text-brand transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => setModalType("register")}
            className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Start for free
          </button>
          <Modal isOpen={modalType !== null} onClose={closeModal}>
            {modalType === "login" && (
              <LoginForm onSwitch={() => setModalType("register")} />
            )}
            {modalType === "register" && (
              <RegisterForm onSwitch={() => setModalType("login")} />
            )}
          </Modal>
          </>
          )}
        </div>
      </div>
    </header>
  );
};
