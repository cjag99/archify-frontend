// Page-level UI component that renders the EmptyTable interface
"use client";

import { FC, useState } from "react";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import Modal from "./Modal";
import { CodeLanguageForm } from "./CodeLanguageForm";
import { useRouter } from "next/navigation";

interface EmptyTableProps {
    label?: string;
    onClick?: () => void;
}

export const EmptyTable: FC<EmptyTableProps> = ({ label, onClick }) => {
    const router = useRouter();
    const [modalType, setModalType] = useState<string | null>(null);
    const closeModal = () => setModalType(null);
    const handleClick = () => {
        if (label === "project" || label === "pattern" || label === "architecture") {
            const resource =
                label === "project"
                    ? "projects"
                    : label === "pattern"
                      ? "patterns"
                      : "architectures";
            router.push(`/dashboard/${resource}/new`);
            return;
        }

        if (onClick) {
            onClick();
            return;
        }

        setModalType(label || "record");
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl max-w-xl mx-auto px-6 border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <div className="w-14 h-14 bg-brand/10 dark:bg-brand/20 rounded-xl flex items-center justify-center text-brand mb-6">
                <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-slate-100 mb-2">No records found</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-center text-sm leading-relaxed mb-6">
                This table is currently empty or couldnt be loaded. Check back later or add records in the console.
            </p>

            {onClick && label !== "image" && (
                <>
                    <Button
                        onClick={() => handleClick()}
                        variant="success"
                        className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        New {label || "record"}
                    </Button>
                    <Modal isOpen={modalType !== null} onClose={closeModal}>
                        {modalType === "code-language" ? (
                            <CodeLanguageForm />
                        ) : (
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">Crear {label || "registro"}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Todavía no hay formulario de creación para esta tabla.
                                </p>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
}

