"use client";

import { useState, useRef, useEffect } from "react";
import { FC } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useImage } from "@/hooks/useImage";
import { ProfileDropdown } from "./ProfileDropdown";
import { ChevronDown } from "lucide-react";

export const ProfileMenu: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { fetchImage } = useImage();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user?.avatar) {
            fetchImage(user.avatar as any).then((img) => {
                if (img?.url) setAvatarUrl(img.url);
            });
        } else {
            setAvatarUrl(null);
        }
    }, [user?.avatar, fetchImage]);

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

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={toggleDropdown}
                className="flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-200 active:scale-98 select-none"
            >
                <div className="relative flex-shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand/30 transition-all duration-200"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-brand/5 text-brand flex items-center justify-center font-bold text-sm ring-2 ring-slate-100 group-hover:ring-brand/30 transition-all duration-200">
                            {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>

                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-brand transition-colors duration-200 leading-none mb-0.5">
                        {user.username}
                    </p>
                </div>

                <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>
            {isOpen && (
                <ProfileDropdown onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
}