"use client";

<<<<<<< HEAD
import { useAuth } from "@/app/auth/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
=======
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext"; // Adjust import path if needed
import { Loader2 } from "lucide-react";
>>>>>>> reports-feature

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
<<<<<<< HEAD
      router.replace("/auth/login");
=======
      router.push("/auth/login");
>>>>>>> reports-feature
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
<<<<<<< HEAD
    return null;
  }

  return <>{children}</>;
=======
    // Return null to prevent the UI from flashing before the redirect happens
    return null;
  }

  // If authenticated, render the protected content
  return children;
>>>>>>> reports-feature
}
