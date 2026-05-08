import { apiFetch, ApiError } from "@/src/lib/api-client";

export interface DashboardReport {
  totalAssets: number;
  byType: {
    LAPTOP: number;
    MONITOR: number;
    ACCESSORY: number;
  };
  byStatus: {
    AVAILABLE: number;
    ASSIGNED: number;
    UNDER_REPAIR: number;
    DECOMMISSIONED: number;
  };
  warrantyExpiringIn30Days: number;
  openConditionReports: number;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export async function fetchDashboardReports(
  token: string,
): Promise<DashboardReport> {
  return apiFetch<DashboardReport>("/reports/dashboard", { token });
}

export async function fetchNotifications(
  token: string,
): Promise<NotificationsResponse> {
  return apiFetch<NotificationsResponse>("/notifications", { token });
}

export async function markNotificationRead(
  token: string,
  notificationId: string,
): Promise<void> {
  return apiFetch<void>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    token,
  });
}

export { ApiError };
