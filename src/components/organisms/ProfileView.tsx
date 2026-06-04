// Page-level UI component that renders the ProfileView interface
"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/core/types/auth";
import { userService } from '@/core/api/users.service';
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FileInput } from "../molecules/FileInput";
import { useAuth } from "@/core/context/AuthContext";
import { useImage } from "@/hooks/useImage";
import { User as UserIcon, Mail, Hash, Shield, Trash2, Save, Camera, Edit3 } from "lucide-react";

interface ProfileViewProps {
  user?: User;
  onSave?: (updatedUser: Partial<User>, avatarFile?: File | null) => Promise<void> | void;
  onDelete?: () => void;
  isLoading?: boolean;
  hideActions?: boolean;
}

export const ProfileView = ({ 
  user: propUser, 
  onSave, 
  onDelete, 
  isLoading = false 
  , hideActions = false
}: ProfileViewProps) => {
  const { user: authUser, logout } = useAuth();
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

  const currentUser = propUser || authUser;
  const isMyAccount = !propUser || propUser.id === authUser?.id;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!passwordData.password || passwordData.password !== passwordData.confirmPassword) {
          alert('Passwords do not match or are empty.');
          return;
      }
      try {
          if (currentUser?.id) {
              // @ts-ignore - userService has custom method
              await (userService as any).updatePassword(String(currentUser.id), { password: passwordData.password });
              // Logout to force re-login with new credentials
              await logout();
          }
      } catch (err: any) {
          console.error('Password update error', err);
          alert(err.message || 'Failed to update password');
      }
  };

  // render password edit section conditionally
  const renderPasswordSection = () => {
      if (!isMyAccount) return null;
      
      if (!showPasswordEdit) {
          return (
              <Button type="button" variant="secondary" onClick={() => setShowPasswordEdit(true)} className="w-full sm:w-auto">
                  Change Password
              </Button>
          );
      }
      return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                      label="New Password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      required
                      className="flex-1"
                  />
                  <div className="flex gap-2 sm:pt-7">
                      <Button type="submit" variant="primary" className="flex-1 sm:flex-none">
                          Update Password
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => {setShowPasswordEdit(false); setPasswordData({ password: '', confirmPassword: '' });}} className="flex-1 sm:flex-none">
                          Cancel
                      </Button>
                  </div>
              </div>
              <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
              />
          </form>
      );
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    is_authorized: false,
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { fetchImage } = useImage();

  useEffect(() => {
    if (currentUser?.avatar) {
      fetchImage(currentUser.avatar as any).then((img) => {
        if (img?.url) setAvatarUrl(img.url);
      });
    } else {
      setAvatarUrl(null);
    }
  }, [currentUser?.avatar, fetchImage]);

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        is_authorized: currentUser.is_authorized ?? false,
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl dark:bg-slate-900/40 dark:border-slate-700/50">
        <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-300">
          <div className="p-4 bg-slate-100 rounded-full animate-pulse dark:bg-slate-800">
            <UserIcon size={32} className="opacity-50" />
          </div>
          <p className="font-medium text-lg tracking-tight">No user profile found</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData, avatarFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-y-auto max-h-screen bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-slate-700/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_50px_rgba(0,0,0,0.08)]">
      {}
      <div className="relative h-24 sm:h-32 md:h-44 w-full bg-linear-to-br from-brand/10 via-brand/5 to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="px-6 md:px-10 pb-8 md:pb-10 -mt-16 md:-mt-20 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-2 shadow-xl border border-slate-100/50 transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl dark:bg-slate-900/70 dark:border-slate-700/50">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-800/80 dark:bg-slate-900/80 flex items-center justify-center relative">
                   {}
                   <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <Camera className="text-white" size={28} />
                   </div>
                   <div className="w-full h-full opacity-0 absolute inset-0 z-20 cursor-pointer">
                      {!hideActions && (
                        <FileInput 
                          onChange={(file) => setAvatarFile(file)} 
                          placeholder=""
                        />
                      )}
                   </div>
                   {avatarFile ? (
                     <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                   ) : avatarUrl ? (
                     <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                       <UserIcon size={48} />
                     </div>
                   )}
                </div>
              </div>
                {!hideActions && (
                  <div className="absolute -bottom-3 -right-3 bg-brand text-white p-2.5 rounded-xl shadow-lg border-2 border-white transform transition-transform hover:scale-110 hover:rotate-12 cursor-pointer z-0 dark:border-slate-700/50">
                    <Edit3 size={18} />
                  </div>
                )}
            </div>

            <div className="flex-1 pb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                {formData.first_name || formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}`.trim() 
                  : "Profile Settings"}
                {formData.is_authorized && (
                  <span className="inline-flex items-center justify-center p-1 bg-emerald-100 text-emerald-600 rounded-full dark:bg-emerald-900/20 dark:text-emerald-300" title="Authorized">
                    <Shield size={20} className="fill-emerald-100" />
                  </span>
                )}
              </h2>
              <p className="text-slate-500 dark:text-slate-300 font-medium flex items-center gap-2 mt-2">
                <Mail size={16} className="text-brand/60" />
                {formData.email || "No email provided"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/50 shadow-sm dark:bg-slate-900/40 dark:border-slate-700/50">
            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-brand transition-colors">First Name</label>
              <div className="relative">
                <Input 
                  name="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange} 
                  required 
                  disabled={hideActions}
                  className="pl-10 bg-white/50 dark:bg-slate-900/60 border-transparent focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm focus:shadow-md"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-brand transition-colors">Last Name</label>
              <div className="relative">
                <Input 
                  name="last_name" 
                  value={formData.last_name} 
                  onChange={handleChange} 
                  required 
                  disabled={hideActions}
                  className="pl-10 bg-white/50 dark:bg-slate-900/60 border-transparent focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm focus:shadow-md"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              </div>
            </div>
            
            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-brand transition-colors">Username</label>
              <div className="relative">
                <Input 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  disabled={hideActions}
                  className="pl-10 bg-white/50 dark:bg-slate-900/60 border-transparent focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm focus:shadow-md"
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-brand transition-colors">Email Address</label>
              <div className="relative">
                <Input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  disabled={hideActions}
                  className="pl-10 bg-white/50 dark:bg-slate-900/60 border-transparent focus:bg-white dark:focus:bg-slate-950 transition-all shadow-sm focus:shadow-md"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between dark:bg-slate-900/50 dark:border-slate-700">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield size={18} className="text-slate-400" />
                Account Authorization
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Determine if this user has authorized access to the system.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                name="is_authorized" 
                checked={formData.is_authorized} 
                onChange={handleChange} 
                disabled={!authUser?.is_authorized || hideActions} 
                className="sr-only peer" 
              />
              <div className="w-14 h-8 bg-slate-200/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-brand peer-checked:to-brand/80 shadow-inner group-hover:shadow-md transition-all duration-300"></div>
            </label>
          </div>
          
          {isMyAccount && (
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
                Security
              </h4>
              {renderPasswordSection()}
            </div>
          )}

          {!hideActions && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
              <Button 
                type="button" 
                variant="danger" 
                onClick={onDelete}
                disabled={isLoading || !onDelete}
                className="w-full sm:w-auto bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border-red-100 shadow-none hover:shadow-red-500/20 px-6 py-3 rounded-2xl group transition-all duration-300"
              >
                <Trash2 size={18} className="group-hover:animate-bounce" />
                Delete Profile
              </Button>
              
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading}
                disabled={!onSave}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl shadow-brand/20 hover:shadow-brand/40 bg-linear-to-r from-brand to-brand/90 group transition-all duration-300"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

