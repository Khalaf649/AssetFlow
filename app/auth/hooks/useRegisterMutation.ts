import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";
import { registerUser, ApiError } from "../api/auth-api";
import { useToast } from "@/src/hooks/use-toast";
import { RegisterInput } from "../schemas/auth-schemas";

// We require the component to pass us its setError function
interface UseRegisterOptions {
  setError: UseFormSetError<RegisterInput>;
}

export function useRegisterMutation({ setError }: UseRegisterOptions) {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      registerUser(data.name, data.email, data.password),

    onSuccess: () => {
      // Show success message and redirect to login
      toast({
        title: "Account created",
        description: "Please sign in with your credentials.",
      });
      router.push("/auth/login");
    },

    onError: (error) => {
      // All the messy error mapping is hidden away in the hook
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
}
