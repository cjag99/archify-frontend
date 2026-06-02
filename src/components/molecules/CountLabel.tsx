// Composite UI component used by views and forms for CountLabel
import type { FC } from "react";
import { CountBadge } from "../atoms/CountBadge";

export const CountLabel: FC<{
    label: string;
    count: number;
}> = ({ label, count }) => {
    return (
        <div className="w-full sm:max-w-xs md:max-w-sm flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-sm uppercase text-slate-500 dark:text-slate-400 font-bold">
                Total {label.replace(/Your\s+/i, "")}
            </span>
            <CountBadge count={count} />
        </div>
    );
};

