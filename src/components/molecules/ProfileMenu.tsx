"use client";

import { useState, useRef, useEffect } from "react";
import { FC } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { ProfileDropdown } from "./ProfileDropdown";

export const ProfileMenu: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout, isAuthenticated } = useAuth();
    const hasAvatar = user && user.avatar !== null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={dropdownRef}>
            <>
                {!hasAvatar && user && (
                    <div
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-white font-bold text-base">
                                {user.first_name.charAt(0).toUpperCase()}
                            </div>
                            {/* Indicador de conexión (opcional) */}
                            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-900 leading-none">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 capitalize">
                                {user.role}
                            </p>
                        </div>
                        <svg
                            className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                )}
                {hasAvatar && user && (
                    <div
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="relative flex-shrink-0">

                            {/* Indicador de conexión (opcional) */}
                            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-900 leading-none">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 capitalize">
                                {user.role}
                            </p>
                        </div>
                        <svg
                            className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                )}
                {isOpen && (
                    <ProfileDropdown onClose={() => setIsOpen(false)} />
                )}
            </>
        </div>
    );
}