import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import {
  fetchDashboardReports,
  fetchNotifications,
} from "../api/dashboard-api";
import { queryKeys } from "@/src/lib/query-keys";

// Mock data for frontend testing
const mockDashboardReports = {
  totalAssets: 156,
  byType: {
    LAPTOP: 78,
    MONITOR: 52,
    ACCESSORY: 26,
  },
  byStatus: {
    AVAILABLE: 45,
    ASSIGNED: 98,
    UNDER_REPAIR: 8,
    DECOMMISSIONED: 5,
  },
  warrantyExpiringIn30Days: 12,
  openConditionReports: 5,
};

const mockNotifications = {
  items: [
    {
      id: "notif-1",
      type: "WARRANTY_EXPIRY",
      message: "3 assets have warranty expiring within 30 days",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
  },
};

export function useDashboardReports() {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboard.reports,
    queryFn: async () => {
      // Use mock data if no token (frontend testing mode)
      if (!token) return mockDashboardReports;
      return fetchDashboardReports(token);
    },
    enabled: true, // Always enabled, falls back to mock data
    staleTime: 60 * 1000, // 60 seconds
  });
}

export function useNotifications() {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      // Use mock data if no token (frontend testing mode)
      if (!token) return mockNotifications;
      return fetchNotifications(token);
    },
    enabled: true, // Always enabled, falls back to mock data
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Poll every 60 seconds
  });
}
