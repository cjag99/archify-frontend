"use client";
import { FC, useState } from "react";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useParams } from "next/navigation";
import { EmptyTable } from "./EmptyTable";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import Modal from "./Modal";
import { CodeLanguageForm } from "./CodeLanguageForm";
import { DeleteModal } from "./DeleteModal";

export const AdminTable: FC = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    // 💡 Estado extra para saber qué item estamos editando/borrando sin duplicar componentes
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);
    
    const { tablename } = useParams();
    const { data, loading, error, currentTable, dropData, refreshData } = useAdminTable(tablename as string);
    
    let columns: string[] = [];
    type TableRow = { item: Record<string, unknown>; values: unknown[] };
    let rows: TableRow[] = [];

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-slate-100 rounded w-48 animate-pulse" />
                <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    // 💡 Normalizamos reemplazando guiones bajos por guiones medios para curarnos en salud
    const singularTable = currentTable 
        ? currentTable.toLowerCase().replace(/s$/, "").replace("_", "-") 
        : "";
    
    if (error) return <EmptyTable />;
    
    if (!data || data.length === 0) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-950 capitalize mb-2">
                            {`${currentTable} Directory`}
                        </h1>
                        <p className="text-sm text-slate-500">
                            View and manage {currentTable} records in the system.
                        </p>
                    </div>
                </div>
                <EmptyTable 
                    label={singularTable} 
                    onClick={() => setModalType(`${singularTable}-create`)} 
                />
            </div>
        );
    }

    columns = Object.keys(data[0] as Record<string, unknown>);
    rows = (data as Record<string, unknown>[]).map((item) => ({
        item,
        values: Object.values(item),
    }));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-950 capitalize mb-2">
                        {`${currentTable} Directory`}
                    </h1>
                    <p className="text-sm text-slate-500">
                        View and manage {currentTable} records in the system.
                    </p>
                </div>
                
                <Button
                    onClick={() => setModalType(`${singularTable}-create`)}
                    variant="success"
                    className="flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New {singularTable.replace("-", " ")}
                </Button>
            </div>

            {/* ✨ ÚNICO CONTENEDOR DE MODALES GLOBAL (Fuera de las tablas) */}
            <Modal isOpen={modalType !== null} onClose={closeModal}>
                {modalType === "code-language-create" && (
                    <CodeLanguageForm
                        onCreated={async () => {
                            await refreshData();
                            closeModal();
                        }}
                    />
                )}
                
                {modalType === `${singularTable}-delete` && selectedItem && (
                    <DeleteModal
                        id={String(selectedItem.id)}
                        onConfirm={async () => {
                            await dropData(selectedItem.id as string | number);
                            closeModal();
                        }}
                        onClose={closeModal}
                    />
                )}
            </Modal>

            <div className="overflow-hidden glass-card rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {columns.map((col: string, i: number) => (
                                    <th key={i} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                        {col.replace("_", " ")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row: TableRow, i: number) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                    {row.values.map((cell: unknown, j: number) => (
                                        <td key={j} className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {j === row.values.length - 1 ? (
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="truncate max-w-37.5">
                                                        {cell === null || cell === undefined ? "-" : String(cell)}
                                                    </span>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedItem(row.item);
                                                                setModalType(`${singularTable}-edit`);
                                                            }} 
                                                            className="text-xs font-semibold bg-slate-50 hover:bg-brand/10 hover:text-brand text-slate-600 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedItem(row.item); // Guardamos el elemento que queremos borrar
                                                                setModalType(`${singularTable}-delete`);
                                                            }} 
                                                            className="text-xs font-semibold bg-red-50 hover:bg-red-500 hover:text-white text-red-600 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="truncate max-w-50 block">
                                                    {cell === null || cell === undefined ? "-" : String(cell)}
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
};
