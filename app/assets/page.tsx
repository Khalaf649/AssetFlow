"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { AdminAssetView } from "./components/AdminAssetView";
import { DeveloperAssetView } from "./components/DeveloperAssetView";

export default function AssetsPage() {
  const { user } = useAuth();

  const mockUser = {
    id: "dev-user-1",
    name: "Developer User",
    role: "ADMIN" as const,
  };
  const currentUser = user || mockUser;

  const isStaff =
    currentUser.role === "ADMIN" || currentUser.role === "MANAGER";

  return isStaff ? <AdminAssetView /> : <DeveloperAssetView />;
}
