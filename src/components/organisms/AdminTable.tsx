"use client";
import { FC } from "react";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useParams } from "next/navigation";
import { EmptyTable } from "./EmptyTable";

export const AdminTable: FC = () => {
    const { tablename } = useParams();
    const { data, loading, error, currentTable } = useAdminTable(tablename as string);
    let columns: string[] = [];
    let rows: any[] = [];

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-slate-100 rounded w-48 animate-pulse" />
                <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
        );
    }
    
    if (error) return <EmptyTable />;
    if (!data || data.length === 0) return <EmptyTable />;
    columns = Object.keys(data[0]);
    rows = data.map((item: any) => Object.values(item));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize mb-2">
                        {`${currentTable} Directory`}
                    </h1>
                    <p className="text-sm text-slate-500">
                        View and manage {currentTable} records in the system.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {columns.map((col: string, i: number) => (
                                    <th key={i} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {col.replace("_", " ")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row: any[], i: number) => (
                                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                    {row.map((cell: any, j: number) => (
                                        <td key={j} className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {j === row.length - 1 ? (
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="truncate max-w-[150px]">{cell?.toString() || "-"}</span>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button 
                                                            onClick={() => console.log("Editar")} 
                                                            className="text-xs font-semibold bg-slate-50 hover:bg-brand/10 hover:text-brand text-slate-600 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => console.log("Eliminar")} 
                                                            className="text-xs font-semibold bg-red-50 hover:bg-red-500 hover:text-white text-red-600 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="truncate max-w-[200px] block">
                                                    {cell?.toString() || "-"}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}