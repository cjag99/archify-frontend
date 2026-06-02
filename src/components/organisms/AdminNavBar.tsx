// Page-level UI component that renders the AdminNavBar interface
import { FC } from "react";
import { AdminMenu } from "../molecules/AdminMenu";

export const AdminNavBar: FC = () => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center md:justify-start w-full">
                <div className="w-full">
                    <AdminMenu />
                </div>
            </div>
        </div>
    );
};