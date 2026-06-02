// Reusable atom UI component for CountBadge
import type { FC } from "react";

export const CountBadge: FC<{ count: number }> = ({ count }) => {
    return (
        <div className="refraction-gradient-hover text-white px-3 py-2 rounded-lg font-semibold">
            {count}
        </div>
    );
};