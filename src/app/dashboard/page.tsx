"use client";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "@/hooks/useProject";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error } = useProject();
  const isProjectsEmpty = !loading && projects.length === 0;
  const router = useRouter();
  return (
    <ProtectedRoute>
      <div className="min-h-screen grid grid-cols-12 gap-4 bg-linear-to-br from-slate-50 to-slate-100">
        <div className="col-span-9">
          <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard, {user?.username}!</h1>
          {
            isProjectsEmpty ? (
              <div>
                <p className="text-lg text-gray-600">You don't have any projects yet.</p>
              </div>
            ) : (
              <div>
                <p className="text-lg text-gray-600">Here are your projects:</p>
                <div className="grid grid-cols-12 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="col-span-4">
                      <p>{project.name}</p>
                      <p>{project.description}</p>
                      <button onClick={() => router.push(`/dashboard/projects/${project.id}`)}>View project</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div>
      </div>
    </ProtectedRoute>
  );
}