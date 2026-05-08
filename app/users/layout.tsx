"use client";

import { DashboardNavbar } from "../dashboard/components/Navbar";
// import { RoleGuard } from "./components/Roleguard";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ProtectedLayout>
    // <RoleGuard>
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardNavbar />
      <main className="flex-1 mx-auto w-full max-w-350 px-6 py-10">
        {children}
      </main>
    </div>
    // </RoleGuard>
    // </ProtectedLayout>
  );
}
