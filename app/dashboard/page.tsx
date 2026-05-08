"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { AdminManagerView } from "./components/AdminManagerView";
import { DeveloperView } from "./components/DeveloperView";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock user for frontend testing (when no backend is available)
  const mockUser = {
    id: "dev-user-1",
    name: "Developer",
    role: "DEVELOPER" as const,
  };

  const currentUser = user || mockUser;

  const isStaff =
    currentUser.role === "ADMIN" || currentUser.role === "MANAGER";

  if (!isStaff) {
    return <DeveloperView />;
  }

  return <AdminManagerView />;
}
