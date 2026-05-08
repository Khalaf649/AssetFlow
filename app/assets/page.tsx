"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { AdminAssetView } from "./components/AdminAssetView";
import { DeveloperAssetView } from "./components/DeveloperAssetView";

export default function AssetsPage() {
  const { user } = useAuth();

  // ProtectedLayout guarantees user is non-null
  if (!user) return null;

  const isStaff = user.role === "ADMIN" || user.role === "MANAGER";

  return isStaff ? <AdminAssetView /> : <DeveloperAssetView />;
}
