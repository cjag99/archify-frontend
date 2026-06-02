// User profile page for viewing and editing account details
"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { ProfileView } from "@/components/organisms/ProfileView";
import { useAuth } from "@/core/context/AuthContext";
import { userService } from "@/core/api/users.service";
import { useImage } from "@/hooks/useImage";
import { User } from "@/core/types/auth";
import Cookies from "js-cookie";
import { UUID } from "crypto";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { createImage } = useImage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (updatedData: Partial<User>, avatarFile?: File | null) => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      let avatarId = user.avatar;
      

      if (avatarFile) {
        const imageRes = await createImage(avatarFile, "avatar");
        if (imageRes?.id) {
          avatarId = imageRes.id as UUID;
        }
      }


      const updatedUser = await userService.update(user.id, {
        ...updatedData,
        avatar: avatarId
      });


      Cookies.set("user_data", JSON.stringify(updatedUser), {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });
      

      window.location.reload();
      
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        await userService.delete(user.id);
        await logout();
      } catch (error) {
        console.error("Failed to delete profile", error);
        alert("Failed to delete profile. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <ProtectedRoute>
        {user ? (
          <ProfileView 
            user={user} 
            onSave={handleSave} 
            onDelete={handleDelete} 
            isLoading={isLoading}
          />
        ) : null}
    </ProtectedRoute>
  );
}

