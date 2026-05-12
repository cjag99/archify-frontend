"use client";
import { FC } from "react";
import { TableHeader } from "../molecules/TableHeader";

export const AdminTable: FC = () => {
    return (
        <>
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md" >
                <TableHeader />
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md" >
                <h1>Admin Table</h1>
            </div>
        </>
    );
}