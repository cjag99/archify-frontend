"use client";

import { useState, useEffect, useCallback } from "react";
import { patternService, PatternCreatePayload } from "../core/api/patterns.service";
import { Pattern } from "../core/types/models";

export const usePatterns = () => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPatterns = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        setError(null);

        try {
            const result = await patternService.getAll({ signal });
            setPatterns(result);
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setPatterns([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPattern = useCallback(async (payload: PatternCreatePayload): Promise<Pattern | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const newPattern = await patternService.create(payload);
            setPatterns((prev) => [...prev, newPattern]);
            return newPattern;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Create error:", err);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchPatterns(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchPatterns]);

    const fetchPatternById = useCallback(async (id: string, signal?: AbortSignal) => {
        setLoading(true);
        setError(null);

        try {
            const result = await patternService.getById(id);
            return result;
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return undefined;
            }

            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch by id error:", err);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, []);

    return { patterns, loading, error, fetchPatterns, fetchPatternById, createPattern };
};