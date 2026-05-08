"use client";

import { useAuth } from "@/app/auth/context/AuthContext"; // Adjust import path if needed
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  // If authenticated, render the protected content
  return children;
}
