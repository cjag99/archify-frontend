// Dynamic dashboard item page for viewing or editing a selected resource
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PatternView } from "@/components/organisms/PatternView";
import { ArchitectureView } from "@/components/organisms/ArchitectureView";
import { ProjectView } from "@/components/organisms/ProjectView";
import { ProfileView } from "@/components/organisms/ProfileView";
import { BackLink } from "@/components/atoms/BackLink";
import { userService } from "@/core/api/users.service";
import { useImage } from "@/hooks/useImage";
import { User } from "@/core/types/auth";
import { dashboardResourceList } from "@/lib/routes";
import { Briefcase } from "lucide-react";

export default function ResourceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const resource = typeof params?.resource === "string" ? params.resource : "";
    const id = typeof params?.id === "string" ? params.id : "";

    const [userDetail, setUserDetail] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const { createImage } = useImage();

    useEffect(() => {
        if (resource !== "users" || !id) return;

        let active = true;
        setUserLoading(true);
        setUserError(null);

        void userService
            .getById(id)
            .then((result) => {
                if (active) {
                    setUserDetail(result);
                }
            })
            .catch((err) => {
                if (active) {
                    setUserError(err instanceof Error ? err.message : "Unable to fetch user.");
                }
            })
            .finally(() => {
                if (active) {
                    setUserLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id, resource]);

    const handleUserSave = async (updatedData: Partial<User>, avatarFile?: File | null) => {
        if (!userDetail) return;

        setActionLoading(true);
        try {
            let avatarId: User["avatar"] = userDetail.avatar;
            if (avatarFile) {
                const imageRes = await createImage(avatarFile, "avatar");
                if (imageRes?.id) {
                    avatarId = imageRes.id as User["avatar"];
                }
            }

            const updatedUser = await userService.update(userDetail.id, {
                ...updatedData,
                avatar: avatarId,
            });

            setUserDetail(updatedUser);
        } catch (error) {
            console.error("Failed to update user", error);
            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    const handleUserDelete = async () => {
        if (!userDetail) return;

        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        setActionLoading(true);
        try {
            await userService.delete(userDetail.id);
            router.push("/admin/tables/users");
        } catch (error) {
            console.error("Failed to delete user", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (!id || !resource) {
        return (
            <ProtectedRoute>
                <div className="app-shell flex items-center justify-center p-6">
                    <p className="text-slate-500">Invalid resource parameters.</p>
                </div>
            </ProtectedRoute>
        );
    }

    if (resource === "patterns") {
        return (
            <ProtectedRoute>
                <PatternView patternId={id} />
            </ProtectedRoute>
        );
    }

    if (resource === "architectures") {
        return (
            <ProtectedRoute>
                <ArchitectureView architectureId={id} />
            </ProtectedRoute>
        );
    }

    if (resource === "projects") {
        return (
            <ProtectedRoute>
                <ProjectView projectId={id} />
            </ProtectedRoute>
        );
    }

    if (resource === "users") {
        return (
            <ProtectedRoute>
                <div className="app-shell p-6">
                    <div className="max-w-5xl mx-auto">
                        <ProfileView
                            user={userDetail ?? undefined}
                            onSave={handleUserSave}
                            onDelete={handleUserDelete}
                            isLoading={userLoading || actionLoading}
                        />
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const backHref = resource === "users" ? "/admin/tables/users" : dashboardResourceList(resource);

    return (
        <ProtectedRoute>
            <div className="app-shell flex flex-col items-center justify-center p-6">
                <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto px-6 w-full">
                    <div className="w-14 h-14 bg-brand/8 rounded-xl flex items-center justify-center text-brand mx-auto mb-6">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">View not available</h2>
                    <p className="text-slate-500 mb-6">
                        Detailed view for {resource} is currently under construction.
                    </p>
                    <BackLink href={backHref} label={`Volver a ${resource}`} />
                </div>
            </div>
        </ProtectedRoute>
    );
}

