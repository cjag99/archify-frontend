import type { FC } from "react";
import { CountBadge } from "../atoms/CountBadge";

export const CountLabel: FC<{
    label: string;
    count: number;
}> = ({ label, count }) => {
    return (
        <div className="w-90 flex justify-between items-center border-b border-slate-100">
            <span className="text-xl uppercase tracking-wider text-slate-500 font-bold"> TOTAL {label}</span>
            <CountBadge count={count} />
        </div>
    );
};
