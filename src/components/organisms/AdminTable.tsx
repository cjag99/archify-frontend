"use client";
import { FC, useState } from "react";
import { useAdminTable } from "@/hooks/useAdminTable";
import { useParams } from "next/navigation";
import { EmptyTable } from "./EmptyTable";
import { Button } from "@/components/atoms/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { CodeLanguageForm } from "./CodeLanguageForm";
import { DeleteModal } from "./DeleteModal";
import { NoTableSelected } from "@/components/molecules/NoTableSelected";

export const AdminTable: FC = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    // 💡 Estado extra para saber qué item estamos editando/borrando sin duplicar componentes
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);
    
    const { tablename } = useParams();
    const { data, loading, error, currentTable, dropData, refreshData } = useAdminTable(tablename as string);
    
    let columns: string[] = [];
    type TableRow = { item: Record<string, unknown>; values: unknown[] };
    let rows: TableRow[] = [];

    // ✨ Si no hay tabla seleccionada, mostrar componente
    if (!tablename) {
        return <NoTableSelected />;
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-48 animate-pulse" />
                <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
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
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-slate-100 capitalize mb-1 md:mb-2 truncate">
                            {`${currentTable} Directory`}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-slate-100 capitalize mb-1 md:mb-2 truncate">
                        {`${currentTable} Directory`}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                        View and manage {currentTable} records in the system.
                    </p>
                </div>
                
                <Button
                    onClick={() => setModalType(`${singularTable}-create`)}
                    variant="success"
                    className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start flex-shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden md:inline">New {singularTable.replace("-", " ")}</span>
                    <span className="md:hidden">New</span>
                </Button>
            </div>

            {/* ✨ ÚNICO CONTENEDOR DE MODALES GLOBAL (Fuera de las listas) */}
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

            <div className="space-y-2 md:space-y-3">
                <ul className="space-y-2 md:space-y-3">
                    {rows.map((row: TableRow, i: number) => {
                        // Determinar el campo a mostrar según la tabla
                        let displayField = "name";
                        if (currentTable === "images") displayField = "file_name";
                        else if (currentTable === "users") displayField = "username";
                        
                        const itemName = (row.item[displayField] as string) || `Item ${i + 1}`;

                        return (
                            <li
                                key={i}
                                onClick={() => {
                                    // Click en el li abre la vista (sin implementar por ahora)
                                    console.log("Open view for:", row.item);
                                }}
                                className="group flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 truncate flex-1 pr-4">
                                    {itemName}
                                </span>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Mobile: Solo iconos */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-edit`);
                                        }}
                                        className="md:hidden p-1.5 text-slate-500 hover:text-brand hover:bg-brand/10 dark:hover:bg-brand/20 rounded-lg transition-all active:scale-95"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-delete`);
                                        }}
                                        className="md:hidden p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-95"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Desktop: Botones con texto */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-edit`);
                                        }}
                                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-all active:scale-95 flex-shrink-0"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(row.item);
                                            setModalType(`${singularTable}-delete`);
                                        }}
                                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-semibold text-xs rounded-lg transition-all active:scale-95 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
