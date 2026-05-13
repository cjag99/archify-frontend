"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const useAdminTable = (tableName?: string) => {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!tableName) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/${tableName}`, {
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
            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            console.error("Fetch error:", err);
            setData([]); // Reset data on error
        } finally {
            setLoading(false);
        }
    }

    const changeTable = (table: string) => {
        router.push(`/admin/tables/${table}`);
    };

    useEffect(() => {
        fetchData();
    }, [tableName]);

    return { currentTable: tableName, changeTable, data, loading, error };
}