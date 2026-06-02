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

    const fetchProjectById = useCallback(async (id: string): Promise<Project | null> => {
        try {
            const result = await projectService.getById(id);
            return result || null;
        } catch (err) {
            console.error("Error fetching project by ID:", err);
            return null;
        }
    }, []);

    const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project | null> => {
        try {
            console.log("Updating project payload:", data);
            const result = await projectService.update(id, data);
            return result || null;
        } catch (err) {
            console.error("Error updating project:", err);
            throw err;
        }
    }, []);

    const deleteProject = useCallback(async (id: string): Promise<boolean> => {
        try {
            await projectService.delete(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (err) {
            console.error("Error deleting project:", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProjects();
    }, [fetchProjects]);

    return { 
        projects, 
        loading, 
        error, 
        fetchProjectById, 
        updateProject, 
        deleteProject 
    };
}