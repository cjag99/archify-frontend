"use client";
import { AdminNavBar } from "@/components/organisms/AdminNavBar";
import { AdminProtectedRoute } from "@/components/organisms/AdminProtectedRoute";

export default function TableLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProtectedRoute>
            <div className="min-h-screen grid grid-cols-12 gap-2 md:gap-5 py-4 md:py-6">
                <div className="col-span-12 md:col-span-3">
                    <div className="w-[90vw] max-w-[90vw] mx-auto md:w-full md:max-w-none mt-5 mb-4 md:mt-0 md:mb-0">
                        <AdminNavBar />
                    </div>
                </div>
                <div className="col-span-12 md:col-span-9">
                    {children}
                </div>
            </div>
        </AdminProtectedRoute>
    );
}