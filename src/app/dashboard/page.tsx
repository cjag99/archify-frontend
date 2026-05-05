import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Panel de Control Privado</h1>
      <p>Solo tú puedes ver esto.</p>
    </ProtectedRoute>
  );
}