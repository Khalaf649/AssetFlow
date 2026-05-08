"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUser } from "../hooks/useUser";
import { ArrowLeft } from "lucide-react";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { UserAssignedAssets } from "./components/UserAssignedAssets";
import { UserActivityTimeline } from "./components/UserActivityTimeline";
import { UserActionModals } from "../components/UserActionModals";
import UserProfile from "../interfaces/UserProfile";

const dummyUser: UserProfile = {
  id: "user-123",
  name: "Alex Morgan",
  email: "admin@assettrack.dev",
  role: "ADMIN",
  createdAt: "2024-02-12T10:30:00Z",
  assignedAssets: [
    {
      id: "asset-001",
      brand: "Dell",
      model: "XPS 15",
      serialNumber: "SN123456789",
      type: "LAPTOP",
      status: "ASSIGNED",
    },
    {
      id: "asset-002",
      brand: "LG",
      model: "UltraFine 27",
      serialNumber: "SN987654321",
      type: "MONITOR",
      status: "ASSIGNED",
    },
  ],
};

interface UserPageProps {
  params: { id: string };
}

export default function UserPage({ params }: UserPageProps) {
  const userId = params.id;
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading } = useUser(userId);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);

  const profileData: UserProfile = currentUser || dummyUser;
  const isAdmin = profileData?.role === "ADMIN";

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to directory
        </Link>

        {/* Profile Header */}
        <UserProfileHeader
          user={profileData}
          isAdmin={isAdmin}
          onEditClick={setEditUser}
          onDeleteClick={setDeleteUser}
        />

        {/* Assets + Activity side by side */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
          <UserAssignedAssets assets={profileData.assignedAssets} />
          <UserActivityTimeline
            createdAt={profileData.createdAt}
            role={profileData.role}
          />
        </div>
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
