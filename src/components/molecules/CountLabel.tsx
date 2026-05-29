import type { FC } from "react";
import { CountBadge } from "../atoms/CountBadge";

export const CountLabel: FC<{
    label: string;
    count: number;
}> = ({ label, count }) => {
    return (
        <div className="w-full sm:w-90 flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-sm uppercase text-slate-500 font-bold">Total {label}</span>
            <CountBadge count={count} />
        </div>
    );
};
