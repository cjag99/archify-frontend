"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";

export const useProject = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/projects/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("auth_token")}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            setProjects(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, [user]);

    return { projects, loading, error };
}