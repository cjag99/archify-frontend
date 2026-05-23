"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";


export default function AdminPage() {

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <AdminNavBar />
                    </aside>
                    <main className="flex-1">
                        <AdminTable />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}