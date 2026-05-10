"use client";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { useAuth } from "@/core/context/AuthContext";
export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard, {user?.username}!</h1>
        <p className="text-lg text-gray-600">This is a protected page that only authenticated users can access.</p>
      </div>
    </ProtectedRoute>
  );
}