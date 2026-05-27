"use client";

import { useState, useCallback, useEffect } from "react";
import { Architecture } from "@/core/types/models";
import { architectureService } from "@/core/api/architectures.service";

export const useArchitecture = () => {
    const [architectures, setArchitectures] = useState<Architecture[]>([]);
    const [architecture, setArchitecture] = useState<Architecture | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArchitectures = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await architectureService.getAll();
            setArchitectures(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setArchitectures([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchArchitecture = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await architectureService.getById(id);
            setArchitecture(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setArchitecture(null);
        }
        finally {
            setLoading(false);
        }
    }, []);

    const createArchitecture = useCallback(async (payload: { name: string; description?: string; enabled?: boolean; schema: JSON }) => {
        setLoading(true);
        setError(null);
        try {
            const result = await architectureService.create(payload);
            setArchitecture(result);
            await fetchArchitectures();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [fetchArchitectures]);

    useEffect(() => {
        let isMounted = true;
        const loadArchitectures = async () => {
            await fetchArchitectures();
            if (!isMounted) {
                return;
            }
        };
        void loadArchitectures();
        return () => {
            isMounted = false;
        };
    }, [fetchArchitectures]);


    return {
        architectures,
        architecture,
        loading,
        error,
        fetchArchitectures,
        fetchArchitecture,
        createArchitecture,
    };
};
