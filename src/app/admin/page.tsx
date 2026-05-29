"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { AdminProtectedRoute } from "@/components/organisms/AdminProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";


export default function AdminPage() {

    return (
        <AdminProtectedRoute>
            <div className="app-shell">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <AdminNavBar />
                    </aside>
                    <main className="flex-1">
                        <AdminTable />
                    </main>
                </div>
            </div>
        </AdminProtectedRoute>
    );
}
