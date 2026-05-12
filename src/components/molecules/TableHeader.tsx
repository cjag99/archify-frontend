"use client";

import { useAdminTable } from "@/hooks/useAdminTable";
import { FC } from "react";

export const TableHeader: FC = () => {
    const { data, loading, error } = useAdminTable();
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (data.length === 0) return <div>No data</div>;

    const columns: string[] = Object.keys(data[0]);
    return (
        <>
            {columns.map((col) => (
                <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md" >
                    <h1 className="text-4xl font-bold mb-4">{col}</h1>
                </div>
            ))}
        </>
    );
}