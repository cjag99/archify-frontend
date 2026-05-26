"use client";

import { useCallback, useEffect, useState } from "react";
import { useImage } from "@/hooks/useImage";
import { CodeLanguage, ImageType } from "@/core/types/models";
import { codeLanguageService } from "@/core/api/code-languages.service";

export const useCodeLanguage = () => {
    const { fetchImage } = useImage();
    const [codeLanguage, setCodeLanguage] = useState<CodeLanguage | null>(null);
    const [codeLanguages, setCodeLanguages] = useState<CodeLanguage[]>([]);
    const [codeLogo, setCodeLogo] = useState<ImageType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCodeLanguage = useCallback(async (id: string) => {
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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setCodeLanguage(null);
            setCodeLogo(null);
        } finally {
            setLoading(false);
        }
    }, [fetchImage]);

    const fetchCodeLanguages = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await codeLanguageService.getAll();
            setCodeLanguages(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setCodeLanguages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCodeLanguage = useCallback(async (name: string, file_extension: string, icon: string) => {
        setLoading(true);
        setError(null);

        const payload = {
            name,
            file_extension,
            icon: icon || null,
        };

        try {
            const result = await codeLanguageService.create(payload);
            setCodeLanguages((prevCodeLanguages) => [...prevCodeLanguages, result]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Create error:", err);
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
            await fetchCodeLanguages();
            if (!isMounted) {
                return;
            }
        };

        void loadCodeLanguages();

        return () => {
            isMounted = false;
        };
    }, [fetchCodeLanguages]);

    return {
        codeLanguage,
        codeLanguages,
        codeLogo,
        loading,
        error,
        fetchCodeLanguage,
        createCodeLanguage,
        dropCodeLanguage,
    };
};