"use client";

import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <AdminNavBar />
            {children}
        </ProtectedRoute>
    );
}