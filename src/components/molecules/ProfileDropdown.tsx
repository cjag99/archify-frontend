"use client";

import { FC } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface ProfileDropdownProps {
    onClose: () => void;
}

export const ProfileDropdown: FC<ProfileDropdownProps> = ({ onClose }) => {
    const { user, logout } = useAuth();
    const hasAvatar = user && user.avatar !== null;

    if (!user) return null;

    return (
        <div className="glass-card rounded-2xl w-64 absolute top-full right-0 mt-3 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header user info */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100/60 mb-2">
                <div className="relative shrink-0">
                    {hasAvatar && user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" 
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-brand/5 text-brand flex items-center justify-center font-bold text-base ring-2 ring-slate-100">
                            {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">
                        {user.first_name} {user.last_name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-0.5">
                <Link
                    href="/profile"
                    onClick={() => onClose()}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 font-semibold rounded-xl hover:bg-brand/5 hover:text-brand transition-all duration-150 group"
                >
                    <User className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-brand transition-colors" />
                    <span>My Profile</span>
                </Link>
                
                <Link
                    href="/settings"
                    onClick={() => onClose()}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 font-semibold rounded-xl hover:bg-brand/5 hover:text-brand transition-all duration-150 group"
                >
                    <Settings className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-brand transition-colors" />
                    <span>Settings</span>
                </Link>

                <div className="border-t border-slate-100/60 my-1" />

                <button
                    onClick={() => {
                        logout();
                        onClose();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-150 cursor-pointer group"
                >
                    <LogOut className="w-4 h-4 shrink-0 text-red-400 group-hover:text-red-600 transition-colors" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );
}