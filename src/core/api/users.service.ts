import { CrudService } from "./crud.service";
import { User } from "@/core/types/auth";
import { apiClient } from "./apiClient";

export const userService = new CrudService<User>('users');
// Update password for a specific user
(userService as any).updatePassword = (id: string, data: { password: string }) => apiClient.patch<void>(`/users/${id}/password`, data);

