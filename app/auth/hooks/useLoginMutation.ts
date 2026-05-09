import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";
import { loginUser, ApiError } from "../api/auth-api";
import { useAuth } from "./../context/AuthContext";
import { LoginInput } from "../schemas/auth-schemas";

// We require the component to pass us its setError function
interface UseLoginOptions {
  setError: UseFormSetError<LoginInput>;
}

export function useLoginMutation({ setError }: UseLoginOptions) {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginInput) => loginUser(data.email, data.password),

    onSuccess: (response) => {
      // Global state update & routing handled here
      login(response.accessToken, response.user);
      router.push("/dashboard");
    },

    onError: (error) => {
      // All the messy error mapping is hidden away in the hook
      if (error instanceof ApiError) {
        if (error.code === "UNAUTHORIZED") {
          setError("root", { message: "Invalid email or password" });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as "email" | "password", {
              message: detail.message,
            });
          });
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", {
          message: "An unexpected error occurred",
        });
      }
    },
  });
}
