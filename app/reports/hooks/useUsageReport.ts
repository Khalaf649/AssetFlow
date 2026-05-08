import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchUsageReport, UsageReportParams } from '../api/reports-api';

export function useUsageReport() {
  const searchParams = useSearchParams();

  const params: UsageReportParams = {
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
  };

  return useQuery({
    queryKey: ['reports', 'usage', params],
    queryFn: () => fetchUsageReport(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}