"use client";

import { DashboardNavbar } from "./components/Navbar";
import { ProtectedLayout } from "@/src/components/ProtectedLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ProtectedLayout>
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardNavbar />
      <main className="flex-1 mx-auto w-full max-w-350 px-6 py-10">
        {children}
      </main>
    </div>
    // </ProtectedLayout>
  );
}
