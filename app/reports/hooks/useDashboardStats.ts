import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../api/reports-api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}