"use client";
import { AdminNavBar } from "@/components/atoms/AdminNavBar";
import { useAuth } from "@/core/context/AuthContext";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function AdminPage() {
    const { user } = useAuth();
    return (
        <ProtectedRoute>
            <div className="min-h-screen grid grid-cols-12 gap-4 bg-linear-to-br from-slate-50 to-slate-100">
                <div className="col-span-3">
                    <AdminNavBar />
                </div>
                <div className="col-span-9">
                    <h1 className="text-4xl font-bold mb-4">Welcome to your Admin Dashboard, {user?.username}!</h1>
                    <p className="text-lg text-gray-600">This is a protected page that only authenticated users can access.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}