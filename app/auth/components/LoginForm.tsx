"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { loginSchema, type LoginInput } from "../schemas/auth-schemas";
import { loginUser, ApiError } from "../api/auth-api";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => loginUser(data.email, data.password),
    onSuccess: (response) => {
      login(response.accessToken, response.user);
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.code === "UNAUTHORIZED") {
          setError("root", {
            message: "Invalid email or password",
          });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as "email" | "password", {
              message: detail.message,
            });
          });
        } else {
          setError("root.serverError", {
            message: error.message,
          });
        }
      } else {
        setError("root.serverError", {
          message: "An unexpected error occurred",
        });
      }
    },
  });

  async function onSubmit(data: LoginInput) {
    loginMutation.mutate(data);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your AssetTrack account.
        </p>
      </div>

      {errors.root && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="pr-10"
              aria-invalid={!!errors.password}
            />
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="text-accent font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
