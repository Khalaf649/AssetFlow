"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { AdminManagerView } from "./components/AdminManagerView";
import { DeveloperView } from "./components/DeveloperView";

export default function DashboardPage() {
  const { user } = useAuth();

  // ProtectedLayout guarantees user is non-null
  if (!user) return null;

  const isStaff = user.role === "ADMIN" || user.role === "MANAGER";

  return isStaff ? <AdminManagerView /> : <DeveloperView />;
}
