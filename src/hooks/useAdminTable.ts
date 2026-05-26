"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/core/api/users.service";
import { projectService } from "@/core/api/projects.service";
import { architectureService } from "@/core/api/architectures.service";
import { patternService } from "@/core/api/patterns.service";
import { codeLanguageService } from "@/core/api/code-languages.service";
import { patternCodeService } from "@/core/api/patterns-code.service";
import { imageService } from "@/core/api/images.service";

import { CrudService } from "@/core/api/crud.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const servicesMap: Record<string, CrudService<any>> = {
    "users": userService,
    "projects": projectService,
    "architectures": architectureService,
    "patterns": patternService,
    "code-languages": codeLanguageService,
    "patterns-code": patternCodeService,
    "images": imageService,
};

export const useAdminTable = (tableName?: string) => {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!tableName) return;
        const service = servicesMap[tableName];
        if (!service) {
            setError(`No service found for table: ${tableName}`);
            setLoading(false);
            return;
        }

        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });

        try {
            const result = await service.getAll();
            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [tableName]);

    const changeTable = (table: string) => {
        router.push(`/admin/tables/${table}`);
    };

    const dropData = async (id: string | number) => {
        if (!tableName) return;
        const service = servicesMap[tableName];
        if (!service) {
            setError(`No service found for table: ${tableName}`);
            return;
        }

        try {
            await service.delete(id);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Delete error:", err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    return { currentTable: tableName, changeTable, data, loading, error, dropData, refreshData: fetchData };
}