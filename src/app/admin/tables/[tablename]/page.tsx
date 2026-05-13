"use client";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";
export default function TablePage() {
    return (
        <ProtectedRoute>
            <AdminTable />
        </ProtectedRoute>
    );
}