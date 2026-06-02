// Custom React hook for useCodeLanguage state and behavior
"use client";

import { useCallback, useEffect, useState } from "react";
import { useImage } from "@/hooks/useImage";
import { CodeLanguage, ImageType } from "@/core/types/models";
import { codeLanguageService } from "@/core/api/code-languages.service";

interface UseCodeLanguageOptions {
    autoFetch?: boolean;
    logErrors?: boolean;
}

export const useCodeLanguage = ({
    autoFetch = true,
    logErrors = true,
}: UseCodeLanguageOptions = {}) => {
    const { fetchImage } = useImage();
    const [codeLanguage, setCodeLanguage] = useState<CodeLanguage | null>(null);
    const [codeLanguages, setCodeLanguages] = useState<CodeLanguage[]>([]);
    const [codeLogo, setCodeLogo] = useState<ImageType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCodeLanguage = useCallback(async (id: string): Promise<CodeLanguage | null> => {
        setLoading(true);
        setError(null);
        setCodeLogo(null);

        try {
            const result = await codeLanguageService.getById(id);
            setCodeLanguage(result);

            if (result.icon) {
                const fetchedImage = await fetchImage(result.icon);
                setCodeLogo(fetchedImage ?? null);
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            if (logErrors) {
                console.error("Fetch error:", err);
            }
            setCodeLanguage(null);
            setCodeLogo(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchImage, logErrors]);

    const fetchCodeLanguages = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await codeLanguageService.getAll();
            setCodeLanguages(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            if (logErrors) {
                console.error("Fetch error:", err);
            }
            setCodeLanguages([]);
        } finally {
            setLoading(false);
        }
    }, [logErrors]);

    const createCodeLanguage = useCallback(async (name: string, file_extension: string, icon?: string | null) => {
        setLoading(true);
        setError(null);

        const payload = {
            name,
            file_extension,
            icon: icon ?? null,
        };

        try {
            const result = await codeLanguageService.create(payload);
            setCodeLanguages((prevCodeLanguages) => [...prevCodeLanguages, result]);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Create error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCodeLanguage = useCallback(async (id: string, name: string, file_extension: string, icon?: string | null) => {
        setLoading(true);
        setError(null);

        const payload: Partial<CodeLanguage> = {
            name,
            file_extension,
            icon: icon ? (icon as CodeLanguage["icon"]) : undefined,
        };

        try {
            const result = await codeLanguageService.update(id, payload);
            setCodeLanguages((prevCodeLanguages) =>
                prevCodeLanguages.map((language) =>
                    String(language.id) === String(id) ? result : language
                )
            );
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Update error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const dropCodeLanguage = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await codeLanguageService.delete(id);
            setCodeLanguages((prevCodeLanguages) => prevCodeLanguages.filter(cl => cl.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Delete error:", err);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadCodeLanguages = async () => {
            if (!autoFetch) {
                setLoading(false);
                return;
            }

            await fetchCodeLanguages();
            if (!isMounted) {
                return;
            }
        };

        void loadCodeLanguages();

        return () => {
            isMounted = false;
        };
    }, [autoFetch, fetchCodeLanguages]);

    return {
        codeLanguage,
        codeLanguages,
        codeLogo,
        loading,
        error,
        fetchCodeLanguage,
        fetchCodeLanguages,
        createCodeLanguage,
        updateCodeLanguage,
        dropCodeLanguage,
    };
};

