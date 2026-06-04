import { CrudService } from "./crud.service";
import { User } from "@/core/types/auth";
import { apiClient } from "./apiClient";

export const userService = new CrudService<User>('users');

// Admin update that includes target_user_id query parameter
export const updateUserAdmin = (id: string, data: Partial<User>) => {
  const endpoint = `/users/${id}?target_user_id=${encodeURIComponent(id)}`;
  return apiClient.patch<User>(endpoint, data);
};
// Update password for a specific user
(userService as any).updatePassword = (id: string, data: { password: string }) => apiClient.patch<void>(`/users/${id}/password`, data);

