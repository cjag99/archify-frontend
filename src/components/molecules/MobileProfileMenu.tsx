// Mobile version of ProfileMenu for the mobile navigation menu
"use client";

import { useState, useEffect } from "react";
import { FC } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useImage } from "@/hooks/useImage";
import { useTheme } from "@/core/context/ThemeContext";
import Image from "next/image";
import {  Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { NavMenu } from "../molecules/NavMenu";

export const MobileProfileMenu: FC = () => {
  const { user, logout } = useAuth();
  const { fetchImage } = useImage();
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

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

  if (!user) return null;

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-2 px-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-brand/5 text-brand flex items-center justify-center font-bold text-sm">
            {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
          {user.username}
        </span>
      </div>

      <label className="flex items-center cursor-pointer px-3">
        <input
          type="checkbox"
          checked={resolvedTheme === "dark"}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-brand after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          {resolvedTheme === "dark" ? "Dark" : "Light"} mode
        </span>
      </label>

      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">My account</span>
      </Link>

      <NavMenu mobile />

      <button
        onClick={logout}
        className="flex w-full items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Logout</span>
      </button>
    </div>
  );
};
