"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useAdminTable = () => {
    const apiRoutes = [
        "users",
        "patterns",
        "architectures",
        "projects",
        "images",
        "code_languages",
        "pattern_codes"
    ];
    const [currentTable, setCurrentTable] = useState(apiRoutes[0]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/${currentTable}`, {
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
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    const changeTable = (table: string) => {
        if (table === currentTable) return;
        setCurrentTable(table);
    };

    useEffect(() => {
        fetchData();
    }, [currentTable]);

    return { currentTable, changeTable, data, loading, error };
}