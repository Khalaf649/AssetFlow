"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return <LoginForm />;
}
