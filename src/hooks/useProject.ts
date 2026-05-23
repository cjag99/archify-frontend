"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { projectService } from "@/core/api/projects.service";
import { Project } from "@/core/types/models";

export const useProject = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        if (!user) return;
        // Defer updates to avoid calling setState synchronously during effect rendering phase
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });

        try {
            const result = await projectService.getAll();
            setProjects(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error };
}