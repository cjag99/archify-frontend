"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { AdminProtectedRoute } from "@/components/organisms/AdminProtectedRoute";

export default function TableLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProtectedRoute>
            <div className="min-h-screen grid grid-cols-12 gap-4 bg-linear-to-br from-slate-50 to-slate-100">
                <div className="col-span-3">
                    <AdminNavBar />
                </div>
                <div className="col-span-9">
                    {children}
                </div>
            </div>
        </AdminProtectedRoute>
    );
}