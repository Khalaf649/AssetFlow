import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";
import { registerUser, ApiError } from "../api/auth-api";
import { RegisterInput } from "../schemas/auth-schemas";
import { toast } from "sonner";

// We require the component to pass us its setError function
interface UseRegisterOptions {
  setError: UseFormSetError<RegisterInput>;
}

export function useRegisterMutation({ setError }: UseRegisterOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      registerUser(data.name, data.email, data.password),

    onSuccess: () => {
      toast.success("Account created — please sign in with your credentials.");
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
          setError("root.serverError", { message: error.message });
        }
      } else {
        setError("root.serverError", {
          message: "An unexpected error occurred",
        });
      }
    },
  });
}
