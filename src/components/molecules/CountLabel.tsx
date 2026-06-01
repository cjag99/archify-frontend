import type { FC } from "react";
import { CountBadge } from "../atoms/CountBadge";

export const CountLabel: FC<{
    label: string;
    count: number;
}> = ({ label, count }) => {
    return (
        <div className="w-full sm:w-90 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-sm uppercase text-slate-500 dark:text-slate-400 font-bold">
                Total {label.replace(/Your\s+/i, "")}
            </span>
            <CountBadge count={count} />
        </div>
    );
};
