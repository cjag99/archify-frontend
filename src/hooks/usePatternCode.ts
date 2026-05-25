"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { patternCodeService, CodeSnippetCreatePayload } from "../core/api/patterns-code.service";

export const usePatternCode = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [codeSnippet, setCodeSnippet] = useState<CodeSnippetCreatePayload | null>(null);

    const createCodeSnippet = useCallback(async (payload: CodeSnippetCreatePayload) => {
        if (!user) return;
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });

        try {
            const result = await patternCodeService.create(payload);
            setCodeSnippet(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Create error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchCodeSnippet = useCallback(async (patternId: string, codeId: string) => {
        if (!user) return;
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });

        try {
            const result = await patternCodeService.getByIds([patternId, codeId]);
            setCodeSnippet(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    return { codeSnippet, loading, error, createCodeSnippet, fetchCodeSnippet };
};