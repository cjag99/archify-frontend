"use client";

import { useState, useEffect } from "react";
import { User, RegisterCredentials } from "@/core/types/auth";
import { authService } from "@/core/api/auth.service";
import { userService } from "@/core/api/users.service";
import { useImage } from "@/hooks/useImage";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FileInput } from "../molecules/FileInput";
import { AlertCircle, User as UserIcon, Shield, Camera } from "lucide-react";

interface AdminUserFormProps {
    user?: User;
    onCompleted?: (success: boolean) => Promise<void> | void;
}

export const AdminUserForm = ({ user, onCompleted }: AdminUserFormProps) => {
    const { createImage, fetchImage } = useImage();
    const isEditMode = Boolean(user);

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        is_authorized: user?.is_authorized ?? false,
    });
    
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.avatar) {
            fetchImage(user.avatar as any).then((img) => {
                if (img?.url) setAvatarUrl(img.url);
            });
        }
    }, [user?.avatar, fetchImage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isEditMode) {
            if (!formData.password || formData.password !== formData.confirmPassword) {
                setError("Passwords do not match or are empty.");
                return;
            }
        }

        setLoading(true);
        let success = false;

        try {
            let targetUserId = user?.id;

            if (!isEditMode) {
                const credentials: RegisterCredentials = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                };
                const response = await authService.register(credentials);
                if (!response.profile?.id) {
                    throw new Error("Failed to get created user ID");
                }
                targetUserId = response.profile.id;
            }

            let avatarId = user?.avatar;
            if (avatarFile) {
                const imageRes = await createImage(avatarFile, "avatar");
                if (imageRes?.id) {
                    avatarId = imageRes.id as User["avatar"];
                }
            }

            if (targetUserId) {
                await userService.update(String(targetUserId), {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    username: formData.username,
                    email: formData.email,
                    is_authorized: formData.is_authorized,
                    avatar: avatarId,
                });
            }

            success = true;
        } catch (err: any) {
            console.error("User save error:", err);
            setError(err.message || "Failed to save user");
        } finally {
            setLoading(false);
            if (onCompleted) {
                await onCompleted(success);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative group w-24 h-24">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-[3px] border-white dark:border-slate-900 shadow-sm flex items-center justify-center relative">
                        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <Camera className="text-white" size={20} />
                        </div>
                        <div className="w-full h-full opacity-0 absolute inset-0 z-20 cursor-pointer">
                            <FileInput 
                                onChange={(file) => setAvatarFile(file)} 
                                placeholder=""
                            />
                        </div>
                        {avatarFile ? (
                            <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                        ) : avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                <UserIcon size={32} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-3 text-sm font-medium text-red-600 border border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 rounded-xl">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="First name"
                    name="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Last name"
                    name="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <Input
                label="Username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <Input 
                label="Email" 
                name="email" 
                type="email" 
                placeholder="your@email.com" 
                value={formData.email}
                onChange={handleChange}
                required 
            />

            {!isEditMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Shield size={16} className="text-brand" />
                        Authorized Access
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Determine if this user has authorized access.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                    <input 
                        type="checkbox" 
                        name="is_authorized" 
                        checked={formData.is_authorized} 
                        onChange={handleChange} 
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand shadow-inner"></div>
                </label>
            </div>

            <Button type="submit" variant="primary" isLoading={loading} fullWidth>
                {isEditMode ? "Save Changes" : "Create User"}
            </Button>
        </form>
    );
};
