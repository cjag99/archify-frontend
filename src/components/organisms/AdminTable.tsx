"use client";
import { FC } from "react";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useParams } from "next/navigation";
import { Button } from "../atoms/Button";

export const AdminTable: FC = () => {
    const { tablename } = useParams();
    const { data, loading, error, currentTable } = useAdminTable(tablename as string);
    let columns: string[] = [];
    let rows: any[] = [];

    if (loading) return <div className="text-center p-10">Cargando datos...</div>;
    if (error) return <div className="text-red-500 p-10">Error: {error}</div>;
    if (!data || data.length === 0) return <div className="text-center p-10">No hay datos disponibles para la tabla {currentTable}.</div>;
    columns = Object.keys(data[0]);
    rows = data.map((item: any) => Object.values(item));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 capitalize">{`${currentTable} Table`}</h1>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col: string, i: number) => (
                                <th key={i} className="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {col.replace("_", " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row: any[], i: number) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                {row.map((cell: any, j: number) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cell?.toString() || "-"}
                                        {
                                            j === row.length - 1 &&
                                            <div className="flex gap-2">
                                                <button onClick={() => console.log("Editar")} className="text-blue-500 hover:text-blue-700">Editar</button>
                                                <button onClick={() => console.log("Eliminar")} className="text-red-500 hover:text-red-700">Eliminar</button>
                                            </div>
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}