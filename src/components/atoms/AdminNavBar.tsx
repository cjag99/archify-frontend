import { FC } from "react";
import { AdminMenu } from "../molecules/AdminMenu";

export const AdminNavBar: FC = () => {
    return (
        <div className="w-max h-full">
            <div className="max-w-7xl py-4 flex items-center justify-between">
                <AdminMenu />
            </div>
        </div>
    );
};