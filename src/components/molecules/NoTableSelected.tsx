"use client";

import { FC } from "react";
import { Button } from "@/components/atoms/Button";
import { Database } from "lucide-react";
import { useRouter } from "next/navigation";

export const NoTableSelected: FC = () => {
    const router = useRouter();

    const handleNavigate = () => {
        router.push("/admin/tables/users");
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-24 rounded-2xl max-w-2xl mx-auto px-4 md:px-6 border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4 md:mb-6">
                <Database className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-100 mb-2 md:mb-3 text-center">
                No table selected yet!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-center text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                To get started, select one of the available tables from the left panel (like Users or Projects).
            </p>
            <Button
                onClick={handleNavigate}
                variant="success"
                className="flex items-center gap-2"
            >
                Browse tables
            </Button>
        </div>
    );
};
