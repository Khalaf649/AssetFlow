"use client";

import { useState } from "react";
import { useAuth } from "@/app/auth/context/AuthContext";
import { useUserFilters } from "./hooks/useUserFilters";
import { useUsers } from "./hooks/useUsers";
import { UsersHeaderAndFilters } from "./components/UsersHeaderAndFilters";
import { UsersTable } from "./components/UsersTable";
import { UserActionModals } from "./components/UserActionModals";
import UserProfile from "./interfaces/UserProfile";

// Dummy data for testing without backend
const dummyUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "ADMIN" as const,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "MANAGER" as const,
    createdAt: "2023-01-02",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "DEVELOPER" as const,
    createdAt: "2023-01-03",
  },
];

export default function UsersPage() {
  // Auth & Filters
  const { user } = useAuth();
  const { filters, setFilter } = useUserFilters();
  const { data: usersData, isLoading } = useUsers(filters);

  // Modal State
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);

  // Current User
  const mockUser = {
    id: "dev-user-1",
    name: "Developer User",
    role: "ADMIN" as const,
  };
  const currentUser = user || mockUser;
  const isAdmin = currentUser?.role === "ADMIN";

  // Data
  const users = usersData?.items || dummyUsers;
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
