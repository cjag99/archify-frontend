"use client";
import { ReactNode } from "react";

interface NodeButtonProps {
    onclick: () => void;
    icon: ReactNode;
    label: string;
    description: string;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const NodeButton: React.FC<NodeButtonProps> = ({ onclick, icon, label, description, onDragStart }) => {
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg cursor-pointer hover:bg-slate-100/80"
            onClick={onclick}
            onDragStart={onDragStart}
            draggable = {!!onDragStart}
        >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    );
};