"use client";

import { FC } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { NavLink } from "../atoms/NavLink";
import { PowerOff } from "lucide-react";

interface ProfileDropdownProps {
    onClose: () => void;
}

export const ProfileDropdown: FC<ProfileDropdownProps> = ({ onClose }) => {
    const { user, logout } = useAuth();
    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-64 border border-slate-200 absolute top-full right-0 mt-2 z-50">
            <div className="px-5 py-4 bg-gradient-to-r from-brand to-brand-dark text-white">
                <div className="text-sm font-medium">Welcome back,</div>
                <div className="text-lg font-bold">{user?.first_name} {user?.last_name}</div>
                <div className="text-xs opacity-90 mt-1 capitalize">{user?.role}</div>
            </div>
            <hr />
            <div className="py-2 pl-3">
                <div className="block px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-brand transition-colors">
                    <NavLink
                        href="/profile"
                        onClick={() => onClose()}
                    >
                        Profile
                    </NavLink>
                </div>
                <hr />
                <div className="block px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-brand transition-colors">
                    <NavLink
                        href="/settings"
                        onClick={() => onClose()}
                    >
                        Settings
                    </NavLink>
                </div>
                <div className="block px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-brand transition-colors">
                    <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        className="block w-full text-left px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-brand transition-colors"
                    >
                        <PowerOff size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </div >
    );
}