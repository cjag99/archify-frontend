"use client";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";
import { CodeLanguageForm } from "@/components/organisms/CodeLanguageForm";
export default function TablePage() {
    return (
        <ProtectedRoute>
            <AdminTable />
            <CodeLanguageForm />
        </ProtectedRoute>
    );
}