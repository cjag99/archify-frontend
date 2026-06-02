// Admin landing page for managing application data
"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { AdminProtectedRoute } from "@/components/organisms/AdminProtectedRoute";
import { AdminTable } from "@/components/organisms/AdminTable";


export default function AdminPage() {

    return (
        <AdminProtectedRoute>
            <div className="app-shell">
                <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-6">
                    {}
                    <div className="block md:hidden w-full flex justify-center mt-5 mb-4">
                        <div className="w-[90vw] max-w-[90vw] mx-auto">
                            <AdminNavBar />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                        <aside className="hidden md:block md:w-64 shrink-0 order-1 md:order-1">
                            <AdminNavBar />
                        </aside>
                        <main className="flex-1 order-2 md:order-2 min-w-0">
                            <AdminTable />
                        </main>
                    </div>
                </div>
            </div>
        </AdminProtectedRoute>
    );
}


