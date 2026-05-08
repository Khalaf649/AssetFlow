import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../api/dashboard-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!token) throw new Error("No auth token");
      return markNotificationRead(token, notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
