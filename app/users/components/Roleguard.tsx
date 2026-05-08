"use client";

import { useAuth } from "@/app/auth/context/AuthContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

type Role = "ADMIN" | "MANAGER" | "DEVELOPER";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const { id: pathId } = useParams<{ id: string }>();
  const router = useRouter();

  function canAccess(): boolean {
    const role = user?.role as Role;

    // /users — ADMIN and MANAGER only
    if (pathname === "/users") {
      return role === "ADMIN" || role === "MANAGER";
    }

    // /users/:id — ADMIN and MANAGER always, DEVELOPER only if their id matches
    if (pathname.startsWith("/users/")) {
      if (role === "ADMIN" || role === "MANAGER") return true;
      if (role === "DEVELOPER") return user?.id === pathId;
    }

    return false;
  }

  const allowed = canAccess();

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace("/dashboard");
    }
  }, [isLoading, allowed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!allowed) return null;

  return children;
}
