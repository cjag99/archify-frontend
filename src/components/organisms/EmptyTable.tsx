"use client";

import { FC } from "react";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface EmptyTableProps {
    label?: string;
    onClick?: () => void;
}

export const EmptyTable: FC<EmptyTableProps> = ({ label, onClick }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl max-w-xl mx-auto px-6">
            <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mb-6">
                <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No records found</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-center text-sm leading-relaxed mb-6">
                This table is currently empty or couldn't be loaded. Check back later or add records in the console.
            </p>
            {onClick && (
                <Button
                    onClick={onClick}
                    variant="success"
                    className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                    <Plus className="w-5 h-5" />
                    New {label || "record"}
                </Button>
            )}
        </div>
    );
}