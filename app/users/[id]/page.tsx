"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUser } from "../hooks/useUser";
import { useUserAssets } from "../hooks/useUserAssets";
import { ArrowLeft } from "lucide-react";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { UserAssignedAssets } from "./components/UserAssignedAssets";
import { UserActivityTimeline } from "./components/UserActivityTimeline";
import { UserActionModals } from "../components/UserActionModals";
import UserProfile from "../interfaces/UserProfile";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { id: userId } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading } = useUser(userId);
  const { data: assets = [], isLoading: assetsLoading } = useUserAssets(userId);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);

  // ProtectedLayout guarantees currentUser is non-null
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "ADMIN";

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">User not found.</p>
        <Link
          href="/users"
          className="text-accent hover:underline text-sm mt-2 inline-block"
        >
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to directory
      </Link>

      {/* Profile Header */}
      <UserProfileHeader
        user={user}
        isAdmin={isAdmin}
        onEditClick={setEditUser}
        onDeleteClick={setDeleteUser}
      />

      {/* Assets + Activity side by side */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <UserAssignedAssets assets={assets} isLoading={assetsLoading} />
        <UserActivityTimeline createdAt={user.createdAt} role={user.role} />
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
