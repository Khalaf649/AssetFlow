"use client";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import { redirect } from "next/navigation";
export default function LoginPage() {
  const { user } = useAuth();
  if (!user) return <LoginForm />;
  else return redirect("/dashboard");
}
