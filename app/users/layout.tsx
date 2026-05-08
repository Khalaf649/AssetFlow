"use client";

import { AuthenticatedLayout } from "@/src/components/AuthenticatedLayout";
import { RoleGuard } from "./components/Roleguard";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout>
      <RoleGuard>{children}</RoleGuard>
    </AuthenticatedLayout>
  );
}
