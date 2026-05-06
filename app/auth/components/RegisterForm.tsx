"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { registerSchema, type RegisterInput } from "../schemas/auth-schemas";
import { registerUser, ApiError } from "../api/auth-api";
import { useToast } from "@/src/hooks/use-toast";

const passwordChecks = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /\d/ },
  { label: "One special character", regex: /[^A-Za-z0-9]/ },
];

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") || "";
  const allChecksPassed = passwordChecks.every((check) =>
    check.regex.test(passwordValue),
  );

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) =>
      registerUser(data.name, data.email, data.password),
    onSuccess: () => {
      toast({
        title: "Account created",
        description: "Please sign in with your credentials.",
      });
      router.push("/auth/login");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.code === "EMAIL_CONFLICT") {
          setError("email", {
            message: "An account with this email already exists.",
          });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as "name" | "email" | "password", {
              message: detail.message,
            });
          });
        } else {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Registration failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
  });

  async function onSubmit(data: RegisterInput) {
    registerMutation.mutate(data);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start managing your team's equipment.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
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
              {...register("password")}
              className="pr-10"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}

          <ul className="mt-2 space-y-1">
            {passwordChecks.map((check) => {
              const isValid = check.regex.test(passwordValue);
              return (
                <li
                  key={check.label}
                  className={`flex items-center gap-2 text-xs ${
                    isValid ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {isValid ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  {check.label}
                </li>
              );
            })}
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending || !allChecksPassed}
        >
          {registerMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-accent font-medium hover:underline"
        >
          Sign in
        </a>
      </p>
    </>
  );
}
