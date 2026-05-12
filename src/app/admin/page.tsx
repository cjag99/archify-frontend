"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";
import { useAuth } from "@/core/context/AuthContext";

export default function AdminPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen grid grid-cols-12 gap-4 bg-linear-to-br from-slate-50 to-slate-100">
                <div className="col-span-3">
                    <AdminNavBar />
                </div>
                <div className="col-span-9">
                    <AdminTable />
                </div>
            </div>
        </ProtectedRoute>
    );
}