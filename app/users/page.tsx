"use client";

import { useState } from "react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUserFilters } from "./hooks/useUserFilters";
import { useUsers } from "./hooks/useUsers";
import { UsersHeaderAndFilters } from "./components/UsersHeaderAndFilters";
import { UsersTable } from "./components/UsersTable";
import { UserActionModals } from "./components/UserActionModals";
import UserProfile from "./interfaces/UserProfile";

export default function UsersPage() {
  const { user } = useAuth();
  const { filters, setFilter } = useUserFilters();
  const { data: usersData, isLoading } = useUsers(filters);

  // Modal State
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);

  // ProtectedLayout guarantees user is non-null
  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  const users = usersData?.items || [];
  const totalElements = usersData?.pagination?.totalElements || 0;

  return (
    <div className="space-y-6">
      <UsersHeaderAndFilters
        totalElements={totalElements}
        filters={filters}
        setFilter={setFilter}
      />

      <UsersTable
        users={users}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onEditClick={setEditUser}
        onDeleteClick={setDeleteUser}
      />

      <UserActionModals
        editUser={editUser}
        deleteUser={deleteUser}
        onCloseEdit={() => setEditUser(null)}
        onCloseDelete={() => setDeleteUser(null)}
        onDeleteSuccess={() => {}}
      />
    </div>
  );
}
