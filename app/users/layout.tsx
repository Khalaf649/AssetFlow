"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useAuth();

  //   useEffect(() => {
  //     // Check if user is authenticated
  //     if (!token) {
  //       router.push("/auth/login");
  //       return;
  //     }

  //     // Check if user has access to users section
  //     // DEVELOPER users can only access their own profile via /users/[id]
  //     // This layout will not prevent it because the route-specific page will handle the check
  //   }, [token, router]);

  return <>{children}</>;
}
