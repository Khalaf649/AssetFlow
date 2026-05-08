"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUser } from "../hooks/useUser";
import { ArrowLeft } from "lucide-react";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { UserAssignedAssets } from "./components/UserAssignedAssets";
import { UserActivityTimeline } from "./components/UserActivityTimeline";
import { UserActionModals } from "./components/UserActionModals";

// Dummy data for testing without backend
const dummyUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "DEVELOPER" as const,
  createdAt: "2024-01-15T10:30:00Z",
  assignedAssets: [
    {
      id: "asset-001",
      brand: "Apple",
      model: 'MacBook Pro 16"',
      serialNumber: "A2345B78901",
      type: "LAPTOP" as const,
      status: "ASSIGNED" as const,
    },
    {
      id: "asset-002",
      brand: "Dell",
      model: "UltraSharp U2724D",
      serialNumber: "D9876C54321",
      type: "MONITOR" as const,
      status: "ASSIGNED" as const,
    },
  ],
};

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { id: userId } = params as any;
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading } = useUser(userId);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);

  // RBAC Check: Developer can only view own profile
  useEffect(() => {
    if (currentUser?.role === "DEVELOPER" && currentUser.id !== userId) {
      router.push("/dashboard");
    }
  }, [currentUser, userId, router]);

  const isAdmin = currentUser?.role === "ADMIN";

  // Use dummy data if backend data is unavailable
  const profileData = user || dummyUser;

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Link>

        {/* Profile Header */}
        <UserProfileHeader
          user={profileData}
          isAdmin={isAdmin}
          onEditClick={setEditUser}
          onDeleteClick={setDeleteUser}
        />

        {/* Assigned Assets */}
        <UserAssignedAssets assets={profileData.assignedAssets} />

        {/* Activity Timeline */}
        <UserActivityTimeline createdAt={profileData.createdAt} />
      </div>

      {/* Action Modals */}
      <UserActionModals
        editUser={editUser}
        deleteUser={deleteUser}
        onCloseEdit={() => setEditUser(null)}
        onCloseDelete={() => setDeleteUser(null)}
        onDeleteSuccess={() => router.push("/users")}
      />
    </div>
  );
}
